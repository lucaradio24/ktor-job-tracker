package com.example.repository

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.example.model.StatusTransition

interface ApplicationRepository {
    suspend fun findAll(ownerId: String): List<JobApplication>
    suspend fun findById(id: String, ownerId: String): JobApplication?
    suspend fun create(jobApplication: JobApplication): Boolean
    suspend fun update(
        id: String,
        ownerId: String,
        jobApplication: JobApplication,
        statusTransition: StatusTransition,
    ): JobApplication?
    suspend fun delete(id: String, ownerId: String): JobApplication?
    suspend fun patch(
        id: String,
        ownerId: String,
        changes: JobApplicationChanges,
        statusTransition: StatusTransition?,
    ): JobApplication?
}
