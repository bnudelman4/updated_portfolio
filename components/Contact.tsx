'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { contact } from '@/data/content'
import { POP, staggerInView } from '@/lib/anim'

export default function Contact() {
  const reduced = useReducedMotion() ?? false
  const stagger = reduced ? {} : staggerInView
  const item = reduced ? {} : { variants: POP }
  return (
    <section id="contact" className="max-w-4xl mx-auto px-6 py-32 text-center">
      <motion.div {...stagger}>
        <motion.p {...item} className="text-xs tracking-[0.2em] uppercase text-white/40">05 — Contact</motion.p>
        <motion.h2 {...item} className="font-display font-bold uppercase text-4xl md:text-5xl mt-4 tracking-tight">
          {contact.message}
        </motion.h2>
        {/* email written out (obfuscated) rather than as a clickable address */}
        <motion.p {...item} className="mt-8 text-lg text-accent2">
          {contact.emailDisplay}
        </motion.p>
        <motion.div {...item} className="mt-8 flex justify-center gap-5 text-sm">
          {contact.links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
              {l.label}
            </a>
          ))}
          <a href="/updatedResume.pdf" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
            Resume
          </a>
        </motion.div>

        {/* old gamified portfolio — given real estate here instead of a tiny footer line */}
        <motion.p {...item} className="mt-14 text-base text-white/55">
          Want the older, gamified version of my portfolio?{' '}
          <a
            href={contact.oldSite}
            target="_blank"
            rel="noreferrer"
            className="text-accent font-medium underline underline-offset-4 hover:text-white"
          >
            Visit it here ↗
          </a>{' '}
          <span className="text-white/35">(outdated)</span>
        </motion.p>
      </motion.div>
    </section>
  )
}
