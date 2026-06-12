export default function Footer() {
  return (
    <footer className="border-t border-line py-8 text-center text-xs text-white/40 space-y-1">
      <p>© 2026 Ben Nudelman · Built with Next.js + three.js</p>
      <p className="text-white/30">
        3D model:{' '}
        <a
          href="https://sketchfab.com/3d-models/low-poly-computer-desk-646ed84ecd9d40089c31d94f79334ca5"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-white/60"
        >
          &ldquo;Low Poly Computer Desk&rdquo; by Nyangire
        </a>{' '}
        · licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-white/60"
        >
          CC BY 4.0
        </a>
        , modified for this site
      </p>
    </footer>
  )
}
