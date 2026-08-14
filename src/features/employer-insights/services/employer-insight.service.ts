const EMPLOYER_GRADES = {
  OUTSTANDING: 90,
  EXCELLENT: 75,
  STRONG: 60,
} as const;

import type {
  EmployerInsight,
  EmployerInsightInput,
} from "../types";

export function generateEmployerInsight(
  input: EmployerInsightInput,
): EmployerInsight {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (input.completedProjects >= 3) {
    strengths.push(`${input.completedProjects} completed projects`);
  } else {
    improvements.push("Complete more projects");
  }

  if (input.githubProjects > 0) {
    strengths.push("GitHub repositories available");
  } else {
    improvements.push("Connect GitHub repositories");
  }

  if (input.liveProjects > 0) {
    strengths.push("Live deployed applications");
  } else {
    improvements.push("Deploy your projects");
  }

  if (input.totalSkills >= 5) {
    strengths.push(`${input.totalSkills} documented skills`);
  } else {
    improvements.push("Document more technical skills");
  }

  if (input.screenshotProjects === 0) {
    improvements.push("Add project screenshots");
  }

  let grade: EmployerInsight["grade"] = "Developing";

  if (input.profileStrength >= EMPLOYER_GRADES.OUTSTANDING) {
    grade = "Outstanding";
  } else if (input.profileStrength >= EMPLOYER_GRADES.EXCELLENT) {
    grade = "Excellent";
  } else if (input.profileStrength >= EMPLOYER_GRADES.STRONG) {
    grade = "Strong";
  }

  return {
    score: input.profileStrength,
    grade,
    confidence:
      grade === "Outstanding" || grade === "Excellent"
        ? "high"
        : grade === "Strong"
          ? "medium"
          : "developing",
    summary:
      grade === "Outstanding"
        ? "Outstanding technical evidence across multiple verified projects."
        : grade === "Excellent"
          ? "Strong practical evidence demonstrating professional capability."
          : grade === "Strong"
            ? "Good evidence with opportunities to strengthen the profile."
            : "The profile is developing and would benefit from additional evidence.",
    strengths,
    improvements,
  };
}