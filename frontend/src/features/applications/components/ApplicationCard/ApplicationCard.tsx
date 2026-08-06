import {
  CalendarDays,
  ExternalLink,
  Circle,
  CircleCheck,
  CircleMinus,
  CircleX,
  MessageSquare,
  type LucideIcon,
  EllipsisVertical,
} from "lucide-react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import Link from "next/link";
import styles from "./ApplicationCard.module.css";
import { useDraggable } from "@dnd-kit/react";

interface ApplicationCardProps {
  application: JobApplication;
  draggable?: boolean;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDeleteRequest?: (application: JobApplication) => void;
}

interface StatusDetails {
  icon: LucideIcon;
  label: string;
  className: string;
}

const statuses: Record<ApplicationStatus, StatusDetails> = {
  APPLIED: { icon: Circle, label: "Inviata", className: styles.amber },
  INTERVIEW: {
    icon: MessageSquare,
    label: "Colloquio",
    className: styles.violet,
  },
  OFFER: {
    icon: CircleCheck,
    label: "Offerta ricevuta",
    className: styles.green,
  },
  REJECTED: { icon: CircleX, label: "Rifiutata", className: styles.rose },
  WITHDRAWN: { icon: CircleMinus, label: "Ritirata", className: styles.rose },
};

const statusActions: Array<{
  status: ApplicationStatus;
  label: string;
}> = [
  { status: "WITHDRAWN", label: "Archivia come Ritirata" },
  { status: "REJECTED", label: "Segna come Rifiutata" },
  { status: "OFFER", label: "Sposta in Offerte" },
  { status: "INTERVIEW", label: "Sposta in Colloqui" },
  { status: "APPLIED", label: "Sposta in Candidature" },
];

function formatApplicationDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
  }).format(parsedDate);
}

function getApplicationLink(link: string) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

export default function ApplicationCard({
  application,
  draggable = true,
  onStatusChange,
  onDeleteRequest,
}: ApplicationCardProps) {
  const { icon: StatusIcon, label, className } = statuses[application.status];
  const city = application.city || "Da definire";
  const { ref, isDragging } = useDraggable({
    id: application.id,
    disabled: !draggable,
  });
  const linkIcon = (
    <ExternalLink aria-hidden="true" size={18} strokeWidth={1.9} />
  );

  const availableActions = statusActions.filter(
    (action) => action.status !== application.status,
  );

  return (
    <article
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
      ref={ref}
    >
      <h3 title={application.company}>
        <Link href={`/applications/${application.id}`}>
          {application.company}
        </Link>
      </h3>
      <p className={styles.role} title={application.title}>
        {application.title}
      </p>

      <div className={styles.meta}>
        <span className={styles.date}>
          <CalendarDays aria-hidden="true" size={14} strokeWidth={1.8} />
          <time dateTime={application.appliedAt}>
            {formatApplicationDate(application.appliedAt)}
          </time>
        </span>
        <span className={styles.separator} aria-hidden="true">
          •
        </span>
        <span className={styles.city} title={city}>
          {city}
        </span>
      </div>

      <footer className={styles.footer}>
        <span className={`${styles.status} ${className}`}>
          <StatusIcon aria-hidden="true" size={16} strokeWidth={1.9} />
          {label}
        </span>

        <div className={styles.cardActions}>
          {application.link && (
            <a
              className={styles.linkIcon}
              href={getApplicationLink(application.link)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Apri l'annuncio per ${application.title}`}
            >
              {linkIcon}
            </a>
          )}

          <details
            className={styles.statusMenu}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.removeAttribute("open");
              }
            }}
            onToggle={(e) => {
              const details = e.currentTarget;

              details.classList.remove(styles.openUpwards, styles.positioned);

              if (!details.open) return;
              const menu = details.querySelector<HTMLElement>(
                `.${styles.statusOptions}`,
              );
              if (!menu) return;
              details.classList.toggle(
                styles.openUpwards,
                menu.getBoundingClientRect().bottom > window.innerHeight - 16,
              );

              details.classList.add(styles.positioned);
            }}
            // per il focus da tastiera
            onBlur={(event) => {
              const nextTarget = event.relatedTarget as Node | null;

              if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                event.currentTarget.removeAttribute("open");
              }
            }}
          >
            <summary aria-label={`Cambia stato di ${application.company}`}>
              <EllipsisVertical aria-hidden="true" size={20} />
            </summary>

            <div className={styles.statusOptions}>
              {availableActions.map((action) => (
                <button
                  type="button"
                  key={action.status}
                  className={
                    action.status === "WITHDRAWN"
                      ? styles.withdrawAction
                      : undefined
                  }
                  onClick={(e) => {
                    onStatusChange(application.id, action.status);
                    e?.currentTarget
                      .closest("details")
                      ?.removeAttribute("open");
                  }}
                >
                  {application.status === "WITHDRAWN" &&
                  action.status === "APPLIED"
                    ? "Ripristina in Candidature"
                    : action.label}
                </button>
              ))}

              {application.status === "WITHDRAWN" && onDeleteRequest && (
                <button
                  type="button"
                  className={styles.deleteAction}
                  onClick={(e) => {
                    e.currentTarget.closest("details")?.removeAttribute("open");
                    onDeleteRequest(application);
                  }}
                >
                  Elimina definitivamente
                </button>
              )}
            </div>
          </details>
        </div>
      </footer>
    </article>
  );
}
