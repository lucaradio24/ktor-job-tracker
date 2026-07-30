import type { JobApplication } from "../model/jobApplication";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiErrorBody {
  errorCode: ErrorCode;
  message: string;
  fieldErrors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

type ErrorCode =
  | "INVALID_REQUEST"
  | "ALREADY_EXISTS"
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR"
  | "NETWORK_ERROR";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: ErrorCode,
    readonly fieldErrors?: FieldError[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new ApiError("Impossibile connettersi al server", 0, "NETWORK_ERROR");
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;

    throw new ApiError(
      errorBody?.message ?? `Errore HTTP ${response.status}`,
      response.status,
      errorBody?.errorCode ?? "INTERNAL_ERROR",
      errorBody?.fieldErrors,
    );
  }

  return body as T;
}

export type CreateJobApplication = Omit<JobApplication, "id">;

export async function getApplications(): Promise<JobApplication[]> {
  return fetcher<JobApplication[]>("/applications");
}

export async function createApplication(
  payload: CreateJobApplication,
): Promise<JobApplication> {
  return fetcher<JobApplication>("/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getApplication(id: string): Promise<JobApplication> {
  return fetcher<JobApplication>(`/applications/${id}`);
}

export type UpdateJobApplication = Omit<JobApplication, "id">;

export async function updateApplication(
  id: string,
  payload: UpdateJobApplication,
): Promise<JobApplication> {
  return fetcher<JobApplication>(`/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
