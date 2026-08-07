"use client";

import { Archive, CircleAlert, Plus, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/components/feedback/ToastViewport/ToastProvider";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import {
  ApiError,
  deleteApplication,
  patchApplication,
} from "../../api/jobApplicationApi";
import ApplicationBoard from "../ApplicationBoard/ApplicationBoard";
import ApplicationInspector from "../ApplicationInspector/ApplicationInspector";
import ApplicationsList from "../ApplicationsList/ApplicationsList";
import ConfirmDialog from "../Dialogs/ConfirmDialog/ConfirmDialog";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import headerStyles from "../DashboardHeader/DashboardHeader.module.css";
import styles from "./ApplicationsDashboard.module.css";

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Candidature",
  INTERVIEW: "Colloqui",
  OFFER: "Offerte",
  REJECTED: "Non selezionate",
  WITHDRAWN: "Ritirate",
};

const pipelineStatuses = new Set<ApplicationStatus>([
  "APPLIED",
  "INTERVIEW",
  "OFFER",
]);

export default function ApplicationsDashboard({
  initialApplications,
}: {
  initialApplications: JobApplication[];
}) {
  const { showToast } = useToast();
  const pendingStatusChanges = useRef(new Set<string>());
  const [jobApplications, setJobApplications] =
    useState<JobApplication[]>(initialApplications);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showOutcomes, setShowOutcomes] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [applicationToDelete, setApplicationToDelete] =
    useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleCreated(createdApplication: JobApplication) {
    setJobApplications((applications) => [...applications, createdApplication]);
    requestAnimationFrame(() => {
      if (
        document.documentElement.dataset.motion === "reduced" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      document
        .getElementById(`application-card-${createdApplication.id}`)
        ?.animate(
          [
            {
              opacity: 0,
              clipPath: "inset(0 0 1rem 0 round var(--radius-md))",
              transform: "translateY(0.5rem)",
            },
            {
              opacity: 1,
              clipPath: "inset(0 round var(--radius-md))",
              transform: "translateY(0)",
            },
          ],
          { duration: 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
    });
  }

  function removeApplication(id: string) {
    setJobApplications((applications) =>
      applications.filter((application) => application.id !== id),
    );
    setSelectedApplicationId((selectedId) =>
      selectedId === id ? null : selectedId,
    );
  }

  function handleCloseInspector() {
    const applicationId = selectedApplicationId;
    setSelectedApplicationId(null);
    if (applicationId) {
      requestAnimationFrame(() =>
        document.getElementById(`application-card-${applicationId}`)?.focus(),
      );
    }
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
      if (requestError instanceof ApiError && requestError.status === 404) {
        removeApplication(id);
      }
      setUpdateError(
        requestError instanceof ApiError && requestError.status === 404
          ? "La candidatura non esiste più. L’elenco è stato aggiornato."
          : requestError instanceof Error
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
    const wasSelected = selectedApplicationId === id;

    if (
      !previousApplication ||
      previousApplication.status === status ||
      pendingStatusChanges.current.has(id)
    ) {
      return;
    }

    pendingStatusChanges.current.add(id);
    if (selectedApplicationId === id) {
      const remainsVisible = showOutcomes
        ? !pipelineStatuses.has(status)
        : hasQuery || pipelineStatuses.has(status);
      if (!remainsVisible) setSelectedApplicationId(null);
    }
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
      const isMissing =
        requestError instanceof ApiError && requestError.status === 404;
      if (isMissing) {
        removeApplication(id);
      } else {
        setJobApplications((applications) =>
          applications.map((application) =>
            application.id === id && application.status === status
              ? previousApplication
              : application,
          ),
        );
        if (wasSelected) setSelectedApplicationId(id);
      }
      setUpdateError(
        isMissing
          ? "La candidatura non esiste più. L’elenco è stato aggiornato."
          : requestError instanceof Error
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
      removeApplication(applicationId);
      setApplicationToDelete(null);
    } catch (requestError) {
      setApplicationToDelete(null);
      if (requestError instanceof ApiError && requestError.status === 404) {
        removeApplication(applicationId);
        return;
      }
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
  const pipelineApplications = matchingApplications.filter((application) =>
    pipelineStatuses.has(application.status),
  );
  const outcomeApplications = matchingApplications.filter(
    (application) => !pipelineStatuses.has(application.status),
  );
  const outcomesCount = jobApplications.filter(
    (application) => !pipelineStatuses.has(application.status),
  ).length;
  const visibleApplications = showOutcomes
    ? outcomeApplications
    : hasQuery
      ? matchingApplications
      : pipelineApplications;
  const selectedApplication =
    visibleApplications.find(
      (application) => application.id === selectedApplicationId,
    ) ?? null;

  return (
    <>
      <div
        className={styles.headerSlot}
        data-inspector-open={selectedApplication ? "true" : "false"}
      >
        <DashboardHeader
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onCreateApplication={handleCreated}
        />
      </div>

      {updateError && (
        <div className={styles.alert} role="alert">
          <CircleAlert aria-hidden="true" size={20} />
          <div>
            <strong>Operazione non riuscita</strong>
            <p>{updateError}</p>
          </div>
        </div>
      )}

      <section
        className={styles.dashboard}
        data-inspector-open={selectedApplication ? "true" : "false"}
        id="overview"
      >
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <Search aria-hidden="true" size={19} strokeWidth={1.8} />
            <input
              aria-label="Cerca candidature"
              type="search"
              placeholder="Cerca azienda o ruolo"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                const selected = jobApplications.find(
                  (application) => application.id === selectedApplicationId,
                );
                if (
                  selected &&
                  !`${selected.company} ${selected.title}`
                    .toLocaleLowerCase("it-IT")
                    .includes(nextQuery.trim().toLocaleLowerCase("it-IT"))
                ) {
                  setSelectedApplicationId(null);
                }
              }}
            />
            {query && (
              <button
                className={styles.clearSearch}
                type="button"
                onClick={() => {
                  setQuery("");
                  const selected = jobApplications.find(
                    (application) => application.id === selectedApplicationId,
                  );
                  if (
                    selected &&
                    !showOutcomes &&
                    !pipelineStatuses.has(selected.status)
                  ) {
                    setSelectedApplicationId(null);
                  }
                }}
                aria-label="Cancella ricerca"
              >
                <X aria-hidden="true" size={18} />
              </button>
            )}
          </label>

          <button
            type="button"
            className={styles.outcomesToggle}
            aria-pressed={showOutcomes}
            onClick={() => {
              const nextShowOutcomes = !showOutcomes;
              setShowOutcomes(nextShowOutcomes);
              const selected = jobApplications.find(
                (application) => application.id === selectedApplicationId,
              );
              if (
                selected &&
                pipelineStatuses.has(selected.status) === nextShowOutcomes
              ) {
                setSelectedApplicationId(null);
              }
            }}
            aria-controls="applications-view"
          >
            <Archive aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{showOutcomes ? "Torna alla pipeline" : "Uscite"}</span>
            <span className={styles.outcomesCount} aria-hidden="true">
              {outcomesCount}
            </span>
          </button>

          <button
            className={headerStyles.primaryAction}
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus aria-hidden="true" size={19} strokeWidth={2.2} />
            Nuova candidatura
          </button>
        </div>

        <div
          className={styles.workspace}
          data-inspector-open={selectedApplication ? "true" : "false"}
        >
          <div id="applications-view" className={styles.applicationsView}>
            {showOutcomes ? (
              <section className={styles.outcomesView} aria-labelledby="outcomes-title">
                <header className={styles.viewHeader}>
                  <div>
                    <h2 id="outcomes-title" className={styles.viewTitle}>Uscite</h2>
                    <p className={styles.viewDescription}>
                      Candidature non selezionate e ritirate.
                    </p>
                  </div>
                  <span className={styles.resultsCount}>
                    {outcomeApplications.length}
                  </span>
                </header>
                {outcomeApplications.length > 0 ? (
                  <ApplicationsList
                    applications={outcomeApplications}
                    onDeleteRequest={setApplicationToDelete}
                    onSelect={setSelectedApplicationId}
                    onStatusChange={handleStatusChange}
                    selectedApplicationId={selectedApplicationId}
                  />
                ) : (
                  <p className={styles.emptyResults}>Nessuna uscita da mostrare.</p>
                )}
              </section>
            ) : hasQuery ? (
              <section className={styles.searchView} aria-labelledby="search-results-title">
                <header className={styles.viewHeader}>
                  <h2 className={styles.viewTitle} id="search-results-title">
                    Risultati per “{query.trim()}”
                  </h2>
                  <span className={styles.resultsCount}>
                    {matchingApplications.length}
                  </span>
                </header>
                {matchingApplications.length > 0 ? (
                  <ApplicationsList
                    applications={matchingApplications}
                    onSelect={setSelectedApplicationId}
                    onStatusChange={handleStatusChange}
                    selectedApplicationId={selectedApplicationId}
                  />
                ) : (
                  <p className={styles.emptyResults}>
                    Nessuna candidatura corrisponde alla ricerca.
                  </p>
                )}
              </section>
            ) : (
              <ApplicationBoard
                applications={pipelineApplications}
                onSelect={setSelectedApplicationId}
                onStatusChange={handleStatusChange}
                selectedApplicationId={selectedApplicationId}
                selectedStatus={selectedApplication?.status ?? null}
              />
            )}
          </div>

          {selectedApplication && (
            <ApplicationInspector
              application={selectedApplication}
              onClose={handleCloseInspector}
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
