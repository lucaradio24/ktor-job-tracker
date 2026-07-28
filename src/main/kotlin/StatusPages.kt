package com.example

import com.example.error.ApiErrorResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.ContentTransformationException
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import io.ktor.serialization.ContentConvertException
import io.ktor.server.plugins.BadRequestException
import kotlinx.serialization.SerializationException

fun Application.configureStatusPages() {
    install(StatusPages) {


        exception<BadRequestException> { call, _ ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorResponse("Invalid request body")
            )
        }


        exception<ContentTransformationException> { call, _ ->
            call.respond(HttpStatusCode.BadRequest,
                ApiErrorResponse("Invalid request body"))
        }

        exception<ContentConvertException> { call, _ ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorResponse("Invalid request body")
            )
        }

        exception<SerializationException> { call, _ ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiErrorResponse("Invalid request body")
            )
        }


        exception<Throwable> { call, _ ->

            call.respond(HttpStatusCode.InternalServerError,
                ApiErrorResponse("Internal Server Error"))
        }
    }
}