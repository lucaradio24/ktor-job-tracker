package com.example.routes

import com.example.model.JobApplication
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import com.example.model.mock.applications
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.routing.delete
import io.ktor.server.routing.post
import io.ktor.server.routing.put

fun Route.applicationRoutes() {
    route("/applications"){
        get {
            call.respond(applications)
        }

        get("/{id}"){
            val id = call.parameters["id"]
            if (id != null){
                val application = applications.find { it.id == id }
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
            val alreadyExists = applications.any { it.id == application.id }
            if (alreadyExists){
                call.respond(HttpStatusCode.Conflict,
                    mapOf("error" to "Application already exists"))
                return@post
            }
            applications.add(application)
            call.respond(HttpStatusCode.Created, application)
        }

        put("/{id}") {
            val id = call.parameters["id"]
                ?: return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Missing or malformed id")
                )

            val receivedApplication = call.receive<JobApplication>()
            val index = applications.indexOfFirst { it.id == id }
            if (index == -1) {
                call.respond(HttpStatusCode.NotFound,
                    mapOf("error" to "Application not found"))
                return@put
            }
            val updatedApplication = receivedApplication.copy(id = id)
            applications[index] = updatedApplication

            call.respond(HttpStatusCode.OK,updatedApplication)
        }

        delete( "/{id}" ){
            val id = call.parameters["id"]
            ?: return@delete call.respond(HttpStatusCode.BadRequest)

            val application = applications.find { it.id == id }
                ?: return@delete call.respond(HttpStatusCode.NotFound,
                    mapOf("error" to "Application not found"))


            applications.remove(application)
            call.respond(HttpStatusCode.OK, application)
        }
    }


}