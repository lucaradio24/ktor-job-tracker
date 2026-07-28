import type { LucideIcon } from "lucide-react";
import type { JobApplication } from "../../model/jobApplication";
import ApplicationCard from "../ApplicationCard/ApplicationCard";
import styles from "./ApplicationColumn.module.css";

export type ColumnTone = "amber" | "violet" | "green" | "rose";

interface ApplicationColumnProps {
  id: string;
  title: string;
  applications: JobApplication[];
  tone: ColumnTone;
  emptyIcon: LucideIcon;
  emptyMessage: string;
}

const toneClasses: Record<ColumnTone, string> = {
  amber: styles.amber,
  violet: styles.violet,
  green: styles.green,
  rose: styles.rose,
};

export default function ApplicationColumn({
  id,
  title,
  applications,
  tone,
  emptyIcon: EmptyIcon,
  emptyMessage,
}: ApplicationColumnProps) {
  return (
    <section className={`${styles.column} ${toneClasses[tone]}`} id={id}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.dot} aria-hidden="true" />
          <h2>{title}</h2>
          <span className={styles.count} aria-label={`${applications.length}`}>
            {applications.length}
          </span>
        </div>
      </header>

      <div className={styles.content}>
        {applications.map((application) => (
          <ApplicationCard application={application} key={application.id} />
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
