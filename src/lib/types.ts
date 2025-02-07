export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  xp: number;
  githubId: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: "commit" | "pull_request" | "repo_creation" | "merge";
  userId: string;
  xp: number;
  createdAt: string;
  user: User;
}
