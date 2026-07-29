"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { createApplication } from "../../../api/jobApplicationApi";
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

function getInitialValues(): ApplicationFormValues {
  return {
    company: "",
    title: "",
    status: "APPLIED",
    appliedAt: new Date().toISOString().slice(0, 10),
    city: "",
    link: "",
    description: "",
  };
}

const formInitialValues = getInitialValues();

interface NewApplicationFormProps {
  onCancel: () => void;
  onCreated: (application: JobApplication) => void;
}

export default function NewApplicationForm({
  onCancel,
  onCreated,
}: NewApplicationFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const payload = {
      company: value("company"),
      title: value("title"),
      status: value("status") as ApplicationStatus,
      appliedAt: value("appliedAt"),
      city: value("city") || null,
      link: value("link") || null,
      description: value("description") || null,
    };

    setSubmitError(null);

    try {
      setIsSaving(true);

      const created = await createApplication(payload);
      form.reset();
      onCreated(created);
      onCancel();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Non è stato possibile salvare la candidatura.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={isSaving}>
      <label className={styles.field} htmlFor="company">
        <span>Azienda</span>
        <input
          type="text"
          name="company"
          id="company"
          placeholder="es. Lumen Studio"
          autoComplete="organization"
          autoFocus
          required
          defaultValue={formInitialValues.company}
        />
      </label>

      <label className={styles.field} htmlFor="title">
        <span>Posizione</span>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="es. Product Designer"
          autoComplete="organization-title"
          required
          defaultValue={formInitialValues.title}
        />
      </label>

      <label className={styles.field} htmlFor="status">
        <span>Stato</span>
        <select
          name="status"
          id="status"
          defaultValue={formInitialValues.status}
        >
          <option value="APPLIED">Candidatura inviata</option>
          <option value="INTERVIEW">Colloquio</option>
          <option value="OFFER">Offerta ricevuta</option>
          <option value="REJECTED">Non selezionata</option>
          <option value="WITHDRAWN">Ritirata</option>
        </select>
      </label>

      <label className={styles.field} htmlFor="appliedAt">
        <span>Data candidatura</span>
        <input
          type="date"
          name="appliedAt"
          id="appliedAt"
          defaultValue={formInitialValues.appliedAt}
          required
        />
      </label>

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
        <span>Link annuncio</span>
        <input
          type="url"
          name="link"
          id="link"
          placeholder="https://"
          inputMode="url"
          defaultValue={formInitialValues.link}
        />
      </label>

      <label
        className={`${styles.field} ${styles.wideField}`}
        htmlFor="description"
      >
        <span>Descrizione</span>
        <textarea
          name="description"
          id="description"
          placeholder="Aggiungi una nota o i requisiti principali…"
          defaultValue={formInitialValues.description}
        />
      </label>

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
        <button
          className={styles.primaryButton}
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <LoaderCircle
              className={styles.spinner}
              aria-hidden="true"
              size={18}
            />
          ) : (
            <Check aria-hidden="true" size={18} strokeWidth={2.2} />
          )}
          {isSaving ? "Salvataggio…" : "Salva candidatura"}
        </button>
      </footer>
    </form>
  );
}
