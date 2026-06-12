'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BG = '#04130a'
const GREEN = '#7CFFB0'
const BRIGHT = '#defce9'

const LINES = [
  '> booting portfolio.os ...',
  '> user: Ben Nudelman',
  '> role: CS @ Cornell',
  '> stack: full-stack · mobile · embedded',
  '',
  '> ready.',
]

function drawScreen(ctx: CanvasRenderingContext2D, w: number, h: number, caretOn: boolean) {
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, w, h)
  // subtle scanlines
  ctx.fillStyle = 'rgba(255,255,255,0.03)'
  for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2)
  ctx.textBaseline = 'top'
  ctx.font = '600 34px monospace'
  ctx.fillStyle = GREEN
  let y = 60
  for (const l of LINES) {
    ctx.fillText(l, 50, y)
    y += 48
  }
  ctx.font = '800 56px monospace'
  ctx.fillStyle = BRIGHT
  const name = 'BEN NUDELMAN'
  ctx.fillText(name, 50, y + 18)
  if (caretOn) {
    const wText = ctx.measureText(name).width
    ctx.fillRect(50 + wText + 8, y + 18, 26, 52)
  }
}

// Boot terminal rendered onto the CRT face via a CanvasTexture (crisp, glows,
// and scales naturally as the camera pushes into the screen).
export default function ScreenContent() {
  const { texture, canvas, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 820
    const ctx = canvas.getContext('2d')!
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    drawScreen(ctx, canvas.width, canvas.height, true)
    return { texture, canvas, ctx }
  }, [])

  const blink = useRef({ t: 0, on: true })
  useFrame((_, dt) => {
    const b = blink.current
    b.t += dt
    if (b.t > 0.55) {
      b.t = 0
      b.on = !b.on
      drawScreen(ctx, canvas.width, canvas.height, b.on)
      texture.needsUpdate = true
    }
  })

  // Aligned to the monitor face (world ~ -0.12, 3.02, -1.30), facing +z.
  return (
    <mesh position={[-0.12, 3.02, -1.29]} rotation={[0, 0, 0]}>
      <planeGeometry args={[0.92, 0.72]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
