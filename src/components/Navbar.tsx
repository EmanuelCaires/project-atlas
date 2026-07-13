import Link from "next/link";

type NavbarProps = {
  compact?: boolean;
};

export default function Navbar({ compact = false }: NavbarProps) {
  return (
    <header className={compact ? "navbar-shell compact" : "navbar-shell"}>
      <nav className="navbar container">
        <Link className="brand" href="/">
          <span className="brand-mark">A</span>

          <span className="brand-text">
            <strong>ATLAS</strong>
            <small>Talent Intelligence</small>
          </span>
        </Link>

        <div className="nav-links">
          <Link href="/#platform">Platform</Link>
          <Link href="/#platform">Developer Passport</Link>
          <Link href="/dashboard">For companies</Link>
        </div>

        <div className="nav-actions">
          <Link className="login-link" href="/login">
            Log in
          </Link>

          <Link className="button button-small" href="/register">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
