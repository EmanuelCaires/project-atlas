"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  display_name: string | null;
  headline: string | null;
  location: string | null;
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

type SkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

type DeveloperSkill = {
  skillId: number;
  name: string;
  category: string | null;
  level: SkillLevel;
  yearsExperience: number;
  isVerified: boolean;
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

  return labels[value];
}

function formatSkillLevel(level: SkillLevel) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export default function DeveloperPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
  const [developerSkills, setDeveloperSkills] = useState<DeveloperSkill[]>([]);
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
          `
        )
        .eq("profile_id", user.id)
        .maybeSingle();

      if (passportError) {
        setErrorMessage(passportError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setPassport(passportData);

      if (passportData) {
        const {
          data: developerSkillRows,
          error: developerSkillsError,
        } = await supabase
          .from("developer_skills")
          .select(
            "skill_id, level, years_experience, is_verified"
          )
          .eq("passport_id", passportData.id)
          .order("years_experience", { ascending: false });

        if (developerSkillsError) {
          setErrorMessage(developerSkillsError.message);
          setLoading(false);
          return;
        }

        const skillIds = (developerSkillRows ?? []).map(
          (row) => row.skill_id
        );

        if (skillIds.length > 0) {
          const { data: skillRows, error: skillsError } = await supabase
            .from("skills")
            .select("id, name, category")
            .in("id", skillIds);

          if (skillsError) {
            setErrorMessage(skillsError.message);
            setLoading(false);
            return;
          }

          const skillMap = new Map(
            (skillRows ?? []).map((skill) => [skill.id, skill])
          );

          const loadedDeveloperSkills: DeveloperSkill[] = (
            developerSkillRows ?? []
          )
            .map((row) => {
              const skill = skillMap.get(row.skill_id);

              if (!skill) {
                return null;
              }

              return {
                skillId: row.skill_id,
                name: skill.name,
                category: skill.category,
                level: row.level as SkillLevel,
                yearsExperience: Number(row.years_experience ?? 0),
                isVerified: row.is_verified ?? false,
              };
            })
            .filter(
              (skill): skill is DeveloperSkill => skill !== null
            );

          setDeveloperSkills(loadedDeveloperSkills);
        }
      }

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

  const displayName = profile?.display_name || "Developer";
  const role =
    passport.preferred_role ||
    profile?.headline ||
    "Software Developer";

  return (
    <main>
      <Navbar compact />

      <section className="passport-page">
        <div className="container">
          <div className="passport-page-header">
            <div>
              <p className="section-kicker">Developer Passport</p>
              <h1>Professional evidence in one verified profile.</h1>
            </div>

            <div className="passport-page-actions">
              <button
                className="button button-secondary"
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                type="button"
              >
                Share profile
              </button>

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
              <span>{profile?.location || "Location not added"}</span>

              <div className="availability-badge">
                <span className="status-dot" />
                {formatAvailability(passport.availability)}
              </div>

              <div className="sidebar-details">
                <div>
                  <span>Experience</span>
                  <strong>{passport.years_experience ?? 0} years</strong>
                </div>

                <div>
                  <span>Preferred role</span>
                  <strong>{role}</strong>
                </div>

                <div>
                  <span>Work preference</span>
                  <strong>
                    {passport.work_preference || "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>Profile status</span>
                  <strong>
                    {passport.is_published ? "Published" : "Private"}
                  </strong>
                </div>
              </div>

              <Link className="button form-button" href="/developer/edit">
                Update profile
              </Link>
            </aside>

            <div className="passport-main-column">
              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">
                      Atlas profile summary
                    </p>
                    <h2>Developer overview</h2>
                  </div>

                  {passport.identity_verified ? (
                    <span className="verified-badge">
                      Identity verified
                    </span>
                  ) : (
                    <span className="verified-badge">
                      Verification pending
                    </span>
                  )}
                </div>

                <p className="profile-summary">
                  {passport.bio ||
                    "No professional biography has been added yet."}
                </p>

                <div className="score-summary-grid">
                  <div>
                    <span>Profile strength</span>
                    <strong>{passport.profile_strength}%</strong>
                  </div>

                  <div>
                    <span>GitHub evidence</span>
                    <strong>
                      {passport.github_verified
                        ? "Verified"
                        : "Not verified"}
                    </strong>
                  </div>

                  <div>
                    <span>Visibility</span>
                    <strong>
                      {passport.is_published ? "Public" : "Private"}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">
                      Professional evidence
                    </p>
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
                    <p className="dashboard-kicker">
                      Technical evidence
                    </p>
                    <h2>Skills</h2>
                  </div>

                  <Link
                    className="button button-secondary"
                    href="/developer/skills"
                  >
                    Manage skills
                  </Link>
                </div>

                {developerSkills.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(190px, 1fr))",
                    }}
                  >
                    {developerSkills.map((skill) => (
                      <div
                        key={skill.skillId}
                        style={{
                          padding: "14px",
                          border:
                            "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "12px",
                          background:
                            "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                          }}
                        >
                          <strong>{skill.name}</strong>

                          {skill.isVerified && (
                            <span className="verified-badge">
                              Verified
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginTop: "10px",
                          }}
                        >
                          <span
                            style={{
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "rgba(59, 130, 246, 0.14)",
                              fontSize: ".82rem",
                            }}
                          >
                            {formatSkillLevel(skill.level)}
                          </span>

                          <span
                            style={{
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background:
                                "rgba(255, 255, 255, 0.07)",
                              fontSize: ".82rem",
                            }}
                          >
                            {skill.yearsExperience}{" "}
                            {skill.yearsExperience === 1
                              ? "year"
                              : "years"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="profile-summary">
                      No technical skills have been added yet.
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
                    <h2>Projects</h2>
                  </div>
                </div>

                <p className="profile-summary">
                  Project management will be connected in the next
                  development stage.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}