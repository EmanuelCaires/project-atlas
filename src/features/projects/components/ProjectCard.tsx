import { PROJECT_STATUS_LABELS } from "../constants";
import type { DeveloperProject } from "../types";

type ProjectCardProps = {
  project: DeveloperProject;
  onEdit: (project: DeveloperProject) => void;
  onDelete: (projectId: string) => void;
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <article
      style={{
        padding: 18,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 14,
        background: "rgba(255, 255, 255, 0.03)",
      }}
    >
      {project.image_url && (
        // External user-provided URLs are intentionally rendered without
        // Next Image optimisation until Atlas adds managed image storage.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${project.title} screenshot`}
          src={project.image_url}
          style={{
            width: "100%",
            maxHeight: 260,
            objectFit: "cover",
            borderRadius: 10,
            marginBottom: 16,
          }}
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

      <p className="profile-summary">
        {project.description || "No project description added."}
      </p>

      <div className="passport-page-actions" style={{ marginTop: 16 }}>
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
