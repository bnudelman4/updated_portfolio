'use client'
import { useState } from 'react'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectDetail from './ProjectDetail'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function Work() {
  const ref = useScrollReveal<HTMLElement>()
  const [openId, setOpenId] = useState<number | null>(null)
  const open = projects.find((p) => p.id === openId) || null
  return (
    <section id="work" ref={ref} className="max-w-6xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">02 — Selected Work</p>
      <h2 className="reveal font-display text-3xl md:text-4xl mt-3 tracking-tight">
        Things I&apos;ve built
      </h2>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>
      {open && <ProjectDetail project={open} onClose={() => setOpenId(null)} />}
    </section>
  )
}
