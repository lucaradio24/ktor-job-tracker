import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import styles from "./ApplicationCard.module.css";

export interface StatusAction {
  status: ApplicationStatus;
  label: string;
}

export const statusActions: StatusAction[] = [
  { status: "WITHDRAWN", label: "Archivia come Ritirata" },
  { status: "REJECTED", label: "Segna come Rifiutata" },
  { status: "OFFER", label: "Sposta in Offerte" },
  { status: "INTERVIEW", label: "Sposta in Colloqui" },
  { status: "APPLIED", label: "Sposta in Candidature" },
];

interface StatusActionsProps {
  application: JobApplication;
  availableActions: StatusAction[];
  className?: string;
  onClose: () => void;
  onDeleteRequest?: (application: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export default function StatusActions({
  application,
  availableActions,
  className,
  onClose,
  onDeleteRequest,
  onStatusChange,
}: StatusActionsProps) {
  return (
    <div className={`${styles.statusOptions} ${className ?? ""}`}>
      {availableActions.map((action) => (
        <button
          type="button"
          key={action.status}
          className={
            action.status === "WITHDRAWN"
              ? styles.withdrawAction
              : undefined
          }
          onClick={() => {
            onStatusChange(application.id, action.status);
            onClose();
          }}
        >
          {application.status === "WITHDRAWN" && action.status === "APPLIED"
            ? "Ripristina in Candidature"
            : action.label}
        </button>
      ))}

      {application.status === "WITHDRAWN" && onDeleteRequest && (
        <button
          type="button"
          className={styles.deleteAction}
          onClick={() => {
            onClose();
            onDeleteRequest(application);
          }}
        >
          Elimina definitivamente
        </button>
      )}
    </div>
  );
}
