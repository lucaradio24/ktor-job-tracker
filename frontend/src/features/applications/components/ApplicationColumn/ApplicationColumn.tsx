import type { LucideIcon } from "lucide-react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationCard from "../ApplicationCard/ApplicationCard";
import styles from "./ApplicationColumn.module.css";
import { useDroppable } from "@dnd-kit/react";

export type ColumnTone = "amber" | "violet" | "green" | "rose";

interface ApplicationColumnProps {
  id: string;
  labelledBy: string;
  applications: JobApplication[];
  tone: ColumnTone;
  emptyIcon: LucideIcon;
  emptyMessage: string;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onSelect: (id: string) => void;
  selectedApplicationId: string | null;
  status: ApplicationStatus;
}

const toneClasses: Record<ColumnTone, string> = {
  amber: styles.amber,
  violet: styles.violet,
  green: styles.green,
  rose: styles.rose,
};

export default function ApplicationColumn({
  id,
  labelledBy,
  applications,
  tone,
  emptyIcon: EmptyIcon,
  emptyMessage,
  onStatusChange,
  onSelect,
  selectedApplicationId,
  status,
}: ApplicationColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id: status });

  function sortApplicationsFromTheMostRecentToTheOldest(
    a: JobApplication,
    b: JobApplication,
  ) {
    return b.appliedAt.localeCompare(a.appliedAt);
  }

  applications.sort(sortApplicationsFromTheMostRecentToTheOldest);

  return (
    <section
      ref={ref}
      className={`${styles.column} ${toneClasses[tone]} ${isDropTarget ? styles.dropTarget : ""}`}
      id={id}
      aria-labelledby={labelledBy}
    >
      <div className={styles.content} role="list">
        {applications.map((application) => (
          <ApplicationCard
            onStatusChange={onStatusChange}
            onSelect={onSelect}
            application={application}
            key={application.id}
            selected={application.id === selectedApplicationId}
          />
        ))}

        {applications.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <EmptyIcon size={22} strokeWidth={1.7} />
            </span>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
