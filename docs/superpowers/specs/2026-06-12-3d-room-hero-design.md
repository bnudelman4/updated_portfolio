# 3D Room Hero Redesign — Design Spec

**Date:** 2026-06-12
**Owner:** Ben Nudelman
**Status:** Approved for planning
**Supersedes:** the particle-"BN" hero from `2026-06-12-portfolio-redesign-design.md` (sections About→Contact and their content/data are KEPT and reused).

## Goal

Replace the simple particle hero with a high-fidelity, cinematic 3D opening in the spirit of henryheffernan.com: a **realistic, warm-lit retro computer desk/room**. As the visitor scrolls, a keyframed camera moves through the 3D environment around the computer; the CRT screen shows live content; then the camera pulls away and the page scrolls off into the existing portfolio text sections. "HD" grade via real lighting, environment reflections, and a postprocessing pipeline.

## Reference

- henryheffernan.com (godly.website/website/henry-heffernan-749) — cozy baked 3D room, CRT centerpiece, cinematic camera, post-processing.
- peachweb.io — scroll-triggered 3D scenes, lights, depth.
- animejs.com — motion polish / spring timing (applied to UI transitions, not the hero model).

## Approved decisions

- **Scene:** cozy retro desk/room — CRT monitor + desk + props, warm baked lighting.
- **Model source:** a curated CC0 / permissively-licensed GLTF, optimized (Draco). Realism is capped by the best available asset; user can swap it later. Attribution recorded if the license requires it.
- **Screen:** live content rendered onto the monitor surface (real DOM via drei `<Html transform occlude>`) — an animated boot/intro: name, tagline, blinking terminal line. NOT interactive (keeps scope bounded).
- **Existing content kept:** About, Work (7 projects + detail modal), Experience (placeholder timeline), Skills, Contact, Footer, and all `data/*` are reused.

## Experience / scroll choreography

The page is one scroll timeline (drei `ScrollControls`, `pages` ≈ 7–8, `damping` for smooth feel):

1. **Act 1 — Establish (offset 0.0–0.15):** camera opens on a wide, slightly high view of the lit room. Title/cue overlay: "Ben Nudelman".
2. **Act 2 — Approach (0.15–0.35):** camera dollies + orbits toward the desk, settling into a "seated" framing where the **CRT screen is centered and readable**. Screen plays the boot/intro.
3. **Act 3 — Handoff (0.35–0.45):** camera pulls back/up and tilts; the 3D scene recedes (dim/defocus) and the HTML portfolio content begins to scroll up over/after it.
4. **Act 4 — Portfolio (0.45–1.0):** standard sections scroll: About → Work → Experience → Skills → Contact → Footer. The 3D canvas parks (low cost) behind a solid/gradient backdrop.

Camera positions are keyframed as an array of `{ offset, position, lookAt }` and interpolated by `useScroll().offset` each frame (with damping). Reduced-motion uses static framing (Act 2 pose) and normal section scroll.

## Visual grade (postprocessing)

`@react-three/postprocessing` `<EffectComposer>`: Bloom (screen glow), Depth of Field (cinematic focus on the CRT), Vignette, Noise/film grain (subtle), and a light ChromaticAberration. Tuned for warm, filmic look. Effects disabled/reduced on the fallback path.

## Tech stack (additions)

- Re-add `@react-three/drei` (ScrollControls, useScroll, useGLTF, Html, Environment, ContactShadows, useDetectGPU).
- Add `@react-three/postprocessing` (+ `postprocessing`).
- three.js DRACOLoader via drei `useGLTF.preload` with draco path; ship draco decoder (or use the hosted gstatic decoder).
- Keep Next.js 16, R3F v9, GSAP (for non-canvas UI micro-motion), Tailwind v4, TypeScript, @vercel/analytics.
- Smooth scroll handled by ScrollControls damping (no separate Lenis needed).

## Component architecture

```
components/three/
  Experience3D.tsx      # <Canvas> + <ScrollControls> root; composes Scene + Rig + Effects + <Scroll html>
  Scene.tsx             # model (useGLTF) + lights + Environment + ContactShadows
  CameraRig.tsx         # reads useScroll offset, interpolates keyframed camera (damped)
  ScreenContent.tsx     # <Html transform occlude> mounted on the CRT screen mesh — boot/intro DOM
  Effects.tsx           # <EffectComposer> bloom/DOF/vignette/noise/chromatic
  cameraKeyframes.ts    # typed [{offset, position:[x,y,z], lookAt:[x,y,z]}] timeline
  useSceneFallback.ts   # GPU/viewport/reduced-motion detection → boolean "useFallback"
components/
  HeroFallback.tsx      # static image (pre-rendered scene frame) or gradient + name; shown when useFallback
  Nav, About, Work, ProjectCard, ProjectDetail, Experience, TimelineItem, Skills, Contact, Footer  # REUSED unchanged
app/page.tsx            # if fallback → <Nav/> + static hero + sections; else → <Experience3D/> with sections inside <Scroll html>
public/models/          # optimized .glb + (optional) draco assets
public/hero-fallback.jpg# pre-rendered scene still for the fallback
```

The existing section components are reused verbatim inside `<Scroll html>` (Act 4). `Nav` stays fixed on top in both paths.

## Data flow

Static `data/*` unchanged. Scroll offset (from `useScroll`) is the single animation driver for the camera rig and for fade/defocus of the scene during handoff. Screen content is static DOM. No backend.

## Performance & robustness

- **Model budget:** target the optimized .glb < ~5–8 MB; Draco geometry compression; KTX2/resized textures if needed; `useGLTF.preload`.
- **Fallback path** (`useSceneFallback`): trigger on any of — coarse pointer + small viewport (mobile), `prefers-reduced-motion`, or low `useDetectGPU` tier. Render `HeroFallback` (static pre-rendered scene frame + name) and the normal sections; skip Canvas entirely.
- Cap `dpr={[1, 1.75]}`; pause/`frameloop` throttle when tab hidden; lazy-load `Experience3D` via `next/dynamic({ ssr:false })`.
- Postprocessing effects gated off on lower tiers.

## Error handling

- Model fails to load (network/decoder) → suspense error boundary swaps in `HeroFallback`.
- WebGL unsupported → `useSceneFallback` returns true before any Canvas mounts.
- `<Html>` screen content always has a plain-DOM equivalent in the fallback hero (name/tagline), so the intro copy is never lost.

## Testing / verification

- Unit: `cameraKeyframes` interpolation helper (offset→pose) is pure and tested; `useSceneFallback` decision logic tested. Existing 7 tests stay green.
- Manual (Playwright, controller): load model, verify scene renders, scrub scroll through Acts 1–4, confirm CRT screen content readable at Act 2, confirm handoff into sections, confirm fallback path on mobile viewport + reduced-motion, confirm `npm run build` clean.
- Perf spot check: initial load weight, frame rate during scroll.

## Out of scope

- Interactive desktop/OS on the screen (animated boot text only).
- Custom-modeled/Blender-baked assets (we source CC0; bespoke modeling later if desired).
- New projects/experiences (still the 7 + placeholder timeline).

## Risks / iteration points

- **Asset quality is the primary risk.** The sourced CC0 model may need material/lighting tuning or a swap to look truly "real". Expect one iteration pass after first render.
- Camera keyframes need hand-tuning against the actual model's scale/orientation — a verify-and-adjust loop.
- `<Html transform occlude>` alignment to the screen mesh depends on the model's screen geometry; may need a manually placed plane if the model lacks a clean screen face.
