package com.example.dto

import com.example.model.ApplicationStatus
import kotlinx.serialization.Serializable

@Serializable
data class UpdateJobApplicationRequest (
    val company: String,
    val status: ApplicationStatus,
    val title: String,
    val appliedAt: String,
    val description: String? = null,
    val link: String? = null,
    val city: String? = null
){
}