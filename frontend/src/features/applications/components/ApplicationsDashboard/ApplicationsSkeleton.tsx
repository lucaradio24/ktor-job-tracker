import styles from "./ApplicationsDashboard.module.css";
import headerStyles from "../DashboardHeader/DashboardHeader.module.css";

export default function ApplicationsSkeleton() {
  return (
    <>
      <header className={headerStyles.header} aria-hidden="true">
        <div className={headerStyles.copy}>
          <span className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
          <span className={`${styles.skeleton} ${styles.skeletonHeading}`} />
          <span
            className={`${styles.skeleton} ${styles.skeletonDescription}`}
          />
        </div>
        <span className={`${styles.skeleton} ${styles.skeletonAction}`} />
      </header>

      <section
        className={styles.dashboard}
        aria-label="Caricamento candidature"
        aria-busy="true"
      >
        <div className={styles.toolbar} aria-hidden="true">
          <span className={`${styles.skeleton} ${styles.skeletonSearch}`} />
          <span className={`${styles.skeleton} ${styles.skeletonToggle}`} />
        </div>

        <div className={styles.skeletonBoard} aria-hidden="true">
          {[0, 1, 2, 3].map((column) => (
            <div className={styles.skeletonColumn} key={column}>
              <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
              <span className={`${styles.skeleton} ${styles.skeletonCard}`} />
              <span
                className={`${styles.skeleton} ${styles.skeletonCard} ${styles.skeletonCardShort}`}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
