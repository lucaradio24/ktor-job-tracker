import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <section className={styles.content} aria-labelledby="not-found-title">
        <div className={styles.copy}>
          <p className={styles.code}>404</p>
          <h1 id="not-found-title">
            <span>Oh no!</span>
            <br />
            <span>Il robottino non ha trovato questa candidatura.</span>
          </h1>
          <p className={styles.description}>
            <span>Il collegamento che cercavi non è più valido</span>
            <span> oppure è stata rimossa.</span>
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
          src="/robot-paperwork-search.png"
          alt=""
          fill
          sizes="(max-width: 48rem) 70vw, 40vw"
          loading="eager"
        />
      </div>
    </main>
  );
}
