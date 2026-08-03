import "server-only";

import { auth0 } from "@/lib/auth0";
import type { JobApplication } from "../model/jobApplication";
import { fetcher } from "./jobApplicationApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function authenticatedFetcher<T>(path: string): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL non configurata");

  const { token } = await auth0.getAccessToken();

  return fetcher<T>(`${API_URL}${path}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getApplications(): Promise<JobApplication[]> {
  return authenticatedFetcher<JobApplication[]>("/applications");
}

export function getApplication(id: string): Promise<JobApplication> {
  return authenticatedFetcher<JobApplication>(`/applications/${id}`);
}
