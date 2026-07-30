package com.example

import com.example.error.ApiErrorResponse
import com.example.error.ErrorCodes
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.ContentTransformationException
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import io.ktor.server.application.log

fun Application.configureStatusPages() {
    install(StatusPages) {

        exception<ContentTransformationException> { call, _ ->
            call.respond(HttpStatusCode.BadRequest,
                ApiErrorResponse(ErrorCodes.INVALID_REQUEST, "Invalid request body"))
        }

        exception<Throwable> { call, cause ->

            call.application.log.error("Unhandled server error", cause)

            call.respond(HttpStatusCode.InternalServerError,
                ApiErrorResponse(ErrorCodes.INTERNAL_ERROR, "Internal Server Error"))
        }
    }
}