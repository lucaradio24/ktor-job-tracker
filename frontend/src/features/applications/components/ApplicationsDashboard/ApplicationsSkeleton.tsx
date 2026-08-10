import styles from "./ApplicationsDashboard.module.css";

export default function ApplicationsSkeleton() {
  return (
    <>
      {/* <span className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
      <span className={`${styles.skeleton} ${styles.skeletonHeading}`} /> */}
      {/* <span className={`${styles.skeleton} ${styles.skeletonDescription}`} /> */}

      <section
        className={styles.dashboard}
        aria-label="Caricamento candidature"
        aria-busy="true"
      >
        <div className={styles.skeletonToolbar} aria-hidden="true">
          <span className={`${styles.skeleton} ${styles.skeletonSearch}`} />
          <span className={`${styles.skeleton} ${styles.skeletonAction}`} />
          <span className={`${styles.skeleton} ${styles.skeletonToggle}`} />
        </div>

        <div className={styles.skeletonBoard} aria-hidden="true">
          {[0, 1, 2].map((column) => (
            <div className={styles.skeletonColumn} key={column}>
              <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
              <span className={`${styles.skeleton} ${styles.skeletonCard}`} />
              <span
                className={`${styles.skeleton} ${styles.skeletonCard} ${styles.skeletonCardShort}`}
              />
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
