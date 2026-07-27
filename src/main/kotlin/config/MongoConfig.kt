package com.example.config

import com.example.model.JobApplication
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import org.bson.BsonInt32
import org.bson.Document

object MongoConfig {

    private val client: MongoClient by lazy {
        MongoClient.create(Environment.mongoUri)
    }

    val database: MongoDatabase by lazy { client.getDatabase(Environment.mongoDatabase) }

    val jobApplicationsCollection: MongoCollection<JobApplication> by lazy {
        database.getCollection<JobApplication>("job_applications")
    }

    suspend fun ping(): Document{
        return database.runCommand(
            Document("ping", BsonInt32(1))
        )
    }
}
