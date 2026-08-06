import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  CircleX,
  type LucideIcon,
} from "lucide-react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationColumn, {
  type ColumnTone,
} from "../ApplicationColumn/ApplicationColumn";
import styles from "./ApplicationBoard.module.css";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { useState } from "react";
import ApplicationsList from "../ApplicationsList/ApplicationsList";

interface ApplicationBoardProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
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
  {
    id: "rejected",
    title: "Rifiutate",
    status: "REJECTED",
    tone: "rose",
    emptyIcon: CircleX,
    emptyMessage: "Le candidature non selezionate compariranno qui.",
  },
];

export default function ApplicationBoard({
  applications,
  onStatusChange,
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

  return (
    <>
      <div className={styles.desktopView}>
        <DragDropProvider
      sensors={(defaults) => [
        ...defaults.filter((sensor) => sensor !== PointerSensor),
        PointerSensor.configure({
          preventActivation: (event) => {
            const target = event.target as Element;

            const blocked = Boolean(
              target.closest(
                'a, button, input, select, textarea, summary, [contenteditable="true"]',
              ),
            );

            return blocked;
          },
        }),
      ]}
      onDragEnd={({ canceled, operation }) => {
        if (canceled || !operation.target) return;

        const id = String(operation.source?.id);
        const status = operation.target.id as ApplicationStatus;
        const application = applications.find(
          (application) => application.id === id,
        );

        if (!application || application.status === status) return;

        onStatusChange(id, status);
      }}
        >
          <div className={styles.board} id="application-board">
        {columns.map((column) => (
          <ApplicationColumn
            onStatusChange={onStatusChange}
            applications={applications.filter(
              (application) => application.status === column.status,
            )}
            emptyIcon={column.emptyIcon}
            emptyMessage={column.emptyMessage}
            id={column.id}
            key={column.status}
            title={column.title}
            tone={column.tone}
            status={column.status}
          />
        ))}
          </div>
        </DragDropProvider>
      </div>

      <section className={styles.mobileView} aria-label="Candidature per stato">
        <div
          className={styles.statusFilters}
          role="group"
          aria-label="Filtra le candidature per stato"
        >
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

        <div id="mobile-application-list" className={styles.mobileList}>
          {mobileApplications.length > 0 ? (
            <ApplicationsList
              applications={mobileApplications}
              onStatusChange={onStatusChange}
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
