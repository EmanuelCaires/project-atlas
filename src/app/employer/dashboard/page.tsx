import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Employer Dashboard",
};

const developers = [
  {
    initials: "EC",
    name: "Emanuel Caires",
    role: "Full-Stack Developer",
    location: "Bristol, UK",
    skills: ["Next.js", "React", "Django"],
    match: 94,
    availability: "Available",
  },
  {
    initials: "SM",
    name: "Sofia Martins",
    role: "Frontend Developer",
    location: "London, UK",
    skills: ["React", "TypeScript", "Figma"],
    match: 91,
    availability: "2 weeks",
  },
  {
    initials: "JL",
    name: "James Lewis",
    role: "Backend Developer",
    location: "Manchester, UK",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    match: 87,
    availability: "Available",
  },
  {
    initials: "AK",
    name: "Amara Khan",
    role: "Software Engineer",
    location: "Remote, UK",
    skills: ["Python", "FastAPI", "React"],
    match: 85,
    availability: "1 month",
  },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <Navbar compact />

      <div className="dashboard-layout container">
        <aside className="dashboard-sidebar">
          <div className="company-profile">
            <div className="company-logo">AC</div>
            <div>
              <strong>Atlas Company</strong>
              <span>Employer workspace</span>
            </div>
          </div>

          <nav className="dashboard-menu">
            <Link className="active" href="/dashboard">
              Talent discovery
            </Link>
            <Link href="#">AI matches</Link>
            <Link href="#">Saved developers</Link>
            <Link href="#">Messages</Link>
            <Link href="#">Hiring projects</Link>
          </nav>
        </aside>

        <section className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <p className="dashboard-kicker">Talent discovery</p>
              <h1>Find your next developer.</h1>
              <p>
                Search verified Developer Passports using skills, experience
                and availability.
              </p>
            </div>

            <button className="button" type="button">
              Create hiring project
            </button>
          </div>

          <div className="dashboard-stat-grid">
            <article>
              <span>Available developers</span>
              <strong>1,284</strong>
              <small>+86 this month</small>
            </article>
            <article>
              <span>Recommended matches</span>
              <strong>24</strong>
              <small>Based on your searches</small>
            </article>
            <article>
              <span>Saved candidates</span>
              <strong>12</strong>
              <small>Across 3 hiring projects</small>
            </article>
          </div>

          <div className="search-panel">
            <div className="search-field">
              <input
                placeholder="Search by skill, role or technology..."
                type="search"
              />
            </div>

            <select defaultValue="">
              <option disabled value="">Experience</option>
              <option>Junior</option>
              <option>Mid-level</option>
              <option>Senior</option>
            </select>

            <select defaultValue="">
              <option disabled value="">Availability</option>
              <option>Available now</option>
              <option>Within 2 weeks</option>
              <option>Within 1 month</option>
            </select>

            <button className="button" type="button">
              Search
            </button>
          </div>

          <div className="candidate-section-header">
            <div>
              <h2>Recommended developers</h2>
              <p>Profiles matched to your recent activity.</p>
            </div>
          </div>

          <div className="candidate-grid">
            {developers.map((developer) => (
              <article className="candidate-card" key={developer.name}>
                <div className="candidate-card-top">
                  <div className="candidate-avatar">{developer.initials}</div>
                  <div className="candidate-match">
                    <strong>{developer.match}%</strong>
                    <span>match</span>
                  </div>
                </div>

                <h3>{developer.name}</h3>
                <p>{developer.role}</p>
                <span className="candidate-location">{developer.location}</span>

                <div className="candidate-skills">
                  {developer.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="candidate-card-footer">
                  <span>{developer.availability}</span>
                  <Link href="/developer">View passport →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
