export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  year?: string;
  status?: "completed" | "in-progress" | "archived";
}

export interface Skill {
  name: string;
  category?: "backend" | "database" | "tools" | "systems" | "security" | "languages";
  icon?: string;
  level?: number;
  description?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  /** hex accent for the category card */
  accent?: string;
  skills: Skill[];
}

export interface JourneyItem {
  id: string;
  year: string;
  title: string;
  description: string;
  tags?: string[];
  type: "learning" | "building" | "exploring" | "goal";
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  roles: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  githubUsername: string;
  githubUrl: string;
  availability: string;
}
