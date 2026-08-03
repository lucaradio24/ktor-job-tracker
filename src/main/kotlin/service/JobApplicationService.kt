package com.example.service

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.example.repository.ApplicationRepository

class JobApplicationService(
    private val repository: ApplicationRepository
) {

    suspend fun findAll(ownerId: String): List<JobApplication> =
        repository.findAll(ownerId)

    suspend fun findById(id: String, ownerId: String): JobApplication? =
        repository.findById(id, ownerId)

    suspend fun create(application: JobApplication): Boolean =
        repository.create(application)

    suspend fun update(
        id: String,
        ownerId: String,
        application: JobApplication
    ): JobApplication? =
        repository.update(id, ownerId,application)

    suspend fun patch(
        id: String,
        ownerId: String,
        changes: JobApplicationChanges
    ): JobApplication? =
        repository.patch(id, ownerId, changes)

    suspend fun delete(id: String, ownerId: String): JobApplication? =
        repository.delete(id, ownerId)
}