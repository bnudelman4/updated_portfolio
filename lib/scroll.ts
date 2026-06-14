import { projects } from '@/data/projects'
import { lenisRef } from '@/lib/lenisRef'

// Scroll helpers for both render paths. In the 3D experience the DOM lives in drei's
// transform-positioned <Scroll html>, whose translate is NOT 1:1 with the scroll element's
// scrollTop — it moves at slope = (scrollRange - viewport) / scrollRange. So to land an
// element at a desired on-screen position we convert through that slope, then drive Lenis
// via its real scrollTo() (setting scrollTop directly fights Lenis and lands halfway).

const NAV_OFFSET = 64 // leave room under the fixed top nav

function lenisWrap(): HTMLElement | null {
  return document.querySelector('.lenis') as HTMLElement | null
}

// scrollTop that puts `el`'s rendered top at `desiredRenderedTop` (viewport px).
function targetScrollTop(el: Element, desiredRenderedTop: number): number | null {
  const wrap = lenisWrap()
  if (!wrap) return null
  const vh = wrap.clientHeight
  const scrollRange = wrap.scrollHeight - vh
  if (scrollRange <= 0) return null
  const slope = scrollRange > vh ? (scrollRange - vh) / scrollRange : 1
  const rectTop = el.getBoundingClientRect().top
  return wrap.scrollTop + (rectTop - desiredRenderedTop) / slope
}

// Bring a section (by id) to just under the nav.
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = lenisRef.current
  const target = lenis && targetScrollTop(el, NAV_OFFSET)
  if (lenis && target != null) lenis.scrollTo(target, { duration: 1 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

// Jump to a specific project within the scroll-pinned Work section. Work maps its rendered
// position (-rect.top / range, 0..1) to a project index, so we want Work's rendered top at
// -frac * range.
export function scrollToProject(index: number) {
  const work = document.getElementById('work')
  if (!work) return
  const vh = window.innerHeight
  const range = Math.max(1, work.offsetHeight - vh)
  const count = projects.length
  const frac = count > 1 ? index / (count - 1) : 0
  const lenis = lenisRef.current
  const target = lenis && targetScrollTop(work, -frac * range)
  if (lenis && target != null) {
    lenis.scrollTo(target, { duration: 1 })
  } else {
    const workTop = window.scrollY + work.getBoundingClientRect().top
    window.scrollTo({ top: workTop + frac * range, behavior: 'smooth' })
  }
}
