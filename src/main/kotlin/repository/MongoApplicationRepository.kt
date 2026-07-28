package com.example.repository

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.mongodb.client.model.Updates.set
import com.mongodb.client.model.Updates.combine
import com.mongodb.client.model.Filters.eq
import com.mongodb.kotlin.client.coroutine.MongoCollection
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import org.bson.conversions.Bson

class MongoApplicationRepository(
    private val collection: MongoCollection<JobApplication>
): ApplicationRepository {
    override suspend fun findAll(): List<JobApplication> {
        return collection.find().toList()
    }

    override suspend fun findById(id: String): JobApplication? {
        return collection
            .find(eq("id", id))
            .firstOrNull()
    }

    override suspend fun create(jobApplication: JobApplication): Boolean {
        val alreadyExists = findById(jobApplication.id) != null

        if (alreadyExists) return false

        val result = collection.insertOne(jobApplication)

        return result.wasAcknowledged()
    }

    override suspend fun update(
        id: String,
        jobApplication: JobApplication
    ): JobApplication? {
        val updatedApplication = jobApplication.copy(id = id)

        val result = collection.replaceOne(eq("id", id),
            updatedApplication)

        if (result.matchedCount == 0L) return null

        return updatedApplication
    }

    override suspend fun delete(id: String): JobApplication? {
        val application = findById(id)
            ?: return null

        collection.deleteOne(eq("id", id))
        return application
    }

    override suspend fun patch(id: String, changes: JobApplicationChanges): JobApplication? {
        val updatedFields = mutableListOf<Bson>()

        changes.company?.let {
            updatedFields.add(set("company", it))
        }

        changes.status?.let {
            updatedFields.add(set("status", it))
        }

        changes.title?.let {
            updatedFields.add(set("title", it))
        }

        changes.appliedAt?.let {
            updatedFields.add(set("appliedAt", it))
        }

        changes.description?.let {
            updatedFields.add(set("description", it))
        }

        changes.link?.let {
            updatedFields.add(set("link", it))
        }

        changes.city?.let {
            updatedFields.add(set("city", it))
        }

        if(updatedFields.isEmpty()) return findById(id)

        val result = collection.updateOne(eq("id", id), combine(updatedFields))

        if (result.matchedCount == 0L) return null

        return findById(id)
    }

}