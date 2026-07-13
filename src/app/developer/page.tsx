import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Developer Passport",
};

const skills = [
  { name: "JavaScript", level: 92 },
  { name: "TypeScript", level: 84 },
  { name: "React", level: 88 },
  { name: "Next.js", level: 86 },
  { name: "Python", level: 78 },
  { name: "Django", level: 80 },
];

const projects = [
  {
    name: "WeRepair.io",
    description:
      "Full-stack e-commerce platform for mobile phones, parts and accessories.",
    technology: "Django · PostgreSQL · Stripe",
  },
  {
    name: "EC1 Energy",
    description:
      "Modern product and waitlist website for an energy drink brand.",
    technology: "Next.js · Supabase · Vercel",
  },
  {
    name: "Project Atlas",
    description:
      "Talent discovery platform built around verified developer evidence.",
    technology: "Next.js · TypeScript · Supabase",
  },
];

export default function DeveloperPage() {
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
              <button className="button button-secondary" type="button">
                Share profile
              </button>
              <Link className="button" href="/register">
                Edit passport
              </Link>
            </div>
          </div>

          <div className="passport-dashboard">
            <aside className="developer-sidebar">
              <div className="large-profile-avatar">EC</div>
              <h2>Emanuel Caires</h2>
              <p>Full-Stack Web Developer</p>
              <span>Bristol, United Kingdom</span>

              <div className="availability-badge">
                <span className="status-dot" />
                Open to opportunities
              </div>

              <div className="sidebar-details">
                <div>
                  <span>Experience</span>
                  <strong>4+ years</strong>
                </div>
                <div>
                  <span>Preferred role</span>
                  <strong>Junior Full-Stack</strong>
                </div>
                <div>
                  <span>Work preference</span>
                  <strong>Remote / Hybrid</strong>
                </div>
                <div>
                  <span>Languages</span>
                  <strong>English, Portuguese</strong>
                </div>
              </div>

              <button className="button form-button" type="button">
                Contact developer
              </button>
            </aside>

            <div className="passport-main-column">
              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Atlas profile summary</p>
                    <h2>Developer overview</h2>
                  </div>
                  <span className="verified-badge">Identity verified</span>
                </div>

                <p className="profile-summary">
                  Full-stack developer with practical experience building
                  responsive websites and data-driven applications using
                  JavaScript, Python, Django, React and Next.js.
                </p>

                <div className="score-summary-grid">
                  <div>
                    <span>Profile strength</span>
                    <strong>91%</strong>
                  </div>
                  <div>
                    <span>GitHub evidence</span>
                    <strong>Verified</strong>
                  </div>
                  <div>
                    <span>Projects reviewed</span>
                    <strong>6</strong>
                  </div>
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Technical evidence</p>
                    <h2>Verified skills</h2>
                  </div>
                </div>

                <div className="skill-progress-list">
                  {skills.map((skill) => (
                    <div className="skill-progress-item" key={skill.name}>
                      <div>
                        <strong>{skill.name}</strong>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="skill-progress-track">
                        <span style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section-header">
                  <div>
                    <p className="dashboard-kicker">Selected work</p>
                    <h2>Projects</h2>
                  </div>
                </div>

                <div className="project-list">
                  {projects.map((project) => (
                    <article className="project-card" key={project.name}>
                      <div className="project-icon">{project.name.charAt(0)}</div>
                      <div>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <span>{project.technology}</span>
                      </div>
                      <button type="button">View project →</button>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
