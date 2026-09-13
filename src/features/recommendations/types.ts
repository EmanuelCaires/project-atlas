export type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: number;
  estimatedMinutes: number;
  actionLabel: string;
  actionHref: string;
};

export type RecommendationInput = {
  totalProjects: number;
  completedProjects: number;
  featuredProjects: number;
  githubProjects: number;
  liveProjects: number;
  screenshotProjects: number;
};