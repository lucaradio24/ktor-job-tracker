"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, type FormEvent } from "react";
import {
  ApiError,
  deleteApplication,
  updateApplication,
  type FieldError,
  type UpdateJobApplication,
} from "../../../api/jobApplicationApi";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../../model/jobApplication";
import ConfirmDialog from "../../Dialogs/ConfirmDialog/ConfirmDialog";
import { Trash2 } from "lucide-react";
import styles from "../NewApplicationForm/NewApplicationForm.module.css";
import editStyles from "./EditApplicationForm.module.css";
import { useToast } from "@/components/feedback/ToastViewport/ToastProvider";

function readForm(form: HTMLFormElement): UpdateJobApplication {
  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();

  return {
    company: value("company"),
    title: value("title"),
    status: value("status") as ApplicationStatus,
    appliedAt: value("appliedAt"),
    city: value("city") || null,
    link: value("link") || null,
    description: value("description") || null,
  };
}

export default function EditApplicationForm({
  application,
}: {
  application: JobApplication;
}) {
  const { showToast } = useToast();

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const isBusy = isSaving || isDeleting;
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const initialValues = useRef(
    JSON.stringify({
      company: application.company,
      title: application.title,
      status: application.status,
      appliedAt: application.appliedAt,
      city: application.city ?? null,
      link: application.link ?? null,
      description: application.description ?? null,
    } satisfies UpdateJobApplication),
  );

  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleReset() {
    formRef.current?.reset();
    setIsDirty(false);
    setSubmitError(null);
    setFieldErrors([]);
  }

  const getFieldError = (field: string) =>
    fieldErrors.find((error) => error.field === field)?.message;

  const companyError = getFieldError("company");
  const titleError = getFieldError("title");
  const appliedAtError = getFieldError("appliedAt");
  const linkError = getFieldError("link");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: UpdateJobApplication = readForm(event.currentTarget);

    try {
      setIsSaving(true);
      setSubmitError(null);
      setFieldErrors([]);
      const updatedApplication = await updateApplication(
        application.id,
        payload,
      );
      initialValues.current = JSON.stringify(payload);
      setIsDirty(false);
      router.refresh();
      showToast({
        title: "Modifiche salvate",
        description: `${updatedApplication.company} - ${updatedApplication.title}`,
        durationMs: 2_000,
      });
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        const fieldErrors = requestError.fieldErrors ?? [];
        setFieldErrors(fieldErrors);
        setSubmitError(fieldErrors.length > 0 ? null : requestError.message);
        return;
      }

      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile salvare la candidatura.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    setIsDirty(
      JSON.stringify(readForm(event.currentTarget)) !== initialValues.current,
    );
  }

  async function handleDeleteApplication() {
    try {
      setIsDeleting(true);
      setSubmitError(null);
      setFieldErrors([]);
      await deleteApplication(application.id);
      setIsConfirmDialogOpen(false);
      router.replace("/");
    } catch (requestError) {
      setIsDeleting(false);
      setIsConfirmDialogOpen(false);
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile eliminare la candidatura.",
      );
    }
  }

  return (
    <>
      <form
        ref={formRef}
        className={`${styles.form} ${
          isDirty ? editStyles.formWithSaveBar : ""
        }`}
        onSubmit={handleSubmit}
        onChange={handleChange}
        aria-busy={isBusy}
      >
        <label className={styles.field} htmlFor="company">
          <span className={styles.fieldHeading}>
            <span>Azienda</span>
            {companyError && (
              <span
                id="company-error"
                className={styles.fieldError}
                role="alert"
              >
                {companyError}
              </span>
            )}
          </span>
          <input
            id="company"
            name="company"
            defaultValue={application.company}
            required
            aria-invalid={Boolean(companyError)}
            aria-describedby={companyError ? "company-error" : undefined}
          />
        </label>

        <label className={styles.field} htmlFor="title">
          <span className={styles.fieldHeading}>
            <span>Posizione</span>
            {titleError && (
              <span id="title-error" className={styles.fieldError} role="alert">
                {titleError}
              </span>
            )}
          </span>
          <input
            id="title"
            name="title"
            defaultValue={application.title}
            required
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? "title-error" : undefined}
          />
        </label>

        <label className={styles.field} htmlFor="status">
          <span>Stato</span>
          <select id="status" name="status" defaultValue={application.status}>
            <option value="APPLIED">Candidatura inviata</option>
            <option value="INTERVIEW">Colloquio</option>
            <option value="OFFER">Offerta ricevuta</option>
            <option value="REJECTED">Non selezionata</option>
            <option value="WITHDRAWN">Ritirata</option>
          </select>
        </label>

        <label className={styles.field} htmlFor="appliedAt">
          <span className={styles.fieldHeading}>
            <span>Data candidatura</span>
            {appliedAtError && (
              <span
                id="appliedAt-error"
                className={styles.fieldError}
                role="alert"
              >
                {appliedAtError}
              </span>
            )}
          </span>
          <input
            id="appliedAt"
            type="date"
            name="appliedAt"
            defaultValue={application.appliedAt}
            required
            aria-invalid={Boolean(appliedAtError)}
            aria-describedby={appliedAtError ? "appliedAt-error" : undefined}
          />
        </label>

        <label className={styles.field} htmlFor="city">
          <span>Città</span>
          <input id="city" name="city" defaultValue={application.city ?? ""} />
        </label>

        <label className={styles.field} htmlFor="link">
          <span className={styles.fieldHeading}>
            <span>Link annuncio</span>
            {linkError && (
              <span id="link-error" className={styles.fieldError} role="alert">
                {linkError}
              </span>
            )}
          </span>
          <input
            id="link"
            type="url"
            name="link"
            defaultValue={application.link ?? ""}
            aria-invalid={Boolean(linkError)}
            aria-describedby={linkError ? "link-error" : undefined}
          />
        </label>

        <label
          className={`${styles.field} ${styles.wideField}`}
          htmlFor="description"
        >
          <span>Descrizione</span>
          <textarea
            id="description"
            name="description"
            defaultValue={application.description ?? ""}
          />
        </label>

        {submitError && (
          <p className={styles.error} role="alert">
            {submitError}
          </p>
        )}

        <footer
          className={`${editStyles.saveBar} ${isDirty ? editStyles.savebarVisible : ""}`}
          aria-hidden={!isDirty}
        >
          <div className={editStyles.message}>
            <strong>Hai modifiche non salvate</strong>
            <span>Salva oppure ripristina i valori precedenti.</span>
          </div>

          <div className={editStyles.actions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isBusy}
            >
              Annulla modifiche
            </button>

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={!isDirty || isBusy}
            >
              {isSaving ? "Salvataggio…" : "Salva modifiche"}
            </button>
          </div>
        </footer>

        <section
          className={styles.deleteActions}
          aria-labelledby="delete-application-title"
        >
          <div className={styles.deleteMessage}>
            <span className={styles.deleteIcon}>
              <Trash2 aria-hidden="true" size={20} strokeWidth={1.8} />
            </span>
            <div className={styles.deleteCopy}>
              <p id="delete-application-title" className={styles.deleteTitle}>
                Elimina candidatura
              </p>
              <p className={styles.deleteHint}>L’eliminazione è definitiva.</p>
            </div>
          </div>

          <button
            className={styles.dangerButton}
            type="button"
            onClick={() => setIsConfirmDialogOpen(true)}
            disabled={isBusy}
          >
            {isDeleting ? "Eliminazione…" : "Elimina candidatura"}
          </button>
        </section>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        title="Eliminazione candidatura"
        description={
          <>
            <p>
              Stai per eliminare{" "}
              <strong>
                {application.company} - {application.title}.
              </strong>
              <br />
              Questa azione non può essere annullata.
            </p>
          </>
        }
        isPending={isDeleting}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteApplication}
      />
    </>
  );
}
