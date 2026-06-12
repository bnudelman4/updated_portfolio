import type { Project } from '@/lib/types'

export function projectLinks(p: Pick<Project, 'github' | 'live' | 'demo'>) {
  const out: { label: string; url: string }[] = []
  if (p.github) out.push({ label: 'GitHub', url: p.github })
  if (p.live) out.push({ label: 'Live', url: p.live })
  if (p.demo) out.push({ label: 'Demo', url: p.demo })
  return out
}
