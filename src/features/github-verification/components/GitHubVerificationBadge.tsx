"use client";

import { useState } from "react";
import type { GitHubRepositoryVerification } from "../types";

type GitHubVerificationBadgeProps = {
  projectId: string;
  repositoryUrl: string;
  initialVerification: GitHubRepositoryVerification | null;
};

export default function GitHubVerificationBadge({
  projectId,
  repositoryUrl,
  initialVerification,
}: GitHubVerificationBadgeProps) {
  const [result, setResult] =
  useState<GitHubRepositoryVerification | null>(
    initialVerification,
  );

  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setVerifying(true);
    setError(null);

    try {
      // First verify the repository with GitHub.
      const response = await fetch(
        `/api/github/verify?url=${encodeURIComponent(repositoryUrl)}`,
      );

      const data =
        (await response.json()) as GitHubRepositoryVerification;

      if (!response.ok || !data.verified) {
        setResult(data);
        return;
      }

      // Then persist the successful verification in Atlas.
      const saveResponse = await fetch(
        "/api/github/save-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            verification: data,
          }),
        },
      );

      if (!saveResponse.ok) {
        const saveData = await saveResponse.json();

        setError(
          saveData.error ??
            "Repository verified, but Atlas could not save the verification.",
        );

        return;
      }

      setResult(data);
    } catch {
      setError("Unable to verify the repository. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  if (error) {
    return (
      <div className="github-verification github-verification-failed">
        <strong>Verification error</strong>
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
        {verifying ? "Verifying..." : "Verify GitHub"}
      </button>
    );
  }

  if (!result.verified) {
    return (
      <div className="github-verification github-verification-failed">
        <strong>GitHub not verified</strong>
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
        <strong>✓ Verified repository</strong>
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