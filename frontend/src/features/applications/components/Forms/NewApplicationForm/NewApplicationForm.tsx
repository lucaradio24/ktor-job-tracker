"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  ApiError,
  createApplication,
  type CreateJobApplication,
  type FieldError,
} from "../../../api/jobApplicationApi";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../../model/jobApplication";
import styles from "./NewApplicationForm.module.css";

type ApplicationFormValues = {
  company: string;
  title: string;
  status: ApplicationStatus;
  appliedAt: string;
  city: string;
  link: string;
  description: string;
};

const formInitialValues: ApplicationFormValues = {
  company: "",
  title: "",
  status: "APPLIED",
  appliedAt: new Date().toISOString().slice(0, 10),
  city: "",
  link: "",
  description: "",
};

function readForm(form: HTMLFormElement): ApplicationFormValues {
  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();

  return {
    company: value("company"),
    title: value("title"),
    status: value("status") as ApplicationStatus,
    appliedAt: value("appliedAt"),
    city: value("city"),
    link: value("link"),
    description: value("description"),
  };
}

interface NewApplicationFormProps {
  onCancel: () => void;
  onCreated: (application: JobApplication) => void;
  onDirtyChange: (dirty: boolean) => void;
}

export default function NewApplicationForm({
  onCancel,
  onCreated,
  onDirtyChange,
}: NewApplicationFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const getFieldError = (field: string) =>
    fieldErrors.find((error) => error.field === field)?.message;

  const companyError = getFieldError("company");
  const titleError = getFieldError("title");
  const appliedAtError = getFieldError("appliedAt");
  const linkError = getFieldError("link");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = readForm(form);
    const payload: CreateJobApplication = {
      ...values,
      city: values.city || null,
      link: values.link || null,
      description: values.description || null,
    };

    setSubmitError(null);
    setFieldErrors([]);

    try {
      setIsSaving(true);
      onCreated(await createApplication(payload));
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const errors = error.fieldErrors ?? [];
        setFieldErrors(errors);
        setSubmitError(errors.length > 0 ? null : error.message);
        requestAnimationFrame(() => {
          const field = errors[0]?.field;
          if (field) {
            (form.elements.namedItem(field) as HTMLElement | null)?.focus();
          }
        });
        return;
      }
      setSubmitError("Si è verificato un errore imprevisto.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={(event) =>
        onDirtyChange(
          JSON.stringify(readForm(event.currentTarget)) !==
            JSON.stringify(formInitialValues),
        )
      }
      aria-busy={isSaving}
    >
      <label className={styles.field} htmlFor="company">
        <span className={styles.fieldHeading}>
          <span>Azienda *</span>
          {companyError && (
            <span id="company-error" className={styles.fieldError} role="alert">
              {companyError}
            </span>
          )}
        </span>
        <input
          type="text"
          name="company"
          id="company"
          placeholder="es. Lumen Studio"
          autoComplete="organization"
          autoFocus
          required
          defaultValue={formInitialValues.company}
          aria-invalid={Boolean(companyError)}
          aria-describedby={companyError ? "company-error" : undefined}
        />
      </label>

      <label className={styles.field} htmlFor="title">
        <span className={styles.fieldHeading}>
          <span>Posizione *</span>
          {titleError && (
            <span id="title-error" className={styles.fieldError} role="alert">
              {titleError}
            </span>
          )}
        </span>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="es. Product Designer"
          autoComplete="organization-title"
          required
          defaultValue={formInitialValues.title}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? "title-error" : undefined}
        />
      </label>

      <label className={styles.field} htmlFor="appliedAt">
        <span className={styles.fieldHeading}>
          <span>Data candidatura</span>
          {appliedAtError && (
            <span id="appliedAt-error" className={styles.fieldError} role="alert">
              {appliedAtError}
            </span>
          )}
        </span>
        <input
          type="date"
          name="appliedAt"
          id="appliedAt"
          defaultValue={formInitialValues.appliedAt}
          required
          aria-invalid={Boolean(appliedAtError)}
          aria-describedby={appliedAtError ? "appliedAt-error" : undefined}
        />
      </label>

      <label className={styles.field} htmlFor="status">
        <span>Stato iniziale</span>
        <select name="status" id="status" defaultValue={formInitialValues.status}>
          <option value="APPLIED">Candidatura inviata</option>
          <option value="INTERVIEW">Colloquio</option>
          <option value="OFFER">Offerta ricevuta</option>
          <option value="REJECTED">Non selezionata</option>
          <option value="WITHDRAWN">Ritirata</option>
        </select>
      </label>

      <fieldset className={styles.secondaryFields}>
        <legend>Dettagli facoltativi</legend>

        <label className={styles.field} htmlFor="city">
          <span>Città</span>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="es. Milano"
            autoComplete="address-level2"
            defaultValue={formInitialValues.city}
          />
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
            type="url"
            name="link"
            id="link"
            placeholder="https://"
            inputMode="url"
            defaultValue={formInitialValues.link}
            aria-invalid={Boolean(linkError)}
            aria-describedby={linkError ? "link-error" : undefined}
          />
        </label>

        <label className={`${styles.field} ${styles.wideField}`} htmlFor="description">
          <span>Note</span>
          <textarea
            name="description"
            id="description"
            placeholder="Aggiungi note o requisiti utili…"
            defaultValue={formInitialValues.description}
          />
        </label>
      </fieldset>

      {submitError && (
        <p className={styles.error} role="alert">
          {submitError}
        </p>
      )}

      <footer className={styles.actions}>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={onCancel}
          disabled={isSaving}
        >
          Annulla
        </button>
        <button className={styles.primaryButton} type="submit" disabled={isSaving}>
          {isSaving ? (
            <LoaderCircle className={styles.spinner} aria-hidden="true" size={18} />
          ) : (
            <Check aria-hidden="true" size={18} strokeWidth={2.2} />
          )}
          {isSaving ? "Salvataggio…" : "Salva candidatura"}
        </button>
      </footer>
    </form>
  );
}
