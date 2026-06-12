export interface Project {
  id: number
  name: string
  description: string
  category: string
  techStack: string
  github: string | null
  live: string | null
  demo: string | null
  code: string
  features: string[]
  technologies: string[]
  timeframe: string
}

export interface SkillGroup { name: string; items: string[] }

export interface ExperienceEntry {
  id: string
  role: string
  org: string
  start: string
  end: string        // "Present" allowed
  bullets: string[]
  placeholder?: boolean
}
