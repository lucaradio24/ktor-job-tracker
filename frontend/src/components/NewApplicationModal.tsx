"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface NewApplicationModalProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function NewApplicationModal({
  open,
  onClose,
  children,
}: NewApplicationModalProps) {
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
      className="application-modal"
      aria-labelledby="new-application-title"
      aria-describedby="new-application-description"
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="application-modal-header">
        <div className="application-modal-art" aria-hidden="true" />

        <div className="application-modal-copy">
          <h2 id="new-application-title">Nuova candidatura</h2>
          <p id="new-application-description">
            Un altro passo verso il lavoro giusto.
          </p>
        </div>

        <button
          className="modal-close-button"
          type="button"
          aria-label="Chiudi modal"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <main className="application-modal-body">{children}</main>
    </dialog>
  );
}
