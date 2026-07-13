import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <Navbar compact />

      <section className="auth-container container">
        <div className="auth-copy">
          <p className="section-kicker">Join Project Atlas</p>
          <h1>Create a profile built around evidence.</h1>
          <p>
            Join as a developer to demonstrate your work or as an employer to
            discover verified technical talent.
          </p>

          <div className="auth-benefits">
            <span>Showcase real projects and skills</span>
            <span>Connect GitHub and portfolio evidence</span>
            <span>Get discovered by suitable companies</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <h2>Create your account</h2>
            <p>Choose how you want to use Atlas.</p>
          </div>

          <div className="role-selector">
            <label>
              <input defaultChecked name="role" type="radio" value="developer" />
              <span>
                <strong>Developer</strong>
                <small>Build your Developer Passport</small>
              </span>
            </label>

            <label>
              <input name="role" type="radio" value="employer" />
              <span>
                <strong>Employer</strong>
                <small>Discover and shortlist developers</small>
              </span>
            </label>
          </div>

          <form className="auth-form">
            <div className="form-row">
              <label htmlFor="firstName">
                First name
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="Emanuel"
                  type="text"
                  required
                />
              </label>

              <label htmlFor="lastName">
                Last name
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Caires"
                  type="text"
                  required
                />
              </label>
            </div>

            <label htmlFor="registerEmail">
              Email address
              <input
                id="registerEmail"
                name="email"
                placeholder="you@example.com"
                type="email"
                required
              />
            </label>

            <label htmlFor="registerPassword">
              Password
              <input
                id="registerPassword"
                name="password"
                placeholder="Create a secure password"
                type="password"
                required
              />
            </label>

            <label className="checkbox-label terms-checkbox">
              <input type="checkbox" required />
              I agree to the terms and privacy policy.
            </label>

            <button className="button form-button" type="submit">
              Create account
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link href="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
