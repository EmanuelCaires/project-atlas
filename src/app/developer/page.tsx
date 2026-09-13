"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { SkillBadge } from "@/components/ui";
import { listProjects } from "@/features/projects/services/projects.service";
import type { DeveloperProject } from "@/features/projects/types";
import { calculateProfileStrength } from "@/features/evidence/services/profile-strength.service";
import EvidenceTimeline from "@/features/evidence/components/EvidenceTimeline";
import { buildEvidenceTimeline } from "@/features/evidence/services/evidence-timeline.service";

type Profile = {
  display_name: string | null;
  headline: string | null;
  location: string | null;
};

type DeveloperSkill = {
  id: number;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  years_experience: number;
  is_verified: boolean;
  skill: {
    name: string;
    category: string | null;
  };
};

type Passport = {
  id: string;
  bio: string | null;
  years_experience: number | null;
  preferred_role: string | null;
  work_preference: string | null;
  availability:
    | "available_now"
    | "within_2_weeks"
    | "within_1_month"
    | "not_available";
  github_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  identity_verified: boolean;
  github_verified: boolean;
  profile_strength: number;
  is_published: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatAvailability(value: Passport["availability"]) {
  const labels = {
    available_now: "Available now",
    within_2_weeks: "Available within 2 weeks",
    within_1_month: "Available within 1 month",
    not_available: "Not currently available",
  };

  return labels[value] || "Availability not specified";
}

export default function DeveloperPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
  const [developerSkills, setDeveloperSkills] = useState<DeveloperSkill[]>([]);
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDeveloperPassport() {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("display_name, headline, location")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
      }

      const { data: passportData, error: passportError } = await supabase
        .from("developer_passports")
        .select(
          `
          id,
          bio,
          years_experience,
          preferred_role,
          work_preference,
          availability,
          github_url,
          portfolio_url,
          linkedin_url,
          identity_verified,
          github_verified,
          profile_strength,
          is_published
          `,
        )
        .eq("profile_id", user.id)
        .maybeSingle();

      if (passportError) {
        setErrorMessage(passportError.message);
        setLoading(false);
        return;
      }

      if (passportData) {
        const { data: skillRows, error: skillsError } = await supabase
          .from("developer_skills")
          .select(
            `
            id,
            level,
            years_experience,
            is_verified,
            skill:skills (
              name,
              category
            )
            `,
          )
          .eq("passport_id", passportData.id)
          .order("years_experience", { ascending: false });

        if (skillsError) {
          setErrorMessage(skillsError.message);
          setLoading(false);
          return;
        }

        setDeveloperSkills((skillRows ?? []) as unknown as DeveloperSkill[]);

        try {
          setProjects(await listProjects(passportData.id));
        } catch (projectsError) {
          setErrorMessage(
            projectsError instanceof Error
              ? projectsError.message
              : "Unable to load projects.",
          );
          setLoading(false);
          return;
        }
      }

      setProfile(profileData);
      setPassport(passportData);
      setLoading(false);
    }

    loadDeveloperPassport();
  }, [router]);

  if (loading) {
    return (
      <main>
        <Navbar compact />

        <section className="container passport-editor-loading">
          <p>Loading your Developer Passport...</p>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main>
        <Navbar compact />

        <section className="container passport-editor-loading">
          <div>
            <h1>Unable to load your passport</h1>
            <p className="passport-editor-error">{errorMessage}</p>
          </div>
        </section>
      </main>
    );
  }

  if (!passport) {
    return (
      <main>
        <Navbar compact />

        <section className="container passport-editor-loading">
          <div>
            <p className="section-kicker">Developer Passport</p>
            <h1>You have not created your passport yet.</h1>
            <p>
              Add your professional details, availability and portfolio links.
            </p>

            <Link className="button" href="/developer/edit">
              Create Developer Passport
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const displayName = profile?.display_name?.trim() || "Developer";
  const role =
    profile?.headline?.trim() || passport.preferred_role?.trim() || "Add your professional headline";
  const profileStrength = calculateProfileStrength({
    displayName: profile?.display_name ?? null,
    headline: profile?.headline ?? null,
    location: profile?.location ?? null,
    bio: passport.bio,
    yearsExperience: passport.years_experience,
    preferredRole: passport.preferred_role,
    workPreference: passport.work_preference,
    githubUrl: passport.github_url,
    portfolioUrl: passport.portfolio_url,
    linkedinUrl: passport.linkedin_url,
    skillsCount: developerSkills.length,
    projectsCount: projects.length,
  });

  return (
    <main>
      <Navbar compact />

      <section className="passport-page better-passport">
        <div className="container">
          <div className="passport-page-header">
            <div>
              <p className="section-kicker">Developer Passport</p>
              <h1>{displayName}</h1>
              <p className="profile-summary">{role}</p>
            </div>

            <Link className="button button-secondary" href="/dashboard">
              Back to dashboard
            </Link>

            <div className="passport-page-actions">
              <Link className="button" href="/developer/edit">
                Edit passport
              </Link>
            </div>
          </div>

          <div className="passport-dashboard">
            <aside className="developer-sidebar">
              <div className="large-profile-avatar">
                {getInitials(displayName)}
              </div>

              <h2>{displayName}</h2>
              <p>{role}</p>
              <span>{profile?.location?.trim() || "Location not added"}</span>

              <div className="availability-badge">
                {formatAvailability(passport.availability)}
              </div>

              <div className="sidebar-details">
                <div>
                  <span>Experience</span>
                  <strong>
                    {passport.years_experience == null
                      ? "Not added"
                      : `${passport.years_experience} years`}
                  </strong>
                </div>

                <div>
                  <span>Preferred role</span>
                  <strong>{passport.preferred_role?.trim() || "Not specified"}</strong>
                </div>

                <div>
                  <span>Work preference</span>
                  <strong>{passport.work_preference?.trim() || "Not specified"}</strong>
                </div>

                <div>
                  <span>Publishing preference</span>
                  <strong>
                    {passport.is_published ? "Enabled" : "Private"}
                  </strong>
                </div>
              </div>

              <p className="profile-summary">Public Passport sharing is not available yet.</p>

              <Link className="button form-button" href="/developer/edit">
                Update profile
              </Link>
            </aside>

            <div className="passport-main-column">
              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Professional introduction · Self-reported</p>
                    <h2>About</h2>
                  </div>

                  {passport.identity_verified ? (
                    <span className="verified-badge">Identity verified</span>
                  ) : null}
                </div>

                <p className="profile-summary">
                  {passport.bio?.trim() ||
                    "No professional biography has been added yet."}
                </p>
              </section>

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Provided by the developer</p>
                    <h2>Profile links</h2>
                  </div>
                </div>

                <div className="passport-link-list">
                  {passport.github_url ? (
                    <a
                      className="button button-secondary"
                      href={passport.github_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View GitHub
                    </a>
                  ) : (
                    <span>GitHub URL not added</span>
                  )}

                  {passport.portfolio_url ? (
                    <a
                      className="button button-secondary"
                      href={passport.portfolio_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View portfolio
                    </a>
                  ) : (
                    <span>Portfolio URL not added</span>
                  )}

                  {passport.linkedin_url ? (
                    <a
                      className="button button-secondary"
                      href={passport.linkedin_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View LinkedIn
                    </a>
                  ) : (
                    <span>LinkedIn URL not added</span>
                  )}
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Self-reported capabilities</p>
                    <h2>Skills &amp; experience</h2>
                  </div>

                  <Link
                    className="button button-secondary"
                    href="/developer/skills"
                  >
                    Manage skills
                  </Link>
                </div>

                {developerSkills.length > 0 ? (
                  <div className="passport-skill-list">
                    <p className="profile-summary">Listed by reported years of experience. See project-linked skills in the work below.</p>
                    {developerSkills.map((developerSkill) => (
                      <div key={developerSkill.id} className="passport-skill-row">
                        <SkillBadge name={developerSkill.skill.name} />
                        <span>
                          {developerSkill.level}
                          {developerSkill.years_experience > 0
                            ? ` · ${developerSkill.years_experience}y`
                            : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="profile-summary">
                      No skills have been added yet. Add your strongest skills
                      to strengthen your Developer Passport.
                    </p>
                    <Link className="button" href="/developer/skills">
                      Add skills
                    </Link>
                  </div>
                )}
              </section>
              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Selected work</p>
                    <h2>Project evidence</h2>
                  </div>

                  <Link
                    className="button button-secondary"
                    href="/developer/projects"
                  >
                    Manage projects
                  </Link>
                </div>

                {projects.length > 0 ? (
                  <div className="passport-project-list">
                    <p className="profile-summary">
                      Featured work first, then newest projects. Skills are linked
                      by the developer. Repository confirmation checks that a
                      repository exists on GitHub; it does not verify ownership
                      or contribution. Scores reflect recorded evidence fields.
                    </p>
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} readOnly />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="profile-summary">
                      No projects have been added yet. Add work that
                      demonstrates your technical ability.
                    </p>
                    <Link className="button" href="/developer/projects">
                      Add projects
                    </Link>
                  </div>
                )}
              </section>
              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Professional progress</p>
                    <h2>Passport completion · {profileStrength}%</h2>
                  </div>
                </div>
                <p className="profile-summary">
                  Completion tracks profile details, links, skills and projects.
                  It is separate from project evidence scores and does not verify capability.
                </p>
                <progress
                  className="passport-completion"
                  value={profileStrength}
                  max={100}
                  aria-label="Passport completion"
                >
                  {profileStrength}%
                </progress>
                <details className="evidence-breakdown">
                  <summary>How completion is calculated</summary>
                  <p className="profile-summary">
                    Name, headline, bio, preferred role and GitHub link: 10 points each.
                    Location, experience above zero, work preference, portfolio and LinkedIn:
                    5 each. Listed skills: 3 each, up to 10. Projects: 5 each, up to 15.
                    Complete missing details and connect relevant work to build your Passport.
                  </p>
                </details>
                <p className="dashboard-kicker">Next step</p>
                <p className="profile-summary">
                  {projects.length === 0
                    ? "Add a project that shows what you can build."
                    : "Strengthen your selected work with a clear contribution, linked skills and supporting evidence."}
                </p>
                <Link className="button button-secondary" href="/developer/projects">
                  {projects.length === 0 ? "Add your first project" : "Improve project evidence"}
                </Link>
              </section>
              <EvidenceTimeline events={buildEvidenceTimeline(projects)} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
