"use client";

import { Trash2, X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Elimina definitivamente",
  isPending = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

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
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={isPending}
      onCancel={(event) => {
        event.preventDefault();

        if (!isPending) {
          onCancel();
        }
      }}
    >
      <button
        className={styles.closeButton}
        type="button"
        onClick={onCancel}
        disabled={isPending}
        aria-label="Chiudi la finestra di conferma"
      >
        <X aria-hidden="true" size={20} />
      </button>

      <div className={styles.content}>
        <span className={styles.icon}>
          <Trash2 aria-hidden="true" size={26} strokeWidth={1.8} />
        </span>

        <div className={styles.copy}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>

          <span id={descriptionId} className={styles.description}>
            {description}
          </span>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onCancel}
              disabled={isPending}
              autoFocus
            >
              Annulla
            </button>

            <button
              className={styles.confirmButton}
              type="button"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? "Eliminazione…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
