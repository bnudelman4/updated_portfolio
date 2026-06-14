'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { POP, staggerInView } from '@/lib/anim'

export default function Footer() {
  const reduced = useReducedMotion() ?? false
  const stagger = reduced ? {} : staggerInView
  const item = reduced ? {} : { variants: POP }
  return (
    <motion.footer
      {...stagger}
      className="border-t border-line py-7 text-center text-xs text-white/40 space-y-2"
    >
      <motion.p {...item}>© 2026 Ben Nudelman · Built with Next.js + three.js</motion.p>
      <motion.p {...item} className="text-white/30">
        3D model: &ldquo;Complete Office Workplace Setup&rdquo; by Demycs, via{' '}
        <a href="https://www.blenderkit.com/" target="_blank" rel="noreferrer" className="underline hover:text-white/60">
          BlenderKit
        </a>{' '}
        · Royalty Free license
      </motion.p>
      <motion.p {...item} className="text-white/30">
        &ldquo;iMac 2021&rdquo; model by DatSketch · licensed under{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline hover:text-white/60">
          CC BY 4.0
        </a>
      </motion.p>
    </motion.footer>
  )
}
