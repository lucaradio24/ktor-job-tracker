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
  return (
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
  );
}
