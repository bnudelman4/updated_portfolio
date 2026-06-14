import type { Variants } from 'framer-motion'

// Shared "incoming" entrance used across the site (originally the About section): a springy
// scale-up from small to full with a slight overshoot + fade, cascaded via a stagger parent.
// Replays on re-entry (use viewport={{ once: false }}).
//
// NOTE (revert): sections previously used the CSS `.reveal` class via lib/useScrollReveal.
// That hook still exists — to revert a section, drop these variants and restore useScrollReveal.
export const POP: Variants = {
  hidden: { opacity: 0, scale: 0.55, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 13, mass: 0.7 } },
  exit: { opacity: 0, scale: 0.85, y: -16, transition: { duration: 0.18 } },
}

export const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

// Props for a stagger container that plays on scroll-in and replays on re-entry.
export const staggerInView = {
  variants: STAGGER,
  initial: 'hidden' as const,
  whileInView: 'show' as const,
  viewport: { once: false, amount: 0.3 },
}
