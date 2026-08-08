import { BackButton } from "@/components/shared/BackButton";
import { ApiError } from "@/features/applications/api/jobApplicationApi";
import { getApplication } from "@/features/applications/api/jobApplicationServerApi";
import EditApplicationForm from "@/features/applications/components/Forms/EditApplicationForm/EditApplicationForm";
import type { JobApplication } from "@/features/applications/model/jobApplication";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let application: JobApplication;

  try {
    application = await getApplication(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <BackButton />
        <div>
          {/* <h1>Modifica candidatura</h1> */}
          <p>
            <strong>{application.company}</strong> · {application.title}
          </p>
        </div>
      </header>
      <div className={styles.formPanel}>
        <EditApplicationForm application={application} />
      </div>
    </section>
  );
}
