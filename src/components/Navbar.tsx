"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
  compact?: boolean;
};

export default function Navbar({ compact = false }: NavbarProps) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(Boolean(session));
      setLoadingAuth(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      alert(error.message);
      return;
    }

    setIsAuthenticated(false);
    setLoggingOut(false);

    router.push("/");
    router.refresh();
  }

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

          <Link href={isAuthenticated ? "/developer" : "/#platform"}>
            Developer Passport
          </Link>

          <Link href="/dashboard">For companies</Link>
        </div>

        <div className="nav-actions">
          {loadingAuth ? null : isAuthenticated ? (
            <>
              <Link className="login-link" href="/developer">
                My Passport
              </Link>

              <button
                className="button button-small"
                disabled={loggingOut}
                onClick={handleLogout}
                type="button"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <>
              <Link className="login-link" href="/login">
                Log in
              </Link>

              <Link className="button button-small" href="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}