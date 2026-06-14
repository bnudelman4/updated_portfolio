'use client'
import { useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, useScroll } from '@react-three/drei'
import { KTX2Loader } from 'three-stdlib'
import { DRACO_DECODER_PATH } from './dracoConfig'
import { createBootScreen } from './bootScreen'
import { screenTarget } from './sceneState'
import { OFFICE_HIDE, heroProgress } from './cameraKeyframes'

const MODEL = '/models/officeroom-web.glb'
// World size the recentered setup should fit within (max bbox dimension).
const TARGET = 7
// Name of the monitor's screen material (the blue wallpaper) in the source asset.
const SCREEN_MAT = 'Monitor_screen_mat'

// Debug: set true to log the resolved screen transform once (used to sanity-check the
// camera fly-in). Leave false in committed code.
const DEBUG_SCREEN = false

function isScreenMaterial(m: THREE.Material | THREE.Material[] | null): boolean {
  if (!m) return false
  return Array.isArray(m) ? m.some((x) => x.name === SCREEN_MAT) : m.name === SCREEN_MAT
}

// Average a mesh's vertex normals into a single world-space facing direction.
function worldFacing(mesh: THREE.Mesh): THREE.Vector3 {
  const n = mesh.geometry.attributes.normal as THREE.BufferAttribute | undefined
  const acc = new THREE.Vector3()
  if (n) {
    const v = new THREE.Vector3()
    for (let i = 0; i < n.count; i++) acc.add(v.fromBufferAttribute(n, i))
  }
  if (acc.lengthSq() === 0) acc.set(0, 0, 1)
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
  return acc.applyMatrix3(normalMatrix).normalize()
}

export default function Scene() {
  const gl = useThree((s) => s.gl)

  // KTX2 transcoder (Basis), configured for THIS renderer; Draco handled by drei.
  const ktx2 = useMemo(
    () => new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl),
    [gl],
  )
  useEffect(() => {
    return () => {
      ktx2.dispose()
    }
  }, [ktx2])

  const { scene } = useGLTF(MODEL, DRACO_DECODER_PATH, false, (loader) => {
    // drei wires Draco; we add KTX2 so the optimized textures decode.
    ;(loader as unknown as { setKTX2Loader: (l: KTX2Loader) => void }).setKTX2Loader(ktx2)
  })

  const boot = useMemo(() => createBootScreen(), [])

  // Recenter on X/Z, sit the base on y=0, scale to a sane size, enable shadows, mount
  // the boot terminal on the monitor, and resolve the screen target for the camera.
  const { scale, position } = useMemo(() => {
    let screenMesh: THREE.Mesh | null = null
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        if (isScreenMaterial(mesh.material)) screenMesh = mesh
      }
    })

    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = TARGET / Math.max(size.x, size.y, size.z)
    const pos: [number, number, number] = [-center.x * s, -box.min.y * s, -center.z * s]

    // Paint the boot terminal onto the monitor's own (emissive) screen material so the
    // text glows and stays crisp as the camera pushes in.
    if (screenMesh) {
      const mesh = screenMesh as THREE.Mesh
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const mat of mats) {
        if (mat.name !== SCREEN_MAT) continue
        const std = mat as THREE.MeshStandardMaterial
        std.map = boot.texture
        std.emissive = new THREE.Color(0xffffff)
        std.emissiveMap = boot.texture
        std.emissiveIntensity = 1.25
        std.toneMapped = true
        std.needsUpdate = true
      }
    }

    return { scale: s, position: pos }
  }, [scene, boot])

  // Resolve the screen's WORLD transform after the recenter/scale group is applied.
  useEffect(() => {
    let screenMesh: THREE.Mesh | null = null
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh && isScreenMaterial(mesh.material)) screenMesh = mesh
    })
    if (!screenMesh) return
    const mesh = screenMesh as THREE.Mesh
    mesh.updateWorldMatrix(true, false)

    const wbox = new THREE.Box3().setFromObject(mesh)
    const wsize = new THREE.Vector3()
    const wcenter = new THREE.Vector3()
    wbox.getSize(wsize)
    wbox.getCenter(wcenter)

    const normal = worldFacing(mesh)
    // Upright monitor: up is world-up flattened into the screen plane.
    const up = new THREE.Vector3(0, 1, 0)
    up.addScaledVector(normal, -up.dot(normal)).normalize()
    if (up.lengthSq() < 1e-6) up.set(0, 1, 0)
    const right = new THREE.Vector3().crossVectors(up, normal).normalize()

    // Screen extents: vertical = projection of bbox on `up`; horizontal = on `right`.
    const height = Math.abs(wsize.x * up.x) + Math.abs(wsize.y * up.y) + Math.abs(wsize.z * up.z)
    const width = Math.abs(wsize.x * right.x) + Math.abs(wsize.y * right.y) + Math.abs(wsize.z * right.z)

    screenTarget.current = { center: wcenter, normal, up, right, height, width }
    if (DEBUG_SCREEN) {
      // eslint-disable-next-line no-console
      console.log('[screen]', {
        center: wcenter.toArray().map((n) => +n.toFixed(3)),
        normal: normal.toArray().map((n) => +n.toFixed(3)),
        height: +height.toFixed(3),
        width: +width.toFixed(3),
      })
    }
    return () => {
      screenTarget.current = null
    }
  }, [scene, scale, position])

  // Drive the boot-terminal blink, and hide the whole office once the camera has passed
  // through the screen into the black void (so only the name reveal is visible).
  const scroll = useScroll()
  const office = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    boot.tick(dt)
    if (office.current) office.current.visible = heroProgress(scroll.offset) < OFFICE_HIDE
  })

  return (
    <group>
      <group ref={office} scale={scale} position={position}>
        <primitive object={scene} />
      </group>

      {/* CC0 Poly Haven HDRI (hosted locally so it never depends on a CDN) for
          believable reflections; the visible background stays a dark void. */}
      <Environment files="/hdri/lebombo_1k.hdr" environmentIntensity={0.62} />

      {/* Key + cool fill so the PBR materials read with depth beyond the HDRI. */}
      <directionalLight
        position={[5, 9, 6]}
        intensity={1.5}
        color="#fff3e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 40]} />
      </directionalLight>
      <directionalLight position={[-6, 5, -3]} intensity={0.5} color="#8fb6ff" />

      {/* Grounding contact shadow so the setup does not float in the void. */}
      <ContactShadows position={[0, 0.002, 0]} opacity={0.7} scale={16} blur={2.8} far={6} resolution={1024} />
    </group>
  )
}
