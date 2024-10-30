// 工作经验类型
export interface Experience {
  period: string;
  company: string;
  position: string;
  description: string;
  achievements: string[];
}

// 项目经验类型
export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
  highlights: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

// 技能类型
export interface Skill {
  name: string;
  level: number;
  description: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

// 证书类型
export interface Certificate {
  name: string;
  organization: string;
  date: string;
  type: "primary" | "success" | "warning" | "info";
}

export interface Profile {
  name: string;
  title: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  description: string;
}
