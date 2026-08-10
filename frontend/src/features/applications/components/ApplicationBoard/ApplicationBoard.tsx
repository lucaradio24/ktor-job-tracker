import { BadgeCheck, BriefcaseBusiness, CalendarClock, type LucideIcon } from "lucide-react";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { useState } from "react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationColumn, {
  type ColumnTone,
} from "../ApplicationColumn/ApplicationColumn";
import ApplicationsList from "../ApplicationsList/ApplicationsList";
import styles from "./ApplicationBoard.module.css";

interface ApplicationBoardProps {
  applications: JobApplication[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  selectedApplicationId: string | null;
  selectedStatus: ApplicationStatus | null;
}

interface BoardColumn {
  id: string;
  title: string;
  status: ApplicationStatus;
  tone: ColumnTone;
  emptyIcon: LucideIcon;
  emptyMessage: string;
}

const columns: BoardColumn[] = [
  {
    id: "applications",
    title: "Candidature",
    status: "APPLIED",
    tone: "amber",
    emptyIcon: BriefcaseBusiness,
    emptyMessage: "Le nuove candidature compariranno qui.",
  },
  {
    id: "interviews",
    title: "Colloqui",
    status: "INTERVIEW",
    tone: "violet",
    emptyIcon: CalendarClock,
    emptyMessage: "I prossimi colloqui compariranno qui.",
  },
  {
    id: "offers",
    title: "Offerte",
    status: "OFFER",
    tone: "green",
    emptyIcon: BadgeCheck,
    emptyMessage: "Le offerte ricevute compariranno qui.",
  },
];

export default function ApplicationBoard({
  applications,
  onSelect,
  onStatusChange,
  selectedApplicationId,
  selectedStatus,
}: ApplicationBoardProps) {
  const [mobileStatus, setMobileStatus] =
    useState<ApplicationStatus>("APPLIED");
  const mobileColumn = columns.find(
    (column) => column.status === mobileStatus,
  )!;
  const mobileApplications = applications.filter(
    (application) => application.status === mobileStatus,
  );
  const MobileEmptyIcon = mobileColumn.emptyIcon;
  const selectedStage = columns.some(
    (column) => column.status === selectedStatus,
  )
    ? selectedStatus?.toLowerCase()
    : undefined;

  return (
    <>
      <div className={styles.desktopView}>
        <div className={styles.route} data-selected-stage={selectedStage}>
          {columns.map((column) => {
            const count = applications.filter(
              (application) => application.status === column.status,
            ).length;

            return (
              <div
                className={styles.stage}
                data-active={selectedStatus === column.status ? "true" : undefined}
                data-tone={column.tone}
                key={column.status}
              >
                <div className={styles.stageInner}>
                  <span className={styles.marker} aria-hidden="true" />
                  <h2 id={`${column.id}-title`}>{column.title}</h2>
                  <span className={styles.count} aria-label={`${count} candidature`}>
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <DragDropProvider
          sensors={(defaults) => [
            ...defaults.filter((sensor) => sensor !== PointerSensor),
            PointerSensor.configure({
              preventActivation: (event) => {
                const target = event.target as Element;
                return Boolean(
                  target.closest(
                    'a, button, input, select, textarea, summary, [contenteditable="true"]',
                  ),
                );
              },
            }),
          ]}
          onDragEnd={({ canceled, operation }) => {
            if (canceled || !operation.target) return;

            const id = String(operation.source?.id);
            const status = operation.target.id as ApplicationStatus;
            const application = applications.find(
              (candidate) => candidate.id === id,
            );

            if (!application || application.status === status) return;
            onStatusChange(id, status);
          }}
        >
          <div className={styles.board} id="application-board">
            {columns.map((column) => (
              <ApplicationColumn
                applications={applications.filter(
                  (application) => application.status === column.status,
                )}
                emptyIcon={column.emptyIcon}
                emptyMessage={column.emptyMessage}
                id={column.id}
                key={column.status}
                labelledBy={`${column.id}-title`}
                onSelect={onSelect}
                onStatusChange={onStatusChange}
                selectedApplicationId={selectedApplicationId}
                status={column.status}
                tone={column.tone}
              />
            ))}
          </div>
        </DragDropProvider>
      </div>

      <section className={styles.mobileView} aria-label="Candidature per stato">
        <div className={styles.statusFilters} role="group" aria-label="Filtra per stato">
          {columns.map((column) => {
            const count = applications.filter(
              (application) => application.status === column.status,
            ).length;

            return (
              <button
                type="button"
                className={styles.statusFilter}
                data-tone={column.tone}
                aria-pressed={mobileStatus === column.status}
                aria-controls="mobile-application-list"
                key={column.status}
                onClick={() => setMobileStatus(column.status)}
              >
                <span>{column.title}</span>
                <span className={styles.filterCount} aria-hidden="true">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.mobileListHeader} data-tone={mobileColumn.tone}>
          <h2>{mobileColumn.title}</h2>
          <span aria-label={`${mobileApplications.length} candidature`}>
            {mobileApplications.length}
          </span>
        </div>

        <div
          id="mobile-application-list"
          className={styles.mobileList}
          key={mobileStatus}
        >
          {mobileApplications.length > 0 ? (
            <ApplicationsList
              applications={mobileApplications}
              onSelect={onSelect}
              onStatusChange={onStatusChange}
              selectedApplicationId={selectedApplicationId}
            />
          ) : (
            <div className={styles.mobileEmpty} data-tone={mobileColumn.tone}>
              <MobileEmptyIcon aria-hidden="true" size={22} strokeWidth={1.7} />
              <p>{mobileColumn.emptyMessage}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
