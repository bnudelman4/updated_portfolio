export default function Footer() {
  return (
    <footer className="border-t border-line py-8 text-center text-xs text-white/40 space-y-1">
      <p>© 2026 Ben Nudelman · Built with Next.js + three.js</p>
      <p className="text-white/30">
        3D scene:{' '}
        <a
          href="https://poly.pizza/m/cA_lcvRC4NA"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-white/60"
        >
          &ldquo;Computer Room&rdquo; by Bruno Oliveira
        </a>{' '}
        · CC-BY 3.0 via Poly Pizza
      </p>
    </footer>
  )
}
