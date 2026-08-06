"use client";

import { CircleAlert, Search, Archive, Plus } from "lucide-react";
import { useState } from "react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationBoard from "../ApplicationBoard/ApplicationBoard";
import styles from "./ApplicationsDashboard.module.css";
import headerStyles from "../DashboardHeader/DashboardHeader.module.css";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import {
  patchApplication,
  deleteApplication,
} from "../../api/jobApplicationApi";
import ApplicationsList from "../ApplicationsList/ApplicationsList";
import ConfirmDialog from "../Dialogs/ConfirmDialog/ConfirmDialog";

type ApplicationDashboardProps = {
  initialApplications: JobApplication[];
};

export default function ApplicationsDashboard({
  initialApplications,
}: ApplicationDashboardProps) {
  const [jobApplications, setJobApplications] =
    useState<JobApplication[]>(initialApplications);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showWithdrawn, setShowWithdrawn] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [applicationToDelete, setApplicationToDelete] =
    useState<JobApplication | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDeleteApplication() {
    if (!applicationToDelete) return;

    const applicationId = applicationToDelete.id;

    try {
      setIsDeleting(true);
      setUpdateError(null);
      await deleteApplication(applicationId);

      setJobApplications((applications) =>
        applications.filter((application) => application.id !== applicationId),
      );

      setApplicationToDelete(null);
    } catch (requestError) {
      setApplicationToDelete(null);

      setUpdateError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile eliminare la candidatura.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const normalizedQuery = query.trim().toLocaleLowerCase("it-IT");
  const hasQuery = normalizedQuery.length > 0;

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

  const withdrawnApplicationsCount = jobApplications.filter(
    (application) => application.status === "WITHDRAWN",
  ).length;

  return (
    <>
      <DashboardHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onCreateApplication={handleCreated}
      />
      {updateError && (
        <div className={styles.alert} role="alert">
          <CircleAlert aria-hidden="true" size={20} />
          <div>
            <strong>Operazione non riuscita</strong>
            <p>{updateError}</p>
          </div>
        </div>
      )}
      <section className={styles.dashboard} id="overview">
        <div className={styles.toolbar}>
          <button
            className={headerStyles.primaryAction}
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus aria-hidden="true" size={19} strokeWidth={2.2} />
            Nuova candidatura
          </button>

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
              {withdrawnApplicationsCount}
            </span>
          </button>
        </div>
        <div id="applications-view" className={styles.applicationsView}>
          {showWithdrawn ? (
            <section
              className={styles.archiveView}
              aria-labelledby="archive-title"
            >
              <header className={styles.archiveHeader}>
                <div>
                  <p className={styles.viewEyebrow}>Archivio</p>
                  <h2 id="archive-title" className={styles.viewTitle}>
                    Ritirate
                  </h2>
                  <p className={styles.archiveDescription}>
                    Qui trovi le candidature che hai archiviato.
                  </p>
                </div>

                <span
                  className={styles.archiveResultsCount}
                  aria-label={`${withdrawnApplications.length} candidature da mostrare`}
                >
                  {withdrawnApplications.length}
                </span>
              </header>

              {withdrawnApplications.length > 0 ? (
                <ApplicationsList
                  applications={withdrawnApplications}
                  onStatusChange={handleStatusChange}
                  onDeleteRequest={setApplicationToDelete}
                />
              ) : (
                <p className={`${styles.emptyResults} ${styles.emptyArchive}`}>
                  Nessuna candidatura ritirata da mostrare.
                </p>
              )}
            </section>
          ) : hasQuery ? (
            <section
              className={styles.searchView}
              aria-labelledby="search-results-title"
            >
              <header className={styles.searchHeader}>
                <div>
                  <p className={styles.viewEyebrow}>Ricerca</p>
                  <h2 className={styles.viewTitle} id="search-results-title">
                    Risultati per “{query.trim()}”
                  </h2>
                </div>
                <p className={styles.resultsCount}>
                  {activeApplications.length}{" "}
                  {activeApplications.length === 1 ? "risultato" : "risultati"}
                </p>
              </header>

              {activeApplications.length > 0 ? (
                <ApplicationsList
                  applications={activeApplications}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <p className={styles.emptyResults}>
                  Nessuna candidatura corrisponde alla ricerca.
                </p>
              )}
            </section>
          ) : (
            <ApplicationBoard
              applications={activeApplications}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </section>

      <ConfirmDialog
        open={applicationToDelete !== null}
        title="Eliminare definitivamente?"
        description={
          applicationToDelete ? (
            <>
              Stai per eliminare{" "}
              <strong>
                {applicationToDelete.company} - {applicationToDelete.title}.
              </strong>
              <br />
              Questa azione non può essere annullata.
            </>
          ) : null
        }
        onCancel={() => setApplicationToDelete(null)}
        onConfirm={handleDeleteApplication}
        isPending={isDeleting}
      />
    </>
  );
}
