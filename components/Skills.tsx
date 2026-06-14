'use client'
import { motion, useReducedMotion } from 'framer-motion'
import type { IconType } from 'react-icons'
import {
  SiJavascript, SiSwift, SiPython, SiC, SiCplusplus, SiOcaml, SiHtml5, SiGnubash, SiOpenjdk,
  SiReact, SiNextdotjs, SiNodedotjs, SiApple, SiTensorflow, SiScikitlearn, SiD3, SiFlask,
  SiExpress, SiGit, SiVite, SiFirebase, SiMongodb, SiPrisma, SiDocker, SiFigma, SiTailwindcss,
} from 'react-icons/si'
import { LuCircleDot } from 'react-icons/lu'
import { skillGroups } from '@/data/content'
import { POP, staggerInView } from '@/lib/anim'

// Map each skill to a monochrome Simple Icons logo. Anything without a brand icon falls back
// to a neutral dot. (Only maps the skills already in data/content.ts — nothing added.)
const ICONS: Record<string, IconType> = {
  Java: SiOpenjdk, JavaScript: SiJavascript, Swift: SiSwift, Python: SiPython,
  C: SiC, 'C++': SiCplusplus, OCaml: SiOcaml, 'HTML/CSS': SiHtml5, BASH: SiGnubash,
  React: SiReact, 'React Native': SiReact, 'Next.js': SiNextdotjs, 'Node.js': SiNodedotjs,
  UIKit: SiApple, 'TensorFlow Lite': SiTensorflow, TensorFlow: SiTensorflow,
  'Scikit-learn': SiScikitlearn, 'D3.js': SiD3, Flask: SiFlask, Express: SiExpress,
  Git: SiGit, Vite: SiVite, Firebase: SiFirebase, MongoDB: SiMongodb, Prisma: SiPrisma,
  Docker: SiDocker, Figma: SiFigma, Codable: SiSwift, 'Tailwind CSS': SiTailwindcss,
}

export default function Skills() {
  const reduced = useReducedMotion() ?? false
  const stagger = reduced ? {} : staggerInView
  const item = reduced ? {} : { variants: POP }
  return (
    <section id="skills" className="max-w-5xl mx-auto px-6 py-28">
      <motion.div {...stagger}>
        <motion.p {...item} className="text-xs tracking-[0.2em] uppercase text-white/40">04 — Skills</motion.p>
        <motion.h2 {...item} className="font-display font-bold uppercase text-3xl md:text-4xl mt-3 mb-8 tracking-tight">
          Skills
        </motion.h2>

        <div className="space-y-7">
          {skillGroups.map((g) => (
            <motion.div key={g.name} {...item}>
              <h3 className="text-xs uppercase tracking-[0.18em] text-white/40 mb-3">{g.name}</h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => {
                  const Icon = ICONS[it] ?? LuCircleDot
                  return (
                    <span
                      key={it}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface
                                 px-3 py-1.5 text-[13px] text-white/80 transition
                                 hover:-translate-y-0.5 hover:border-accent2/60 hover:text-white"
                    >
                      <Icon className="shrink-0 text-[15px] text-white/60" aria-hidden />
                      {it}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
