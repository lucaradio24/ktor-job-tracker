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
import { useEffect, useRef, useState, type FocusEvent } from "react";
import styles from "./ApplicationCard.module.css";
import { useDraggable } from "@dnd-kit/react";
import StatusActions, { statusActions } from "./StatusActions";
import StatusBottomSheet from "./StatusBottomSheet";

interface ApplicationCardProps {
  application: JobApplication;
  draggable?: boolean;
  selected?: boolean;
  onSelect: (id: string) => void;
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
  REJECTED: {
    icon: CircleX,
    label: "Non selezionata",
    className: styles.rose,
  },
  WITHDRAWN: { icon: CircleMinus, label: "Ritirata", className: styles.slate },
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
  selected = false,
  onSelect,
  onStatusChange,
  onDeleteRequest,
}: ApplicationCardProps) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const statusTriggerRef = useRef<HTMLButtonElement | null>(null);
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

  useEffect(() => {
    if (!isStatusMenuOpen) return;

    const menu = statusMenuRef.current?.querySelector<HTMLElement>(
      `.${styles.statusOptions}`,
    );
    if (!menu) return;

    setOpenUpwards(menu.getBoundingClientRect().bottom > window.innerHeight - 16);
  }, [isStatusMenuOpen]);

  const closeStatusMenu = () => {
    setIsStatusMenuOpen(false);
    setOpenUpwards(false);
  };
  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    Boolean(target.closest("a, button, input, select, textarea"));

  const handleStatusMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    const focusIsMovingToBottomSheet =
      nextTarget instanceof Element &&
      nextTarget.closest("[data-status-bottom-sheet]");

    if (
      !nextTarget ||
      (!event.currentTarget.contains(nextTarget) && !focusIsMovingToBottomSheet)
    ) {
      closeStatusMenu();
    }
  };

  return (
    <>
      <article
        id={`application-card-${application.id}`}
        className={`${styles.card} ${selected ? styles.selected : ""} ${isDragging ? styles.dragging : ""}`}
        ref={ref}
        role="listitem"
        tabIndex={0}
        aria-current={selected ? "true" : undefined}
        onClick={(event) => {
          if (!isInteractiveTarget(event.target)) onSelect(application.id);
        }}
        onKeyDown={(event) => {
          if (
            !isInteractiveTarget(event.target) &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            onSelect(application.id);
          }
        }}
      >
        <h3 title={application.company}>{application.company}</h3>
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

            <div
              ref={statusMenuRef}
              className={`${styles.statusMenu} ${isStatusMenuOpen ? styles.statusMenuOpen : ""} ${openUpwards ? styles.openUpwards : ""}`}
              data-open={isStatusMenuOpen ? "true" : undefined}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeStatusMenu();
              }}
              onBlur={handleStatusMenuBlur}
            >
              <button
                ref={statusTriggerRef}
                type="button"
                className={styles.statusMenuTrigger}
                aria-label={`Cambia stato di ${application.company}`}
                aria-expanded={isStatusMenuOpen}
                onClick={() => {
                  if (isStatusMenuOpen) {
                    closeStatusMenu();
                  } else {
                    setOpenUpwards(false);
                    setIsStatusMenuOpen(true);
                  }
                }}
              >
                <EllipsisVertical aria-hidden="true" size={20} />
              </button>

              {isStatusMenuOpen && (
                <StatusActions
                  application={application}
                  availableActions={availableActions}
                  className={styles.desktopStatusOptions}
                  onClose={closeStatusMenu}
                  onDeleteRequest={onDeleteRequest}
                  onStatusChange={onStatusChange}
                />
              )}
            </div>
          </div>
        </footer>
      </article>

      {isStatusMenuOpen && (
        <StatusBottomSheet
          application={application}
          availableActions={availableActions}
          onClose={closeStatusMenu}
          onDeleteRequest={onDeleteRequest}
          onStatusChange={onStatusChange}
          triggerRef={statusTriggerRef}
        />
      )}
    </>
  );
}
