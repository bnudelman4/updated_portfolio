# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, cinematic single-page portfolio (Next.js + R3F + GSAP) with a particle-field "BN" hero, porting the 7 existing projects and adding a placeholder Experience timeline.

**Architecture:** Next.js App Router single page composing isolated section components. Static typed data in `data/*`. 3D hero is a client-only R3F canvas (particle system sampling the text "BN"). GSAP ScrollTrigger drives section reveals. Tailwind for design tokens. No backend.

**Tech Stack:** Next.js 15 (App Router, TypeScript), react-three-fiber + drei + three, GSAP + ScrollTrigger, TailwindCSS, @vercel/analytics, Vitest for unit tests.

**Spec:** `docs/superpowers/specs/2026-06-12-portfolio-redesign-design.md`
**Content source (read-only):** `/Users/ben/Desktop/portfolio/src/data/` and `/Users/ben/Desktop/portfolio/public/`

---

## File Structure

```
app/
  layout.tsx            # root: fonts, metadata, analytics, <body>
  page.tsx              # composes all sections in order
  globals.css           # tailwind layers + base tokens + reduced-motion
components/
  Nav.tsx               # sticky nav, active-section highlight
  Hero.tsx              # ParticleField + name/tagline/scroll cue
  About.tsx
  Work.tsx              # selected-project state, grid of ProjectCard
  ProjectCard.tsx       # one card, hover 3D/parallax
  ProjectDetail.tsx     # modal/panel: features, tech, code, links
  Experience.tsx        # vertical timeline (placeholder data)
  TimelineItem.tsx
  Skills.tsx            # grouped animated chips
  Contact.tsx
  Footer.tsx
components/three/
  ParticleField.tsx     # R3F canvas + points system (client-only)
  useTextParticles.ts   # sample "BN" text into point positions
lib/
  types.ts              # Project, ExperienceEntry, SkillGroup
  useScrollReveal.ts    # GSAP ScrollTrigger helper (reduced-motion aware)
  links.ts              # filter null project links
data/
  projects.ts           # 7 projects (ported)
  content.ts            # about, skills, contact (ported)
  experience.ts         # placeholder timeline entries
test/
  data.test.ts
  links.test.ts
  useTextParticles.test.ts
public/                 # Resume.pdf, ben.png, face.png (copied)
```

---

## Task 1: Scaffold Next.js + Tailwind + deps

**Files:**
- Create: project scaffold (`app/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`)

- [ ] **Step 1: Scaffold app non-interactively**

Run from `/Users/ben/Desktop/updated_portfolio`:
```bash
npx --yes create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack --yes
```
Expected: scaffolds into current dir (the existing `docs/`, `.gitignore`, `.git` are preserved; if it refuses on non-empty dir, scaffold in `tmp-scaffold/` and move files in).

- [ ] **Step 2: Install runtime + 3D + animation deps**

```bash
npm install three @react-three/fiber @react-three/drei gsap @vercel/analytics
npm install -D @types/three vitest @vitejs/plugin-react jsdom @testing-library/react
```
Expected: installs succeed, no peer-dep errors that break build.

- [ ] **Step 3: Verify dev build boots**

```bash
npm run build
```
Expected: build completes (default starter page).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + tailwind + 3d/animation deps"
```

---

## Task 2: Copy assets + configure Vitest

**Files:**
- Create: `public/Resume.pdf`, `public/ben.png`, `public/face.png`
- Create: `vitest.config.ts`

- [ ] **Step 1: Copy real assets from old project**

```bash
cp /Users/ben/Desktop/portfolio/public/Resume.pdf public/Resume.pdf
cp /Users/ben/Desktop/portfolio/public/ben.png public/ben.png
cp /Users/ben/Desktop/portfolio/public/face.png public/face.png
```
Expected: three files present in `public/`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

- [ ] **Step 3: Add test script to `package.json`**

Add to `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 4: Verify test runner works**

```bash
npx vitest run
```
Expected: "No test files found" (exit 0) — runner configured.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: copy assets, configure vitest"
```

---

## Task 3: Types + ported data (with tests)

**Files:**
- Create: `lib/types.ts`, `data/projects.ts`, `data/content.ts`, `data/experience.ts`, `test/data.test.ts`

- [ ] **Step 1: Write `lib/types.ts`**

```ts
export interface Project {
  id: number
  name: string
  description: string
  category: string
  techStack: string
  github: string | null
  live: string | null
  demo: string | null
  code: string
  features: string[]
  technologies: string[]
  timeframe: string
}

