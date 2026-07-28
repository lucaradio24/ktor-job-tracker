import ApplicationCard from "@/components/ApplicationCard";
import type { JobApplication } from "@/types/JobApplication";

type ColumnTone = "lavender" | "blue" | "green" | "coral";

interface ApplicationColumnProps {
  id: string;
  title: string;
  applications: JobApplication[];
  tone: ColumnTone;
  emptySymbol: string;
  emptyMessage: string;
}

export default function ApplicationColumn({
  id,
  title,
  applications,
  tone,
  emptySymbol,
  emptyMessage,
}: ApplicationColumnProps) {
  return (
    <section className={`application-column column-${tone}`} id={id}>
      <header className="column-header">
        <div>
          <span className={`column-dot column-dot-${tone}`} aria-hidden="true" />
          <h2>{title}</h2>
          <span className="column-count">{applications.length}</span>
        </div>
        <button
          className="column-menu"
          type="button"
          aria-label={`Altre opzioni per ${title}`}
        >
          ⋮
        </button>
      </header>

      <div className="column-content">
        {applications.map((application) => (
          <ApplicationCard application={application} key={application.id} />
        ))}

        {applications.length === 0 && (
          <div className="column-empty">
            <span aria-hidden="true">{emptySymbol}</span>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
