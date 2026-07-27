package com.example.dto

import com.example.model.ApplicationStatus
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class CreateJobApplicationRequest(
    val company: String,
    val status: ApplicationStatus,
    val title: String,
    val appliedAt: String = Instant.now().toString(),
    val description: String? = null,
    val link: String? = null,
    val city: String? = null

)