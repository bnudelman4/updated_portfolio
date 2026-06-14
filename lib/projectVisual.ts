// Filler visuals for projects until real screenshots exist. Deterministic per id so a
// project always gets the same look across the showcase card, mockup, and detail modal.
const PALETTES: [string, string][] = [
  ['#6366f1', '#a855f7'],
  ['#0ea5e9', '#22d3ee'],
  ['#f43f5e', '#fb923c'],
  ['#10b981', '#34d399'],
  ['#8b5cf6', '#ec4899'],
  ['#f59e0b', '#ef4444'],
  ['#14b8a6', '#3b82f6'],
]

export function projectColors(id: number): [string, string] {
  return PALETTES[(id - 1) % PALETTES.length]
}

export function projectGradient(id: number, angle = 135): string {
  const [a, b] = projectColors(id)
  return `linear-gradient(${angle}deg, ${a}, ${b})`
}
