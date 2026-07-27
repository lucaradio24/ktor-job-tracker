package com.example.routes

import com.example.model.JobApplication
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import com.example.repository.ApplicationRepository
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.routing.delete
import io.ktor.server.routing.post
import io.ktor.server.routing.put

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
            val application = call.receive<JobApplication>()
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

            val receivedApplication = call.receive<JobApplication>()
            val updatedApplication = repository.update(id,receivedApplication)
            if (updatedApplication != null){
                call.respond(HttpStatusCode.OK, updatedApplication)
            } else {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Application not found"))
            }


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