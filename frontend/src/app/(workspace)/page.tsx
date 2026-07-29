import styles from "./page.module.css";
import ApplicationsDashboard from "@/features/applications/components/ApplicationsDashboard/ApplicationsDashboard";

export default function Home() {
  return (
    <>
      <ApplicationsDashboard />
      <span id="settings" className={styles.visuallyHidden}>
        Impostazioni
      </span>
    </>
  );
}
