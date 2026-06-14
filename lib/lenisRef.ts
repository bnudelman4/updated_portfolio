import type Lenis from 'lenis'

// Shared handle to the Lenis instance created in the 3D experience, so scroll helpers can
// drive it through its real scrollTo() API. Setting el.scrollTop directly fights Lenis (it
// lerps back toward its own target), which lands you halfway between sections.
export const lenisRef: { current: Lenis | null } = { current: null }
