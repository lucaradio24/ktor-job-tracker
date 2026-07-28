package com.example.error

import kotlinx.serialization.Serializable

@Serializable
data class ApiErrorResponse(
    val error: String,
)