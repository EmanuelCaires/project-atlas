"use client";

import { getNextRecommendation } from "@/features/recommendations/services/recommendation.service";
import TodayMission from "@/components/missions/TodayMission";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { StatCard } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  display_name: string | null;
  headline: string | null;
};

type Passport = {
  id: string;
  profile_strength: number;
  is_published: boolean;
  github_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
};

type DashboardProject = {
  id: string;
  title: string;
  status: "planning" | "in_progress" | "completed" | "archived";
  is_featured: boolean;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  created_at: string;
};

type DashboardStats = {
  totalProjects: number;
  totalSkills: number;
  featuredProjects: number;
  completedProjects: number;
};

const EMPTY_STATS: DashboardStats = {
  totalProjects: 0,
  totalSkills: 0,
  featuredProjects: 0,
  completedProjects: 0,
};

function formatProjectStatus(status: DashboardProject["status"]) {
  const labels: Record<DashboardProject["status"], string> = {
    planning: "Planning",
    in_progress: "In progress",
    completed: "Completed",
    archived: "Archived",
  };

  return labels[status];
}

export default function DeveloperDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [latestProjects, setLatestProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error(userError.message);
        }

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, headline")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw new Error(profileError.message);
        }

        const { data: passportData, error: passportError } = await supabase
          .from("developer_passports")
          .select(
            `
            id,
            profile_strength,
            is_published,
            github_url,
            portfolio_url,
            linkedin_url
            `,
          )
          .eq("profile_id", user.id)
          .maybeSingle();

        if (passportError) {
          throw new Error(passportError.message);
        }

        if (!passportData) {
          router.push("/developer/edit");
          return;
        }

        const [
          projectsResult,
          skillsResult,
          featuredResult,
          completedResult,
          latestProjectsResult,
        ] = await Promise.all([
          supabase
            .from("developer_projects")
            .select("*", { count: "exact", head: true })
            .eq("passport_id", passportData.id),

          supabase
            .from("developer_skills")
            .select("*", { count: "exact", head: true })
            .eq("passport_id", passportData.id),

          supabase
            .from("developer_projects")
            .select("*", { count: "exact", head: true })
            .eq("passport_id", passportData.id)
            .eq("is_featured", true),

          supabase
            .from("developer_projects")
            .select("*", { count: "exact", head: true })
            .eq("passport_id", passportData.id)
            .eq("status", "completed"),

          supabase
            .from("developer_projects")
            .select(
              "id, title, status, is_featured, github_url, live_url, image_url, created_at",
            )
            .eq("passport_id", passportData.id)
            .order("created_at", { ascending: false }),
        ]);

        const queryError =
          projectsResult.error ||
          skillsResult.error ||
          featuredResult.error ||
          completedResult.error ||
          latestProjectsResult.error;

        if (queryError) {
          throw new Error(queryError.message);
        }

        setProfile(profileData);
        setPassport(passportData);
        setStats({
          totalProjects: projectsResult.count ?? 0,
          totalSkills: skillsResult.count ?? 0,
          featuredProjects: featuredResult.count ?? 0,
          completedProjects: completedResult.count ?? 0,
        });
        setLatestProjects(
          (latestProjectsResult.data ?? []) as DashboardProject[],
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [router]);

  const nextActions = useMemo(() => {
    if (!passport) {
      return [];
    }

    const actions: string[] = [];

    if (stats.totalProjects === 0) {
      actions.push("Add your first project");
    }

    if (stats.totalSkills === 0) {
      actions.push("Add your professional skills");
    }

    if (!passport.github_url) {
      actions.push("Connect your GitHub profile");
    }

    if (!passport.portfolio_url) {
      actions.push("Add your portfolio URL");
    }

    if (!passport.linkedin_url) {
      actions.push("Add your LinkedIn profile");
    }

    if (!passport.is_published) {
      actions.push("Publish your Developer Passport");
    }

    return actions.slice(0, 3);
  }, [passport, stats]);

  if (loading) {
    return (
      <main>
        <Navbar compact />

        <section className="container passport-editor-loading">
          <p>Loading your dashboard...</p>
        </section>
      </main>
    );
  }

  if (errorMessage || !passport) {
    return (
      <main>
        <Navbar compact />

        <section className="container passport-editor-loading">
          <div>
            <p className="section-kicker">Atlas Dashboard</p>
            <h1>Unable to load your dashboard</h1>
            <p className="passport-editor-error">
              {errorMessage || "Developer Passport not found."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const displayName = profile?.display_name || "Developer";

  const recommendation = getNextRecommendation({
    totalProjects: latestProjects.length,

    completedProjects: latestProjects.filter(
      (project) => project.status === "completed",
    ).length,

    featuredProjects: latestProjects.filter((project) => project.is_featured)
      .length,

    githubProjects: latestProjects.filter((project) =>
      Boolean(project.github_url),
    ).length,

    liveProjects: latestProjects.filter((project) => Boolean(project.live_url))
      .length,

    screenshotProjects: latestProjects.filter((project) =>
      Boolean(project.image_url),
    ).length,
  });
  return (
    <main className="dashboard-page">
      <Navbar compact />

      <section className="passport-page">
        <div className="container">
          <div className="passport-page-header">
            <div>
              <p className="section-kicker">Evidence Dashboard</p>
              <h1>Welcome back, {displayName}.</h1>
              <p>
                Track the evidence behind your professional identity and see
                what to strengthen next.
              </p>
            </div>

            <TodayMission
              title={recommendation.title}
              description={recommendation.description}
              impact={recommendation.impact}
              estimatedMinutes={recommendation.estimatedMinutes}
            />

            <div className="passport-page-actions">
              <Link className="button button-secondary" href="/developer">
                View passport
              </Link>

              <Link className="button" href="/developer/projects">
                Add project
              </Link>
            </div>
          </div>

          <div className="dashboard-stat-grid">
            <StatCard
              title="Projects"
              value={stats.totalProjects}
              subtitle="Professional work added"
            />

            <StatCard
              title="Skills"
              value={stats.totalSkills}
              subtitle="Capabilities documented"
            />

            <StatCard
              title="Featured projects"
              value={stats.featuredProjects}
              subtitle="Highlighted on your Passport"
            />

            <StatCard
              title="Completed projects"
              value={stats.completedProjects}
              subtitle="Delivered project evidence"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              marginTop: 28,
            }}
          >
            <section className="profile-section">
              <div className="profile-section-header">
                <div>
                  <p className="dashboard-kicker">Passport progress</p>
                  <h2>{passport.profile_strength}% complete</h2>
                </div>

                <span className="verified-badge">
                  {passport.is_published ? "Published" : "Private"}
                </span>
              </div>

              <div
                aria-label={`Passport completion: ${passport.profile_strength}%`}
                style={{
                  width: "100%",
                  height: 12,
                  overflow: "hidden",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.1)",
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      Math.max(passport.profile_strength, 0),
                      100,
                    )}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #8b5cf6, #4f46e5)",
                    transition: "width 300ms ease",
                  }}
                />
              </div>

              {nextActions.length > 0 ? (
                <div style={{ marginTop: 22 }}>
                  <p className="dashboard-kicker">Recommended next steps</p>

                  <ul
                    style={{
                      display: "grid",
                      gap: 10,
                      marginTop: 12,
                      paddingLeft: 20,
                    }}
                  >
                    {nextActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="profile-summary" style={{ marginTop: 20 }}>
                  Your Passport foundation is complete. Continue adding strong,
                  relevant evidence.
                </p>
              )}

              <div className="passport-page-actions" style={{ marginTop: 20 }}>
                <Link
                  className="button button-secondary"
                  href="/developer/edit"
                >
                  Edit passport
                </Link>
              </div>
            </section>

            <section className="profile-section">
              <div className="profile-section-header">
                <div>
                  <p className="dashboard-kicker">Quick actions</p>
                  <h2>Continue building your evidence</h2>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                <Link className="button" href="/developer/projects">
                  Add or manage projects
                </Link>

                <Link
                  className="button button-secondary"
                  href="/developer/skills"
                >
                  Add or manage skills
                </Link>

                <Link
                  className="button button-secondary"
                  href="/developer/edit"
                >
                  Update professional details
                </Link>
              </div>
            </section>
          </div>

          <section className="profile-section" style={{ marginTop: 24 }}>
            <div className="profile-section-header">
              <div>
                <p className="dashboard-kicker">Recent evidence</p>
                <h2>Latest projects</h2>
              </div>

              <Link href="/developer/projects">View all projects →</Link>
            </div>

            {latestProjects.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                  gap: 16,
                  marginTop: 20,
                }}
              >
                {latestProjects.slice(0, 3).map((project) => (
                  <article
                    key={project.id}
                    style={{
                      padding: 18,
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 14,
                      background: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <div className="profile-section-header">
                      <div>
                        <h3>{project.title}</h3>
                        <p className="dashboard-kicker">
                          {formatProjectStatus(project.status)}
                        </p>
                      </div>

                      {project.is_featured && (
                        <span className="verified-badge">Featured</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 20 }}>
                <p className="profile-summary">
                  You have not added any project evidence yet.
                </p>

                <Link className="button" href="/developer/projects">
                  Add your first project
                </Link>
              </div>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
