"use client";

import { Undo2 } from "lucide-react";
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
    <section
      className={styles.viewport}
      aria-label="Notifiche"
      aria-live="polite"
    >
      <article
        className={styles.toast}
        role="status"
        style={
          {
            "--toast-duration": `${toast.durationMs}ms`,
          } as CSSProperties
        }
      >
        <div className={styles.copy}>
          <strong>{toast.title}</strong>
          {toast.description && <span>{toast.description}</span>}
        </div>
        {toast.action && (
          <button type="button" onClick={handleAction}>
            <Undo2 aria-hidden="true" size={17} />
            {toast.action.label}
          </button>
        )}
        <span
          key={toast.id}
          className={styles.progress}
          aria-hidden="true"
          onAnimationEnd={onClose}
        />{" "}
      </article>
    </section>
  );
}
