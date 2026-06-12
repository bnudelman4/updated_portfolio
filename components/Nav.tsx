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
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 py-4 bg-bg/70 backdrop-blur-md border-b border-line">
      <a href="#hero" className="font-display font-bold">BN</a>
      <div className="flex gap-5 text-sm">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={
              active === s.id ? 'text-white' : 'text-white/50 hover:text-white/80'
            }
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
