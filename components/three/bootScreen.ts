import * as THREE from 'three'

// Boot-terminal look. These colors are also mirrored by the DOM portfolio layer
// (globals.css --color-boot-*) so the WebGL→HTML crossfade reads as one surface.
export const BOOT_BG = '#04130a'
export const BOOT_GREEN = '#7CFFB0'
export const BOOT_BRIGHT = '#defce9'

const LINES = [
  '> booting portfolio.os ...',
  '> user: Ben Nudelman',
  '> role: CS @ Cornell',
  '> stack: full-stack · mobile · embedded',
  '',
  '> ready.',
]

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, caretOn: boolean) {
  ctx.fillStyle = BOOT_BG
  ctx.fillRect(0, 0, w, h)
  // subtle scanlines
  ctx.fillStyle = 'rgba(255,255,255,0.035)'
  for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2)
  ctx.textBaseline = 'top'
  ctx.font = '600 34px monospace'
  ctx.fillStyle = BOOT_GREEN
  let y = 70
  for (const l of LINES) {
    ctx.fillText(l, 56, y)
    y += 50
  }
  ctx.font = '800 58px monospace'
  ctx.fillStyle = BOOT_BRIGHT
  const name = 'BEN NUDELMAN'
  ctx.fillText(name, 56, y + 20)
  if (caretOn) {
    const wText = ctx.measureText(name).width
    ctx.fillRect(56 + wText + 10, y + 20, 28, 56)
  }
}

export interface BootScreen {
  texture: THREE.CanvasTexture
  /** advance the blink clock; returns true when the canvas was repainted */
  tick: (dt: number) => boolean
}

// Creates the boot-terminal CanvasTexture and its blink animator. Kept framework-free
// so the Scene can both paint it onto the monitor material and drive it from useFrame.
export function createBootScreen(width = 1024, height = 768): BootScreen {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.flipY = false // glTF UVs are not flipped; match the model's screen UVs
  texture.anisotropy = 8
  draw(ctx, width, height, true)

  let t = 0
  let on = true
  return {
    texture,
    tick(dt: number) {
      t += dt
      if (t < 0.55) return false
      t = 0
      on = !on
      draw(ctx, width, height, on)
      texture.needsUpdate = true
      return true
    },
  }
}