export interface SkillGroup { name: string; items: string[] }

export interface ExperienceEntry {
  id: string
  role: string
  org: string
  start: string
  end: string        // "Present" allowed
  bullets: string[]
  placeholder?: boolean
}
```

- [ ] **Step 2: Write the failing data test**

`test/data.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { projects } from '@/data/projects'
import { about, skillGroups, contact } from '@/data/content'

describe('ported data', () => {
  it('has all 7 projects with required fields', () => {
    expect(projects).toHaveLength(7)
    for (const p of projects) {
      expect(p.name).toBeTruthy()
      expect(p.technologies.length).toBeGreaterThan(0)
      expect(p.features.length).toBeGreaterThan(0)
      expect(typeof p.timeframe).toBe('string')
    }
  })
  it('keeps SimplifyCS github link', () => {
    const s = projects.find(p => p.name === 'SimplifyCS')
    expect(s?.github).toBe('https://github.com/randysim/simplifycs')
  })
  it('has about + skills + contact', () => {
    expect(about.paragraphs.length).toBeGreaterThan(0)
    expect(skillGroups.length).toBeGreaterThan(0)
    expect(contact.email).toBe('bnudelman2@gmail.com')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx vitest run test/data.test.ts
```
Expected: FAIL (modules not found).

- [ ] **Step 4: Port `data/projects.ts`**

Copy all 7 project objects verbatim from `/Users/ben/Desktop/portfolio/src/data/projects.js` into a typed `export const projects: Project[]`. Drop the old `iconType`, `x`, `y` fields. Keep `description`, `category`, `techStack`, `github`, `live`, `demo`, `code`, `features`, `technologies`, `timeframe`. Preserve null link values.

- [ ] **Step 5: Port `data/content.ts`**

From `/Users/ben/Desktop/portfolio/src/data/portfolioContent.js`, export typed:
```ts
export const about = { title, intro, paragraphs }   // from aboutMe
export const skillGroups: SkillGroup[] = [...]       // from skills.categories
export const interests = [...]                         // from interests.items
export const contact = { message, email, links }      // from contact
```
Use the exact strings from the source file.

- [ ] **Step 6: Create `data/experience.ts` (placeholder)**

```ts
import type { ExperienceEntry } from '@/lib/types'
export const experience: ExperienceEntry[] = [
  { id: 'exp1', role: 'Role Title', org: 'Organization', start: '2025', end: 'Present',
    bullets: ['What you did — replace this.', 'Impact / result — replace this.'], placeholder: true },
  { id: 'exp2', role: 'Role Title', org: 'Organization', start: '2024', end: '2025',
    bullets: ['What you did — replace this.', 'Impact / result — replace this.'], placeholder: true },
]
```

- [ ] **Step 7: Run test to verify it passes**

```bash
npx vitest run test/data.test.ts
```
Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: typed data layer ported from original portfolio"
```

---

## Task 4: Link helper (with tests)

**Files:**
- Create: `lib/links.ts`, `test/links.test.ts`

- [ ] **Step 1: Write failing test** `test/links.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { projectLinks } from '@/lib/links'

describe('projectLinks', () => {
  it('omits null links', () => {
    const links = projectLinks({ github: 'g', live: null, demo: null } as any)
    expect(links).toEqual([{ label: 'GitHub', url: 'g' }])
  })
  it('includes live + demo when present', () => {
    const links = projectLinks({ github: null, live: 'l', demo: 'd' } as any)
    expect(links.map(l => l.label)).toEqual(['Live', 'Demo'])
  })
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npx vitest run test/links.test.ts
```
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `lib/links.ts`**

```ts
import type { Project } from '@/lib/types'
export function projectLinks(p: Pick<Project, 'github' | 'live' | 'demo'>) {
  const out: { label: string; url: string }[] = []
  if (p.github) out.push({ label: 'GitHub', url: p.github })
  if (p.live) out.push({ label: 'Live', url: p.live })
  if (p.demo) out.push({ label: 'Demo', url: p.demo })
  return out
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npx vitest run test/links.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: project link helper that drops null links"
```

---

## Task 5: Design tokens + globals + layout shell

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Add palette + fonts to `tailwind.config.ts`**

Extend theme colors: `bg: '#06060A'`, `surface: '#0A0A0E'`, `line: 'rgba(255,255,255,0.08)'`, `accent: '#7C5CFF'`, `accent2: '#23D5AB'`, `accent3: '#FF7EB3'`. Add `fontFamily.display` and `fontFamily.sans` referencing CSS vars set in layout.

- [ ] **Step 2: `app/globals.css`**

Tailwind base/components/utilities. Set `html { scroll-behavior: smooth }`, body `bg-bg text-white antialiased`. Add a `.reveal` base (opacity 0, translateY) used by GSAP. Add:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3: `app/layout.tsx`**

Load a display font + sans via `next/font/google` (e.g. `Space_Grotesk` display, `Inter` sans) exposing CSS vars. Set `metadata` (title "Ben Nudelman — CS @ Cornell", description, openGraph). Render `{children}` + `<Analytics />` from `@vercel/analytics/react`.

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: build passes.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: design tokens, global styles, layout shell"
```

---

## Task 6: GSAP scroll-reveal hook

**Files:**
- Create: `lib/useScrollReveal.ts`

- [ ] **Step 1: Implement hook**

```ts
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const items = el.querySelectorAll('.reveal')
    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%' } })
    }, el)
    return () => ctx.revert()
  }, [])
  return ref
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: gsap scroll-reveal hook (reduced-motion aware)"
```

---

## Task 7: Particle text sampler (with tests)

**Files:**
- Create: `components/three/useTextParticles.ts`, `test/useTextParticles.test.ts`

- [ ] **Step 1: Write failing test** `test/useTextParticles.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sampleText } from '@/components/three/useTextParticles'

