'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, useMotionValue, type Variants } from 'framer-motion'
import { useScroll } from '@react-three/drei'
import { projects } from '@/data/projects'
import IMacStage from './three/IMacStage'
import { scrollToId } from '@/lib/scroll'

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const FADE_MS = 650 // per-project fade-up duration (matches the About entrance feel)

// Same springy pop/cascade as the About entrance — used for the detail-panel text so it
// pops in on open and pops back out on close ("come and go").
const POP: Variants = {
  hidden: { opacity: 0, scale: 0.55, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 13, mass: 0.7 } },
  exit: { opacity: 0, scale: 0.85, y: -16, transition: { duration: 0.18 } },
}
const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

export default function Work() {
  const reduced = useReducedMotion() ?? false
  // In the 3D path Work renders inside drei's <Scroll html> provider, so useScroll() returns
  // the scroll state; in the fallback (native-scroll) path it returns null. We pin the panel
  // with native CSS sticky in the fallback path, and via the in-canvas <WorkPin> controller
  // (synced to drei's content transform) in the 3D path — never with a lagging JS counter-
  // translate here, which is what caused the shaky scroll.
  const inThree = !!useScroll()
  const section = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const phaseRef = useRef(0)
  const lastRaw = useRef(0)
  const [index, setIndex] = useState(0)
  const idxRef = useRef(0)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  openRef.current = open

  // Per-project fade-up, driven on the DOM canvas wrapper (no 3D transparency sorting).
  const enterAt = useRef(-1)
  const modelOpacity = useMotionValue(reduced ? 1 : 0)
  const modelY = useMotionValue(reduced ? 0 : 22)

  // Custom hover cursor (white circle + plus). Position via motion values so mousemove
  // never re-renders; only enter/leave toggles state.
  const curX = useMotionValue(0)
  const curY = useMotionValue(0)
  const [hovering, setHovering] = useState(false)

  // The panel is PINNED outside this component — natively via CSS `position: sticky` in the
  // fallback path, and via the in-canvas <WorkPin> controller (synced to drei's content
  // transform) in the 3D path. Here we only READ scroll progress to map scroll → project
  // index, drive the per-project fade-up, and collapse any open detail on scroll. These are
  // not pixel-positional, so a single rAF reading layout is fine — it can't cause pin jitter.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const sec = section.current
      if (sec) {
        const range = Math.max(1, sec.offsetHeight - window.innerHeight)
        const raw = clamp(-sec.getBoundingClientRect().top / range, 0, 1)
        phaseRef.current = raw

        if (openRef.current && Math.abs(raw - lastRaw.current) > 0.0012) setOpen(false)
        lastRaw.current = raw

        const i = clamp(Math.round(raw * (projects.length - 1)), 0, projects.length - 1)
        if (i !== idxRef.current) {
          idxRef.current = i
          setIndex(i)
          if (!reduced) enterAt.current = performance.now() // re-fire the fade-up
        }
      }

      // Time-based fade-up (independent of scroll).
      if (!reduced) {
        if (enterAt.current < 0) enterAt.current = performance.now()
        const e = easeOutCubic(clamp((performance.now() - enterAt.current) / FADE_MS, 0, 1))
        modelOpacity.set(e)
        modelY.set((1 - e) * 22)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, modelOpacity, modelY])

  const current = projects[index]
  const cta = current.live || current.github
  const toggle = () => setOpen((o) => !o)

  const onCursorMove = (e: React.MouseEvent) => {
    const rect = panel.current?.getBoundingClientRect()
    if (!rect) return
    curX.set(e.clientX - rect.left)
    curY.set(e.clientY - rect.top)
  }

  const stageAnim = reduced
    ? { x: open ? '-20%' : '0%', scale: open ? 0.92 : 1 }
    : { x: open ? '-26%' : '0%', scale: open ? 0.9 : 1 }
  const stageTransition = reduced
    ? { duration: 0.25 }
    : ({ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 } as const)

  const showCursor = hovering && !open && !reduced

  return (
    <section id="work" ref={section} style={{ height: `${projects.length * 100}vh` }} className="relative">
      {/* Pinned stage. Fallback path: native CSS sticky (compositor-driven, jitter-free).
          3D path: position relative; the in-canvas <WorkPin> controller sets the transform. */}
      <div
        ref={panel}
        id="work-pin"
        style={inThree ? undefined : { position: 'sticky', top: 0 }}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Persistent corner CTA (Scout's "build with us") */}
        <button
          onClick={(e) => { e.currentTarget.blur(); scrollToId('contact') }}
          className="absolute top-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm text-white backdrop-blur hover:bg-accent/20 transition"
        >
          <span className="h-2 w-2 rounded-full bg-accent2 animate-pulse" />
          build with me →
        </button>

        <div className="relative h-full max-w-6xl mx-auto px-6">
          {/* STAGE: iMac (big, centered) + name below. Slides LEFT when opened. */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2"
            animate={stageAnim}
            transition={stageTransition}
          >
            {/* iMac — fades up on each project; click to open/close; custom hover cursor */}
            <div
              role="button"
              tabIndex={0}
              aria-label={open ? `Close ${current.name}` : `Open ${current.name}`}
              aria-expanded={open}
              onClick={toggle}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle())}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onMouseMove={onCursorMove}
              style={{ cursor: open || reduced ? 'pointer' : 'none' }}
              className="group relative h-[58vh] w-full max-w-3xl outline-none"
            >
              <motion.div className="h-full w-full" style={{ opacity: modelOpacity, y: modelY }}>
                <IMacStage projects={projects} phaseRef={phaseRef} reduced={reduced} onIndex={setIndex} />
              </motion.div>
            </div>

            {/* Project NAME below the model — same font as the About headline. Hidden when
                opened (the name becomes the panel heading on the right). */}
            <motion.div
              className="pointer-events-none -mt-2 text-center"
              animate={{ opacity: open ? 0 : 1, y: open ? 12 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.h3
                  key={current.id}
                  {...(reduced
                    ? {}
                    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 }, transition: { duration: 0.35 } })}
                  className="font-display font-bold uppercase text-5xl md:text-7xl tracking-tight leading-[0.95]"
                >
                  {current.name}
                </motion.h3>
              </AnimatePresence>
              <p className="mt-3 font-mono text-xs text-white/40">
                {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {current.category}
              </p>
            </motion.div>
          </motion.div>

          {/* DETAIL panel — slides in from the right when opened (collapses out right on scroll) */}
          <AnimatePresence>
            {open && (
              <motion.aside
                key="detail"
                className="absolute top-0 right-0 z-20 flex h-full w-full items-center md:w-[46%]"
                variants={reduced ? undefined : STAGGER}
                initial={reduced ? { opacity: 0 } : 'hidden'}
                animate={reduced ? { opacity: 1 } : 'show'}
                exit={reduced ? { opacity: 0 } : 'exit'}
                transition={reduced ? { duration: 0.2 } : undefined}
              >
                <div className="w-full pr-2">
                  {current.timeframe && (
                    <motion.p variants={reduced ? undefined : POP} className="font-mono text-xs text-accent2 mb-3">
                      {current.timeframe}
                    </motion.p>
                  )}
                  <motion.h3
                    variants={reduced ? undefined : POP}
                    className="font-display font-bold uppercase text-4xl md:text-5xl tracking-tight leading-[0.95] origin-left"
                  >
                    {current.name}
                  </motion.h3>
                  <motion.p variants={reduced ? undefined : POP} className="mt-2 font-mono text-xs text-white/40">
                    {current.category}
                  </motion.p>
                  {/* Body matches the About section's body style (was: text-white/60). Headings
                      above use the same font-display uppercase treatment as the About headline. */}
                  <motion.p variants={reduced ? undefined : POP} className="mt-5 text-lg text-white/55 leading-relaxed line-clamp-5 origin-left">
                    {current.description}
                  </motion.p>

                  {/* small feature/stat points */}
                  <ul className="mt-5 space-y-2">
                    {current.features.slice(0, 3).map((f, i) => (
                      <motion.li key={i} variants={reduced ? undefined : POP} className="flex gap-2 text-sm text-white/55 origin-left">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="line-clamp-2">{f}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {cta && (
                    <motion.div variants={reduced ? undefined : POP} className="mt-7 flex flex-wrap gap-3">
                      <a
                        href={cta}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition"
                      >
                        {current.live ? 'Visit site ↗' : 'View repo ↗'}
                      </a>
                    </motion.div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Custom hover cursor: white circle with a plus inside (positioned panel-local) */}
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-[60]"
            style={{ x: curX, y: curY }}
            animate={{ opacity: showCursor ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-white/15 backdrop-blur-sm">
              <span className="text-3xl font-thin leading-none text-white">+</span>
            </div>
          </motion.div>
        </div>

        {/* progress dots */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {projects.map((p, i) => (
            <span key={p.id} className={`h-1 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-3 bg-white/25'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
