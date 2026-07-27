package com.example.routes

import com.example.dto.CreateJobApplicationRequest
import com.example.dto.PatchJobApplicationRequest
import com.example.dto.UpdateJobApplicationRequest
import com.example.model.JobApplication
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import com.example.repository.ApplicationRepository
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive

import io.ktor.server.routing.delete
import io.ktor.server.routing.patch
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import java.util.UUID

fun Route.applicationRoutes(repository: ApplicationRepository) {
    route("/applications"){
        get {
            call.respond(HttpStatusCode.OK, repository.findAll())
        }

        get("/{id}"){
            val id = call.parameters["id"]
            if (id != null){
                val application = repository.findById(id)
                if (application != null){
                    call.respond(application)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            } else {
                call.respond(HttpStatusCode.BadRequest)
            }

        }

        post{

            val request = call.receive<CreateJobApplicationRequest>()
            val application = JobApplication(
                id = UUID.randomUUID().toString(),
                company = request.company,
                status = request.status,
                title = request.title,
                description = request.description,
                appliedAt = request.appliedAt,
                link = request.link,
                city = request.city,
            )
            val created = repository.create(application)
            if (!created){
                return@post call.respond(HttpStatusCode.Conflict,mapOf("error" to "Application already exists"))
            }
            call.respond(HttpStatusCode.Created, application)
        }

        put("/{id}") {
            val id = call.parameters["id"]
                ?: return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Missing or malformed id")
                )

            val request = call.receive<UpdateJobApplicationRequest>()


            val receivedApplication = JobApplication(
                id = id,
                company = request.company,
                status = request.status,
                title = request.title,
                description = request.description,
                appliedAt = request.appliedAt,
                link = request.link,
                city = request.city,
            )

            val updatedApplication = repository.update(id,receivedApplication)
            if (updatedApplication != null){
                call.respond(HttpStatusCode.OK, updatedApplication)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Application not found"))
            }


        }

        patch("/{id}") {
            val id = call.parameters["id"] ?: return@patch call.respond(HttpStatusCode.BadRequest)
            val request = call.receive<PatchJobApplicationRequest>()
            val existingApplication = repository.findById(id) ?: return@patch call.respond(HttpStatusCode.NotFound,
                mapOf("error" to "Application not found"))

            val applicationToUpdate = existingApplication.copy(
                company = request.company ?: existingApplication.company,
                status = request.status ?: existingApplication.status,
                title = request.title ?: existingApplication.title,
                description = request.description ?: existingApplication.description,
                appliedAt = request.appliedAt ?: existingApplication.appliedAt,
                link = request.link ?: existingApplication.link,
                city = request.city ?: existingApplication.city,

            )

            val updatedApplication = repository.update(id, applicationToUpdate)

            call.respond(HttpStatusCode.OK,
                updatedApplication!!)
        }

        delete( "/{id}" ){
            val id = call.parameters["id"]
            ?: return@delete call.respond(HttpStatusCode.BadRequest)

            val applicationToRemove = repository.delete(id) ?: return@delete call.respond(HttpStatusCode.NotFound,
                mapOf("error" to "Application not found"))


            call.respond(HttpStatusCode.OK, applicationToRemove )
        }
    }


}