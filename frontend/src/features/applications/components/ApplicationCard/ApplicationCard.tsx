import {
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Circle,
  CircleCheck,
  CircleMinus,
  CircleX,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import Link from "next/link";
import styles from "./ApplicationCard.module.css";

interface ApplicationCardProps {
  application: JobApplication;
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

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const { icon: StatusIcon, label, className } = statuses[application.status];
  const city = application.city || "Da definire";
  const chevron = (
    <ChevronRight aria-hidden="true" size={18} strokeWidth={1.9} />
  );
  const linkIcon = (
    <ExternalLink aria-hidden="true" size={18} strokeWidth={1.9} />
  );

  return (
    <article className={styles.card}>
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
      </footer>
    </article>
  );
}
