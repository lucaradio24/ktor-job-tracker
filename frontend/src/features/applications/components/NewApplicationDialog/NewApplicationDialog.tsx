"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./NewApplicationDialog.module.css";

interface NewApplicationDialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function NewApplicationDialog({
  open,
  onClose,
  children,
}: NewApplicationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="new-application-title"
      aria-describedby="new-application-description"
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <header className={styles.header}>
        <div className={styles.copy}>
          <h2 id="new-application-title">Nuova candidatura</h2>
          <p id="new-application-description">
            Inserisci i dati essenziali. Potrai aggiornarli in qualsiasi momento.
          </p>
        </div>

        <button
          className={styles.closeButton}
          type="button"
          aria-label="Chiudi la finestra"
          onClick={onClose}
        >
          <X aria-hidden="true" size={20} strokeWidth={2} />
        </button>
      </header>

      <div className={styles.body}>{children}</div>
    </dialog>
  );
}
