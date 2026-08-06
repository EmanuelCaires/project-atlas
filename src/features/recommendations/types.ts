export type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: number;
  estimatedMinutes: number;
};

export type RecommendationInput = {
  totalProjects: number;
  completedProjects: number;
  featuredProjects: number;
  githubProjects: number;
  liveProjects: number;
  screenshotProjects: number;
};