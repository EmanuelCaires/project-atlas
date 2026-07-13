import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">A</span>

            <span className="brand-text">
              <strong>ATLAS</strong>
              <small>Talent Intelligence</small>
            </span>
          </Link>

          <p className="footer-description">
            Helping modern companies discover developers through proof,
            verified skills and real technical work.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Platform</strong>
            <Link href="/developer">Developer Passport</Link>
            <Link href="/dashboard">Employer Dashboard</Link>
            <Link href="/register">Create account</Link>
          </div>

          <div>
            <strong>Account</strong>
            <Link href="/login">Log in</Link>
            <Link href="/register">Register</Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Project Atlas</span>
        <span>Internal working name</span>
      </div>
    </footer>
  );
}
