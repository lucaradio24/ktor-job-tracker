"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  updateApplication,
  type UpdateJobApplication,
} from "../../../api/jobApplicationApi";
import type {
  ApplicationStatus,
  JobApplication,
} from "../../../model/jobApplication";
import styles from "../NewApplicationForm/NewApplicationForm.module.css";

export default function EditApplicationForm({
  application,
}: {
  application: JobApplication;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const payload: UpdateJobApplication = {
      company: value("company"),
      title: value("title"),
      status: value("status") as ApplicationStatus,
      appliedAt: value("appliedAt"),
      city: value("city") || null,
      link: value("link") || null,
      description: value("description") || null,
    };

    try {
      setIsSaving(true);
      setError(null);
      await updateApplication(application.id, payload);
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Non è stato possibile salvare la candidatura.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Azienda</span>
        <input name="company" defaultValue={application.company} required />
      </label>

      <label className={styles.field}>
        <span>Posizione</span>
        <input name="title" defaultValue={application.title} required />
      </label>

      <label className={styles.field}>
        <span>Stato</span>
        <select name="status" defaultValue={application.status}>
          <option value="APPLIED">Candidatura inviata</option>
          <option value="INTERVIEW">Colloquio</option>
          <option value="OFFER">Offerta ricevuta</option>
          <option value="REJECTED">Non selezionata</option>
          <option value="WITHDRAWN">Ritirata</option>
        </select>
      </label>

      <label className={styles.field}>
        <span>Data candidatura</span>
        <input
          type="date"
          name="appliedAt"
          defaultValue={application.appliedAt}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Città</span>
        <input name="city" defaultValue={application.city ?? ""} />
      </label>

      <label className={styles.field}>
        <span>Link annuncio</span>
        <input type="url" name="link" defaultValue={application.link ?? ""} />
      </label>

      <label className={`${styles.field} ${styles.wideField}`}>
        <span>Descrizione</span>
        <textarea
          name="description"
          defaultValue={application.description ?? ""}
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <footer className={styles.actions}>
        <Link className={styles.secondaryButton} href="/">
          Annulla
        </Link>

        <button
          className={styles.primaryButton}
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </footer>
    </form>
  );
}
