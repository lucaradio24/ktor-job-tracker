import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <Link className={styles.brand} href="/" aria-label="JobTracker">
        <Image
          className={styles.brandLogo}
          src="/jobtracker-logo.png"
          alt=""
          width={40}
          height={40}
        />
        <span>JOBTRACKER</span>
      </Link>

      <section className={styles.content} aria-labelledby="not-found-title">
        <div className={styles.copy}>
          <p className={styles.code}>404</p>
          <h1 id="not-found-title">
            <span>Questa pagina è </span>
            <span>uscita dal processo.</span>
          </h1>
          <p className={styles.description}>
            <span>Il collegamento che cercavi non è più </span>
            <span>disponibile oppure è stato spostato.</span>
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/">
              Torna alla panoramica
            </Link>
            <Link className={styles.secondaryButton} href="/#application-board">
              Vai alle candidature
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.robot} aria-hidden="true">
        <Image
          src="/robot-error-v2.png"
          alt=""
          fill
          sizes="(max-width: 48rem) 70vw, 40vw"
          loading="eager"
        />
      </div>
    </main>
  );
}
