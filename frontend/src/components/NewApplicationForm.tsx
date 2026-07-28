import type { ApplicationStatus } from "@/types/JobApplication";
import { useState, type FormEvent } from "react";
import { createApplication } from "@/api/JobApplicationApi";

type ApplicationFormValues = {
  company: string;
  title: string;
  status: ApplicationStatus;
  appliedAt: string;
  city: string;
  link: string;
  description: string;
};

const initialValues: ApplicationFormValues = {
  company: "",
  title: "",
  status: "APPLIED",
  appliedAt: new Date().toISOString().slice(0, 10),
  city: "",
  link: "",
  description: "",
};

interface NewApplicationFormProps {
  onCancel: () => void;
}

export default function NewApplicationForm({
  onCancel,
}: NewApplicationFormProps) {
  const [formValues, setFormValues] =
    useState<ApplicationFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
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
      setFormValues(initialValues);
      onCancel();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore sconosciuto",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <label className="application-form-field" htmlFor="company">
        <span>Azienda</span>
        <input
          type="text"
          name="company"
          id="company"
          value={formValues.company}
          onChange={handleChange}
          required
        />
      </label>

      <label className="application-form-field" htmlFor="title">
        <span>Titolo</span>
        <input
          type="text"
          name="title"
          id="title"
          value={formValues.title}
          onChange={handleChange}
          required
        />
      </label>

      <label className="application-form-field" htmlFor="status">
        <span>Stato</span>
        <select
          name="status"
          id="status"
          value={formValues.status}
          onChange={handleChange}
        >
          <option value="APPLIED">Applicazione</option>
          <option value="INTERVIEW">Colloquio</option>
          <option value="OFFER">Offerta</option>
          <option value="REJECTED">Rifiutato</option>
          <option value="WITHDRAWN">Ritirata</option>
        </select>
      </label>

      <label className="application-form-field" htmlFor="appliedAt">
        <span>Data</span>
        <input
          type="date"
          name="appliedAt"
          id="appliedAt"
          value={formValues.appliedAt}
          onChange={handleChange}
        />
      </label>

      <label className="application-form-field" htmlFor="city">
        <span>Città</span>
        <input
          type="text"
          name="city"
          id="city"
          value={formValues.city}
          onChange={handleChange}
        />
      </label>

      <label className="application-form-field" htmlFor="link">
        <span>Link</span>
        <input
          type="url"
          name="link"
          id="link"
          value={formValues.link}
          onChange={handleChange}
        />
      </label>

      <label
        className="application-form-field application-form-field-wide"
        htmlFor="description"
      >
        <span>Descrizione</span>
        <textarea
          name="description"
          id="description"
          value={formValues.description}
          onChange={handleChange}
        />
      </label>
      {submitError && (
        <p className="application-form-error" role="alert">
          {submitError}
        </p>
      )}

      <footer className="application-form-actions">
        <button
          className="modal-cancel-button"
          type="button"
          onClick={onCancel}
        >
          Annulla
        </button>
        <button
          className="modal-save-button"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Salvataggio..." : "Salva candidatura"}
        </button>
      </footer>
    </form>
  );
}
