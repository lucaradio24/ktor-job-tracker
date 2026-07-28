import styles from "./page.module.css";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import ApplicationsDashboard from "@/features/applications/components/ApplicationsDashboard/ApplicationsDashboard";
import DashboardHeader from "@/features/applications/components/DashboardHeader/DashboardHeader";

export default function Home() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <DashboardHeader />
        <ApplicationsDashboard />
        <span id="settings" className={styles.visuallyHidden}>
          Impostazioni
        </span>
      </main>
    </div>
  );
}
