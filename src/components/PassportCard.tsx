const skills = ["Next.js", "TypeScript", "React", "Node.js"];

export default function PassportCard() {
  return (
    <article className="passport-card">
      <header className="passport-header">
        <div>
          <p className="passport-label">Developer Passport</p>
          <p className="passport-id">ID: ATL-08421</p>
        </div>

        <span className="verified-badge">Verified</span>
      </header>

      <div className="profile">
        <div className="profile-avatar">EC</div>

        <div>
          <h2>Emanuel Caires</h2>
          <p>Full-Stack Developer</p>
          <span>Bristol, United Kingdom</span>
        </div>
      </div>

      <div className="match-panel">
        <div>
          <span>Atlas Match Score</span>
          <strong>94%</strong>
        </div>

        <div className="score-track">
          <span />
        </div>
      </div>

      <div className="passport-section">
        <p>Core skills</p>

        <div className="skill-list">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="passport-stats">
        <div>
          <strong>12</strong>
          <span>Projects</span>
        </div>

        <div>
          <strong>4+</strong>
          <span>Years building</span>
        </div>

        <div>
          <strong>Active</strong>
          <span>Availability</span>
        </div>
      </div>

      <footer className="passport-footer">
        <span className="status-dot" />
        Identity and GitHub verified
      </footer>
    </article>
  );
}
