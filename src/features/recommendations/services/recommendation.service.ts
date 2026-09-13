import { RECOMMENDATION_IMPACT } from "../constants";
import type {
  Recommendation,
  RecommendationInput,
} from "../types";

export function getNextRecommendation(
  input: RecommendationInput
): Recommendation {
  if (input.totalProjects === 0) {
    return {
      id: "first-project",
      title: "Create your first project",
      description:
        "Projects are the strongest evidence of your technical ability.",
      impact: RECOMMENDATION_IMPACT.FIRST_PROJECT,
      estimatedMinutes: 30,
      actionLabel: "Add first project",
      actionHref: "/developer/projects",
    };
  }

  if (input.totalProjects < 3) {
    return {
      id: "more-projects",
      title: "Add more completed projects",
      description:
        "Three strong projects give employers better confidence when evaluating your skills.",
      impact: RECOMMENDATION_IMPACT.MORE_PROJECTS,
      estimatedMinutes: 45,
      actionLabel: "Add project",
      actionHref: "/developer/projects",
    };
  }

  if (input.githubProjects < input.totalProjects) {
    return {
      id: "github",
      title: "Connect GitHub repositories",
      description:
        "GitHub provides verifiable technical evidence for employers.",
      impact: RECOMMENDATION_IMPACT.GITHUB,
      estimatedMinutes: 5,
      actionLabel: "Manage projects",
      actionHref: "/developer/projects",
    };
  }

  if (input.liveProjects < input.totalProjects) {
    return {
      id: "live-demo",
      title: "Deploy your projects",
      description:
        "Live applications allow employers to experience your work directly.",
      impact: RECOMMENDATION_IMPACT.LIVE_DEMO,
      estimatedMinutes: 15,
      actionLabel: "Add live demo",
      actionHref: "/developer/projects",
    };
  }

  if (input.screenshotProjects < input.totalProjects) {
    return {
      id: "screenshots",
      title: "Add project screenshots",
      description:
        "Visual evidence makes projects easier to evaluate.",
      impact: RECOMMENDATION_IMPACT.SCREENSHOT,
      estimatedMinutes: 3,
      actionLabel: "Add screenshots",
      actionHref: "/developer/projects",
    };
  }

  return {
    id: "featured",
    title: "Feature your strongest project",
    description:
      "Highlight the work you want employers to see first.",
    impact: RECOMMENDATION_IMPACT.FEATURED,
    estimatedMinutes: 2,
    actionLabel: "Choose featured project",
    actionHref: "/developer/projects",
  };
}