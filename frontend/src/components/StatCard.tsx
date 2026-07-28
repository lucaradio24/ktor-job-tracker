type StatCardTone = "lavender" | "blue" | "green";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  tone: StatCardTone;
}

export default function StatCard({
  label,
  value,
  icon,
  tone,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
