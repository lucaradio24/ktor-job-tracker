package com.example.config

import io.github.cdimascio.dotenv.dotenv

object Environment {
    private val dotenv = dotenv{
        ignoreIfMissing = true
    }

    val mongoUri: String =
        dotenv["MONGODB_URI"]
            ?: System.getenv("MONGODB_URI")
            ?: error("MONGODB_URI is not set")

    val mongoDatabase: String = dotenv["MONGODB_DATABASE"]
        ?:System.getenv("MONGODB_DATABASE") ?: "job_tracker"

    val auth0Issuer: String = dotenv["AUTH0_ISSUER"]
    ?: System.getenv("AUTH0_ISSUER")
    ?: error("AUTH0_ISSUER is not set")

    val auth0Audience: String = dotenv["AUTH0_AUDIENCE"]
    ?: System.getenv("AUTH0_AUDIENCE")
    ?: error("AUTH0_AUDIENCE is not set")
}