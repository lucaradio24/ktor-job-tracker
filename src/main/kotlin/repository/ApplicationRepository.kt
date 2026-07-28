package com.example.repository

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges

interface ApplicationRepository {
    suspend fun findAll(): List<JobApplication>
    suspend fun findById(id: String): JobApplication?
    suspend fun create(jobApplication: JobApplication): Boolean
    suspend fun update(id: String, jobApplication: JobApplication): JobApplication?
    suspend fun delete(id: String): JobApplication?
    suspend fun patch(id: String, changes: JobApplicationChanges): JobApplication?
}