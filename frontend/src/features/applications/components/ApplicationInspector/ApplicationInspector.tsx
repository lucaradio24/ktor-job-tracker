"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  Pencil,
  RotateCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type {
  ApplicationStatus,
  JobApplication,
  StatusTransition,
} from "../../model/jobApplication";
import styles from "./ApplicationInspector.module.css";

interface ApplicationInspectorProps {
  application: JobApplication;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Candidature",
  INTERVIEW: "Colloqui",
  OFFER: "Offerte",
  REJECTED: "Non selezionate",
  WITHDRAWN: "Ritirate",
};

const nextStage: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  APPLIED: "INTERVIEW",
  INTERVIEW: "OFFER",
};

function parseDate(value: string) {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string, includeTime = false) {
  const date = parseDate(value);
  if (!date) return "Data non disponibile";

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function daysSince(value: string) {
  const date = parseDate(value);
  if (!date) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
}

function formatDays(days: number | null) {
  if (days === null) return "Data non disponibile";
  if (days === 0) return "Oggi";
  return `${days} ${days === 1 ? "giorno" : "giorni"}`;
}

function getApplicationLink(link: string) {
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

function transitionLabel(transition: StatusTransition, index: number) {
  return index === 0
    ? `Registrata in ${statusLabels[transition.status]}`
    : `Spostata in ${statusLabels[transition.status]}`;
}

export default function ApplicationInspector({
  application,
  onClose,
  onStatusChange,
}: ApplicationInspectorProps) {
  const inspectorRef = useRef<HTMLElement>(null);
  const history = [...application.statusHistory].sort((a, b) =>
    a.changedAt.localeCompare(b.changedAt),
  );
  const currentTransition = [...history]
    .reverse()
    .find((transition) => transition.status === application.status);
  const advanceTo = nextStage[application.status];

  useEffect(() => {
    if (window.matchMedia("(max-width: 47.999rem)").matches) {
      window.scrollTo({ top: 0 });
    }
    inspectorRef.current?.focus({ preventScroll: true });
  }, [application.id]);

  return (
    <aside
      ref={inspectorRef}
      className={styles.inspector}
      aria-label={`Dettaglio candidatura ${application.company}`}
      tabIndex={-1}
    >
      <header className={styles.header}>
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="Chiudi dettaglio candidatura"
        >
          <ArrowLeft className={styles.backIcon} aria-hidden="true" size={19} />
          <X className={styles.closeIcon} aria-hidden="true" size={19} />
          <span className={styles.closeLabel}>Indietro</span>
        </button>

        <div className={styles.identity}>
          <span className={styles.status} data-status={application.status.toLowerCase()}>
            {statusLabels[application.status]}
          </span>
          <h2>{application.company}</h2>
          <p>{application.title}</p>
          {application.city && <span>{application.city}</span>}
        </div>

        {application.link && (
          <a
            className={styles.iconLink}
            href={getApplicationLink(application.link)}
            target="_blank"
            rel="noreferrer"
            aria-label="Apri l'annuncio"
          >
            <ExternalLink aria-hidden="true" size={18} />
          </a>
        )}
      </header>

      <section className={styles.metrics} aria-label="Tempi candidatura">
        <div>
          <CalendarDays aria-hidden="true" size={18} />
          <span>Da candidatura</span>
          <strong>{formatDays(daysSince(application.appliedAt))}</strong>
        </div>
        <div>
          <Clock3 aria-hidden="true" size={18} />
          <span>Tempo nello stato</span>
          <strong>
            {formatDays(
              currentTransition ? daysSince(currentTransition.changedAt) : null,
            )}
          </strong>
        </div>
      </section>

      <section className={styles.journey} aria-labelledby="journey-title">
        <h3 id="journey-title">Percorso</h3>
        <ol>
          <li>
            <span className={styles.journeyMarker} />
            <div>
              <strong>Candidatura inviata</strong>
              <time dateTime={application.appliedAt}>
                {formatDate(application.appliedAt)}
              </time>
            </div>
          </li>
          {history.map((transition, index) => (
            <li key={`${transition.changedAt}-${transition.status}`}>
              <span className={styles.journeyMarker} data-status={transition.status.toLowerCase()} />
              <div>
                <strong>{transitionLabel(transition, index)}</strong>
                <time dateTime={transition.changedAt}>
                  {formatDate(transition.changedAt, true)}
                </time>
              </div>
            </li>
          ))}
          {history.length === 0 && (
            <li>
              <span className={styles.journeyMarker} />
              <div>
                <strong>Stato attuale: {statusLabels[application.status]}</strong>
                <span>Data non disponibile</span>
              </div>
            </li>
          )}
        </ol>
      </section>

      <section className={styles.actions} aria-labelledby="actions-title">
        <h3 id="actions-title">Azioni</h3>
        {advanceTo && (
          <button
            className={styles.primaryAction}
            type="button"
            onClick={() => onStatusChange(application.id, advanceTo)}
          >
            Sposta in {statusLabels[advanceTo]}
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        )}
        {(application.status === "REJECTED" ||
          application.status === "WITHDRAWN") && (
          <button
            className={styles.secondaryAction}
            type="button"
            onClick={() => onStatusChange(application.id, "APPLIED")}
          >
            <RotateCcw aria-hidden="true" size={18} />
            Ripristina in Candidature
          </button>
        )}
        <Link
          className={styles.secondaryAction}
          href={`/applications/${application.id}`}
        >
          <Pencil aria-hidden="true" size={18} />
          Modifica dettagli
        </Link>
      </section>

      {!(["REJECTED", "WITHDRAWN"] as ApplicationStatus[]).includes(
        application.status,
      ) && (
        <section className={styles.otherActions} aria-labelledby="other-actions-title">
          <h3 id="other-actions-title">Altre azioni</h3>
          <button
            type="button"
            onClick={() => onStatusChange(application.id, "REJECTED")}
          >
            Segna come non selezionata
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(application.id, "WITHDRAWN")}
          >
            Ritira candidatura
          </button>
        </section>
      )}
    </aside>
  );
}
