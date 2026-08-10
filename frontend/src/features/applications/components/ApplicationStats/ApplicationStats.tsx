import { BarChart3, Clock3, MapPin, TrendingUp, Trophy } from "lucide-react";
import type { ApplicationStatus } from "../../model/jobApplication";
import type { ApplicationStats as Stats } from "../../model/applicationStats";
import styles from "./ApplicationStats.module.css";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Candidature",
  INTERVIEW: "Colloqui",
  OFFER: "Offerte",
  REJECTED: "Non selezionate",
  WITHDRAWN: "Ritirate",
};

export default function ApplicationStats({ stats }: { stats: Stats }) {
  const averageDuration = stats.averageDaysInCurrentStatus;
  const maxCityCount = stats.topCities[0]?.count ?? 0;
  const reachedInterviewPercentage = stats.totalApplications
    ? Math.round((stats.reachedInterview / stats.totalApplications) * 100)
    : 0;
  const offersPercentage = stats.totalApplications
    ? Math.round((stats.offersReceived / stats.totalApplications) * 100)
    : 0;

  return (
    <div className={styles.content}>
      <section className={styles.metrics} aria-label="Metriche principali">
        <article className={styles.metric}>
          <BarChart3 aria-hidden="true" size={20} />
          <p>Inviate negli ultimi 30 giorni</p>
          <strong data-numeric>{stats.appliedLast30Days}</strong>
          <span>{stats.totalApplications} candidature totali</span>
        </article>
        <article className={styles.metric}>
          <TrendingUp aria-hidden="true" size={20} />
          <p>Arrivate al colloquio</p>
          <strong data-numeric>{stats.reachedInterview}</strong>
          <span>{reachedInterviewPercentage}% del totale</span>
        </article>
        <article className={styles.metric}>
          <Trophy aria-hidden="true" size={20} />
          <p>Offerte ricevute</p>
          <strong data-numeric>{stats.offersReceived}</strong>
          <span>{offersPercentage}% del totale</span>
        </article>
        <article className={styles.metric}>
          <Clock3 aria-hidden="true" size={20} />
          <p>Permanenza media nello stato</p>
          <strong data-numeric>
            {averageDuration === null
              ? "—"
              : `${averageDuration.toLocaleString("it-IT", { maximumFractionDigits: 1 })} gg`}
          </strong>
          <span>Calcolata su {stats.durationSampleSize} candidature</span>
        </article>
      </section>

      <div className={styles.details}>
        <section className={styles.panel} aria-labelledby="distribution-title">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>Pipeline e archiviate</p>
              <h2 id="distribution-title">Distribuzione attuale</h2>
            </div>
            <strong data-numeric>{stats.totalApplications}</strong>
          </div>

          <ul className={styles.barList}>
            {stats.currentStatusCounts.map(({ status, count, percentage }) => (
              <li key={status}>
                <div className={styles.barLabel}>
                  <span>{STATUS_LABELS[status]}</span>
                  <span data-numeric>
                    <strong>{count}</strong> · {percentage}%
                  </span>
                </div>
                <div className={styles.track} aria-hidden="true">
                  <span
                    className={styles.fill}
                    data-status={status}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel} aria-labelledby="cities-title">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>Dove stai cercando</p>
              <h2 id="cities-title">Città più frequenti</h2>
            </div>
            <MapPin aria-hidden="true" size={20} />
          </div>

          {stats.topCities.length > 0 ? (
            <ul className={styles.barList}>
              {stats.topCities.map(({ city, count }) => (
                <li key={city}>
                  <div className={styles.barLabel}>
                    <span>{city}</span>
                    <strong data-numeric>{count}</strong>
                  </div>
                  <div className={styles.track} aria-hidden="true">
                    <span
                      className={`${styles.fill} ${styles.cityFill}`}
                      style={{ width: `${(count / maxCityCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.missingData}>
              Aggiungi la città alle candidature per vedere la distribuzione.
            </p>
          )}
        </section>
      </div>

      {stats.historyCoverage.tracked < stats.historyCoverage.total && (
        <p className={styles.coverage}>
          Storico disponibile per {stats.historyCoverage.tracked} candidature su{" "}
          {stats.historyCoverage.total} ({stats.historyCoverage.percentage}%).
          Le durate escludono i record senza timestamp.
        </p>
      )}
    </div>
  );
}
