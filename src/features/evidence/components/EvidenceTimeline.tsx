import type { EvidenceTimelineEvent, EvidenceTimelineEventType } from "../types";

const EVENT_LABELS: Record<EvidenceTimelineEventType, string> = {
  project_added: "Project added",
  project_started: "Project started",
  project_completed: "Project completed",
  repository_confirmed: "GitHub repository confirmed",
};

// UTC keeps date-only project milestones on their recorded calendar day.
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default function EvidenceTimeline({
  events,
}: {
  events: readonly EvidenceTimelineEvent[];
}) {
  return (
    <section className="profile-section" aria-labelledby="evidence-timeline-title">
      <div className="profile-section-header">
        <div>
          <p className="dashboard-kicker">Professional progress</p>
          <h2 id="evidence-timeline-title">Evidence Timeline</h2>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="profile-summary">
          No timeline events yet. Add a project or project dates to show your progress.
        </p>
      ) : (
        <ol className="evidence-timeline-list">
          {events.map((event) => (
            <li className="evidence-timeline-item" key={event.id}>
              <div>
                <h3>{event.projectTitle}</h3>
                <p>{EVENT_LABELS[event.type]}</p>
              </div>
              <time dateTime={event.date}>
                {dateFormatter.format(new Date(event.date))}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
