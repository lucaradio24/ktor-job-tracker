"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./error.module.css";

type WorkspaceErrorProps = {
  error: Error & {
    digest?: string;
  };
  unstable_retry: () => void;
};

export default function WorkspaceError({
  error,
  unstable_retry,
}: WorkspaceErrorProps) {
  useEffect(() => {
    console.error("Errore nel workspace:", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <section className={styles.errorState} aria-labelledby="workspace-error">
      <div className={styles.content}>
        <div className={styles.mascotFrame}>
          <Image
            className={styles.mascot}
            src="/robot-error.png"
            alt=""
            width={260}
            height={260}
          />
        </div>

        <p className={styles.eyebrow}>Errore temporaneo</p>
        <h1 id="workspace-error">Il robottino ha perso il segnale.</h1>
        <p className={styles.description}>
          Non riesco a caricare le candidature. Controlla che il server sia
          raggiungibile e riprova.
        </p>

        <button
          className={styles.retryButton}
          type="button"
          onClick={unstable_retry}
        >
          Riprova
        </button>
      </div>
    </section>
  );
}
