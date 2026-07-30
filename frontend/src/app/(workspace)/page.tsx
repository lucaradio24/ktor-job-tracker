import { getApplications } from "@/features/applications/api/jobApplicationApi";
import styles from "./page.module.css";
import ApplicationsDashboard from "@/features/applications/components/ApplicationsDashboard/ApplicationsDashboard";

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
