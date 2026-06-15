import type { SkillGroup } from '@/lib/types'

export const about = {
  title: "About Ben",
  intro: "I have a passion for developing software with real-world purpose.",
  paragraphs: [
    "I'm a Computer Science major at Cornell University with minors in ORIE (Operations Research and Information Engineering) and Applied Mathematics, with an expected graduation date of December 2027.",
    "When I'm not coding you can find me at the gym, playing basketball, playing poker, enjoying stock trading, or spending time with my friends and family.",
  ],
}

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    items: ["Java", "JavaScript", "Swift", "Python", "C", "C++", "OCaml", "SQL", "HTML/CSS", "BASH", "Assembly"],
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
  emailDisplay: "bnudelman2 [at] gmail [dot] com",
  oldSite: "https://portfolio-nu-jet-99.vercel.app/",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/nudelman-benjamin/" },
    { label: "GitHub", url: "https://github.com/bnudelman4" },
  ],
}
