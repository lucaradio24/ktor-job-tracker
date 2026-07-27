package com.example.repository

import com.example.model.JobApplication

class InMemoryApplicationRepository : ApplicationRepository {

    private  val applications = com.example.model.mock.applications

    override fun findAll(): List<JobApplication> {
        return applications
    }

    override fun findById(id: String): JobApplication? {
        return applications.find { it.id == id }
    }

    override fun create(jobApplication: JobApplication): Boolean {
        val alreadyExists = applications.any { it.id == jobApplication.id }
        if (alreadyExists) return false

        applications.add(jobApplication)
        return true
    }

    override fun update(
        id: String,
        jobApplication: JobApplication
    ): JobApplication? {
        val index = applications.indexOfFirst { it.id == id }
        if (index == -1) return null
        val updatedApplication = jobApplication.copy(id = id)
        applications[index] = updatedApplication
        return updatedApplication
    }

    override fun delete(id: String): JobApplication? {
        val applicationToRemove = applications.find { it.id == id } ?: return null
        applications.remove(applicationToRemove)
        return applicationToRemove
    }

}