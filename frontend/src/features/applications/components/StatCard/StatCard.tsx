import type { LucideIcon } from "lucide-react";
import styles from "./StatCard.module.css";

export type StatCardTone = "amber" | "violet" | "green";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone: StatCardTone;
}

const toneClasses: Record<StatCardTone, string> = {
  amber: styles.amber,
  violet: styles.violet,
  green: styles.green,
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: StatCardProps) {
  return (
    <article className={styles.card}>
      <span
        className={`${styles.icon} ${toneClasses[tone]}`}
        aria-hidden="true"
      >
        <Icon size={20} strokeWidth={1.9} />
      </span>
      <div className={styles.copy}>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
