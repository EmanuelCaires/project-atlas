import type { DeveloperProject } from "../types";
import ProjectCard from "./ProjectCard";

type ProjectListProps = {
  projects: DeveloperProject[];
  onEdit: (project: DeveloperProject) => void;
  onDelete: (projectId: string) => void;
};

export default function ProjectList({
  projects,
  onEdit,
  onDelete,
}: ProjectListProps) {
  return (
    <section className="profile-section">
      <div className="profile-section-header">
        <div>
          <p className="dashboard-kicker">Selected work</p>
          <h2>Your projects</h2>
        </div>

        <span>
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {projects.length > 0 ? (
        <div style={{ display: "grid", gap: 16 }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onDelete={onDelete}
              onEdit={onEdit}
              project={project}
            />
          ))}
        </div>
      ) : (
        <p className="profile-summary">No projects have been added yet.</p>
      )}
    </section>
  );
}
