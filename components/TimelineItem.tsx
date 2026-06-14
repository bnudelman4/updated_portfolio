import type { ExperienceEntry } from '@/lib/types'

export default function TimelineItem({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="relative pl-8 pb-10 border-l border-line last:pb-0">
      <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
      <p className="text-xs text-white/40">
        {entry.start} — {entry.end}
      </p>
      <h3 className="font-display text-lg mt-1">
        {entry.role} <span className="text-white/50">· {entry.org}</span>
        {entry.placeholder && (
          <span className="ml-2 text-[10px] uppercase tracking-wide text-accent3/70">
            placeholder
          </span>
        )}
      </h3>
      <ul className="mt-2 space-y-1">
        {entry.bullets.map((b, i) => (
          <li key={i} className="text-sm text-white/60">
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}
