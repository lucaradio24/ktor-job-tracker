import styles from "./ApplicationsDashboard.module.css";

export default function ApplicationsSkeleton({
  view,
}: {
  view: "board" | "list";
}) {
  return (
    <div
      className={`${styles.skeletonBoard} ${
        view === "list" ? styles.skeletonList : ""
      }`}
      aria-label="Caricamento candidature"
    >
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
  );
}
