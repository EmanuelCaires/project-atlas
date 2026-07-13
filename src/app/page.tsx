import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PassportCard from "@/components/PassportCard";

const features = [
  {
    number: "01",
    title: "Verified developer profiles",
    description:
      "Review projects, technical skills, GitHub activity and verified experience instead of relying only on CV keywords.",
  },
  {
    number: "02",
    title: "Intelligent talent matching",
    description:
      "Describe the developer you need and allow Atlas to identify suitable candidates based on evidence and availability.",
  },
  {
    number: "03",
    title: "Developer Passport",
    description:
      "Each developer receives a structured profile containing projects, strengths, credentials, experience and availability.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe the role",
    description:
      "Tell Atlas about the skills, experience and availability required.",
  },
  {
    number: "02",
    title: "Review verified matches",
    description:
      "Compare candidates using projects, skills and structured evidence.",
  },
  {
    number: "03",
    title: "Connect directly",
    description:
      "Shortlist suitable developers and begin the hiring conversation.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Navbar />

        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="hero-content container">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              The talent intelligence platform
            </div>

            <h1>
              Hire developers for
              <span> what they build.</span>
            </h1>

            <p className="hero-description">
              Discover verified software developers through real projects,
              proven skills and intelligent matching—not outdated CVs.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/dashboard">
                Find developers
                <span aria-hidden="true">→</span>
              </Link>

              <Link className="button button-secondary" href="/developer">
                View Developer Passport
              </Link>
            </div>

            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span>AM</span>
                <span>JS</span>
                <span>LK</span>
                <span>+</span>
              </div>

              <p>
                Built for ambitious developers
                <br />
                and modern hiring teams.
              </p>
            </div>
          </div>

          <div className="passport-wrapper">
            <div className="passport-orbit passport-orbit-one" />
            <div className="passport-orbit passport-orbit-two" />

            <PassportCard />
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-content">
          <p>Built around proof, not promises</p>

          <div className="trust-items">
            <span>Identity verified</span>
            <span>GitHub connected</span>
            <span>Skills validated</span>
            <span>Intelligently matched</span>
          </div>
        </div>
      </section>

      <section className="features-section container" id="platform">
        <div className="section-heading">
          <p className="section-kicker">A better hiring signal</p>
          <h2>Find technical talent with confidence.</h2>
          <p>
            Atlas replaces fragmented applications with structured evidence,
            verified developer profiles and intelligent discovery.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="section-heading centred-heading">
            <p className="section-kicker">How it works</p>
            <h2>From hiring brief to suitable developer.</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section container">
        <div className="cta-panel">
          <div>
            <p className="section-kicker">Start discovering talent</p>
            <h2>Build your hiring pipeline around proof.</h2>
            <p>
              Create an employer account or begin building your Developer
              Passport.
            </p>
          </div>

          <div className="cta-actions">
            <Link className="button" href="/register">
              Create account
            </Link>
            <Link className="button button-secondary" href="/login">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
