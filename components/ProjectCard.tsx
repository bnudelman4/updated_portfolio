'use client'
import type { Project } from '@/lib/types'

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: () => void
}) {
  return (
    <button
      onClick={onOpen}
      className="reveal group text-left rounded-2xl border border-line bg-surface p-6 transition
                 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_40px_-12px_#7C5CFF]"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{project.name}</h3>
        <span className="text-xs text-white/40">{project.techStack}</span>
      </div>
      <p className="mt-3 text-sm text-white/55 line-clamp-3">{project.description}</p>
      <span className="mt-4 inline-block text-xs text-accent2">{project.category} ↗</span>
    </button>
  )
}
