# Portfolio Redesign — Design Spec

**Date:** 2026-06-12
**Owner:** Ben Nudelman
**Status:** Approved for planning

## Goal

Rebuild Ben's portfolio. Replace the old fake-desktop-OS "game" site with a premium, cinematic, well-animated single-page portfolio featuring high-quality 3D graphics and strong UI/UX. Same 7 projects as the original; add an Experience section (placeholder content for now). Design direction A (Cinematic 3D Hero), with B (Editorial Minimal) restraint kept in mind for typography and whitespace.

## Source of truth

Existing content lives in the old project at `/Users/ben/Desktop/portfolio`:
- `src/data/projects.js` — 7 projects (SimplifyCS, UniRides, In21, DES Software Distribution, Music Recommender, 2FA Pipeline, Eta Compiler) with descriptions, features, tech, timeframe, code snippets, links.
- `src/data/portfolioContent.js` — aboutMe, skills, interests, contact.
- `public/` — `Resume.pdf`, `ben.png`, `face.png`.

Port this content verbatim into the new project's data layer. Do not invent project details.

## Design direction

- **Direction A — Cinematic 3D Hero.** Dark, premium. Motion-first. Big animated 3D centerpiece greets the visitor; scroll-driven reveals carry the rest.
- Borrow from **B — Editorial Minimal**: restrained typography, generous whitespace, no clutter. The 3D is the hero; everything else is calm and readable.
- Reference inspirations: peachweb.io (alive hero object), refero.design (3D), godly.website, anime.js 3D components.

### Hero centerpiece

GPU **particle field** that coalesces into the initials **"BN"** on load, then drifts with slow idle motion and swirls/repels around the cursor. This is the signature moment. Particle field may return as a faint footer/contact backdrop.

### Visual language

- **Palette:** dark base (near-black `#06060A`–`#0A0A0E`), with an accent gradient (violet `#7C5CFF` → teal `#23D5AB` → pink `#FF7EB3`). Light text, low-opacity dividers.
- **Type:** one strong display face for headings (tight letter-spacing, large), one clean sans for body. Editorial scale — big section labels, lots of air.
- **Motion:** GSAP ScrollTrigger for section reveals, pinning, and scroll-linked transforms. Framer-style micro-interactions on hover. Respect `prefers-reduced-motion` (disable heavy motion + degrade particles to static).

## Tech stack

- **Framework:** Next.js (App Router) — SEO, metadata, clean Vercel deploy.
- **3D:** react-three-fiber + drei (`@react-three/fiber`, `@react-three/drei`), three.js.
- **Animation:** GSAP + ScrollTrigger for scroll cinematics; CSS/Framer-style micro-interactions for hover.
- **Styling:** TailwindCSS (utility + design tokens for the palette/type scale).
- **Deploy:** Vercel. Keep `@vercel/analytics`.
- **Language:** TypeScript (new build; old was JS — fresh start is fine).

## Page structure (single-page scroll)

Sticky minimal nav: `BN · Work · About · Experience · Contact` (smooth-scroll anchors; blurred translucent bar).

1. **Hero** — particle field → "BN", name + tagline ("Ben Nudelman · CS @ Cornell · builder"), scroll cue.
2. **01 About** — short sharp intro + photo (`ben.png`). Pulls from `aboutMe`. Two-to-three lines, not walls of text.
3. **02 Selected Work** — 7 project cards (name, stack, one-liner) with subtle 3D/parallax hover. Click → detail view (modal or expanding panel) showing description, features list, technologies, code snippet, timeframe, GitHub/live links. Handle null links gracefully.
4. **03 Experience** — vertical timeline. **Placeholder entries now**, structured so real roles/orgs/dates drop in later without redesign.
5. **04 Skills** — grouped animated chips (Languages, Frameworks, Tools, Specialized, Speaking Languages). From `skills`.
6. **05 Contact** — CTA + email, LinkedIn, GitHub, Resume.pdf. Optional particle backdrop returns.

Footer: minimal — name, year, socials.

## Component architecture

Each unit one clear purpose, isolated, independently understandable:

- `app/layout.tsx` — root layout, fonts, metadata, analytics.
- `app/page.tsx` — composes sections in order.
- `components/three/ParticleField.tsx` — R3F canvas + particle system; props for target shape ("BN"), density, cursor interaction. Self-contained; lazy/client-only (`next/dynamic`, `ssr:false`).
- `components/three/useTextParticles.ts` — hook: sample target text/shape into point positions.
- `components/Nav.tsx` — sticky nav, active-section highlight.
- `components/Hero.tsx` — wraps ParticleField + name/tagline + scroll cue.
- `components/About.tsx`
- `components/Work.tsx` + `components/ProjectCard.tsx` + `components/ProjectDetail.tsx`
- `components/Experience.tsx` + `components/TimelineItem.tsx` (placeholder data).
- `components/Skills.tsx`
- `components/Contact.tsx` + `components/Footer.tsx`
- `lib/useScrollReveal.ts` — GSAP ScrollTrigger reveal helper (registers once, respects reduced-motion).
- `data/projects.ts`, `data/content.ts`, `data/experience.ts` (placeholder) — typed content, ported from the old site.
- `lib/types.ts` — `Project`, `ExperienceEntry`, `SkillGroup` types.

## Data flow

Static typed data in `data/*` → imported by section components → rendered. No backend, no fetching. Project detail state held locally in `Work.tsx` (selected project id). Particle target ("BN") passed as prop to `ParticleField`.

## Performance & robustness

- Particle field: cap count, use `BufferGeometry` + a single points material/shader; pause `requestAnimationFrame`/`useFrame` when hero off-screen (IntersectionObserver).
- 3D client-only to avoid SSR/WebGL mismatch; lightweight loading state.
- `prefers-reduced-motion`: static particle snapshot of "BN", no scroll pinning, instant reveals.
- Mobile: particle count scaled down; nav collapses; cards single-column; touch-friendly detail view.
- Lighthouse-conscious: lazy-load 3D, optimize images via `next/image`, preload key font.

## Error handling

- Missing/null project links (`github`/`live`/`demo` null) → hide that link, don't render dead buttons.
- WebGL unsupported → fall back to a static gradient hero with the "BN" wordmark.
- Image load failure → graceful placeholder.

## Testing / verification

- Manual: `npm run dev`, verify each section, scroll reveals, particle "BN" formation, cursor interaction, project detail open/close, reduced-motion path, mobile layout, all links.
- Build: `npm run build` passes clean (no SSR/WebGL errors).
- Lighthouse spot check on performance + accessibility.

## Out of scope (for now)

- Real Experience content (placeholders only; user fills later).
- New projects beyond the existing 7.
- CMS / blog / backend.

## Open items deferred to user

- Real experience entries (roles, orgs, dates, bullets).
- Any additional projects.
- Final exact font choices (spec picks a display + sans direction; concrete faces chosen at build).
