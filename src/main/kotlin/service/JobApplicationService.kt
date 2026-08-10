package com.example.service

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.example.model.StatusTransition
import com.example.repository.ApplicationRepository
import java.time.Instant

class JobApplicationService(
    private val repository: ApplicationRepository
) {

    suspend fun findAll(ownerId: String): List<JobApplication> =
        repository.findAll(ownerId)

    suspend fun findById(id: String, ownerId: String): JobApplication? =
        repository.findById(id, ownerId)

    suspend fun create(application: JobApplication): JobApplication? {
        val createdApplication = application.copy(
            statusHistory = listOf(StatusTransition(application.status, Instant.now().toString()))
        )

        return createdApplication.takeIf { repository.create(it) }
    }

    suspend fun update(
        id: String,
        ownerId: String,
        application: JobApplication
    ): JobApplication? = repository.update(
        id,
        ownerId,
        application,
        StatusTransition(application.status, Instant.now().toString()),
    )

    suspend fun patch(
        id: String,
        ownerId: String,
        changes: JobApplicationChanges
    ): JobApplication? = repository.patch(
        id,
        ownerId,
        changes,
        changes.status?.let { StatusTransition(it, Instant.now().toString()) },
    )

    suspend fun delete(id: String, ownerId: String): JobApplication? =
        repository.delete(id, ownerId)
}
