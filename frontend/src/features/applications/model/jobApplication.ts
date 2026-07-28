export type ApplicationStatus =
  | "APPLIED"
  | "INTERVIEW"
  | "REJECTED"
  | "WITHDRAWN"
  | "OFFER";

export interface JobApplication {
  id: string;
  company: string;
  status: ApplicationStatus;
  title: string;
  appliedAt: string;
  description?: string | null;
  link?: string | null;
  city?: string | null;
}
