import Image from "next/image";
import Link from "next/link";
import { getApplications } from "@/features/applications/api/jobApplicationServerApi";
import ApplicationStats from "@/features/applications/components/ApplicationStats/ApplicationStats";
import { calculateApplicationStats } from "@/features/applications/model/applicationStats";
import styles from "./statistics.module.css";

export default async function StatisticsPage() {
  const applications = await getApplications();
  const now = new Date();

  if (applications.length === 0) {
    return (
      <section className={styles.empty}>
        <Image
          src="/robot-paperwork-search.png"
          alt=""
          width={240}
          height={360}
          priority
        />
        <div>
          <p className={styles.eyebrow}>Statistiche</p>
          <h1>Prima i dati, poi i segnali</h1>
          <p>
            Aggiungi la prima candidatura: qui vedrai avanzamenti, offerte e
            distribuzione della ricerca.
          </p>
          <Link href="/">Aggiungi candidatura</Link>
        </div>
      </section>
    );
  }

  const stats = calculateApplicationStats(applications, now);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Panoramica</p>
          <h1>Statistiche</h1>
        </div>
        <p>
          Aggiornate al{" "}
          <time dateTime={now.toISOString()}>
            {now.toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          . Gli avanzamenti coprono tutto lo storico disponibile.
        </p>
      </header>

      <ApplicationStats stats={stats} />
    </section>
  );
}
