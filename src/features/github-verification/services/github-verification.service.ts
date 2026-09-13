import type { GitHubRepositoryVerification } from "../types";

function parseGitHubRepositoryUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname !== "github.com" &&
      parsed.hostname !== "www.github.com"
    ) {
      return null;
    }

    const parts = parsed.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export async function verifyGitHubRepository(
  repositoryUrl: string
): Promise<GitHubRepositoryVerification> {
  const parsed = parseGitHubRepositoryUrl(repositoryUrl);

  if (!parsed) {
    return {
      verified: false,
      owner: "",
      repo: "",
      fullName: null,
      description: null,
      language: null,
      stars: 0,
      forks: 0,
      isPrivate: null,
      repositoryUrl,
      updatedAt: null,
      error: "Invalid GitHub repository URL.",
    };
  }

  const response = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    return {
      verified: false,
      owner: parsed.owner,
      repo: parsed.repo,
      fullName: null,
      description: null,
      language: null,
      stars: 0,
      forks: 0,
      isPrivate: null,
      repositoryUrl,
      updatedAt: null,
      error:
        response.status === 404
          ? "Repository not found."
          : "Unable to verify repository.",
    };
  }

  const data = await response.json();

  return {
    verified: true,
    owner: parsed.owner,
    repo: parsed.repo,
    fullName: data.full_name ?? null,
    description: data.description ?? null,
    language: data.language ?? null,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    isPrivate: data.private ?? null,
    repositoryUrl,
    updatedAt: data.updated_at ?? null,
    error: null,
  };
}