"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import NewApplicationDialog from "../Dialogs/NewApplicationDialog/NewApplicationDialog";
import NewApplicationForm from "../Forms/NewApplicationForm/NewApplicationForm";
import styles from "./DashboardHeader.module.css";
import { JobApplication } from "../../model/jobApplication";

export default function DashboardHeader({
  onCreateApplication,
}: {
  onCreateApplication: (application: JobApplication) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Candidature</p>
        <h1>Le tue opportunità, in ordine.</h1>
        <p className={styles.description}>
          Tieni sotto controllo ogni fase della tua ricerca.
        </p>
      </div>

      <button
        className={styles.primaryAction}
        type="button"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus aria-hidden="true" size={19} strokeWidth={2.2} />
        Nuova candidatura
      </button>

      {isDialogOpen && (
        <NewApplicationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        >
          <NewApplicationForm
            onCreated={onCreateApplication}
            onCancel={() => setIsDialogOpen(false)}
          />
        </NewApplicationDialog>
      )}
    </header>
  );
}
