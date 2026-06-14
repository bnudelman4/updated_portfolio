'use client'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'
import { screenTarget } from './sceneState'
import { NAME_START, NAME_END, NAME_DEPTH, heroProgress } from './cameraKeyframes'

const FONT = '/fonts/helvetiker_bold.typeface.json'
const ROW_TOP = 'BEN'
const ROW_BOTTOM = 'NUDELMAN'
const SIZE = 0.82 // screen-heights (group scaled by screen height)
const DEPTH = 0.2 // extrusion as a fraction of SIZE
const DROP = 5 // how far above its rest a letter starts (screen-heights)
const GAP = 0.04

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
// Drop with a small overshoot so each letter lands with a subtle bounce.
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
// deterministic per-index pseudo-random in [-1,1]
const rand = (i: number, salt: number) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

interface Letter {
  ch: string
  x: number
  restY: number
  restRot: number
  dropY: number
  order: number // reveal order across the whole name
  key: string
}

function rowCenters(font: any, row: string): number[] {
  const res = font.resolution || 1000
  const widths = [...row].map((ch) => ((font.glyphs[ch] || font.glyphs[' ']).ha / res) * SIZE + GAP)
  const total = widths.reduce((a, b) => a + b, 0)
  let x = -total / 2
  return widths.map((w) => {
    const c = x + w / 2
    x += w
    return c
  })
}

function useLetters(): Letter[] | null {
  const [data, setData] = useState<Letter[] | null>(null)
  useEffect(() => {
    let alive = true
    fetch(FONT).then((r) => r.json()).then((font) => {
      if (!alive) return
      const letters: Letter[] = []
      let order = 0
      // Bottom row (NUDELMAN) builds the base first, then the top row (BEN) drops in.
      const addRow = (row: string, baseY: number, salt: number) => {
        const centers = rowCenters(font, row)
        ;[...row].forEach((ch, i) => {
          // Scatter so it lands in an unnatural, non-straight shape.
          const restY = baseY + rand(order, salt) * SIZE * 0.22
          const restRot = rand(order, salt + 5) * 0.16
          const x = centers[i] + rand(order, salt + 9) * SIZE * 0.06
          letters.push({ ch, x, restY, restRot, dropY: baseY + DROP, order, key: `${salt}${i}` })
          order++
        })
      }
      addRow(ROW_BOTTOM, -SIZE * 0.55, 1)
      addRow(ROW_TOP, SIZE * 0.62, 2)
      setData(letters)
    }).catch(() => {})
    return () => { alive = false }
  }, [])
  return data
}

function Letters({ letters }: { letters: Letter[] }) {
  const scroll = useScroll()
  const group = useRef<THREE.Group>(null)
  const holders = useRef<(THREE.Group | null)[]>([])
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([])
  const oriented = useRef(false)
  const tmp = useMemo(() => ({ m: new THREE.Matrix4() }), [])
  const count = letters.length

  useFrame(() => {
    const t = screenTarget.current
    const g = group.current
    if (!t || !g) return
    if (!oriented.current) {
      tmp.m.makeBasis(t.right, t.up, t.normal)
      g.quaternion.setFromRotationMatrix(tmp.m)
      g.position.copy(t.center).addScaledVector(t.normal, -NAME_DEPTH * t.height)
      g.scale.setScalar(t.height)
      oriented.current = true
    }

    // Scrubbed by scroll: progress maps straight to letter positions, so the drop
    // advances only while you scroll and freezes the moment you stop.
    const p = clamp01((heroProgress(scroll.offset) - NAME_START) / (NAME_END - NAME_START))
    const seg = 1 / count
    const overlap = 0.45
    for (let i = 0; i < count; i++) {
      const L = letters[i]
      const start = L.order * seg * (1 - overlap)
      const lt = clamp01((p - start) / seg)
      const eased = easeOutBack(lt)
      const holder = holders.current[i]
      if (holder) {
        holder.position.y = THREE.MathUtils.lerp(L.dropY, L.restY, eased)
        holder.rotation.z = L.restRot * lt + (1 - lt) * -0.5 * Math.sign(L.restRot || 1)
      }
      const mat = mats.current[i]
      if (mat) mat.opacity = clamp01(lt * 1.8)
    }
  })

  return (
    <group ref={group}>
      {letters.map((l, i) => (
        <group key={l.key} ref={(el) => { holders.current[i] = el }} position={[l.x, l.dropY, 0]}>
          <Center>
            <Text3D
              font={FONT}
              size={SIZE}
              height={SIZE * DEPTH}
              bevelEnabled
              bevelThickness={SIZE * 0.03}
              bevelSize={SIZE * 0.02}
              bevelSegments={4}
              curveSegments={8}
            >
              {l.ch}
              <meshStandardMaterial
                ref={(el) => { mats.current[i] = el }}
                color="#e9eefc"
                metalness={0.9}
                roughness={0.22}
                envMapIntensity={1.0}
                transparent
                opacity={0}
              />
            </Text3D>
          </Center>
        </group>
      ))}
    </group>
  )
}

// Scroll-driven 3D name reveal: "BEN NUDELMAN" letters drop in (scrubbed by scroll) and
// settle into a scattered, non-straight arrangement — NUDELMAN on the bottom, BEN on top.
export default function NameReveal() {
  const letters = useLetters()
  if (!letters) return null
  return (
    <Suspense fallback={null}>
      <Letters letters={letters} />
    </Suspense>
  )
}
