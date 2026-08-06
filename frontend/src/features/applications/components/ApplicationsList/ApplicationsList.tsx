import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationCard from "../ApplicationCard/ApplicationCard";
import styles from "./ApplicationList.module.css";

interface ApplicationListProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDeleteRequest?: (application: JobApplication) => void;
}

export default function ApplicationList({
  applications,
  onStatusChange,
  onDeleteRequest,
}: ApplicationListProps) {
  return (
    <div className={styles.list}>
      {applications.map((application) => (
        <ApplicationCard
          application={application}
          draggable={false}
          key={application.id}
          onStatusChange={onStatusChange}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
