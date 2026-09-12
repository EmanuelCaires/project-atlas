import {
  EVIDENCE_POINTS,
  MAX_EVIDENCE_SCORE,
} from "../constants";

import type {
  EvidenceResult,
  ProjectEvidenceInput,
} from "../types";

export function calculateProjectEvidence(
  project: ProjectEvidenceInput,
): EvidenceResult {
  const githubEvidence = project.githubUrl?.trim()
    ? project.githubVerified
      ? EVIDENCE_POINTS.GITHUB
      : EVIDENCE_POINTS.GITHUB_UNVERIFIED
    : 0;

  const breakdown = {
    project: EVIDENCE_POINTS.PROJECT,

    description: project.description?.trim()
      ? EVIDENCE_POINTS.DESCRIPTION
      : 0,

    github: githubEvidence,

    liveDemo: project.liveUrl?.trim()
      ? EVIDENCE_POINTS.LIVE_DEMO
      : 0,

    screenshot: project.imageUrl?.trim()
      ? EVIDENCE_POINTS.SCREENSHOT
      : 0,

    skills: project.skillsCount > 0
      ? EVIDENCE_POINTS.SKILLS
      : 0,

    featured: project.isFeatured
      ? EVIDENCE_POINTS.FEATURED
      : 0,

    completed: project.status === "completed"
      ? EVIDENCE_POINTS.COMPLETED
      : 0,
  };

  const score = Object.values(breakdown).reduce(
    (total, value) => total + value,
    0,
  );

  return {
    score: Math.min(score, MAX_EVIDENCE_SCORE),
    breakdown,
  };
}
