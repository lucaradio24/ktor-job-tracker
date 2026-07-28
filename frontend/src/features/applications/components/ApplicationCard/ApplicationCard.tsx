import { ExternalLink, MapPin } from "lucide-react";
import type { JobApplication } from "../../model/jobApplication";
import styles from "./ApplicationCard.module.css";

interface ApplicationCardProps {
  application: JobApplication;
}

type AvatarTone = "violet" | "blue" | "green" | "amber";

const avatarClasses: Record<AvatarTone, string> = {
  violet: styles.avatarViolet,
  blue: styles.avatarBlue,
  green: styles.avatarGreen,
  amber: styles.avatarAmber,
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

function getCompanyTone(company: string): AvatarTone {
  const tones: AvatarTone[] = ["violet", "blue", "green", "amber"];
  const code = company.trim().charCodeAt(0) || 0;
  return tones[code % tones.length];
}

function getApplicationLink(link: string) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

export default function ApplicationCard({
  application,
}: ApplicationCardProps) {
  const initial = application.company.trim().charAt(0).toUpperCase() || "?";
  const avatarTone = getCompanyTone(application.company);

  return (
    <article className={styles.card}>
      <span
        className={`${styles.avatar} ${avatarClasses[avatarTone]}`}
        aria-hidden="true"
      >
        {initial}
      </span>

      <div className={styles.copy}>
        <div className={styles.heading}>
          <h3 title={application.company}>{application.company}</h3>
          <time dateTime={application.appliedAt}>
            {formatApplicationDate(application.appliedAt)}
          </time>
        </div>

        <p className={styles.role} title={application.title}>
          {application.title}
        </p>

        <div className={styles.meta}>
          <span className={styles.location}>
            <MapPin aria-hidden="true" size={15} strokeWidth={1.9} />
            {application.city || "Località da definire"}
          </span>

          {application.link && (
            <a
              className={styles.link}
              href={getApplicationLink(application.link)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Apri l'annuncio per ${application.title}`}
            >
              Annuncio
              <ExternalLink aria-hidden="true" size={14} strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
