import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import StatusActions, { type StatusAction } from "./StatusActions";
import styles from "./ApplicationCard.module.css";

interface StatusBottomSheetProps {
  application: JobApplication;
  availableActions: StatusAction[];
  onClose: () => void;
  onDeleteRequest?: (application: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function StatusBottomSheet({
  application,
  availableActions,
  onClose,
  onDeleteRequest,
  onStatusChange,
  triggerRef,
}: StatusBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const isMobileViewport =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 47.999rem)").matches;

  useEffect(() => {
    if (!isMobileViewport) return;

    const trigger = triggerRef.current;
    sheetRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    return () => {
      if (trigger?.isConnected) {
        trigger.focus();
      }
    };
  }, [isMobileViewport, triggerRef]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.mobileStatusOverlay}
      data-status-bottom-sheet="true"
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Escape") onClose();
      }}
    >
      <div
        ref={sheetRef}
        className={styles.mobileStatusSheet}
        role="dialog"
        aria-modal="true"
        aria-label={`Cambia stato di ${application.company}`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <StatusActions
          application={application}
          availableActions={availableActions}
          onClose={onClose}
          onDeleteRequest={onDeleteRequest}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>,
    document.body,
  );
}
