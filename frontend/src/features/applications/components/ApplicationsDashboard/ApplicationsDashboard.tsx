"use client";

import { CircleAlert, Columns3, List, Search } from "lucide-react";
import { useState } from "react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationBoard from "../ApplicationBoard/ApplicationBoard";
import styles from "./ApplicationsDashboard.module.css";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { patchApplication } from "../../api/jobApplicationApi";

export default function ApplicationsDashboard({
  initialApplications,
}: {
  initialApplications: JobApplication[];
}) {
  const [jobApplications, setJobApplications] =
    useState<JobApplication[]>(initialApplications);

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [updateError, setUpdateError] = useState<string | null>(null);

  function handleCreated(createdApplication: JobApplication) {
    setJobApplications((applications) => [...applications, createdApplication]);
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdateError(null);

    const prevApplication = jobApplications.find(
      (application) => application.id === id,
    );
    if (!prevApplication || prevApplication.status === status) return;
    setJobApplications((applications) =>
      applications.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );

    try {
      const updatedApplication = await patchApplication(id, { status });

      setJobApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === updatedApplication.id
            ? updatedApplication
            : application,
        ),
      );
    } catch (requestError) {
      // rollback
      setJobApplications((applications) =>
        applications.map((application) =>
          application.id === id && application.status === status
            ? prevApplication
            : application,
        ),
      );

      setUpdateError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile spostare la candidatura.",
      );
    }
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("it-IT");
  const visibleApplications = jobApplications.filter((application) =>
    `${application.company} ${application.title}`
      .toLocaleLowerCase("it-IT")
      .includes(normalizedQuery),
  );

  return (
    <>
      <DashboardHeader onCreateApplication={handleCreated} />
      {updateError && (
        <div className={styles.alert} role="alert">
          <CircleAlert aria-hidden="true" size={20} />
          <div>
            <strong>Aggiornamento non riuscito</strong>
            <p>{updateError}</p>
          </div>
        </div>
      )}
      <section className={styles.dashboard} id="overview">
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <Search aria-hidden="true" size={20} strokeWidth={1.8} />
            <input
              aria-label="Cerca candidature"
              type="search"
              placeholder="Cerca azienda o ruolo"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div
            className={styles.viewToggle}
            role="group"
            aria-label="Vista candidature"
          >
            <button
              type="button"
              aria-pressed={view === "board"}
              onClick={() => setView("board")}
            >
              <Columns3 aria-hidden="true" size={19} strokeWidth={1.8} />
              Board
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List aria-hidden="true" size={19} strokeWidth={1.8} />
              Lista
            </button>
          </div>
        </div>

        <ApplicationBoard
          applications={visibleApplications}
          view={view}
          onStatusChange={handleStatusChange}
        />
      </section>
    </>
  );
}
