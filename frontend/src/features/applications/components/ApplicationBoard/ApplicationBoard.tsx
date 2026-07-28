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

interface ApplicationBoardProps {
  applications: JobApplication[];
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
}: ApplicationBoardProps) {
  return (
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
          title={column.title}
          tone={column.tone}
        />
      ))}
    </div>
  );
}
