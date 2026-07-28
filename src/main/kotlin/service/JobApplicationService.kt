package com.example.service

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.example.repository.ApplicationRepository

class JobApplicationService(
    private val repository: ApplicationRepository
) {

    suspend fun findAll(): List<JobApplication> =
        repository.findAll()

    suspend fun findById(id: String): JobApplication? =
        repository.findById(id)

    suspend fun create(application: JobApplication): Boolean =
        repository.create(application)

    suspend fun update(
        id: String,
        application: JobApplication
    ): JobApplication? =
        repository.update(id, application)

    suspend fun patch(
        id: String,
        changes: JobApplicationChanges
    ): JobApplication? =
        repository.patch(id, changes)

    suspend fun delete(id: String): JobApplication? =
        repository.delete(id)
}