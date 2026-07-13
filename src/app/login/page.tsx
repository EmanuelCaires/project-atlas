"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const role = data.user.user_metadata?.role;

    router.push(role === "employer" ? "/dashboard" : "/developer");
    router.refresh();
  }

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

          <form className="auth-form" onSubmit={handleLogin}>
            <label htmlFor="email">
              Email address
              <input
                autoComplete="email"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                autoComplete="current-password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            {errorMessage && (
              <p style={{ color: "#ff8b9b" }}>{errorMessage}</p>
            )}

            <button
              className="button form-button"
              disabled={loading}
              type="submit"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            Do not have an account?{" "}
            <Link href="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
