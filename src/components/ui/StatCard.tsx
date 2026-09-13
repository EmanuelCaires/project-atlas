type StatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-card-title">
        {title}
      </span>

      <strong className="stat-card-value">
        {value}
      </strong>

      {subtitle && (
        <small className="stat-card-subtitle">
          {subtitle}
        </small>
      )}
    </article>
  );
}