package com.example

import com.example.config.MongoConfig
import com.example.model.Health
import com.example.repository.ApplicationRepository
import com.example.repository.MongoApplicationRepository
import com.example.routes.applicationRoutes
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    val repository: ApplicationRepository = MongoApplicationRepository(
        MongoConfig.jobApplicationsCollection
    )
    routing {
        get("/") {
            call.respondText("Hello, World!")
        }
        get("/json/kotlinx-serialization") {
            call.respond(mapOf("hello" to "world"))
        }
        get("/health"){
            call.respond(Health(status = "ok"))
        }
        get("/mongo-health"){
            val result = MongoConfig.ping()

            call.respond(mapOf("status" to "ok",
                "mongo" to result.toJson()))
        }

        applicationRoutes(repository)
    }
}