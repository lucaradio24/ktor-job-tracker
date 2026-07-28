"use client";

import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleAlert,
  MessagesSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getApplications } from "../../api/jobApplicationApi";
import type { JobApplication } from "../../model/jobApplication";
import ApplicationBoard from "../ApplicationBoard/ApplicationBoard";
import StatCard from "../StatCard/StatCard";
import styles from "./ApplicationsDashboard.module.css";

export default function ApplicationsDashboard() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getApplications()
      .then((data) => {
        if (active) setJobApplications(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Errore durante il caricamento delle candidature.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const interviewCount = jobApplications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;
  const offerCount = jobApplications.filter(
    (application) => application.status === "OFFER",
  ).length;
  const withdrawnCount = jobApplications.filter(
    (application) => application.status === "WITHDRAWN",
  ).length;

  return (
    <section className={styles.dashboard} id="overview">
      {error && (
        <div className={styles.alert} role="alert">
          <CircleAlert aria-hidden="true" size={20} />
          <div>
            <strong>Non riesco a caricare le candidature.</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={styles.statsGrid} aria-label="Riepilogo candidature">
        <StatCard
          icon={BriefcaseBusiness}
          label="Totali"
          tone="amber"
          value={loading ? "—" : jobApplications.length}
        />
        <StatCard
          icon={MessagesSquare}
          label="Colloqui"
          tone="violet"
          value={loading ? "—" : interviewCount}
        />
        <StatCard
          icon={BadgeCheck}
          label="Offerte"
          tone="green"
          value={loading ? "—" : offerCount}
        />
      </div>

      <div className={styles.boardHeading}>
        <div>
          <p className={styles.eyebrow}>Pipeline</p>
          <h2>Segui ogni opportunità</h2>
        </div>
        <div className={styles.boardStatus} aria-live="polite">
          {loading ? (
            <>
              <span className={styles.loadingDot} aria-hidden="true" />
              Aggiornamento
            </>
          ) : (
            <>
              <span className={styles.liveDot} aria-hidden="true" />
              Dati aggiornati
            </>
          )}
        </div>
      </div>

      {withdrawnCount > 0 && !loading && (
        <p className={styles.archiveNote}>
          {withdrawnCount}{" "}
          {withdrawnCount === 1
            ? "candidatura ritirata"
            : "candidature ritirate"}{" "}
          in archivio.
        </p>
      )}

      {loading ? (
        <div className={styles.skeletonBoard} aria-label="Caricamento candidature">
          {[0, 1, 2, 3].map((column) => (
            <div className={styles.skeletonColumn} key={column}>
              <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
              <span className={`${styles.skeleton} ${styles.skeletonCard}`} />
              <span
                className={`${styles.skeleton} ${styles.skeletonCard} ${styles.skeletonCardShort}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <ApplicationBoard applications={jobApplications} />
      )}
    </section>
  );
}
