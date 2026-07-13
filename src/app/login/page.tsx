import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Navbar compact />

      <section className="auth-container container">
        <div className="auth-copy">
          <p className="section-kicker">Welcome back</p>
          <h1>Access your Atlas workspace.</h1>
          <p>
            Continue building your Developer Passport or return to your
            employer talent dashboard.
          </p>

          <div className="auth-benefits">
            <span>Verified developer discovery</span>
            <span>Structured talent profiles</span>
            <span>Saved candidates and matches</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <h2>Log in</h2>
            <p>Enter your account details below.</p>
          </div>

          <form className="auth-form">
            <label htmlFor="email">
              Email address
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                Remember me
              </label>
              <Link href="#">Forgot password?</Link>
            </div>

            <button className="button form-button" type="submit">
              Log in
            </button>
          </form>

          <div className="form-divider">
            <span>or</span>
          </div>

          <button className="social-button" type="button">
            Continue with GitHub
          </button>

          <p className="auth-switch">
            Do not have an account? <Link href="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
