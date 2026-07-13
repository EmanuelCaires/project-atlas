"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type Availability =
  | "available_now"
  | "within_2_weeks"
  | "within_1_month"
  | "not_available";

type PassportForm = {
  bio: string;
  years_experience: string;
  preferred_role: string;
  work_preference: string;
  availability: Availability;
  github_url: string;
  portfolio_url: string;
  linkedin_url: string;
  is_published: boolean;
};

const initialForm: PassportForm = {
  bio: "",
  years_experience: "0",
  preferred_role: "",
  work_preference: "",
  availability: "not_available",
  github_url: "",
  portfolio_url: "",
  linkedin_url: "",
  is_published: false,
};

function createSlug(value: string) {
  const baseSlug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseSlug || "developer";
}

export default function EditDeveloperPassportPage() {
  const router = useRouter();

  const [form, setForm] = useState<PassportForm>(initialForm);
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [passportId, setPassportId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPassport() {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
      }

      setDisplayName(profile.display_name || "Developer");

      const { data: passport, error: passportError } = await supabase
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

      if (passport) {
        setPassportId(passport.id);

        setForm({
          bio: passport.bio ?? "",
          years_experience: String(passport.years_experience ?? 0),
          preferred_role: passport.preferred_role ?? "",
          work_preference: passport.work_preference ?? "",
          availability:
            (passport.availability as Availability) ?? "not_available",
          github_url: passport.github_url ?? "",
          portfolio_url: passport.portfolio_url ?? "",
          linkedin_url: passport.linkedin_url ?? "",
          is_published: passport.is_published ?? false,
        });
      }

      setLoading(false);
    }

    loadPassport();
  }, [router]);

  function updateField<K extends keyof PassportForm>(
    field: K,
    value: PassportForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const supabase = createClient();

    const payload = {
      profile_id: userId,
      slug: createSlug(displayName),
      bio: form.bio.trim() || null,
      years_experience: Number(form.years_experience) || 0,
      preferred_role: form.preferred_role.trim() || null,
      work_preference: form.work_preference.trim() || null,
      availability: form.availability,
      github_url: form.github_url.trim() || null,
      portfolio_url: form.portfolio_url.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      is_published: form.is_published,
    };

    let error;

    if (passportId) {
      const result = await supabase
        .from("developer_passports")
        .update(payload)
        .eq("id", passportId);

      error = result.error;
    } else {
      const result = await supabase
        .from("developer_passports")
        .insert(payload)
        .select("id")
        .single();

      error = result.error;

      if (result.data) {
        setPassportId(result.data.id);
      }
    }

    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Developer Passport saved successfully.");
  }

  if (loading) {
    return (
      <main className="auth-page">
        <Navbar compact />
        <section className="container passport-editor-loading">
          <p>Loading your Developer Passport...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <Navbar compact />

      <section className="container passport-editor-page">
        <div className="passport-editor-header">
          <div>
            <p className="section-kicker">Developer Passport</p>
            <h1>Edit your professional profile.</h1>
            <p>
              Add the information employers will use to discover and evaluate
              your experience.
            </p>
          </div>

          <Link className="button button-secondary" href="/developer">
            View passport
          </Link>
        </div>

        <form className="passport-editor-form" onSubmit={handleSave}>
          <section className="profile-section">
            <div className="profile-section-header">
              <div>
                <p className="dashboard-kicker">Professional overview</p>
                <h2>About you</h2>
              </div>
            </div>

            <div className="editor-fields">
              <label className="editor-full-field">
                Professional biography
                <textarea
                  maxLength={1000}
                  onChange={(event) => updateField("bio", event.target.value)}
                  placeholder="Describe your technical experience, strengths and the type of work you enjoy."
                  rows={7}
                  value={form.bio}
                />
              </label>

              <label>
                Years of experience
                <input
                  min="0"
                  onChange={(event) =>
                    updateField("years_experience", event.target.value)
                  }
                  step="0.5"
                  type="number"
                  value={form.years_experience}
                />
              </label>

              <label>
                Preferred role
                <input
                  onChange={(event) =>
                    updateField("preferred_role", event.target.value)
                  }
                  placeholder="Junior Full-Stack Developer"
                  type="text"
                  value={form.preferred_role}
                />
              </label>

              <label>
                Work preference
                <select
                  onChange={(event) =>
                    updateField("work_preference", event.target.value)
                  }
                  value={form.work_preference}
                >
                  <option value="">Select preference</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote / Hybrid">Remote / Hybrid</option>
                </select>
              </label>

              <label>
                Availability
                <select
                  onChange={(event) =>
                    updateField(
                      "availability",
                      event.target.value as Availability
                    )
                  }
                  value={form.availability}
                >
                  <option value="available_now">Available now</option>
                  <option value="within_2_weeks">Within two weeks</option>
                  <option value="within_1_month">Within one month</option>
                  <option value="not_available">Not currently available</option>
                </select>
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <div>
                <p className="dashboard-kicker">Evidence and links</p>
                <h2>Professional links</h2>
              </div>
            </div>

            <div className="editor-fields">
              <label className="editor-full-field">
                GitHub URL
                <input
                  onChange={(event) =>
                    updateField("github_url", event.target.value)
                  }
                  placeholder="https://github.com/yourusername"
                  type="url"
                  value={form.github_url}
                />
              </label>

              <label className="editor-full-field">
                Portfolio URL
                <input
                  onChange={(event) =>
                    updateField("portfolio_url", event.target.value)
                  }
                  placeholder="https://yourportfolio.com"
                  type="url"
                  value={form.portfolio_url}
                />
              </label>

              <label className="editor-full-field">
                LinkedIn URL
                <input
                  onChange={(event) =>
                    updateField("linkedin_url", event.target.value)
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                  type="url"
                  value={form.linkedin_url}
                />
              </label>
            </div>
          </section>

          <section className="profile-section">
            <label className="passport-publish-option">
              <input
                checked={form.is_published}
                onChange={(event) =>
                  updateField("is_published", event.target.checked)
                }
                type="checkbox"
              />

              <span>
                <strong>Publish my Developer Passport</strong>
                <small>
                  Published passports can be displayed to employers and public
                  visitors.
                </small>
              </span>
            </label>
          </section>

          {errorMessage && (
            <p className="passport-editor-error">{errorMessage}</p>
          )}

          {message && <p className="passport-editor-success">{message}</p>}

          <div className="passport-editor-actions">
            <button className="button" disabled={saving} type="submit">
              {saving ? "Saving..." : "Save Developer Passport"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
