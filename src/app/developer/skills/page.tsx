"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { Button, Card, SectionHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type Skill = {
  id: number;
  name: string;
  category: string | null;
};

type SkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

type SelectedSkill = {
  skillId: number;
  level: SkillLevel;
  years: number;
};

export default function SkillsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  const [passportId, setPassportId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkillsPage() {
      const supabase = createClient();

      try {
        setError("");

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
          throw new Error(passportError.message);
        }

        if (!passport) {
          throw new Error(
            "Your Developer Passport does not exist yet. Create it before adding skills."
          );
        }

        setPassportId(passport.id);

        const { data: availableSkills, error: skillsError } = await supabase
          .from("skills")
          .select("id, name, category")
          .order("name");

        if (skillsError) {
          throw new Error(skillsError.message);
        }

        setSkills(availableSkills ?? []);

        const {
          data: existingDeveloperSkills,
          error: developerSkillsError,
        } = await supabase
          .from("developer_skills")
          .select("skill_id, level, years_experience")
          .eq("passport_id", passport.id);

        if (developerSkillsError) {
          throw new Error(developerSkillsError.message);
        }

        const loadedSkills: SelectedSkill[] = (
          existingDeveloperSkills ?? []
        ).map((item) => ({
          skillId: item.skill_id,
          level: item.level as SkillLevel,
          years: Number(item.years_experience ?? 0),
        }));

        setSelectedSkills(loadedSkills);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while loading your skills."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkillsPage();
  }, [router]);

  const toggleSkill = (skillId: number) => {
    setSelectedSkills((current) => {
      const isSelected = current.some(
        (selectedSkill) => selectedSkill.skillId === skillId
      );

      if (isSelected) {
        return current.filter(
          (selectedSkill) => selectedSkill.skillId !== skillId
        );
      }

      return [
        ...current,
        {
          skillId,
          level: "beginner",
          years: 0,
        },
      ];
    });
  };

  const updateSkillLevel = (
    skillId: number,
    level: SkillLevel
  ) => {
    setSelectedSkills((current) =>
      current.map((selectedSkill) =>
        selectedSkill.skillId === skillId
          ? {
              ...selectedSkill,
              level,
            }
          : selectedSkill
      )
    );
  };

  const updateSkillYears = (
    skillId: number,
    years: number
  ) => {
    const safeYears = Number.isNaN(years)
      ? 0
      : Math.max(0, Math.min(years, 50));

    setSelectedSkills((current) =>
      current.map((selectedSkill) =>
        selectedSkill.skillId === skillId
          ? {
              ...selectedSkill,
              years: safeYears,
            }
          : selectedSkill
      )
    );
  };

  const getSkillById = (skillId: number) => {
    return skills.find((skill) => skill.id === skillId);
  };

  const saveSkills = async () => {
    if (!passportId) {
      setError("Your Developer Passport could not be identified.");
      return;
    }

    const supabase = createClient();

    try {
      setSaving(true);
      setError("");

      const { error: deleteError } = await supabase
        .from("developer_skills")
        .delete()
        .eq("passport_id", passportId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      if (selectedSkills.length > 0) {
        const rowsToSave = selectedSkills.map((selectedSkill) => ({
          passport_id: passportId,
          skill_id: selectedSkill.skillId,
          level: selectedSkill.level,
          years_experience: selectedSkill.years,
          score: 0,
          is_verified: false,
        }));

        const { error: insertError } = await supabase
          .from("developer_skills")
          .insert(rowsToSave);

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      router.push("/developer");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Your skills could not be saved."
      );

      setSaving(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: "#111827",
    color: "#ffffff",
  };

  return (
    <main>
      <Navbar compact />

      <section
        className="container"
        style={{
          padding: "3rem 0",
        }}
      >
        <Card elevated>
          <SectionHeader
            eyebrow="Developer Passport"
            title="Skills Management"
            description="Select your skills and add your proficiency level and practical experience."
            action={
              <Button href="/developer" variant="secondary">
                Back to Passport
              </Button>
            }
          />

          <p
            style={{
              marginBottom: "1.5rem",
            }}
          >
            Selected skills:{" "}
            <strong>{selectedSkills.length}</strong>
          </p>

          {loading && <p>Loading skills...</p>}

          {error && (
            <p
              className="passport-editor-error"
              style={{
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          {!loading && skills.length === 0 && (
            <p>No skills were found.</p>
          )}

          {!loading && skills.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(220px, 1fr))",
                }}
              >
                {skills.map((skill) => {
                  const isSelected = selectedSkills.some(
                    (selectedSkill) =>
                      selectedSkill.skillId === skill.id
                  );

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      aria-pressed={isSelected}
                      style={{
                        cursor: "pointer",
                        border: isSelected
                          ? "2px solid #3b82f6"
                          : "2px solid transparent",
                        borderRadius: "12px",
                        padding: 0,
                        background: "transparent",
                        textAlign: "left",
                        color: "inherit",
                      }}
                    >
                      <Card padding="small">
                        <strong>{skill.name}</strong>

                        <div
                          style={{
                            marginTop: "8px",
                            opacity: 0.7,
                            fontSize: ".9rem",
                          }}
                        >
                          {skill.category || "Uncategorised"}
                        </div>
                      </Card>
                    </button>
                  );
                })}
              </div>

              {selectedSkills.length > 0 && (
                <section
                  style={{
                    marginTop: "2.5rem",
                  }}
                >
                  <SectionHeader
                    eyebrow="Selected Skills"
                    title="Experience details"
                    description="Set your proficiency level and years of experience for each skill."
                  />

                  <div
                    style={{
                      display: "grid",
                      gap: "16px",
                    }}
                  >
                    {selectedSkills.map((selectedSkill) => {
                      const skill = getSkillById(
                        selectedSkill.skillId
                      );

                      if (!skill) {
                        return null;
                      }

                      return (
                        <Card
                          key={selectedSkill.skillId}
                          padding="small"
                        >
                          <div
                            style={{
                              display: "grid",
                              gap: "16px",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(180px, 1fr))",
                              alignItems: "end",
                            }}
                          >
                            <div>
                              <strong>{skill.name}</strong>

                              <div
                                style={{
                                  marginTop: "4px",
                                  opacity: 0.7,
                                  fontSize: ".9rem",
                                }}
                              >
                                {skill.category ||
                                  "Uncategorised"}
                              </div>
                            </div>

                            <label>
                              <span
                                style={{
                                  display: "block",
                                  marginBottom: "6px",
                                  fontSize: ".9rem",
                                }}
                              >
                                Proficiency level
                              </span>

                              <select
                                value={selectedSkill.level}
                                onChange={(event) =>
                                  updateSkillLevel(
                                    selectedSkill.skillId,
                                    event.target
                                      .value as SkillLevel
                                  )
                                }
                                style={fieldStyle}
                              >
                                <option value="beginner">
                                  Beginner
                                </option>

                                <option value="intermediate">
                                  Intermediate
                                </option>

                                <option value="advanced">
                                  Advanced
                                </option>

                                <option value="expert">
                                  Expert
                                </option>
                              </select>
                            </label>

                            <label>
                              <span
                                style={{
                                  display: "block",
                                  marginBottom: "6px",
                                  fontSize: ".9rem",
                                }}
                              >
                                Years of experience
                              </span>

                              <input
                                type="number"
                                min="0"
                                max="50"
                                step="0.5"
                                value={selectedSkill.years}
                                onChange={(event) =>
                                  updateSkillYears(
                                    selectedSkill.skillId,
                                    Number(event.target.value)
                                  )
                                }
                                style={fieldStyle}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                toggleSkill(
                                  selectedSkill.skillId
                                )
                              }
                              style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border:
                                  "1px solid rgba(255, 255, 255, 0.2)",
                                backgroundColor: "transparent",
                                color: "inherit",
                                cursor: "pointer",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "2rem",
                  paddingTop: "1.5rem",
                  borderTop:
                    "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Button href="/developer" variant="secondary">
                  Cancel
                </Button>

                <button
                  type="button"
                  onClick={saveSkills}
                  disabled={saving}
                  style={{
                    padding: "11px 22px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    opacity: saving ? 0.65 : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save skills"}
                </button>
              </div>
            </>
          )}
        </Card>
      </section>
    </main>
  );
}