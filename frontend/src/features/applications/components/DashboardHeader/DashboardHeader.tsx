import { JobApplication } from "../../model/jobApplication";
import NewApplicationDialog from "../Dialogs/NewApplicationDialog/NewApplicationDialog";
import NewApplicationForm from "../Forms/NewApplicationForm/NewApplicationForm";
import styles from "./DashboardHeader.module.css";

type DashboardHeaderProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  onCreateApplication: (application: JobApplication) => void;
};

export default function DashboardHeader({
  onCreateApplication,
  isDialogOpen,
  setIsDialogOpen,
}: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <h1>Le tue opportunità, in ordine.</h1>
        {/* <p className={styles.description}>
          Tieni sotto controllo ogni fase della tua ricerca.
        </p> */}
      </div>

      {isDialogOpen && (
        <NewApplicationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        >
          <NewApplicationForm
            onCreated={onCreateApplication}
            onCancel={() => setIsDialogOpen(false)}
          />
        </NewApplicationDialog>
      )}
    </header>
  );
}
