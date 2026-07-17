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

export default function SkillsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data, error: skillsError } = await supabase
        .from("skills")
        .select("id, name, category")
        .order("name");

      if (skillsError) {
        setError(skillsError.message);
      } else {
        setSkills(data ?? []);
      }

      setLoading(false);
    }

    loadSkills();
  }, [router]);

  return (
    <main>
      <Navbar compact />

      <section className="container" style={{ padding: "3rem 0" }}>
        <Card elevated>
          <SectionHeader
            eyebrow="Developer Passport"
            title="Skills Management"
            description="Select the technologies that represent your professional experience."
            action={
              <Button href="/developer" variant="secondary">
                Back to Passport
              </Button>
            }
          />

          {loading && <p>Loading skills...</p>}

          {error && (
            <p className="passport-editor-error">
              {error}
            </p>
          )}

          {!loading && !error && skills.length === 0 && (
            <p>No skills were found.</p>
          )}

          {!loading && !error && skills.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {skills.map((skill) => (
                <Card key={skill.id} padding="small">
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
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
