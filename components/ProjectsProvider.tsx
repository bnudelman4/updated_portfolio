'use client'
import { useSyncExternalStore, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { projects } from '@/data/projects'
import ProjectDetail from './ProjectDetail'

// A module-level store (not React context): components rendered INSIDE the R3F <Canvas>
// (a separate reconciler that can't read outer context) and components outside it both
// drive the same open-project state through these plain functions.
let openId: number | null = null
const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}

export function openProject(id: number) {
  openId = id
  emit()
}
export function closeProject() {
  openId = null
  emit()
}
function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}
export function useOpenProject(): number | null {
  return useSyncExternalStore(subscribe, () => openId, () => null)
}

// Hosts the detail modal in the normal DOM tree (outside the Canvas), reading the store.
export default function ProjectsProvider({ children }: { children: ReactNode }) {
  const id = useOpenProject()
  const proj = projects.find((p) => p.id === id) || null
  return (
    <>
      {children}
      <AnimatePresence>
        {proj && <ProjectDetail key={proj.id} project={proj} onClose={closeProject} />}
      </AnimatePresence>
    </>
  )
}
