export const EVIDENCE_POINTS = {
  PROJECT: 10,
  DESCRIPTION: 10,
  GITHUB: 15,
  LIVE_DEMO: 15,
  SCREENSHOT: 10,
  SKILLS: 10,
  FEATURED: 10,
  COMPLETED: 20,
} as const;

export const MAX_EVIDENCE_SCORE = Object.values(
  EVIDENCE_POINTS
).reduce((total, value) => total + value, 0);