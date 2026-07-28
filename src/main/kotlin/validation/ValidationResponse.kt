package com.example.validation

import kotlinx.serialization.Serializable

@Serializable
data class ValidationResponse(
    val errors: List<ValidationError>,
)