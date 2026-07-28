import ApplicationColumn from "@/components/ApplicationColumn";
import type {
  ApplicationStatus,
  JobApplication,
} from "@/types/JobApplication";

interface ApplicationBoardProps {
  applications: JobApplication[];
}

interface BoardColumn {
  id: string;
  title: string;
  status: ApplicationStatus;
  tone: "lavender" | "blue" | "green" | "coral";
  emptySymbol: string;
  emptyMessage: string;
}

const columns: BoardColumn[] = [
  {
    id: "applications",
    title: "Candidature",
    status: "APPLIED",
    tone: "lavender",
    emptySymbol: "✦",
    emptyMessage: "Aggiungi la tua prima candidatura.",
  },
  {
    id: "interviews",
    title: "Colloqui",
    status: "INTERVIEW",
    tone: "blue",
    emptySymbol: "◎",
    emptyMessage: "I prossimi colloqui appariranno qui.",
  },
  {
    id: "offers",
    title: "Offerte",
    status: "OFFER",
    tone: "green",
    emptySymbol: "☆",
    emptyMessage: "Ottimo lavoro! Continua così.",
  },
  {
    id: "rejected",
    title: "Rifiutate",
    status: "REJECTED",
    tone: "coral",
    emptySymbol: "✉",
    emptyMessage: "Ogni risposta ti avvicina al sì.",
  },
];

export default function ApplicationBoard({
  applications,
}: ApplicationBoardProps) {
  return (
    <div className="application-board" id="application-board">
      {columns.map((column) => (
        <ApplicationColumn
          applications={applications.filter(
            (application) => application.status === column.status,
          )}
          emptyMessage={column.emptyMessage}
          emptySymbol={column.emptySymbol}
          id={column.id}
          key={column.status}
          title={column.title}
          tone={column.tone}
        />
      ))}
    </div>
  );
}
