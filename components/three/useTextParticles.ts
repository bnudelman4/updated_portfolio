export function sampleText(text: string, max: number): Float32Array {
  const w = 200, h = 100
  const canvas =
    typeof document !== 'undefined'
      ? document.createElement('canvas')
      : ({ getContext: () => null } as unknown as HTMLCanvasElement)
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const pts: number[] = []
  if (ctx) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 80px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
    let data: Uint8ClampedArray | null = null
    try {
      data = ctx.getImageData(0, 0, w, h).data
    } catch {
      data = null
    }
    if (data) {
      const candidates: [number, number][] = []
      for (let y = 0; y < h; y += 2)
        for (let x = 0; x < w; x += 2)
          if (data[(y * w + x) * 4 + 3] > 128) candidates.push([x, y])
      // deterministic shuffle (no Math.random so headless behaviour is stable)
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = (i * 2654435761) % (i + 1)
        ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
      }
      for (const [x, y] of candidates.slice(0, max)) {
        pts.push((x - w / 2) / 18, -(y - h / 2) / 18, (((x * y) % 10) - 5) / 30)
      }
    }
  }
  if (pts.length === 0) {
    // jsdom / no-canvas fallback so the system still has points
    const n = Math.min(max, 200)
    for (let i = 0; i < n; i++) {
      pts.push(Math.cos(i) * 3, Math.sin(i) * 1.5, 0)
    }
  }
  return new Float32Array(pts)
}
