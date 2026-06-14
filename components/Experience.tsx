'use client'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { experience } from '@/data/experience'
import { POP, staggerInView } from '@/lib/anim'

export default function Experience() {
  const reduced = useReducedMotion() ?? false
  const stagger = reduced ? {} : staggerInView
  const item = reduced ? {} : { variants: POP }

  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-28">
      <motion.div {...stagger}>
        <motion.p {...item} className="text-xs tracking-[0.2em] uppercase text-white/40">03 — Experience</motion.p>
        <motion.h2 {...item} className="font-display font-bold uppercase text-3xl md:text-5xl mt-3 tracking-tight leading-[0.95]">
          Where I&apos;ve worked
        </motion.h2>
        <motion.p {...item} className="mt-4 max-w-xl text-white/55">
          A short journey through the teams and projects I&apos;ve built with.
        </motion.p>

        {/* connected timeline flow */}
        <div className="relative mt-16">
          {/* the branch line: left rail on mobile, centered on desktop */}
          <div className="pointer-events-none absolute left-7 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 via-line to-accent2/40" />

          {experience.map((e, i) => {
            const left = i % 2 === 0
            return (
              <motion.div
                key={e.id}
                {...item}
                className="relative pl-20 md:pl-0 md:grid md:grid-cols-2 md:items-center md:gap-12 pb-12 last:pb-0 md:min-h-[13rem]"
              >
                {/* logo node on the line */}
                <div className="absolute left-7 md:left-1/2 top-1 md:top-1/2 z-10 -translate-x-1/2 md:-translate-y-1/2">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lg ring-4 ring-bg">
                    {e.logo ? (
                      <span className="relative h-10 w-10">
                        <Image src={e.logo} alt={`${e.org} logo`} fill className="object-contain" sizes="40px" />
                      </span>
                    ) : (
                      <span className="font-display font-bold text-black/80">{e.org[0]}</span>
                    )}
                  </div>
                </div>

                {/* card — alternates side on desktop */}
                <div className={left ? 'md:col-start-1 md:pr-14' : 'md:col-start-2 md:pl-14'}>
                  <div className="rounded-2xl border border-line bg-surface/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent2/40">
                    <p className="font-mono text-xs text-accent2">{e.start} → {e.end}</p>
                    <h3 className="mt-1.5 font-display font-bold uppercase text-xl md:text-2xl tracking-tight leading-[1.05]">
                      {e.role}
                    </h3>
                    <p className="mt-0.5 text-sm text-white/50">{e.org}</p>
                    <ul className="mt-4 space-y-2">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2 text-sm text-white/60 leading-relaxed">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
