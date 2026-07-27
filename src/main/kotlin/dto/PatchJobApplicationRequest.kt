package com.example.dto

import com.example.model.ApplicationStatus
import kotlinx.serialization.Serializable

@Serializable
data class PatchJobApplicationRequest(
    val company: String? = null,
    val status: ApplicationStatus? = null,
    val title: String? = null,
    val appliedAt: String? = null,
    val description: String? = null,
    val link: String? = null,
    val city: String? = null
)