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
  device?: 'desktop' | 'phone' // which 3D model represents this project (default desktop)
  screen?: string // which on-screen mockup to draw (see lib/screenTexture.ts)
}

export interface SkillGroup { name: string; items: string[] }

export interface ExperienceEntry {
  id: string
  role: string
  org: string
  start: string
  end: string        // "Present" allowed
  bullets: string[]
  logo?: string      // path under /public
  placeholder?: boolean
}
