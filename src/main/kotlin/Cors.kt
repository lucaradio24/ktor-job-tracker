package com.example

import com.example.config.Environment
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.cors.routing.CORS
import java.net.URI

fun Application.configureCors() {
    install(CORS) {
        Environment.corsAllowedOrigins.forEach { origin ->
            val uri = URI(origin)
            require(
                uri.scheme in listOf("http", "https") &&
                    uri.host != null &&
                    (uri.path.isNullOrEmpty() || uri.path == "/") &&
                    uri.query == null &&
                    uri.fragment == null
            ) {
                "Invalid CORS_ALLOWED_ORIGINS entry: $origin"
            }
            val host = if (uri.port == -1) uri.host else "${uri.host}:${uri.port}"
            allowHost(host, schemes = listOf(uri.scheme))
        }

        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Delete)

        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowNonSimpleContentTypes = true
    }
}
