"use client";

import { CircleAlert, Search, Archive, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/feedback/ToastViewport/ToastProvider";
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

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Candidature",
  INTERVIEW: "Colloqui",
  OFFER: "Offerte",
  REJECTED: "Non selezionate",
  WITHDRAWN: "Ritirate",
};

type ApplicationDashboardProps = {
  initialApplications: JobApplication[];
};

export default function ApplicationsDashboard({
  initialApplications,
}: ApplicationDashboardProps) {
  const { showToast } = useToast();

  const pendingStatusChanges = useRef(new Set<string>());
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

  async function handleUndo(id: string, previousStatus: ApplicationStatus) {
    if (pendingStatusChanges.current.has(id)) return;

    pendingStatusChanges.current.add(id);
    setUpdateError(null);

    try {
      const restoredApplication = await patchApplication(id, {
        status: previousStatus,
      });

      setJobApplications((applications) =>
        applications.map((application) =>
          application.id === id ? restoredApplication : application,
        ),
      );
    } catch (requestError) {
      setUpdateError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile annullare lo spostamento.",
      );
    } finally {
      pendingStatusChanges.current.delete(id);
    }
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdateError(null);

    const previousApplication = jobApplications.find(
      (application) => application.id === id,
    );

    if (
      !previousApplication ||
      previousApplication.status === status ||
      pendingStatusChanges.current.has(id)
    ) {
      return;
    }

    pendingStatusChanges.current.add(id);

    setJobApplications((applications) =>
      applications.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );

    try {
      const updatedApplication = await patchApplication(id, { status });

      setJobApplications((applications) =>
        applications.map((application) =>
          application.id === id ? updatedApplication : application,
        ),
      );

      showToast({
        title: `Spostata in ${statusLabels[updatedApplication.status]}`,
        description: `${updatedApplication.company} · ${updatedApplication.title}`,
        action: {
          label: "Annulla",
          onClick: () => {
            void handleUndo(updatedApplication.id, previousApplication.status);
          },
        },
      });
    } catch (requestError) {
      setJobApplications((applications) =>
        applications.map((application) =>
          application.id === id && application.status === status
            ? previousApplication
            : application,
        ),
      );

      setUpdateError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile spostare la candidatura.",
      );
    } finally {
      pendingStatusChanges.current.delete(id);
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
            {query && (
              <X
                aria-hidden="true"
                style={{ cursor: "pointer" }}
                size={20}
                strokeWidth={1.8}
                onClick={() => setQuery("")}
              />
            )}
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
