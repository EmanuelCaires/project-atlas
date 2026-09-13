export type ProfileStrengthInput = {
  displayName: string | null;
  headline: string | null;
  location: string | null;
  bio: string | null;
  yearsExperience: number | null;
  preferredRole: string | null;
  workPreference: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  skillsCount: number;
  projectsCount: number;
};

export function calculateProfileStrength(
  input: ProfileStrengthInput
): number {
  let score = 0;

  if (input.displayName?.trim()) score += 10;
  if (input.headline?.trim()) score += 10;
  if (input.location?.trim()) score += 5;
  if (input.bio?.trim()) score += 10;
  if ((input.yearsExperience ?? 0) > 0) score += 5;
  if (input.preferredRole?.trim()) score += 10;
  if (input.workPreference?.trim()) score += 5;
  if (input.githubUrl?.trim()) score += 10;
  if (input.portfolioUrl?.trim()) score += 5;
  if (input.linkedinUrl?.trim()) score += 5;

  score += Math.min(input.skillsCount * 3, 10);
  score += Math.min(input.projectsCount * 5, 15);

  return Math.min(score, 100);
}