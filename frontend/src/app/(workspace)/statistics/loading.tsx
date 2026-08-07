import styles from "./statistics.module.css";

export default function LoadingStatistics() {
  return (
    <section
      className={styles.page}
      aria-label="Caricamento statistiche"
      aria-busy="true"
    >
      <header className={styles.header} aria-hidden="true">
        <div>
          <span className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
          <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        </div>
        <span className={`${styles.skeleton} ${styles.skeletonCopy}`} />
      </header>

      <div className={styles.skeletonContent} aria-hidden="true">
        <div className={styles.skeletonMetrics}>
          {[0, 1, 2, 3].map((metric) => (
            <span
              className={`${styles.skeleton} ${styles.skeletonMetric}`}
              key={metric}
            />
          ))}
        </div>
        <div className={styles.skeletonDetails}>
          <span className={`${styles.skeleton} ${styles.skeletonPanel}`} />
          <span className={`${styles.skeleton} ${styles.skeletonPanel}`} />
        </div>
      </div>
    </section>
  );
}
