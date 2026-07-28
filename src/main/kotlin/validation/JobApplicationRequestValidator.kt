package com.example.validation

import com.example.dto.CreateJobApplicationRequest
import com.example.dto.PatchJobApplicationRequest
import com.example.dto.UpdateJobApplicationRequest
import java.net.URI
import java.time.LocalDate

object JobApplicationRequestValidator {
    fun validateCreate(request: CreateJobApplicationRequest): List<ValidationError> = buildList {
            if (request.company.isBlank()){
                add(ValidationError("company", "must not be blank"))
            }
            if (request.title.isBlank()){
                add(ValidationError("title", "must not be blank"))
            }
            if (!isValidDate(request.appliedAt)){
                add(ValidationError("appliedAt", "must be a date"))
            }

            if (request.link != null && !isValidHTTPUrl(request.link)){
                add(
                    ValidationError(
                        "link",
                        "must be a valid HTTP URL or HTTPS URL"
                    )
                )
            }
    }

    fun validateUpdate(request: UpdateJobApplicationRequest): List<ValidationError> = buildList {
            if (request.company.isBlank()){
                add(ValidationError("company", "must not be blank"))
            }
        if (request.title.isBlank()){
            add(ValidationError("title", "must not be blank"))
        }
        if (!isValidDate(request.appliedAt)){
            add(ValidationError("appliedAt", "must be a valid date"))
        }
        if (request.link != null && !isValidHTTPUrl(request.link)){
            add(ValidationError("link", "must be a valid HTTP URL or HTTPS URL"))
        }
    }

    fun validatePatch(request: PatchJobApplicationRequest): List<ValidationError> = buildList {
        val hasAtLeastOneChange = listOf(
            request.company,
            request.title,
            request.appliedAt,
            request.link,
            request.description,
            request.status,
            request.city
        ).any { it != null }

        if (!hasAtLeastOneChange) {
            add(ValidationError("request", "at least one field must be provided"))
        }

        request.company?.let {
            if (it.isBlank()){
                add(ValidationError("company", "must not be blank"))
            }
        }

        request.title?.let {
            if (it.isBlank()) {
                add(ValidationError("title", "must not be blank"))
            }
        }


        request.appliedAt?.let {
            if (!isValidDate(it)) {
                add(ValidationError("appliedAt", "must be a valid date"))
            }
        }

        request.link?.let {
            if (!isValidHTTPUrl(it)){
                add(ValidationError("link", "must be a valid HTTP URL"))
            }
        }
    }


    private fun isValidDate(value: String): Boolean =
        runCatching { LocalDate.parse(value) }.isSuccess

    private fun isValidHTTPUrl(value: String): Boolean =
        runCatching {
            val uri = URI(value)
            uri.scheme in setOf("http", "https") &&
                    !uri.host.isNullOrBlank()
        }.getOrDefault(false)
}