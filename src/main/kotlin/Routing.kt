package com.example

import com.example.model.Health
import com.example.routes.applicationRoutes
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
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

        applicationRoutes()
    }
}