"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectForm from "@/features/projects/components/ProjectForm";
import ProjectList from "@/features/projects/components/ProjectList";
import {
  createProject,
  getAuthenticatedPassportId,
  listProjects,
  removeProject,
  updateProject,
} from "@/features/projects/services/projects.service";
import {
  DeveloperProject,
  EMPTY_PROJECT_FORM,
  ProjectFormValues,
} from "@/features/projects/types";

function sortProjects(projects: DeveloperProject[]) {
  return [...projects].sort(
    (a, b) => Number(b.is_featured) - Number(a.is_featured)
  );
}

export default function DeveloperProjectsPage() {
  const router = useRouter();
  const [passportId, setPassportId] = useState<string | null>(null);
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [form, setForm] =
    useState<ProjectFormValues>(EMPTY_PROJECT_FORM);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadPage() {
      try {
        const id = await getAuthenticatedPassportId();

        if (id === null) {
          router.push("/login");
          return;
        }

        if (!id) {
          router.push("/developer/edit");
          return;
        }

        setPassportId(id);
        setProjects(await listProjects(id));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [router]);

  function updateForm<K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clearForm() {
    setForm(EMPTY_PROJECT_FORM);
    setEditingProjectId(null);
  }

  function resetEditor() {
    clearForm();
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateForm() {
    if (!form.title.trim()) return "Project title is required.";
    if (
      form.startedAt &&
      form.completedAt &&
      form.completedAt < form.startedAt
    ) {
      return "Completed date cannot be earlier than the started date.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passportId) {
      setErrorMessage("Developer Passport not found.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingProjectId) {
        const updated = await updateProject(
          editingProjectId,
          passportId,
          form
        );
        setProjects((current) =>
          sortProjects(
            current.map((project) =>
              project.id === editingProjectId ? updated : project
            )
          )
        );
        setSuccessMessage("Project updated successfully.");
      } else {
        const created = await createProject(passportId, form);
        setProjects((current) => sortProjects([created, ...current]));
        setSuccessMessage("Project added successfully.");
      }

      clearForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(projectId: string) {
    if (!passportId || !window.confirm("Delete this project permanently?")) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await removeProject(projectId, passportId);
      setProjects((current) =>
        current.filter((project) => project.id !== projectId)
      );
      if (editingProjectId === projectId) clearForm();
      setSuccessMessage("Project deleted.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete project."
      );
    }
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
              <p className="section-kicker">Developer Passport</p>
              <h1>Manage your projects</h1>
              <p>Add the work that best demonstrates your technical ability.</p>
            </div>
            <div className="passport-page-actions">
              <Link className="button button-secondary" href="/developer">
                Back to passport
              </Link>
            </div>
          </div>

          {errorMessage && (
            <p className="passport-editor-error">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="passport-editor-success">{successMessage}</p>
          )}

          <div className="passport-dashboard">
            <ProjectForm
              form={form}
              isEditing={Boolean(editingProjectId)}
              onCancel={resetEditor}
              onChange={updateForm}
              onSubmit={handleSubmit}
              saving={saving}
            />
            <ProjectList
              onDelete={deleteProject}
              onEdit={startEditing}
              projects={projects}
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
