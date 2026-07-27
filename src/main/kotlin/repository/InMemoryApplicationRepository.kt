package com.example.repository

import com.example.dto.PatchJobApplicationRequest
import com.example.model.ApplicationStatus
import com.example.model.JobApplication
import java.time.LocalDateTime

class InMemoryApplicationRepository (
    private val applications: MutableList<JobApplication> = mutableListOf(
        JobApplication(
            id = "1",
            company = "JetBrains",
            status = ApplicationStatus.APPLIED,
            title = "Front end developer",
            appliedAt = LocalDateTime.now().toString()

        )
    )
) : ApplicationRepository {


    override suspend fun findAll(): List<JobApplication> {
        return applications.toList()
    }

    override suspend fun findById(id: String): JobApplication? {
        return applications.find { it.id == id }
    }

    override suspend fun create(jobApplication: JobApplication): Boolean {
        val alreadyExists = applications.any { it.id == jobApplication.id }
        if (alreadyExists) return false

        applications.add(jobApplication)
        return true
    }

    override suspend fun update(
        id: String,
        jobApplication: JobApplication
    ): JobApplication? {
        val index = applications.indexOfFirst { it.id == id }
        if (index == -1) return null
        val updatedApplication = jobApplication.copy(id = id)
        applications[index] = updatedApplication
        return updatedApplication
    }



    override suspend fun delete(id: String): JobApplication? {
        val applicationToRemove = applications.find { it.id == id } ?: return null
        applications.remove(applicationToRemove)
        return applicationToRemove
    }

    override suspend fun patch(id: String, request: PatchJobApplicationRequest): JobApplication? {
        TODO("Not yet implemented")
    }

}