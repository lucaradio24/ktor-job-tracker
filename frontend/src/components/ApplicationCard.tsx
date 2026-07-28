import type { JobApplication } from "@/types/JobApplication";

interface ApplicationCardProps {
  application: JobApplication;
}

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

function getCompanyTone(company: string) {
  const code = company.charCodeAt(0) || 0;
  return code % 4;
}

function getApplicationLink(link: string) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

export default function ApplicationCard({
  application,
}: ApplicationCardProps) {
  const initial = application.company.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="application-card">
      <span
        className={`company-avatar company-avatar-${getCompanyTone(
          application.company,
        )}`}
        aria-hidden="true"
      >
        {initial}
      </span>

      <div className="application-card-copy">
        <div className="application-card-heading">
          <h3>{application.company}</h3>
          <time dateTime={application.appliedAt}>
            {formatApplicationDate(application.appliedAt)}
          </time>
        </div>

        <p>{application.title}</p>

        <div className="application-card-meta">
          <span>
            <span aria-hidden="true">⌖</span>
            {application.city || "Località da definire"}
          </span>

          {application.link && (
            <a
              href={getApplicationLink(application.link)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Apri l'annuncio per ${application.title}`}
            >
              Annuncio ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
