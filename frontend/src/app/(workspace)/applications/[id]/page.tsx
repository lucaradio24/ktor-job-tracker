import { BackButton } from "@/components/shared/BackButton";
import { ApiError } from "@/features/applications/api/jobApplicationApi";
import { getApplication } from "@/features/applications/api/jobApplicationServerApi";
import EditApplicationForm from "@/features/applications/components/Forms/EditApplicationForm/EditApplicationForm";
import type { JobApplication } from "@/features/applications/model/jobApplication";
import { notFound } from "next/navigation";

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
    <section>
      <header>
        <BackButton />
        <p>MODIFICA CANDIDATURA</p>
        <h1>{application.company}</h1>
        <p>{application.title}</p>
      </header>
      <EditApplicationForm application={application} />
    </section>
  );
}
