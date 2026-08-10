package com.example

import com.example.model.ApplicationStatus
import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.example.repository.InMemoryApplicationRepository
import com.example.routes.applicationRoutes
import com.example.service.JobApplicationService
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.server.testing.testApplication
import io.ktor.server.routing.routing
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.coroutines.runBlocking

import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.time.Instant
import kotlin.test.*

class ServerTest {

    private fun application(
        ownerId: String = "owner-a",
        id: String = "application-1",
        status: ApplicationStatus = ApplicationStatus.APPLIED,
    ) = JobApplication(
        ownerId = ownerId,
        id = id,
        company = "Acme",
        status = status,
        title = "Backend Developer",
        appliedAt = "2026-07-30",
    )

    @Test
    fun `test root endpoint`() = testApplication {
        // loads default configuration
        configure()
        // verify server root returns 200
        assertEquals(HttpStatusCode.OK, client.get("/").status)
    }

    @Test
    fun `GET applications without authentication returns unauthorized`() = testApplication {
        configure()

        val response = client.get("/applications")

        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }


    @Test
    fun `POST invalid application returns field errors`() = testApplication {
        application {
            configureSerialization()
            configureStatusPages()
            routing {
                applicationRoutes(
                    JobApplicationService(
                        InMemoryApplicationRepository(mutableListOf())
                    )
                )
            }
        }

        val response = client.post("/applications") {
            contentType(ContentType.Application.Json)
            setBody(
                """
            {
              "company": "",
              "title": "Backend Developer",
              "status": "APPLIED",
              "appliedAt": "2026-07-30"
            }
            """.trimIndent()
            )
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)

        val body = Json.parseToJsonElement(response.bodyAsText()).jsonObject

        assertEquals(
            "VALIDATION_FAILED",
            body["errorCode"]?.jsonPrimitive?.content,
        )

        val companyError = body["fieldErrors"]
            ?.jsonArray
            ?.single {
                it.jsonObject["field"]?.jsonPrimitive?.content == "company"
            }
            ?.jsonObject

        assertEquals(
            "must not be blank",
            companyError?.get("message")?.jsonPrimitive?.content,
        )
    }

    @Test
    fun `POST application without required field returns bad request`() = testApplication {
        application {
            configureSerialization()
            configureStatusPages()
            routing {
                applicationRoutes(JobApplicationService(InMemoryApplicationRepository(mutableListOf())))
            }
        }

        val response = client.post("/applications") {
            contentType(ContentType.Application.Json)
            setBody("""{"company":"Acme","status":"APPLIED"}""")
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals(
            "INVALID_REQUEST",
            Json.parseToJsonElement(response.bodyAsText()).jsonObject["errorCode"]?.jsonPrimitive?.content,
        )
    }

    @Test
    fun `create stores the selected status as the initial server transition`() = runBlocking {
        val service = JobApplicationService(InMemoryApplicationRepository(mutableListOf()))

        val created = assertNotNull(
            service.create(application(status = ApplicationStatus.INTERVIEW))
        )

        assertEquals(ApplicationStatus.INTERVIEW, created.statusHistory.single().status)
        assertNotNull(Instant.parse(created.statusHistory.single().changedAt))
        Unit
    }

    @Test
    fun `patch appends only real status changes`() = runBlocking {
        val service = JobApplicationService(
            InMemoryApplicationRepository(mutableListOf(application()))
        )

        val changed = assertNotNull(
            service.patch(
                "application-1",
                "owner-a",
                JobApplicationChanges(status = ApplicationStatus.INTERVIEW),
            )
        )
        val unchanged = assertNotNull(
            service.patch(
                "application-1",
                "owner-a",
                JobApplicationChanges(status = ApplicationStatus.INTERVIEW),
            )
        )

        assertEquals(listOf(ApplicationStatus.INTERVIEW), changed.statusHistory.map { it.status })
        assertEquals(changed.statusHistory, unchanged.statusHistory)
    }

    @Test
    fun `put preserves history and appends only when status changes`() = runBlocking {
        val service = JobApplicationService(
            InMemoryApplicationRepository(mutableListOf(application()))
        )

        val changed = assertNotNull(
            service.update(
                "application-1",
                "owner-a",
                application(status = ApplicationStatus.OFFER),
            )
        )
        val descriptiveEdit = assertNotNull(
            service.update(
                "application-1",
                "owner-a",
                application(status = ApplicationStatus.OFFER).copy(title = "Platform Engineer"),
            )
        )

        assertEquals(listOf(ApplicationStatus.OFFER), changed.statusHistory.map { it.status })
        assertEquals(changed.statusHistory, descriptiveEdit.statusHistory)
        assertEquals("Platform Engineer", descriptiveEdit.title)
    }

    @Test
    fun `owner isolation protects legacy records and first real change is recorded`() = runBlocking {
        val repository = InMemoryApplicationRepository(mutableListOf(application()))
        val service = JobApplicationService(repository)

        assertNull(
            service.patch(
                "application-1",
                "owner-b",
                JobApplicationChanges(status = ApplicationStatus.REJECTED),
            )
        )
        val untouched = assertNotNull(repository.findById("application-1", "owner-a"))
        assertEquals(ApplicationStatus.APPLIED, untouched.status)
        assertTrue(untouched.statusHistory.isEmpty())

        val changed = assertNotNull(
            service.patch(
                "application-1",
                "owner-a",
                JobApplicationChanges(status = ApplicationStatus.REJECTED),
            )
        )
        assertEquals(ApplicationStatus.REJECTED, changed.statusHistory.single().status)
    }
}

