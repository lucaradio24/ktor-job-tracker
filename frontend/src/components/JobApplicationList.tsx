"use client";

import { getApplications } from "@/api/JobApplicationApi";
import ApplicationBoard from "@/components/ApplicationBoard";
import StatCard from "@/components/StatCard";
import type { JobApplication } from "@/types/JobApplication";
import { useEffect, useState } from "react";

export default function JobApplicationList() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getApplications()
      .then((data) => {
        if (active) setJobApplications(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load applications",
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
    <section className="dashboard-data" id="overview">
      {error && (
        <div className="data-alert" role="alert">
          <span aria-hidden="true">!</span>
          <div>
            <strong>Non riesco a caricare le candidature.</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="stats-grid" aria-label="Riepilogo candidature">
        <StatCard
          icon="▤"
          label="Totali"
          tone="lavender"
          value={loading ? "—" : jobApplications.length}
        />
        <StatCard
          icon="●●"
          label="Colloqui"
          tone="blue"
          value={loading ? "—" : interviewCount}
        />
        <StatCard
          icon="☆"
          label="Offerte"
          tone="green"
          value={loading ? "—" : offerCount}
        />
      </div>

      <div className="board-heading">
        <div>
          <span className="eyebrow">La tua pipeline</span>
          <h2>Segui ogni opportunità</h2>
        </div>
        <div className="board-status">
          {loading ? (
            <span className="loading-indicator">Aggiornamento…</span>
          ) : (
            <>
              <span className="status-live-dot" aria-hidden="true" />
              Dati aggiornati
            </>
          )}
        </div>
      </div>

      {withdrawnCount > 0 && !loading && (
        <p className="archive-note">
          {withdrawnCount}{" "}
          {withdrawnCount === 1 ? "candidatura ritirata" : "candidature ritirate"}{" "}
          nell&apos;archivio.
        </p>
      )}

      {loading ? (
        <div className="board-skeleton" aria-label="Caricamento candidature">
          {[0, 1, 2, 3].map((column) => (
            <div className="skeleton-column" key={column}>
              <span className="skeleton-line skeleton-title" />
              <span className="skeleton-card" />
              <span className="skeleton-card skeleton-card-short" />
            </div>
          ))}
        </div>
      ) : (
        <ApplicationBoard applications={jobApplications} />
      )}
    </section>
  );
}
