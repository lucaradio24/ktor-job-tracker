package com.example.model


data class JobApplicationChanges(
    val company: String? = null,
    val status: ApplicationStatus? = null,
    val title: String? = null,
    val appliedAt: String? = null,
    val description: String? = null,
    val link: String? = null,
    val city: String? = null
)