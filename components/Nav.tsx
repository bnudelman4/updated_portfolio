'use client'
import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import type { IconType } from 'react-icons'
import { SiGithub } from 'react-icons/si'
import {
  LuWifi, LuBatteryFull, LuSignalHigh, LuMail, LuFileText, LuUser, LuFolder,
  LuTrendingUp, LuFlame, LuSearch, LuCar, LuShieldCheck, LuTerminal, LuMusic,
  LuGraduationCap, LuCpu, LuBookOpen, LuMapPin,
} from 'react-icons/lu'
import { projects } from '@/data/projects'
import { projectColors } from '@/lib/projectVisual'
import { scrollToId, scrollToProject } from '@/lib/scroll'

// Shorter display label for the app grid where the full name is too long (full name still
// used for aria-label and everywhere else).
const LABELS: Record<number, string> = {
  1: 'FinVerifier',
}

// Clean line-icon (not emoji) representing each project, keyed by id.
const ICONS: Record<number, IconType> = {
  1: LuTrendingUp, 2: LuFlame, 3: LuSearch, 4: LuCar, 5: LuShieldCheck, 6: LuTerminal,
  7: LuMusic, 8: LuGraduationCap, 9: LuCpu, 10: LuBookOpen, 11: LuMapPin,
}

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
}
const appPop: Variants = {
  hidden: { opacity: 0, scale: 0.4, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 18 } },
}

const linkCls = 'px-4 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition'

export default function Nav() {
  const [showPhone, setShowPhone] = useState(false)

  const close = () => setShowPhone(false)
  const pickProject = (index: number) => {
    close()
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToProject(index)))
  }
  const goSection = (id: string) => {
    close()
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)))
  }

  // iOS dock — pinned "apps" for the key links.
  const dock: { label: string; icon: IconType; onClick?: () => void; href?: string; target?: string }[] = [
    { label: 'About', icon: LuUser, onClick: () => goSection('about') },
    { label: 'Email', icon: LuMail, href: 'mailto:bnudelman2@gmail.com' },
    { label: 'Resume', icon: LuFileText, href: '/updatedResume.pdf', target: '_blank' },
    { label: 'GitHub', icon: SiGithub, href: 'https://github.com/bnudelman4', target: '_blank' },
  ]

  return (
    <>
      {/* About on the left, the rest on the right; no underline */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-5 py-3 bg-bg/50 backdrop-blur-md text-sm">
        <button onClick={() => scrollToId('about')} className={linkCls}>About</button>
        <div className="flex gap-1 sm:gap-2">
          <button onClick={() => setShowPhone(true)} className={linkCls}>Projects</button>
          <button onClick={() => scrollToId('experience')} className={linkCls}>Experience</button>
          <button onClick={() => scrollToId('contact')} className={linkCls}>Contact</button>
        </div>
      </nav>

      {/* Projects → near-fullscreen iPhone home screen with an app per project */}
      <AnimatePresence>
        {showPhone && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/75 backdrop-blur-md p-4"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="relative flex h-[92vh] aspect-[9/19.5] max-w-[94vw] flex-col rounded-[3.2rem] border-[10px] border-[#0c0c10] bg-[radial-gradient(circle_at_50%_16%,#3a2d6b,transparent_55%),radial-gradient(circle_at_82%_88%,#1d4f5e,transparent_50%),linear-gradient(#0b0a14,#070710)] shadow-2xl overflow-hidden"
            >
              {/* notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-7 w-28 rounded-full bg-black z-20" />
              {/* status bar */}
              <div className="flex items-center justify-between px-8 pt-4 text-white text-[13px] font-semibold">
                <span>9:41</span>
                <span className="flex items-center gap-1.5">
                  <LuSignalHigh className="text-[14px]" aria-hidden />
                  <LuWifi className="text-[14px]" aria-hidden />
                  <LuBatteryFull className="text-[17px]" aria-hidden />
                </span>
              </div>

              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-3 right-4 z-30 h-8 w-8 grid place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
              >
                ✕
              </button>

              {/* app grid — 4 per row, iOS-style full labels */}
              <motion.div
                variants={grid}
                initial="hidden"
                animate="show"
                className="mt-10 grid grid-cols-4 gap-x-2 gap-y-5 px-4"
              >
                {projects.map((p, i) => {
                  const [a, b] = projectColors(p.id)
                  const Icon = ICONS[p.id] ?? LuFolder
                  return (
                    <motion.button
                      key={p.id}
                      variants={appPop}
                      whileHover={{ scale: 1.08 }}
                      onClick={() => pickProject(i)}
                      className="flex flex-col items-center gap-1.5 outline-none"
                      aria-label={`Open ${p.name}`}
                    >
                      <span
                        className="grid aspect-square w-[56px] max-w-full place-items-center rounded-[23%] shadow-lg ring-1 ring-white/15"
                        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
                      >
                        <Icon className="text-[26px] text-white drop-shadow" aria-hidden />
                      </span>
                      {/* name (short label where set), wraps fully, never truncated */}
                      <span className="w-full text-center text-[10px] leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                        {LABELS[p.id] ?? p.name}
                      </span>
                    </motion.button>
                  )
                })}
              </motion.div>

              {/* page dots */}
              <div className="absolute bottom-[6.5rem] left-1/2 -translate-x-1/2 flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              </div>

              {/* dock */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 rounded-[1.75rem] bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-xl">
                {dock.map(({ label, icon: Icon, onClick, href, target }) =>
                  href ? (
                    <a
                      key={label}
                      href={href}
                      target={target}
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-12 w-12 place-items-center rounded-[26%] bg-white/15 text-white ring-1 ring-white/10 transition hover:bg-white/25"
                    >
                      <Icon className="text-xl" aria-hidden />
                    </a>
                  ) : (
                    <button
                      key={label}
                      onClick={onClick}
                      aria-label={label}
                      className="grid h-12 w-12 place-items-center rounded-[26%] bg-white/15 text-white ring-1 ring-white/10 transition hover:bg-white/25"
                    >
                      <Icon className="text-xl" aria-hidden />
                    </button>
                  ),
                )}
              </div>

              {/* home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-32 rounded-full bg-white/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
