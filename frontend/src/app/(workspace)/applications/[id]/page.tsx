import { getApplication } from "@/features/applications/api/jobApplicationApi";
import EditApplicationForm from "@/features/applications/components/Forms/EditApplicationForm/EditApplicationForm";
import { notFound } from "next/navigation";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  return (
    <section>
      <header>
        <p>MODIFICA CANDIDATURA</p>
        <h1>{application.company}</h1>
        <p>{application.title}</p>
      </header>
      <EditApplicationForm application={application} />
    </section>
  );
}
