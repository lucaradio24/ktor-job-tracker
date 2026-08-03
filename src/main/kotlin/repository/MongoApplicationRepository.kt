package com.example.repository

import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import com.mongodb.client.model.Filters.and
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
    override suspend fun findAll(ownerId: String): List<JobApplication> {
        return collection.find(eq("ownerId", ownerId)).toList()
    }

    override suspend fun findById(id: String, ownerId: String): JobApplication? {
        return collection
            .find(
                and(eq("id", id),
                    eq("ownerId", ownerId)))
            .firstOrNull()
    }

    override suspend fun create(jobApplication: JobApplication): Boolean {
        val alreadyExists = findById(jobApplication.id, jobApplication.ownerId) != null

        if (alreadyExists) return false

        val result = collection.insertOne(jobApplication)

        return result.wasAcknowledged()
    }

    override suspend fun update(
        id: String,
        ownerId: String,
        jobApplication: JobApplication
    ): JobApplication? {
        val updatedApplication = jobApplication.copy(id = id, ownerId = ownerId)

        val result = collection.replaceOne(and(eq("id", id),
            eq("ownerId", ownerId)),
            updatedApplication)

        if (result.matchedCount == 0L) return null

        return updatedApplication
    }

    override suspend fun delete(id: String, ownerId: String): JobApplication? {
        val application = findById(id, ownerId)
            ?: return null

        collection.deleteOne(and(eq("id", id),
            eq("ownerId", ownerId)))
        return application
    }

    override suspend fun patch(id: String, ownerId: String, changes: JobApplicationChanges): JobApplication? {
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

        if(updatedFields.isEmpty()) return findById(id, ownerId)

        val result = collection.updateOne(and(eq("id", id), eq("ownerId", ownerId) ),
            combine(updatedFields))

        if (result.matchedCount == 0L) return null

        return findById(id, ownerId)
    }

}