"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type ProjectStatus =
  | "planning"
  | "in_progress"
  | "completed"
  | "archived";

type DeveloperProject = {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  started_at: string | null;
  completed_at: string | null;
};

type ProjectForm = {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  status: ProjectStatus;
  isFeatured: boolean;
  startedAt: string;
  completedAt: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  status: "completed",
  isFeatured: false,
  startedAt: "",
  completedAt: "",
};

function formatStatus(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    planning: "Planning",
    in_progress: "In progress",
    completed: "Completed",
    archived: "Archived",
  };

  return labels[status];
}

export default function DeveloperProjectsPage() {
  const router = useRouter();

  const [passportId, setPassportId] = useState<string | null>(null);
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProjects() {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: passport, error: passportError } = await supabase
        .from("developer_passports")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (passportError) {
        setErrorMessage(passportError.message);
        setLoading(false);
        return;
      }

      if (!passport) {
        router.push("/developer/edit");
        return;
      }

      setPassportId(passport.id);

      const { data: projectRows, error: projectsError } =
        await supabase
          .from("developer_projects")
          .select(
            `
            id,
            title,
            description,
            github_url,
            live_url,
            image_url,
            status,
            is_featured,
            started_at,
            completed_at
            `
          )
          .eq("passport_id", passport.id)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false });

      if (projectsError) {
        setErrorMessage(projectsError.message);
        setLoading(false);
        return;
      }

      setProjects(
        (projectRows ?? []) as DeveloperProject[]
      );

      setLoading(false);
    }

    loadProjects();
  }, [router]);

  function updateForm<K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingProjectId(null);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function startEditing(project: DeveloperProject) {
    setEditingProjectId(project.id);

    setForm({
      title: project.title,
      description: project.description ?? "",
      githubUrl: project.github_url ?? "",
      liveUrl: project.live_url ?? "",
      imageUrl: project.image_url ?? "",
      status: project.status,
      isFeatured: project.is_featured,
      startedAt: project.started_at ?? "",
      completedAt: project.completed_at ?? "",
    });

    setErrorMessage("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!passportId) {
      setErrorMessage("Developer Passport not found.");
      return;
    }

    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      setErrorMessage("Project title is required.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const supabase = createClient();

    const projectPayload = {
      passport_id: passportId,
      title: trimmedTitle,
      description: form.description.trim() || null,
      github_url: form.githubUrl.trim() || null,
      live_url: form.liveUrl.trim() || null,
      image_url: form.imageUrl.trim() || null,
      status: form.status,
      is_featured: form.isFeatured,
      started_at: form.startedAt || null,
      completed_at: form.completedAt || null,
      updated_at: new Date().toISOString(),
    };

    if (editingProjectId) {
      const { data, error } = await supabase
        .from("developer_projects")
        .update(projectPayload)
        .eq("id", editingProjectId)
        .select(
          `
          id,
          title,
          description,
          github_url,
          live_url,
          image_url,
          status,
          is_featured,
          started_at,
          completed_at
          `
        )
        .single();

      if (error) {
        setErrorMessage(error.message);
        setSaving(false);
        return;
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProjectId
            ? (data as DeveloperProject)
            : project
        )
      );

      setSuccessMessage("Project updated successfully.");
    } else {
      const { data, error } = await supabase
        .from("developer_projects")
        .insert(projectPayload)
        .select(
          `
          id,
          title,
          description,
          github_url,
          live_url,
          image_url,
          status,
          is_featured,
          started_at,
          completed_at
          `
        )
        .single();

      if (error) {
        setErrorMessage(error.message);
        setSaving(false);
        return;
      }

      setProjects((currentProjects) => [
        data as DeveloperProject,
        ...currentProjects,
      ]);

      setSuccessMessage("Project added successfully.");
    }

    setForm(emptyForm);
    setEditingProjectId(null);
    setSaving(false);
  }

  async function deleteProject(projectId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("developer_projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== projectId
      )
    );

    if (editingProjectId === projectId) {
      resetForm();
    }

    setSuccessMessage("Project deleted.");
  }

  if (loading) {
    return (
      <main>
        <Navbar compact />

        <section className="container passport-editor-loading">
          <p>Loading projects...</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar compact />

      <section className="passport-page">
        <div className="container">
          <div className="passport-page-header">
            <div>
              <p className="section-kicker">
                Developer Passport
              </p>

              <h1>Manage your projects</h1>

              <p>
                Add the work that best demonstrates your
                technical ability.
              </p>
            </div>

            <div className="passport-page-actions">
              <Link
                className="button button-secondary"
                href="/developer"
              >
                Back to passport
              </Link>
            </div>
          </div>

          {errorMessage && (
            <p className="passport-editor-error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="passport-editor-success">
              {successMessage}
            </p>
          )}

          <div className="passport-dashboard">
            <section className="profile-section">
              <div className="profile-section-header">
                <div>
                  <p className="dashboard-kicker">
                    Project details
                  </p>

                  <h2>
                    {editingProjectId
                      ? "Edit project"
                      : "Add project"}
                  </h2>
                </div>
              </div>

              <form
                className="passport-editor-form"
                onSubmit={handleSubmit}
              >
                <label>
                  Project title
                  <input
                    onChange={(event) =>
                      updateForm(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Example: WeRepair"
                    required
                    type="text"
                    value={form.title}
                  />
                </label>

                <label>
                  Description
                  <textarea
                    onChange={(event) =>
                      updateForm(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Explain the project, your contribution and the problem it solves."
                    rows={5}
                    value={form.description}
                  />
                </label>

                <div className="form-grid">
                  <label>
                    GitHub URL
                    <input
                      onChange={(event) =>
                        updateForm(
                          "githubUrl",
                          event.target.value
                        )
                      }
                      placeholder="https://github.com/..."
                      type="url"
                      value={form.githubUrl}
                    />
                  </label>

                  <label>
                    Live project URL
                    <input
                      onChange={(event) =>
                        updateForm(
                          "liveUrl",
                          event.target.value
                        )
                      }
                      placeholder="https://..."
                      type="url"
                      value={form.liveUrl}
                    />
                  </label>
                </div>

                <label>
                  Screenshot image URL
                  <input
                    onChange={(event) =>
                      updateForm(
                        "imageUrl",
                        event.target.value
                      )
                    }
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
                        updateForm(
                          "status",
                          event.target
                            .value as ProjectStatus
                        )
                      }
                      value={form.status}
                    >
                      <option value="planning">
                        Planning
                      </option>

                      <option value="in_progress">
                        In progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="archived">
                        Archived
                      </option>
                    </select>
                  </label>

                  <label>
                    Started date
                    <input
                      onChange={(event) =>
                        updateForm(
                          "startedAt",
                          event.target.value
                        )
                      }
                      type="date"
                      value={form.startedAt}
                    />
                  </label>

                  <label>
                    Completed date
                    <input
                      onChange={(event) =>
                        updateForm(
                          "completedAt",
                          event.target.value
                        )
                      }
                      type="date"
                      value={form.completedAt}
                    />
                  </label>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    checked={form.isFeatured}
                    onChange={(event) =>
                      updateForm(
                        "isFeatured",
                        event.target.checked
                      )
                    }
                    type="checkbox"
                  />

                  Feature this project on my passport
                </label>

                <div className="passport-page-actions">
                  <button
                    className="button"
                    disabled={saving}
                    type="submit"
                  >
                    {saving
                      ? "Saving..."
                      : editingProjectId
                        ? "Update project"
                        : "Add project"}
                  </button>

                  {editingProjectId && (
                    <button
                      className="button button-secondary"
                      onClick={resetForm}
                      type="button"
                    >
                      Cancel editing
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="profile-section">
              <div className="profile-section-header">
                <div>
                  <p className="dashboard-kicker">
                    Selected work
                  </p>

                  <h2>Your projects</h2>
                </div>

                <span>
                  {projects.length}{" "}
                  {projects.length === 1
                    ? "project"
                    : "projects"}
                </span>
              </div>

              {projects.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                >
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      style={{
                        padding: "18px",
                        border:
                          "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "14px",
                        background:
                          "rgba(255, 255, 255, 0.03)",
                      }}
                    >
                      {project.image_url && (
                        <img
                          alt={`${project.title} screenshot`}
                          src={project.image_url}
                          style={{
                            width: "100%",
                            maxHeight: "260px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginBottom: "16px",
                          }}
                        />
                      )}

                      <div className="profile-section-header">
                        <div>
                          <h3>{project.title}</h3>

                          <p className="dashboard-kicker">
                            {formatStatus(project.status)}
                          </p>
                        </div>

                        {project.is_featured && (
                          <span className="verified-badge">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="profile-summary">
                        {project.description ||
                          "No project description added."}
                      </p>

                      <div
                        className="passport-page-actions"
                        style={{
                          marginTop: "16px",
                        }}
                      >
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
                          onClick={() =>
                            startEditing(project)
                          }
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          className="button button-secondary"
                          onClick={() =>
                            deleteProject(project.id)
                          }
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="profile-summary">
                  No projects have been added yet.
                </p>
              )}
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}