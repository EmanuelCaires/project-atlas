import { createClient } from "@/lib/supabase/client";
import type {
  DeveloperProject,
  DeveloperSkill,
  ProjectFormValues,
} from "../types";

const PROJECT_COLUMNS = `
  id,
  title,
  description,
  github_url,
  live_url,
  image_url,
  status,
  is_featured,
  started_at,
  completed_at,
  github_verified,
  github_verified_at,
  github_repository_name,
  github_language,
  github_stars,
  github_forks,
  project_skills (
    skills (
      id,
      name,
      category
    )
  )
`;

function toProjectPayload(passportId: string, form: ProjectFormValues) {
  return {
    passport_id: passportId,
    title: form.title.trim(),
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
}

function mapProjectWithSkills(project: {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  status: DeveloperProject["status"];
  is_featured: boolean;
  started_at: string | null;
  completed_at: string | null;
  project_skills?: Array<{
    skills:
      | {
          id: number;
          name: string;
          category: string | null;
        }
      | Array<{
          id: number;
          name: string;
          category: string | null;
        }>
      | null;
  }>;
}): DeveloperProject {
  const skills = (project.project_skills ?? [])
    .flatMap((row) => {
      if (!row.skills) return [];
      return Array.isArray(row.skills) ? row.skills : [row.skills];
    })
    .filter((skill): skill is DeveloperSkill => Boolean(skill));

  return {
  id: project.id,
  title: project.title,
  description: project.description,

  github_url: project.github_url,
  github_verified: project.github_verified ?? false,
  github_verified_at: project.github_verified_at ?? null,
  github_repository_name: project.github_repository_name ?? null,
  github_language: project.github_language ?? null,
  github_stars: project.github_stars ?? 0,
  github_forks: project.github_forks ?? 0,

  live_url: project.live_url,
  image_url: project.image_url,

  status: project.status,
  is_featured: project.is_featured,
  started_at: project.started_at,
  completed_at: project.completed_at,

  skills,
};
}

export async function getAuthenticatedPassportId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return null;
  }

  const { data: passport, error: passportError } = await supabase
    .from("developer_passports")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (passportError) {
    throw new Error(passportError.message);
  }

  return passport?.id ?? "";
}

export async function listProjects(
  passportId: string,
): Promise<DeveloperProject[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("developer_projects")
    .select(PROJECT_COLUMNS)
    .eq("passport_id", passportId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapProjectWithSkills);
}

export async function listDeveloperSkills(
  passportId: string,
): Promise<DeveloperSkill[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("developer_skills")
    .select(`
  id,
  level,
  years_experience,
  is_verified,
  skill:skills (
    id,
    name,
    category
  )
`)

    .eq("passport_id", passportId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((row) => {
      const skill = Array.isArray(row.skills) ? row.skills[0] : row.skills;

      return skill;
    })
    .filter((skill): skill is DeveloperSkill => Boolean(skill));
}

export async function listProjectSkillIds(
  projectId: string,
): Promise<number[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("project_skills")
    .select("skill_id")
    .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.skill_id);
}

export async function replaceProjectSkills(
  projectId: string,
  skillIds: number[],
): Promise<void> {
  const supabase = createClient();

  const { error: deleteError } = await supabase
    .from("project_skills")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (skillIds.length === 0) {
    return;
  }

  const rows = skillIds.map((skillId) => ({
    project_id: projectId,
    skill_id: skillId,
  }));

  const { error: insertError } = await supabase
    .from("project_skills")
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }
}
export async function createProject(
  passportId: string,
  form: ProjectFormValues,
): Promise<DeveloperProject> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("developer_projects")
    .insert(toProjectPayload(passportId, form))
    .select(PROJECT_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProjectWithSkills(data);
}

export async function updateProject(
  projectId: string,
  passportId: string,
  form: ProjectFormValues,
): Promise<DeveloperProject> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("developer_projects")
    .update(toProjectPayload(passportId, form))
    .eq("id", projectId)
    .eq("passport_id", passportId)
    .select(PROJECT_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DeveloperProject;
}

export async function removeProject(
  projectId: string,
  passportId: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("developer_projects")
    .delete()
    .eq("id", projectId)
    .eq("passport_id", passportId);

  if (error) {
    throw new Error(error.message);
  }
}
