import { getApplications } from "@/features/applications/api/jobApplicationServerApi";
import ApplicationsDashboard from "@/features/applications/components/ApplicationsDashboard/ApplicationsDashboard";
import styles from "../page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidature",
};

export default async function Home() {
  const applications = await getApplications();

  return (
    <>
      <ApplicationsDashboard initialApplications={applications} />
      <span id="settings" className={styles.visuallyHidden}>
        Impostazioni
      </span>
    </>
  );
}
