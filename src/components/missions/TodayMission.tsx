import Link from "next/link";

type TodayMissionProps = {
  title: string;
  description: string;
  impact: number;
  estimatedMinutes: number;
};

export default function TodayMission({
  title,
  description,
  impact,
  estimatedMinutes,
}: TodayMissionProps) {
  return (
    <section className="today-mission">
      <div className="today-mission-header">
        <span>🎯 Today&apos;s Mission</span>
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <div className="today-mission-meta">
        <div>
          <strong>Expected Evidence Gain</strong>
          <span>+{impact}</span>
        </div>

        <div>
          <strong>Estimated Time</strong>
          <span>{estimatedMinutes} min</span>
        </div>

        <div>
          <strong>Difficulty</strong>
          <span>🟢 Easy</span>
        </div>
      </div>

      <Link className="button" href="/developer/projects">
        Start Mission
      </Link>
    </section>
  );
}