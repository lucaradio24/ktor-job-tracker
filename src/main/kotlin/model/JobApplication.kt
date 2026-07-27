package com.example.model

import kotlinx.serialization.Serializable



@Serializable
data class JobApplication(
    val id : String,
    val company: String,
    val status: String,
    val title: String,
    val appliedAt: String,
    val description: String? = null,
    val link: String? = null,
    val city: String? = null,
)