'use client'
import { skillGroups } from '@/data/content'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function Skills() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="skills" ref={ref} className="max-w-5xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">04 — Skills</p>
      <div className="mt-8 space-y-8">
        {skillGroups.map((g) => (
          <div key={g.name} className="reveal">
            <h3 className="text-sm text-white/50 mb-3">{g.name}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span
                  key={it}
                  className="text-sm px-3 py-1.5 rounded-full border border-line bg-surface text-white/70
                             transition hover:border-accent2/60 hover:text-white"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
