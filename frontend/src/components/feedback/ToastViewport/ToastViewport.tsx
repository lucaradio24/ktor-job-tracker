"use client";

import { Undo2, X } from "lucide-react";
import type { CSSProperties } from "react";
import styles from "./ToastViewport.module.css";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  durationMs: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type ToastViewportProps = {
  toast: ToastMessage | null;
  onClose: () => void;
};

export default function ToastViewport({ toast, onClose }: ToastViewportProps) {
  if (!toast) return null;

  function handleAction() {
    toast?.action?.onClick();
    onClose();
  }

  return (
    <section className={styles.viewport} aria-label="Notifiche">
      <article
        className={styles.toast}
        style={
          {
            "--toast-duration": `${toast.durationMs}ms`,
          } as CSSProperties
        }
      >
        <div className={styles.copy} role="status" aria-atomic="true">
          <strong>{toast.title}</strong>
          {toast.description && <span>{toast.description}</span>}
        </div>

        <div className={styles.actions}>
          {toast.action && (
            <button
              className={styles.actionButton}
              type="button"
              onClick={handleAction}
            >
              <Undo2 aria-hidden="true" size={16} />
              {toast.action.label}
            </button>
          )}
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Chiudi notifica"
          >
            <X aria-hidden="true" size={14} />
          </button>
        </div>

        <span
          key={toast.id}
          className={styles.progress}
          aria-hidden="true"
          onAnimationEnd={onClose}
        />
      </article>
    </section>
  );
}
