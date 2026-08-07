import styles from "./settings.module.css";

export default function LoadingSettings() {
  return (
    <section
      className={styles.page}
      aria-label="Caricamento impostazioni"
      aria-busy="true"
    >
      <header className={styles.header} aria-hidden="true">
        <span className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
        <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <span className={`${styles.skeleton} ${styles.skeletonCopy}`} />
      </header>

      <div className={styles.skeletonForm} aria-hidden="true">
        {[0, 1, 2].map((group) => (
          <span
            className={`${styles.skeleton} ${styles.skeletonGroup}`}
            key={group}
          />
        ))}
      </div>
    </section>
  );
}
