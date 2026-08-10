import { getApplications } from "@/features/applications/api/jobApplicationServerApi";
import ApplicationsDashboard from "@/features/applications/components/ApplicationsDashboard/ApplicationsDashboard";
import styles from "../page.module.css";

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
