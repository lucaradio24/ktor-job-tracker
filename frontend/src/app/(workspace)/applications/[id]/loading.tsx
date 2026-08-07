import styles from "./loading.module.css";

export default function LoadingApplication() {
  return (
    <section
      className={styles.loading}
      aria-label="Caricamento candidatura"
      aria-busy="true"
    >
      <div className={`${styles.block} ${styles.back}`} />
      <div className={styles.header}>
        <div className={`${styles.block} ${styles.title}`} />
        <div className={`${styles.block} ${styles.subtitle}`} />
      </div>
      <div className={styles.panel}>
        <div className={`${styles.block} ${styles.field}`} />
        <div className={`${styles.block} ${styles.field}`} />
        <div className={`${styles.block} ${styles.field}`} />
        <div className={`${styles.block} ${styles.notes}`} />
      </div>
      <span className={styles.visuallyHidden} aria-live="polite">
        Caricamento candidatura…
      </span>
    </section>
  );
}
