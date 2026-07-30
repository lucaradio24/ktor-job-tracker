"use client";

import { CircleAlert, Columns3, List, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getApplications } from "../../api/jobApplicationApi";
import type { JobApplication } from "../../model/jobApplication";
import ApplicationBoard from "../ApplicationBoard/ApplicationBoard";
import styles from "./ApplicationsDashboard.module.css";
import DashboardHeader from "../DashboardHeader/DashboardHeader";

export default function ApplicationsDashboard({
  initialApplications,
}: {
  initialApplications: JobApplication[];
}) {
  const [jobApplications, setJobApplications] =
    useState<JobApplication[]>(initialApplications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"board" | "list">("board");

  function handleCreated(createdApplication: JobApplication) {
    setJobApplications((applications) => [...applications, createdApplication]);
  }

  async function loadApplications() {
    setLoading(true);
    setError(null);

    try {
      setJobApplications(await getApplications());
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Errore durante il caricamento delle candidature.",
      );
    } finally {
      setLoading(false);
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

      <section className={styles.dashboard} id="overview">
        {error && (
          <div className={styles.alert} role="alert">
            <CircleAlert aria-hidden="true" size={20} />
            <div>
              <strong>Non riesco a caricare le candidature.</strong>
              <p>{error}</p>
              <button type="button" onClick={loadApplications}>
                Riprova
              </button>
            </div>
          </div>
        )}

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

        {loading ? (
          <div
            className={`${styles.skeletonBoard} ${
              view === "list" ? styles.skeletonList : ""
            }`}
            aria-label="Caricamento candidature"
          >
            {[0, 1, 2, 3].map((column) => (
              <div className={styles.skeletonColumn} key={column}>
                <span
                  className={`${styles.skeleton} ${styles.skeletonTitle}`}
                />
                <span className={`${styles.skeleton} ${styles.skeletonCard}`} />
                <span
                  className={`${styles.skeleton} ${styles.skeletonCard} ${styles.skeletonCardShort}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <ApplicationBoard applications={visibleApplications} view={view} />
        )}
      </section>
    </>
  );
}
