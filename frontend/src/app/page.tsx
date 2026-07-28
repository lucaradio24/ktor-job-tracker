import DashboardHeader from "@/components/DashboardHeader";
import JobApplicationList from "@/components/JobApplicationList";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="app-frame">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <JobApplicationList />
        <span id="settings" className="sr-only">
          Impostazioni
        </span>
      </main>
    </div>
  );
}
