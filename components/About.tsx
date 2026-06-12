'use client'
import Image from 'next/image'
import { about } from '@/data/content'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function About() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="about" ref={ref} className="max-w-5xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">01 — About</p>
      <div className="mt-8 grid md:grid-cols-[1fr_220px] gap-10 items-start">
        <div>
          <h2 className="reveal font-display text-3xl md:text-4xl tracking-tight">
            {about.intro}
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="reveal mt-5 text-white/60 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <Image
          src="/ben.png"
          alt="Ben Nudelman"
          width={220}
          height={260}
          className="reveal rounded-xl object-cover border border-line"
        />
      </div>
    </section>
  )
}
