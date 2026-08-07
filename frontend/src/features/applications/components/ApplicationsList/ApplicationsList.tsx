import type {
  ApplicationStatus,
  JobApplication,
} from "../../model/jobApplication";
import ApplicationCard from "../ApplicationCard/ApplicationCard";
import styles from "./ApplicationList.module.css";

interface ApplicationListProps {
  applications: JobApplication[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDeleteRequest?: (application: JobApplication) => void;
  selectedApplicationId: string | null;
}

export default function ApplicationList({
  applications,
  onSelect,
  onStatusChange,
  onDeleteRequest,
  selectedApplicationId,
}: ApplicationListProps) {
  return (
    <div className={styles.list} role="list">
      {applications.map((application) => (
        <ApplicationCard
          application={application}
          draggable={false}
          key={application.id}
          onSelect={onSelect}
          onStatusChange={onStatusChange}
          onDeleteRequest={onDeleteRequest}
          selected={application.id === selectedApplicationId}
        />
      ))}
    </div>
  );
}
