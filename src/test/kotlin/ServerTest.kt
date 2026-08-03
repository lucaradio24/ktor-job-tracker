package com.example

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

import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlin.test.*

class ServerTest {

    @Test
    fun `test root endpoint`() = testApplication {
        // loads default configuration
        configure()
        // verify server root returns 200
        assertEquals(HttpStatusCode.OK, client.get("/").status)
    }

    @Test
    fun `GET applications returns OK`() = testApplication {
        configure()

        val response = client.get("/applications")

        assertEquals(HttpStatusCode.OK, response.status)
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
}

