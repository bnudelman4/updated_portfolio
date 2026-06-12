'use client'
import { experience } from '@/data/experience'
import TimelineItem from './TimelineItem'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function Experience() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="experience" ref={ref} className="max-w-4xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">03 — Experience</p>
      <h2 className="reveal font-display text-3xl md:text-4xl mt-3 mb-10 tracking-tight">
        Where I&apos;ve worked
      </h2>
      {experience.map((e) => (
        <TimelineItem key={e.id} entry={e} />
      ))}
    </section>
  )
}
