package com.example.dto

import com.example.model.ApplicationStatus
import kotlinx.serialization.Serializable

@Serializable
data class UndoStatusRequest(
    val changedAt: String,
    val previousStatus: ApplicationStatus,
)
