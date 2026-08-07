package com.example.repository

import com.example.model.ApplicationStatus
import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.example.model.StatusTransition

class InMemoryApplicationRepository (
    private val applications: MutableList<JobApplication> = mutableListOf()
) : ApplicationRepository {


    override suspend fun findAll(ownerId: String): List<JobApplication> {
        return applications.filter { it.ownerId == ownerId }.toList()
    }

    override suspend fun findById(id: String, ownerId: String): JobApplication? {
        return applications.find { it.id == id && it.ownerId == ownerId }
    }

    override suspend fun create(jobApplication: JobApplication): Boolean {
        val alreadyExists = applications.any { it.id == jobApplication.id }
        if (alreadyExists) return false

        applications.add(jobApplication)
        return true
    }

    override suspend fun update(
        id: String,
        ownerId: String,
        jobApplication: JobApplication,
        statusTransition: StatusTransition,
    ): JobApplication? {
        val index = applications.indexOfFirst { it.id == id && it.ownerId == ownerId}
        if (index == -1) return null
        val current = applications[index]
        val updatedApplication = jobApplication.copy(
            id = id,
            ownerId = ownerId,
            statusHistory = current.statusHistory.appendIfChanged(current.status, statusTransition),
        )
        applications[index] = updatedApplication
        return updatedApplication
    }



    override suspend fun delete(id: String, ownerId: String): JobApplication? {
        val applicationToRemove = applications.find { it.id == id && it.ownerId == ownerId } ?: return null
        applications.remove(applicationToRemove)
        return applicationToRemove
    }

    override suspend fun patch(
        id: String,
        ownerId: String,
        changes: JobApplicationChanges,
        statusTransition: StatusTransition?,
    ): JobApplication? {
        val index = applications.indexOfFirst { it.id == id && it.ownerId == ownerId}

        if (index == -1) return null

        val current = applications[index]

        val updated = current.copy(
            company = changes.company ?: current.company,
            status = changes.status ?: current.status,
            title = changes.title ?: current.title,
            appliedAt = changes.appliedAt ?: current.appliedAt,
            description = changes.description ?: current.description,
            link = changes.link ?: current.link,
            city = changes.city ?: current.city,
            statusHistory = current.statusHistory.appendIfChanged(current.status, statusTransition),
        )

        applications[index] = updated

        return updated
    }

}

private fun List<StatusTransition>.appendIfChanged(
    currentStatus: ApplicationStatus,
    transition: StatusTransition?,
): List<StatusTransition> =
    if (transition != null && transition.status != currentStatus) this + transition else this
