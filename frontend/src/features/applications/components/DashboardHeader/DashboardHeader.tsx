"use client";

import { useState } from "react";
import { useToast } from "@/components/feedback/ToastViewport/ToastProvider";
import type { JobApplication } from "../../model/jobApplication";
import ConfirmDialog from "../Dialogs/ConfirmDialog/ConfirmDialog";
import NewApplicationDialog from "../Dialogs/NewApplicationDialog/NewApplicationDialog";
import NewApplicationForm from "../Forms/NewApplicationForm/NewApplicationForm";
import styles from "./DashboardHeader.module.css";

type DashboardHeaderProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  onCreateApplication: (application: JobApplication) => void;
};

export default function DashboardHeader({
  onCreateApplication,
  isDialogOpen,
  setIsDialogOpen,
}: DashboardHeaderProps) {
  const { showToast } = useToast();
  const [isCreateDirty, setIsCreateDirty] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);

  function closeDialog() {
    setIsCreateDirty(false);
    setIsDiscardConfirmOpen(false);
    setIsDialogOpen(false);
  }

  function requestClose() {
    if (isCreateDirty) {
      setIsDiscardConfirmOpen(true);
    } else {
      closeDialog();
    }
  }

  function handleCreated(application: JobApplication) {
    onCreateApplication(application);
    showToast({
      title: "Candidatura aggiunta",
      description: `${application.company} · ${application.title}`,
      durationMs: 3_000,
    });
    closeDialog();
  }

  return (
    <>
      <header className={styles.header}>
        {/* <div className={styles.copy}>
          <h1>Le tue opportunità, in ordine.</h1>
        </div> */}
      </header>

      {isDialogOpen && (
        <NewApplicationDialog open={isDialogOpen} onClose={requestClose}>
          <NewApplicationForm
            onCreated={handleCreated}
            onCancel={requestClose}
            onDirtyChange={setIsCreateDirty}
          />
        </NewApplicationDialog>
      )}

      <ConfirmDialog
        open={isDiscardConfirmOpen}
        title="Scartare le modifiche?"
        description="I dati inseriti nella nuova candidatura andranno persi."
        confirmLabel="Scarta modifiche"
        onCancel={() => setIsDiscardConfirmOpen(false)}
        onConfirm={closeDialog}
      />
    </>
  );
}
