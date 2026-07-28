import { fetcher } from "@/lib/apiFetcher";
import { JobApplication } from "@/types/JobApplication";

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
