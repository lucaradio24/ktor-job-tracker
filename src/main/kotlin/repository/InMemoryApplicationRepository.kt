package com.example.repository

import com.example.model.ApplicationStatus
import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
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

    override suspend fun patch(id: String, changes: JobApplicationChanges): JobApplication? {
        val index = applications.indexOfFirst { it.id == id }

        if (index == -1) return null

        val current = applications[index]

        val updated = current.copy(
            company = changes.company ?: current.company,
            status = changes.status ?: current.status,
            title = changes.title ?: current.title,
            appliedAt = changes.appliedAt ?: current.appliedAt,
            description = changes.description ?: current.description,
            link = changes.link ?: current.link,
            city = changes.city ?: current.city
        )

        applications[index] = updated

        return updated
    }

}