package com.example.routes

import com.example.dto.CreateJobApplicationRequest
import com.example.dto.PatchJobApplicationRequest
import com.example.dto.UpdateJobApplicationRequest
import com.example.error.ApiErrorResponse
import com.example.error.ErrorCodes
import com.example.model.JobApplication
import com.example.model.JobApplicationChanges
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import com.example.service.JobApplicationService
import com.example.validation.JobApplicationRequestValidator
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.routing.delete
import io.ktor.server.routing.patch
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import java.util.UUID


fun Route.applicationRoutes(service: JobApplicationService) {
    route("/applications"){
        get {
            call.respond(HttpStatusCode.OK, service.findAll())
        }

        get("/{id}"){
            val id = call.parameters["id"]
            if (id != null){
                val application = service.findById(id)
                if (application != null){
                    call.respond(application)
                } else {
                    call.respond(HttpStatusCode.NotFound, ApiErrorResponse(ErrorCodes.NOT_FOUND,
                        "Application not found"))
                }
            } else {
                call.respond(HttpStatusCode.BadRequest, ApiErrorResponse(ErrorCodes.INVALID_REQUEST,
                    "Invalid ID"))
            }

        }

        post{

            val request = call.receive<CreateJobApplicationRequest>()
            val errors = JobApplicationRequestValidator.validateCreate(request)

            if (errors.isNotEmpty()){
                return@post call.respond(HttpStatusCode.BadRequest, ApiErrorResponse(ErrorCodes.VALIDATION_FAILED,
                    "Validation error", errors))
            }

            val application = JobApplication(
                id = UUID.randomUUID().toString(),
                company = request.company,
                status = request.status,
                title = request.title,
                description = request.description,
                appliedAt = request.appliedAt,
                link = request.link,
                city = request.city,
            )
            val created = service.create(application)
            if (!created){
                return@post call.respond(HttpStatusCode.Conflict, ApiErrorResponse(ErrorCodes.ALREADY_EXISTS,
                    "Application already exists"))
            }
            call.respond(HttpStatusCode.Created, application)
        }

        put("/{id}") {
            val id = call.parameters["id"]
                ?: return@put call.respond(
                    HttpStatusCode.BadRequest,
                    ApiErrorResponse(ErrorCodes.INVALID_REQUEST, "Invalid ID")
                )

            val request = call.receive<UpdateJobApplicationRequest>()
            val errors = JobApplicationRequestValidator.validateUpdate(request)
            if (errors.isNotEmpty()){
                return@put call.respond(HttpStatusCode.BadRequest, ApiErrorResponse(ErrorCodes.VALIDATION_FAILED, "Invalid request", errors))
            }

            val receivedApplication = JobApplication(
                id = id,
                company = request.company,
                status = request.status,
                title = request.title,
                description = request.description,
                appliedAt = request.appliedAt,
                link = request.link,
                city = request.city,
            )

            val updatedApplication = service.update(id,receivedApplication)
            if (updatedApplication != null){
                call.respond(HttpStatusCode.OK, updatedApplication)
            } else {
                call.respond(HttpStatusCode.NotFound, ApiErrorResponse(ErrorCodes.NOT_FOUND, "Application not found"))
            }


        }

        patch("/{id}") {
            val id = call.parameters["id"]
                ?: return@patch call.respond(HttpStatusCode.BadRequest, ApiErrorResponse(ErrorCodes.INVALID_REQUEST, "Invalid ID"))
            val request = call.receive< PatchJobApplicationRequest>()

            val errors = JobApplicationRequestValidator.validatePatch(request)


            if (errors.isNotEmpty()){
                return@patch call.respond(HttpStatusCode.BadRequest, ApiErrorResponse(ErrorCodes.VALIDATION_FAILED, "Validation error", errors))
            }

            val changes = JobApplicationChanges(
                company = request.company,
                status = request.status,
                title = request.title,
                description = request.description,
                appliedAt = request.appliedAt,
                link = request.link,
                city = request.city,
            )

            val updatedApplication = service.patch(id, changes)
                ?: return@patch call.respond(HttpStatusCode.NotFound, ApiErrorResponse(ErrorCodes.NOT_FOUND, "Application not found"))

            call.respond(HttpStatusCode.OK,updatedApplication)
        }

        delete( "/{id}" ){
            val id = call.parameters["id"]
            ?: return@delete call.respond(HttpStatusCode.BadRequest, ApiErrorResponse(ErrorCodes.INVALID_REQUEST, "Invalid ID"))

            val applicationToRemove = service.delete(id) ?: return@delete call.respond(HttpStatusCode.NotFound,
                ApiErrorResponse(ErrorCodes.NOT_FOUND, "Application not found"))


            call.respond(HttpStatusCode.OK, applicationToRemove )
        }
    }



}