import type { SkillGroup } from '@/lib/types'

export const about = {
  title: "About Ben",
  intro: "Hi, I'm Ben Nudelman. I have a passion for developing apps that have a real-world purpose, and I love turning my ideas into code.",
  paragraphs: [
    "I am studying computer science at Cornell University with a minor in Operations Research and Information Engineering (ORIE) as well as a minor in Applied Mathematics. My expected graduation date is May 2028, but I may graduate early in May 2027.",
    "I'm a developer who enjoys working across the stack, implementing front-end interfaces, backend systems, and everything in between.",
    "While I am not coding you can find me at the gym, playing basketball, playing poker, enjoying stock trading, or spending time with my friends and family.",
  ],
}

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    items: ["Java", "JavaScript", "Swift", "Python", "C", "C++", "OCaml", "SQL", "HTML/CSS", "BASH", "Assembly"],
  },
  {
    name: "Speaking Languages",
    items: ["English — Native", "Russian — Intermediate", "French — Advanced"],
  },
  {
    name: "Frameworks & Libraries",
    items: ["React", "React Native", "Next.js", "Node.js", "UIKit", "Bogue", "TensorFlow Lite", "TensorFlow", "Scikit-learn", "D3.js", "Flask", "Express"],
  },
  {
    name: "Tools & Platforms",
    items: ["Git", "Vite", "Firebase", "MongoDB", "Prisma", "Docker", "JFlex", "CUP", "Dune", "OUnit", "Makefile", "Figma"],
  },
  {
    name: "Specialized",
    items: ["TinyML", "REST APIs", "Codable", "BearSSL", "PyCryptoDome", "Tailwind CSS", "bcrypt"],
  },
  {
    name: "Other",
    items: ["Full-stack development", "Mobile development", "Embedded systems", "Problem solving"],
  },
]

export const interests: string[] = [
  "Fullstack development",
  "Creating apps / mobile appdev",
  "Embedded software engineering",
  "Fintech applications",
  "Algorithmic trading",
  "Machine learning",
  "Financial data analysis and modeling",
]

export const contact = {
  message: "Say hi, I'm happy to connect and meet new people.",
  email: "bnudelman2@gmail.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/nudelman-ben" },
    { label: "GitHub", url: "https://github.com/bnudelman4" },
  ],
}
