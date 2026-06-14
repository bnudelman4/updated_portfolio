'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/types'
import { projectLinks } from '@/lib/links'
import { projectGradient } from '@/lib/projectVisual'

export default function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [onClose])
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative max-w-2xl w-full max-h-[88vh] overflow-y-auto rounded-2xl border border-line bg-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        {/* Project visual header (filler) */}
        <div className="relative h-40 rounded-t-2xl overflow-hidden" style={{ background: projectGradient(project.id) }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute bottom-4 left-6">
            <p className="text-xs text-white/70">{project.category}</p>
            <h3 id="project-detail-title" className="font-display text-3xl text-white drop-shadow">{project.name}</h3>
          </div>
        </div>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
        >
          ✕
        </button>

        <div className="p-8">
          <p className="text-xs text-white/40">{project.timeframe}</p>
          <p className="mt-3 text-white/70">{project.description}</p>
          <ul className="mt-5 space-y-2">
            {project.features.map((f, i) => (
              <li key={i} className="text-sm text-white/70 pl-4 border-l-2 border-accent/50">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full border border-line text-white/60">
                {t}
              </span>
            ))}
          </div>
          <pre className="mt-5 text-xs bg-black/50 rounded-lg p-4 overflow-x-auto text-white/70">
            <code>{project.code}</code>
          </pre>
          <div className="mt-5 flex gap-3">
            {projectLinks(project).map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm px-4 py-2 rounded-lg bg-accent/20 border border-accent/40 hover:bg-accent/30"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
