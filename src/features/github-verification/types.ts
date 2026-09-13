export type GitHubRepositoryVerification = {
  verified: boolean;
  owner: string;
  repo: string;
  fullName: string | null;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isPrivate: boolean | null;
  repositoryUrl: string;
  updatedAt: string | null;
  error: string | null;
};