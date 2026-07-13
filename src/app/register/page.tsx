"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

type AccountRole = "developer" | "employer";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<AccountRole>("developer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          first_name: firstName,
          last_name: lastName,
          display_name: `${firstName} ${lastName}`.trim(),
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      router.push(role === "employer" ? "/dashboard" : "/developer");
      router.refresh();
      return;
    }

    setMessage(
      "Account created. Check your email and confirm your address before logging in."
    );
  }

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
              <input
                checked={role === "developer"}
                name="role"
                onChange={() => setRole("developer")}
                type="radio"
                value="developer"
              />

              <span>
                <strong>Developer</strong>
                <small>Build your Developer Passport</small>
              </span>
            </label>

            <label>
              <input
                checked={role === "employer"}
                name="role"
                onChange={() => setRole("employer")}
                type="radio"
                value="employer"
              />

              <span>
                <strong>Employer</strong>
                <small>Discover and shortlist developers</small>
              </span>
            </label>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-row">
              <label htmlFor="firstName">
                First name
                <input
                  id="firstName"
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  type="text"
                  value={firstName}
                />
              </label>

              <label htmlFor="lastName">
                Last name
                <input
                  id="lastName"
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  type="text"
                  value={lastName}
                />
              </label>
            </div>

            <label htmlFor="registerEmail">
              Email address
              <input
                autoComplete="email"
                id="registerEmail"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>

            <label htmlFor="registerPassword">
              Password
              <input
                autoComplete="new-password"
                id="registerPassword"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            {errorMessage && (
              <p style={{ color: "#ff8b9b" }}>{errorMessage}</p>
            )}

            {message && <p style={{ color: "#62dfb4" }}>{message}</p>}

            <button
              className="button form-button"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating account..." : "Create account"}
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
