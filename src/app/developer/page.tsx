"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import {
  Badge,
  Button,
  Card,
  SectionHeader,
} from "@/components/ui";

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

export default function DeveloperPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
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
  <Button
    onClick={() =>
      navigator.clipboard.writeText(window.location.href)
    }
    type="button"
    variant="secondary"
  >
    Share profile
  </Button>

  <Button href="/developer/edit">
    Edit passport
  </Button>
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
                  <strong>
                    {passport.years_experience ?? 0} years
                  </strong>
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
                    <p className="dashboard-kicker">Atlas profile summary</p>
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
                  {passport.bio || "No professional biography has been added yet."}
                </p>

                <div className="score-summary-grid">
                  <div>
                    <span>Profile strength</span>
                    <strong>{passport.profile_strength}%</strong>
                  </div>

                  <div>
                    <span>GitHub evidence</span>
                    <strong>
                      {passport.github_verified ? "Verified" : "Not verified"}
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
                    <p className="dashboard-kicker">Professional evidence</p>
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

              <Card elevated>
  <SectionHeader
    action={
      <Button
        href="/developer/skills"
        size="small"
        variant="secondary"
      >
        Manage skills
      </Button>
    }
    description="Add your technical capabilities, proficiency levels and professional experience."
    eyebrow="Technical evidence"
    title="Skills"
  />

  <div className="passport-link-list">
    <Badge variant="neutral">No skills added yet</Badge>
  </div>
</Card>

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Selected work</p>
                    <h2>Projects</h2>
                  </div>
                </div>

                <p className="profile-summary">
                  Project management will be connected in the next development
                  stage.
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
