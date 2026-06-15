'use client'
import Image from 'next/image'
import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'

const HEADLINE = 'I have a passion for developing software with real-world purpose'
const BODY =
  "I'm a Computer Science major at Cornell University with minors in ORIE (Operations Research and Information Engineering) and Applied Mathematics, with an expected graduation date of December 2027. When I'm not coding you can find me at the gym, playing basketball, playing poker, enjoying stock trading, or spending time with my friends and family."

// family.co-style entrance: a springy scale-up from small → full with a slight overshoot
// and a fade. Children inherit it through the stagger container, so they cascade in.
const POP: Variants = {
  hidden: { opacity: 0, scale: 0.55, y: 26 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    // low damping → visible overshoot past 1 before it settles (the "pop")
    transition: { type: 'spring', stiffness: 340, damping: 12, mass: 0.7 },
  },
}

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

export default function About() {
  const reduced = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)

  // Cursor parallax (damped) for the photo — lives on its own inner wrapper.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.5 })
  const px = useTransform(sx, [-1, 1], [28, -28])
  const py = useTransform(sy, [-1, 1], [22, -22])
  const protate = useTransform(sx, [-1, 1], [4, -4])

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const words = HEADLINE.split(' ')

  // Static render for reduced-motion: no pop, no parallax, no idle float.
  if (reduced) {
    return (
      <section id="about" ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(124,92,255,0.16),transparent_60%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="md:w-[56%]">
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-5">About</p>
            <h2 className="font-display font-bold uppercase text-4xl md:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
              {HEADLINE}
            </h2>
            <p className="mt-7 max-w-lg text-lg text-white/55">{BODY}</p>
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-[54%] md:w-[50%]">
          <div className="relative h-full w-full -rotate-[5deg]">
            <Image src="/ben-nobg.png" alt="Ben Nudelman" fill priority className="object-contain object-right-bottom" sizes="50vw" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-screen flex items-center overflow-hidden px-6 py-24"
    >
      {/* ambient glow (keeps existing palette) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(124,92,255,0.16),transparent_60%)]" />

      {/* Text — LEFT half. Whole block re-pops every time it re-enters (once: false). */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          className="md:w-[56%]"
          variants={STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.45 }}
        >
          <motion.p variants={POP} className="text-xs tracking-[0.25em] uppercase text-accent mb-5">
            About
          </motion.p>
          <h2 className="font-display font-bold uppercase text-4xl md:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
            {words.map((w, i) => (
              <motion.span key={i} variants={POP} className="inline-block mr-[0.25em] origin-bottom">
                {w}
              </motion.span>
            ))}
          </h2>
          <motion.p variants={POP} className="mt-7 max-w-lg text-lg text-white/55 origin-left">
            {BODY}
          </motion.p>
        </motion.div>
      </div>

      {/* Photo — RIGHT, large/dominant, tilted, bleeding off the edges.
          Outer = entrance pop (cascades in after the text via delay, replays on re-entry).
          Middle = idle float. Inner = cursor parallax/tilt. Separate wrappers so the
          transforms never fight. */}
      <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-[54%] md:w-[50%]">
        <motion.div
          className="h-full w-full origin-bottom-right"
          initial={{ scale: 0.74, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12, mass: 0.8, delay: 0.32 }}
        >
          <motion.div
            className="h-full w-full"
            animate={{ y: [0, -14, 0], rotate: [-0.4, 0.4, -0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div style={{ x: px, y: py, rotate: protate }} className="h-full w-full">
              <div className="relative h-full w-full -rotate-[5deg]">
                <div className="absolute -inset-x-10 -bottom-10 top-10 rounded-full bg-[radial-gradient(circle,rgba(35,213,171,0.22),transparent_70%)] blur-3xl" />
                <Image
                  src="/ben-nobg.png"
                  alt="Ben Nudelman"
                  fill
                  priority
                  sizes="50vw"
                  className="object-contain object-right-bottom drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
