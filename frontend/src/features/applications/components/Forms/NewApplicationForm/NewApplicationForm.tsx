"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { createApplication } from "../../../api/jobApplicationApi";
import type { ApplicationStatus } from "../../../model/jobApplication";
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

interface NewApplicationFormProps {
  onCancel: () => void;
}

export default function NewApplicationForm({
  onCancel,
}: NewApplicationFormProps) {
  const [formValues, setFormValues] =
    useState<ApplicationFormValues>(getInitialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      company: formValues.company.trim(),
      title: formValues.title.trim(),
      status: formValues.status,
      appliedAt: formValues.appliedAt,
      city: formValues.city.trim() || null,
      link: formValues.link.trim() || null,
      description: formValues.description.trim() || null,
    };

    setSubmitError(null);

    try {
      setIsSaving(true);
      await createApplication(payload);
      setFormValues(getInitialValues());
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
          value={formValues.company}
          onChange={handleChange}
          placeholder="es. Lumen Studio"
          autoComplete="organization"
          autoFocus
          required
        />
      </label>

      <label className={styles.field} htmlFor="title">
        <span>Posizione</span>
        <input
          type="text"
          name="title"
          id="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder="es. Product Designer"
          autoComplete="organization-title"
          required
        />
      </label>

      <label className={styles.field} htmlFor="status">
        <span>Stato</span>
        <select
          name="status"
          id="status"
          value={formValues.status}
          onChange={handleChange}
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
          value={formValues.appliedAt}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.field} htmlFor="city">
        <span>Città</span>
        <input
          type="text"
          name="city"
          id="city"
          value={formValues.city}
          onChange={handleChange}
          placeholder="es. Milano"
          autoComplete="address-level2"
        />
      </label>

      <label className={styles.field} htmlFor="link">
        <span>Link annuncio</span>
        <input
          type="url"
          name="link"
          id="link"
          value={formValues.link}
          onChange={handleChange}
          placeholder="https://"
          inputMode="url"
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
          value={formValues.description}
          onChange={handleChange}
          placeholder="Aggiungi una nota o i requisiti principali…"
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
