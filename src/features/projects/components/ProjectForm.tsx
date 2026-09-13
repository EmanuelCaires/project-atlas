import { SkillBadge } from "@/components/ui";
import type { FormEvent } from "react";
import type {
  DeveloperSkill,
  ProjectFormValues,
  ProjectStatus,
} from "../types";

type ProjectFormProps = {
  form: ProjectFormValues;
  isEditing: boolean;
  saving: boolean;
  availableSkills: DeveloperSkill[];
  loadingSkills: boolean;
  onChange: <K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function ProjectForm({
  form,
  isEditing,
  saving,
  availableSkills,
  loadingSkills,
  onChange,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  function toggleSkill(skillId: number) {
    const isSelected = form.skillIds.includes(skillId);

    const nextSkillIds = isSelected
      ? form.skillIds.filter((id) => id !== skillId)
      : [...form.skillIds, skillId];

    onChange("skillIds", nextSkillIds);
  }

  return (
    <section className="profile-section">
      <div className="profile-section-header">
        <div>
          <p className="dashboard-kicker">Project details</p>
          <h2>{isEditing ? "Edit project" : "Add project"}</h2>
        </div>
      </div>

      <form className="passport-editor-form" onSubmit={onSubmit}>
        <label>
          Project title
          <input
            maxLength={120}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Example: WeRepair"
            required
            type="text"
            value={form.title}
          />
        </label>

        <label>
          Description
          <textarea
            maxLength={3000}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Explain the project, your contribution and the problem it solves."
            rows={5}
            value={form.description}
          />
        </label>

        <div className="form-grid">
          <label>
            GitHub URL
            <input
              onChange={(event) => onChange("githubUrl", event.target.value)}
              placeholder="https://github.com/..."
              type="url"
              value={form.githubUrl}
            />
          </label>

          <label>
            Live project URL
            <input
              onChange={(event) => onChange("liveUrl", event.target.value)}
              placeholder="https://..."
              type="url"
              value={form.liveUrl}
            />
          </label>
        </div>

        <label>
          Screenshot image URL
          <input
            onChange={(event) => onChange("imageUrl", event.target.value)}
            placeholder="https://..."
            type="url"
            value={form.imageUrl}
          />
        </label>

        <div className="form-grid">
          <label>
            Status
            <select
              onChange={(event) =>
                onChange("status", event.target.value as ProjectStatus)
              }
              value={form.status}
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label>
            Started date
            <input
              onChange={(event) => onChange("startedAt", event.target.value)}
              type="date"
              value={form.startedAt}
            />
          </label>

          <label>
            Completed date
            <input
              min={form.startedAt || undefined}
              onChange={(event) => onChange("completedAt", event.target.value)}
              type="date"
              value={form.completedAt}
            />
          </label>
        </div>

        <div>
          <div className="profile-section-header">
            <div>
              <p className="dashboard-kicker">Evidence</p>
              <h3>Skills used</h3>
            </div>

            <span>{form.skillIds.length} selected</span>
          </div>

          {loadingSkills ? (
            <p>Loading skills...</p>
          ) : availableSkills.length === 0 ? (
            <p>
              No skills are available. Add skills to your Passport before
              linking them to a project.
            </p>
          ) : (
            <div
              className="skill-badge-list"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {availableSkills.map((skill) => {
                const isSelected = form.skillIds.includes(skill.id);

                return (
                  <SkillBadge
                    key={skill.id}
                    disabled={saving}
                    name={skill.name}
                    onClick={() => toggleSkill(skill.id)}
                    selected={isSelected}
                  />
                );
              })}
            </div>
          )}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            checked={form.isFeatured}
            onChange={(event) => onChange("isFeatured", event.target.checked)}
            type="checkbox"
          />
          Feature this project on my passport
        </label>

        <div className="passport-page-actions">
          <button className="button" disabled={saving} type="submit">
            {saving
              ? "Saving..."
              : isEditing
                ? "Update project"
                : "Add project"}
          </button>

          {isEditing && (
            <button
              className="button button-secondary"
              disabled={saving}
              onClick={onCancel}
              type="button"
            >
              Cancel editing
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
