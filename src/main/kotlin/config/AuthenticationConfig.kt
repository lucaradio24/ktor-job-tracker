package com.example.config

import com.auth0.jwk.JwkProviderBuilder
import com.example.error.ApiErrorResponse
import com.example.error.ErrorCodes
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.response.respond
import java.util.concurrent.TimeUnit

fun Application.configureAuthentication() {
    val issuer = Environment.auth0Issuer
    val audience = Environment.auth0Audience

    val jwkProvider = JwkProviderBuilder(issuer)
        .cached(10, 24, TimeUnit.HOURS)
    .rateLimited(10, 1, TimeUnit.MINUTES)
    .build()

    install(Authentication) {
        jwt ("auth0"){
            realm = "job-tracker-api"

            verifier(jwkProvider, issuer){
                withAudience(audience)
                acceptLeeway(3)
            }

            validate { credential ->
                val subject = credential.payload.subject

                if (!subject.isNullOrBlank()) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }

            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized,
                    ApiErrorResponse(ErrorCodes.UNAUTHORIZED, "Invalid or expired access token")
                    )
            }

        }
    }
}