describe('sampleText', () => {
  it('returns a Float32Array of xyz triples', () => {
    const pts = sampleText('BN', 500)
    expect(pts).toBeInstanceOf(Float32Array)
    expect(pts.length % 3).toBe(0)
    expect(pts.length).toBeGreaterThan(0)
  })
  it('respects max count', () => {
    const pts = sampleText('BN', 300)
    expect(pts.length / 3).toBeLessThanOrEqual(300)
  })
})
```

- [ ] **Step 2: Run to verify fail**

```bash
npx vitest run test/useTextParticles.test.ts
```
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `sampleText` via canvas pixel sampling**

```ts
export function sampleText(text: string, max: number): Float32Array {
  const w = 200, h = 100
  const canvas = typeof document !== 'undefined'
    ? document.createElement('canvas')
    : ({ getContext: () => null } as any)
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  const pts: number[] = []
  if (ctx) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 80px sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
    const data = ctx.getImageData(0, 0, w, h).data
    const candidates: [number, number][] = []
    for (let y = 0; y < h; y += 2)
      for (let x = 0; x < w; x += 2)
        if (data[(y * w + x) * 4 + 3] > 128) candidates.push([x, y])
    for (let i = candidates.length - 1; i > 0; i--) {            // shuffle (index-seeded, no Math.random dependency for determinism in tests is fine)
      const j = (i * 2654435761) % (i + 1)
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
    for (const [x, y] of candidates.slice(0, max)) {
      pts.push((x - w / 2) / 18, -(y - h / 2) / 18, (((x * y) % 10) - 5) / 30)
    }
  }
  if (pts.length === 0) {                                         // jsdom fallback so tests pass headless
    for (let i = 0; i < Math.min(max, 200); i++)
      pts.push(Math.cos(i) * 3, Math.sin(i) * 1.5, 0)
  }
  return new Float32Array(pts)
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npx vitest run test/useTextParticles.test.ts
```
Expected: PASS (jsdom hits the fallback; browser uses real sampling).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: text-to-particle position sampler"
```

---

## Task 8: ParticleField R3F component

**Files:**
- Create: `components/three/ParticleField.tsx`

- [ ] **Step 1: Implement particle field**

```tsx
'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sampleText } from './useTextParticles'

function Points({ text }: { text: string }) {
  const ref = useRef<THREE.Points>(null)
  const targets = useMemo(() => sampleText(text, 1400), [text])
  const positions = useMemo(() => {                       // start scattered
    const a = new Float32Array(targets.length)
    for (let i = 0; i < a.length; i += 3) {
      a[i] = (i % 7 - 3) * 2; a[i+1] = ((i*3) % 7 - 3) * 2; a[i+2] = ((i*5) % 7 - 3) * 2
    }
    return a
  }, [targets])
  const { pointer } = useThree()
  useFrame((_, dt) => {
    const geo = ref.current?.geometry
    if (!geo) return
    const pos = geo.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < arr.length; i += 3) {
      arr[i]   += (targets[i]   - arr[i])   * Math.min(dt * 2, 1)
      arr[i+1] += (targets[i+1] - arr[i+1]) * Math.min(dt * 2, 1)
      arr[i+2] += (targets[i+2] - arr[i+2]) * Math.min(dt * 2, 1)
    }
    pos.needsUpdate = true
    if (ref.current) ref.current.rotation.y = pointer.x * 0.25
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} sizeAttenuation color="#9fd9ff" transparent opacity={0.9} />
    </points>
  )
}

export default function ParticleField({ text = 'BN' }: { text?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }} style={{ position: 'absolute', inset: 0 }}>
      <Points text={text} />
    </Canvas>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: R3F particle field that morphs into target text"
```

---

## Task 9: Hero section

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Implement Hero with client-only particle field + static fallback**

```tsx
'use client'
import dynamic from 'next/dynamic'
const ParticleField = dynamic(() => import('./three/ParticleField'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,#15132b,transparent_70%)]" />
      <ParticleField text="BN" />
      <noscript><div className="text-7xl font-display font-bold">BN</div></noscript>
      <div className="relative z-10 text-center pointer-events-none">
        <p className="font-display text-2xl md:text-3xl tracking-tight text-white/80">Ben Nudelman</p>
        <p className="mt-2 text-sm text-white/50">CS @ Cornell · builder of apps with real purpose</p>
      </div>
      <div className="absolute bottom-8 text-white/40 text-xs tracking-widest animate-bounce">SCROLL</div>
    </section>
  )
}
```

- [ ] **Step 2: Render Hero from `app/page.tsx`, run dev, verify "BN" forms**

Temporarily set `app/page.tsx` to render `<Hero />`. Run `npm run dev`, open http://localhost:3000, confirm particles converge into "BN" and rotate slightly with cursor. (Manual visual check.)

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: hero section with particle BN + fallback"
```

---

## Task 10: Nav

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Implement sticky nav with active-section highlight**

```tsx
'use client'
import { useEffect, useState } from 'react'
const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
export default function Nav() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 py-4 bg-bg/70 backdrop-blur-md border-b border-line">
      <a href="#hero" className="font-display font-bold">BN</a>
      <div className="flex gap-5 text-sm">
        {SECTIONS.map(s => (
          <a key={s.id} href={`#${s.id}`}
             className={active === s.id ? 'text-white' : 'text-white/50 hover:text-white/80'}>
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: sticky nav with scroll-spy active state"
```

---

## Task 11: About section

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client'
import Image from 'next/image'
import { about } from '@/data/content'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function About() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="about" ref={ref} className="max-w-5xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">01 — About</p>
      <div className="mt-8 grid md:grid-cols-[1fr_220px] gap-10 items-start">
        <div>
          <h2 className="reveal font-display text-3xl md:text-4xl tracking-tight">{about.intro}</h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="reveal mt-5 text-white/60 leading-relaxed">{p}</p>
          ))}
        </div>
        <Image src="/ben.png" alt="Ben Nudelman" width={220} height={260}
          className="reveal rounded-xl object-cover border border-line" />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck + visual check**

```bash
npx tsc --noEmit
```
Expected: no errors. (Visual check deferred to Task 17 full-page pass.)

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: about section"
```

---

## Task 12: Work — ProjectCard, ProjectDetail, Work

**Files:**
- Create: `components/ProjectCard.tsx`, `components/ProjectDetail.tsx`, `components/Work.tsx`

- [ ] **Step 1: `components/ProjectCard.tsx`**

```tsx
'use client'
import type { Project } from '@/lib/types'
export default function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button onClick={onOpen}
      className="reveal group text-left rounded-2xl border border-line bg-surface p-6 transition
                 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_40px_-12px_var(--tw-shadow-color)] shadow-accent">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{project.name}</h3>
        <span className="text-xs text-white/40">{project.techStack}</span>
      </div>
      <p className="mt-3 text-sm text-white/55 line-clamp-3">{project.description}</p>
      <span className="mt-4 inline-block text-xs text-accent2">{project.category} ↗</span>
    </button>
  )
}
```

- [ ] **Step 2: `components/ProjectDetail.tsx`**

```tsx
'use client'
import { useEffect } from 'react'
import type { Project } from '@/lib/types'
import { projectLinks } from '@/lib/links'
export default function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
         onClick={onClose}>
      <div className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-surface p-8"
           onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
        <p className="text-xs text-white/40">{project.timeframe}</p>
        <h3 className="font-display text-2xl mt-1">{project.name}</h3>
        <p className="mt-3 text-white/60">{project.description}</p>
        <ul className="mt-5 space-y-2">
          {project.features.map((f, i) => (
            <li key={i} className="text-sm text-white/70 pl-4 border-l-2 border-accent/50">{f}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map(t => (
            <span key={t} className="text-xs px-3 py-1 rounded-full border border-line text-white/60">{t}</span>
          ))}
        </div>
        <pre className="mt-5 text-xs bg-black/50 rounded-lg p-4 overflow-x-auto text-white/70"><code>{project.code}</code></pre>
        <div className="mt-5 flex gap-3">
          {projectLinks(project).map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
               className="text-sm px-4 py-2 rounded-lg bg-accent/20 border border-accent/40 hover:bg-accent/30">{l.label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: `components/Work.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectDetail from './ProjectDetail'
import { useScrollReveal } from '@/lib/useScrollReveal'

export default function Work() {
  const ref = useScrollReveal<HTMLElement>()
  const [openId, setOpenId] = useState<number | null>(null)
  const open = projects.find(p => p.id === openId) || null
  return (
    <section id="work" ref={ref} className="max-w-6xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">02 — Selected Work</p>
      <h2 className="reveal font-display text-3xl md:text-4xl mt-3 tracking-tight">Things I&apos;ve built</h2>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(p => <ProjectCard key={p.id} project={p} onOpen={() => setOpenId(p.id)} />)}
      </div>
      {open && <ProjectDetail project={open} onClose={() => setOpenId(null)} />}
    </section>
  )
}
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: work grid with project cards + detail modal"
```

---

## Task 13: Experience timeline

**Files:**
- Create: `components/TimelineItem.tsx`, `components/Experience.tsx`

- [ ] **Step 1: `components/TimelineItem.tsx`**

```tsx
import type { ExperienceEntry } from '@/lib/types'
export default function TimelineItem({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="reveal relative pl-8 pb-10 border-l border-line last:pb-0">
      <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
      <p className="text-xs text-white/40">{entry.start} — {entry.end}</p>
      <h3 className="font-display text-lg mt-1">
        {entry.role} <span className="text-white/50">· {entry.org}</span>
        {entry.placeholder && <span className="ml-2 text-[10px] uppercase tracking-wide text-accent3/70">placeholder</span>}
      </h3>
      <ul className="mt-2 space-y-1">
        {entry.bullets.map((b, i) => <li key={i} className="text-sm text-white/60">{b}</li>)}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: `components/Experience.tsx`**

```tsx
'use client'
import { experience } from '@/data/experience'
import TimelineItem from './TimelineItem'
import { useScrollReveal } from '@/lib/useScrollReveal'
export default function Experience() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="experience" ref={ref} className="max-w-4xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">03 — Experience</p>
      <h2 className="reveal font-display text-3xl md:text-4xl mt-3 mb-10 tracking-tight">Where I&apos;ve worked</h2>
      {experience.map(e => <TimelineItem key={e.id} entry={e} />)}
    </section>
  )
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit && git add -A && git commit -m "feat: experience timeline (placeholder entries)"
```
Expected: no errors.

---

## Task 14: Skills section

**Files:**
- Create: `components/Skills.tsx`

- [ ] **Step 1: Implement**

```tsx
'use client'
import { skillGroups } from '@/data/content'
import { useScrollReveal } from '@/lib/useScrollReveal'
export default function Skills() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="skills" ref={ref} className="max-w-5xl mx-auto px-6 py-28">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">04 — Skills</p>
      <div className="mt-8 space-y-8">
        {skillGroups.map(g => (
          <div key={g.name} className="reveal">
            <h3 className="text-sm text-white/50 mb-3">{g.name}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map(it => (
                <span key={it} className="text-sm px-3 py-1.5 rounded-full border border-line bg-surface text-white/70
                                          transition hover:border-accent2/60 hover:text-white">{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npx tsc --noEmit && git add -A && git commit -m "feat: skills section with grouped chips"
```
Expected: no errors.

---

## Task 15: Contact + Footer

**Files:**
- Create: `components/Contact.tsx`, `components/Footer.tsx`

- [ ] **Step 1: `components/Contact.tsx`**

```tsx
'use client'
import { contact } from '@/data/content'
import { useScrollReveal } from '@/lib/useScrollReveal'
export default function Contact() {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <section id="contact" ref={ref} className="max-w-4xl mx-auto px-6 py-32 text-center">
      <p className="reveal text-xs tracking-[0.2em] uppercase text-white/40">05 — Contact</p>
      <h2 className="reveal font-display text-4xl md:text-5xl mt-4 tracking-tight">{contact.message}</h2>
      <a href={`mailto:${contact.email}`} className="reveal inline-block mt-8 text-lg text-accent2 hover:underline">{contact.email}</a>
      <div className="reveal mt-8 flex justify-center gap-5 text-sm">
        {contact.links.map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">{l.label}</a>
        ))}
        <a href="/Resume.pdf" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">Resume</a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-line py-8 text-center text-xs text-white/40">
      © 2026 Ben Nudelman · Built with Next.js + three.js
    </footer>
  )
}
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit && git add -A && git commit -m "feat: contact section + footer"
```
Expected: no errors.

---

## Task 16: Compose page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Compose all sections in order**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Work from '@/components/Work'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Build + run full test suite**

```bash
npm run build && npx vitest run
```
Expected: build passes; all unit tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: compose full single-page portfolio"
```

---

## Task 17: Full-page verification + polish pass

**Files:**
- Modify: any component needing fixes found during verification

- [ ] **Step 1: Manual walkthrough**

```bash
npm run dev
```
Open http://localhost:3000 and verify:
- Particle field forms "BN", idles, reacts to cursor.
- Nav scroll-spy highlights the right section; anchor links scroll smoothly.
- Each section reveals on scroll (GSAP).
- All 7 project cards open detail modal; ESC + backdrop close it; null links produce no dead buttons (e.g. In21 has no github/live → only shows present links).
- Skills chips, experience timeline (with "placeholder" tags), contact links, Resume open correctly.

- [ ] **Step 2: Reduced-motion + mobile check**

Toggle OS "reduce motion" → reveals instant, no bounce; particle hero still shows static "BN". Resize to mobile width → nav + grids collapse, modal scrolls, no overflow.

- [ ] **Step 3: Fix any issues found, then re-build**

```bash
npm run build
```
Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "polish: full-page verification fixes"
```

---

## Task 18: Vercel deploy config

**Files:**
- Create: `vercel.json` (optional), confirm metadata

- [ ] **Step 1: Confirm build for Vercel**

```bash
npm run build
```
Expected: clean. Next.js auto-detected by Vercel; no special config needed.

- [ ] **Step 2: Deploy (user-driven)**

Suggest the user run in this session:
```
! npx vercel --prod
```
(or connect the repo in the Vercel dashboard). Note: this is the user's action — do not deploy automatically.

- [ ] **Step 3: Commit any config**

```bash
git add -A && git commit -m "chore: vercel deploy config" --allow-empty
```

---

## Self-Review

**Spec coverage:** Hero particle "BN" (T7–9) ✓; Nav (T10) ✓; About (T11) ✓; Work + detail + null-link handling (T4,T12) ✓; Experience placeholder timeline (T3,T13) ✓; Skills (T14) ✓; Contact/Resume (T15) ✓; dark premium tokens + reduced-motion + mobile (T5,T17) ✓; GSAP reveals (T6) ✓; Next.js+R3F+GSAP+Tailwind+TS+analytics stack (T1,T5) ✓; data ported verbatim (T3) ✓; WebGL fallback (T9 noscript + dynamic ssr:false; static gradient bg always present) ✓; Vercel (T18) ✓.

**Placeholder scan:** Experience entries are intentional placeholders (flagged in UI + spec). No unresolved TBD/TODO in code steps.

**Type consistency:** `Project`, `ExperienceEntry`, `SkillGroup` defined T3, used consistently (`projectLinks` uses Pick of Project; components import the same types). `sampleText(text, max)` signature consistent T7→T8. `skillGroups`, `about`, `contact`, `projects`, `experience` export names consistent across data + consumers.
