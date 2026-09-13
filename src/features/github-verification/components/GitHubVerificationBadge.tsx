"use client";

import { useState } from "react";
import type { GitHubRepositoryVerification } from "../types";

type GitHubVerificationBadgeProps = {
  projectId: string;
  initialVerification: GitHubRepositoryVerification | null;
};

type SaveVerificationResponse = {
  success?: boolean;
  error?: string;
  verification?: GitHubRepositoryVerification;
};

export default function GitHubVerificationBadge({
  projectId,
  initialVerification,
}: GitHubVerificationBadgeProps) {
  const [result, setResult] =
    useState<GitHubRepositoryVerification | null>(initialVerification);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setVerifying(true);
    setError(null);

    try {
      const response = await fetch("/api/github/save-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      const data = (await response.json()) as SaveVerificationResponse;

      if (!response.ok) {
        if (data.verification) {
          setResult(data.verification);
        } else {
          setError(data.error ?? "Unable to confirm the GitHub repository.");
        }
        return;
      }

      if (!data.verification) {
        setError("Atlas confirmed the repository but returned no verification details.");
        return;
      }

      setResult(data.verification);
    } catch {
      setError("Unable to confirm the repository. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  if (error) {
    return (
      <div className="github-verification github-verification-failed">
        <strong>Repository check error</strong>
        <span>{error}</span>

        <button
          className="button button-secondary"
          onClick={handleVerify}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <button
        className="button button-secondary"
        disabled={verifying}
        onClick={handleVerify}
        type="button"
      >
        {verifying ? "Checking..." : "Check GitHub repository"}
      </button>
    );
  }

  if (!result.verified) {
    return (
      <div className="github-verification github-verification-failed">
        <strong>Repository not confirmed</strong>
        <span>{result.error}</span>

        <button
          className="button button-secondary"
          onClick={handleVerify}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="github-verification github-verification-success">
      <div>
        <strong>✓ GitHub repository confirmed</strong>
        <span>{result.fullName}</span>
      </div>

      <div className="github-verification-meta">
        {result.language && <span>{result.language}</span>}

        <span>
          {result.stars} {result.stars === 1 ? "star" : "stars"}
        </span>

        <span>
          {result.forks} {result.forks === 1 ? "fork" : "forks"}
        </span>
      </div>
    </div>
  );
}
