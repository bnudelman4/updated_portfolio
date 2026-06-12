'use client'
import { contact } from '@/data/content'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function Contact() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="contact" ref={ref} className="max-w-4xl mx-auto px-6 py-32 text-center">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">05 — Contact</p>
      <h2 className="reveal font-display text-4xl md:text-5xl mt-4 tracking-tight">
        {contact.message}
      </h2>
      <a
        href={`mailto:${contact.email}`}
        className="reveal inline-block mt-8 text-lg text-accent2 hover:underline"
      >
        {contact.email}
      </a>
      <div className="reveal mt-8 flex justify-center gap-5 text-sm">
        {contact.links.map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
            {l.label}
          </a>
        ))}
        <a href="/Resume.pdf" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
          Resume
        </a>
      </div>
    </section>
  )
}
