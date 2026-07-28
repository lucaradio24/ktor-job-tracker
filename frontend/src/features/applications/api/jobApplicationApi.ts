import type { JobApplication } from "../model/jobApplication";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetcher<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(error?.error ?? `Errore HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
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
