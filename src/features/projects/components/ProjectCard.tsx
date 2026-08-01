import { SkillBadge } from "@/components/ui";
import { calculateProjectEvidence } from "@/features/evidence/services/evidence.service";
import { PROJECT_STATUS_LABELS } from "../constants";
import type { DeveloperProject } from "../types";

type ProjectCardProps = {
  project: DeveloperProject;
  onEdit: (project: DeveloperProject) => void;
  onDelete: (projectId: string) => void;
};

function getEvidenceLabel(score: number) {
  if (score >= 85) return "Excellent evidence";
  if (score >= 65) return "Strong evidence";
  if (score >= 40) return "Developing evidence";
  return "Limited evidence";
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const evidence = calculateProjectEvidence({
    description: project.description,
    githubUrl: project.github_url,
    liveUrl: project.live_url,
    imageUrl: project.image_url,
    isFeatured: project.is_featured,
    status: project.status,
    skillsCount: project.skills.length,
  });

  const evidenceLabel = getEvidenceLabel(evidence.score);

  return (
    <article className="developer-project-card">
      {project.image_url && (
        // External user-provided URLs are intentionally rendered without
        // Next Image optimisation until Atlas adds managed image storage.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${project.title} screenshot`}
          className="developer-project-card-image"
          src={project.image_url}
        />
      )}

      <div className="profile-section-header">
        <div>
          <h3>{project.title}</h3>

          <p className="dashboard-kicker">
            {PROJECT_STATUS_LABELS[project.status]}
          </p>
        </div>

        {project.is_featured && (
          <span className="verified-badge">Featured</span>
        )}
      </div>

      <div className="project-evidence-summary">
        <div className="project-evidence-score">
          <span>Evidence score</span>
          <strong>{evidence.score}/100</strong>
        </div>

        <span className="project-evidence-label">{evidenceLabel}</span>
      </div>

      <div
        aria-label={`Evidence score: ${evidence.score} out of 100`}
        className="project-evidence-progress"
      >
        <div
          className="project-evidence-progress-value"
          style={{ width: `${evidence.score}%` }}
        />
      </div>

      <p className="profile-summary">
        {project.description || "No project description added."}
      </p>

      {project.skills.length > 0 && (
        <div
          aria-label="Skills used in this project"
          className="skill-badge-list"
        >
          {project.skills.map((skill) => (
            <SkillBadge key={skill.id} name={skill.name} />
          ))}
        </div>
      )}

      <div className="passport-page-actions developer-project-card-actions">
        {project.github_url && (
          <a
            className="button button-secondary"
            href={project.github_url}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        )}

        {project.live_url && (
          <a
            className="button button-secondary"
            href={project.live_url}
            rel="noreferrer"
            target="_blank"
          >
            Live demo
          </a>
        )}

        <button
          className="button button-secondary"
          onClick={() => onEdit(project)}
          type="button"
        >
          Edit
        </button>

        <button
          className="button button-secondary"
          onClick={() => onDelete(project.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
