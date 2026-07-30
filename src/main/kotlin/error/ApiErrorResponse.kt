package com.example.error

import com.example.validation.ValidationError
import kotlinx.serialization.Serializable


enum class ErrorCodes{
    INVALID_REQUEST,
    ALREADY_EXISTS,
    NOT_FOUND,
    VALIDATION_FAILED,
    INTERNAL_ERROR
}

@Serializable
data class ApiErrorResponse(
    val errorCode: ErrorCodes,
    val message: String,
    val fieldErrors: List<ValidationError>? = null,
    )