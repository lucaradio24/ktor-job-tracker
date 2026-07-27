package com.example.repository

import com.example.model.JobApplication

interface ApplicationRepository {
    fun findAll(): List<JobApplication>
    fun findById(id: String): JobApplication?
    fun create(jobApplication: JobApplication): Boolean
    fun update(id: String, jobApplication: JobApplication): JobApplication?
    fun delete(id: String): JobApplication?

}