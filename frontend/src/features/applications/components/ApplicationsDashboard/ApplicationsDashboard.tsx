"use client";

import { CircleAlert, Search, Archive } from "lucide-react";
import { useState } from "react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationBoard from "../ApplicationBoard/ApplicationBoard";
import styles from "./ApplicationsDashboard.module.css";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { patchApplication } from "../../api/jobApplicationApi";
import ApplicationsList from "../ApplicationsList/ApplicationsList";

export default function ApplicationsDashboard({
  initialApplications,
}: {
  initialApplications: JobApplication[];
}) {
  const [jobApplications, setJobApplications] =
    useState<JobApplication[]>(initialApplications);

  const [query, setQuery] = useState("");
  const [showWithdrawn, setShowWithdrawn] = useState(false);
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
  const matchingApplications = jobApplications.filter((application) =>
    `${application.company} ${application.title}`
      .toLocaleLowerCase("it-IT")
      .includes(normalizedQuery),
  );

  const activeApplications = matchingApplications.filter(
    (application) => application.status !== "WITHDRAWN",
  );

  const withdrawnApplications = matchingApplications.filter(
    (application) => application.status === "WITHDRAWN",
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

          <button
            type="button"
            className={styles.archiveToggle}
            aria-pressed={showWithdrawn}
            onClick={() => setShowWithdrawn((current) => !current)}
            aria-controls="applications-view"
            aria-label={
              showWithdrawn
                ? "Torna alle candidature attive"
                : "Mostra le candidature ritirate"
            }
          >
            <Archive aria-hidden="true" size={19} strokeWidth={1.8} />
            <span>Ritirate</span>
            <span className={styles.archiveCount} aria-hidden="true">
              {withdrawnApplications.length}
            </span>
          </button>
        </div>

        {showWithdrawn ? (
          <ApplicationsList
            applications={withdrawnApplications}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <ApplicationBoard
            applications={activeApplications}
            onStatusChange={handleStatusChange}
          />
        )}
      </section>
    </>
  );
}
