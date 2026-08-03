package com.example.model

import kotlinx.serialization.Serializable

@Serializable
enum class ApplicationStatus{
    APPLIED,
    INTERVIEW,
    REJECTED,
    WITHDRAWN,
    OFFER
}



@Serializable
data class JobApplication(
    val ownerId: String,
    val id : String,
    val company: String,
    val status: ApplicationStatus,
    val title: String,
    val appliedAt: String,
    val description: String? = null,
    val link: String? = null,
    val city: String? = null,
)