'use client'
import { useEffect } from 'react'
import type { Project } from '@/lib/types'
import { projectLinks } from '@/lib/links'

export default function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-surface p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          ✕
        </button>
        <p className="text-xs text-white/40">{project.timeframe}</p>
        <h3 className="font-display text-2xl mt-1">{project.name}</h3>
        <p className="mt-3 text-white/60">{project.description}</p>
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
    </div>
  )
}
