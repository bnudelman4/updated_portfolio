import * as THREE from 'three'
import type { Project } from '@/lib/types'

// Representative on-screen UI for each project, drawn onto a CanvasTexture. Desktop projects
// use a landscape canvas (16:10); phone projects use a portrait canvas. The drawing is a
// stylised mock — recognisable, not pixel-perfect.

const ACCENT = '#7C5CFF'
const ACCENT2 = '#23D5AB'
const ACCENT3 = '#FF7EB3'

const DW = 1024
const DH = 640
const PW = 720
const PH = 1480

export function makeScreenTexture(project: Project): THREE.CanvasTexture {
  const phone = project.device === 'phone'
  const w = phone ? PW : DW
  const h = phone ? PH : DH
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  switch (project.screen) {
    case 'browser': drawBrowser(ctx, w, h); break
    case 'rideApp': drawRideApp(ctx, w, h); break
    case 'streak': drawStreakApp(ctx, w, h); break
    case 'bios': drawBios(ctx, w, h); break
    case 'music': drawMusic(ctx, w, h); break
    case 'ideAudio': drawIdeAudio(ctx, w, h); break
    case 'ideAsm': drawIdeAsm(ctx, w, h); break
    case 'portfolio': drawPortfolio(ctx, w, h); break
    case 'stockSearch': drawStockSearch(ctx, w, h); break
    case 'clutch': drawClutch(ctx, w, h); break
    case 'bridge': drawBridge(ctx, w, h); break
    default: drawBrowser(ctx, w, h)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// ---------- helpers ----------
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}
function fill(ctx: CanvasRenderingContext2D, c: string) { ctx.fillStyle = c; ctx.fill() }

type Seg = { t: string; c: string }
function codeLines(
  ctx: CanvasRenderingContext2D,
  lines: Seg[][],
  x: number,
  y: number,
  lh: number,
  font: string,
  numColor = '#3a4150',
) {
  ctx.font = font
  ctx.textBaseline = 'top'
  lines.forEach((segs, i) => {
    const ly = y + i * lh
    ctx.textAlign = 'right'
    ctx.fillStyle = numColor
    ctx.fillText(String(i + 1), x - 18, ly)
    ctx.textAlign = 'left'
    let cx = x
    for (const s of segs) {
      ctx.fillStyle = s.c
      ctx.fillText(s.t, cx, ly)
      cx += ctx.measureText(s.t).width
    }
  })
}

// ---------- 1. SimplifyCS — browser with a fake website ----------
function drawBrowser(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#1b1d24'
  ctx.fillRect(0, 0, w, h)
  // toolbar
  ctx.fillStyle = '#2a2d37'
  ctx.fillRect(0, 0, w, 70)
  const dots = ['#ff5f57', '#febc2e', '#28c840']
  dots.forEach((d, i) => { ctx.fillStyle = d; ctx.beginPath(); ctx.arc(34 + i * 30, 35, 9, 0, Math.PI * 2); ctx.fill() })
  // address bar
  ctx.fillStyle = '#15171d'
  rr(ctx, 150, 18, w - 320, 36, 18); ctx.fill()
  ctx.fillStyle = ACCENT2; ctx.font = '600 22px ui-sans-serif, system-ui'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'
  ctx.fillText('🔒', 168, 37)
  ctx.fillStyle = '#cfd3dc'; ctx.font = '500 22px ui-sans-serif'
  ctx.fillText('simplifycs.com', 200, 38)
  // page
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 70, w, h - 70)
  // nav
  ctx.fillStyle = ACCENT; ctx.font = '800 30px ui-sans-serif'; ctx.textBaseline = 'alphabetic'
  ctx.fillText('SimplifyCS', 40, 130)
  ctx.fillStyle = '#5b6472'; ctx.font = '500 20px ui-sans-serif'
  ;['Courses', 'Units', 'Lessons', 'Sign in'].forEach((t, i) => ctx.fillText(t, w - 420 + i * 105, 130))
  // hero
  ctx.fillStyle = '#0e1116'; ctx.font = '800 58px ui-sans-serif'
  ctx.fillText('Learn CS, one', 40, 250)
  ctx.fillText('lesson at a time.', 40, 312)
  ctx.fillStyle = '#6b7280'; ctx.font = '400 22px ui-sans-serif'
  ctx.fillText('Courses → units → lessons, with quizzes and assignments.', 40, 360)
  ctx.fillStyle = ACCENT; rr(ctx, 40, 392, 220, 52, 26); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = '600 22px ui-sans-serif'; ctx.fillText('Browse courses', 70, 425)
  // course cards
  const cards = [['Intro to CS', ACCENT], ['Data Structures', ACCENT2], ['Algorithms', ACCENT3]] as const
  cards.forEach(([title, col], i) => {
    const x = 40 + i * 245
    ctx.fillStyle = '#f1f3f7'; rr(ctx, x, 490, 220, 110, 16); ctx.fill()
    ctx.fillStyle = col as string; rr(ctx, x + 16, 506, 60, 60, 12); ctx.fill()
    ctx.fillStyle = '#0e1116'; ctx.font = '700 20px ui-sans-serif'; ctx.fillText(title as string, x + 90, 540)
    ctx.fillStyle = '#9aa1ad'; ctx.font = '400 15px ui-sans-serif'; ctx.fillText('12 lessons', x + 90, 566)
  })
}

// ---------- 2. UniRides — phone car-request app ----------
function drawRideApp(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0e1014'; ctx.fillRect(0, 0, w, h)
  statusBar(ctx, w, '#0e1014', '#fff')
  // map
  const mapTop = 70, mapH = h * 0.6
  ctx.fillStyle = '#dde6ea'; ctx.fillRect(0, mapTop, w, mapH)
  ctx.strokeStyle = '#c2ccd2'; ctx.lineWidth = 18
  for (let i = -1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, mapTop + i * 150 + 80); ctx.lineTo(w, mapTop + i * 150 + 160); ctx.stroke() }
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(i * 180 + 40, mapTop); ctx.lineTo(i * 180 + 120, mapTop + mapH); ctx.stroke() }
  // route
  ctx.strokeStyle = ACCENT; ctx.lineWidth = 12; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(140, mapTop + mapH - 120); ctx.quadraticCurveTo(w / 2, mapTop + mapH / 2, w - 160, 240); ctx.stroke()
  // destination pin
  ctx.fillStyle = ACCENT3; ctx.beginPath(); ctx.arc(w - 160, 232, 26, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w - 160, 232, 10, 0, Math.PI * 2); ctx.fill()
  // car marker
  ctx.fillStyle = '#1a1d24'; rr(ctx, 110, mapTop + mapH - 150, 70, 44, 12); ctx.fill()
  ctx.fillStyle = ACCENT2; ctx.beginPath(); ctx.arc(128, mapTop + mapH - 108, 9, 0, Math.PI * 2); ctx.arc(162, mapTop + mapH - 108, 9, 0, Math.PI * 2); ctx.fill()
  // bottom sheet
  const sy = mapTop + mapH - 30
  ctx.fillStyle = '#15181f'; rr(ctx, 0, sy, w, h - sy + 40, 36); ctx.fill()
  ctx.fillStyle = '#3a4150'; rr(ctx, w / 2 - 40, sy + 18, 80, 8, 4); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = '800 40px ui-sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  ctx.fillText('Choose a ride', 44, sy + 100)
  // ride option card
  ctx.fillStyle = '#1d2330'; ctx.strokeStyle = ACCENT; ctx.lineWidth = 3; rr(ctx, 36, sy + 130, w - 72, 130, 20); ctx.fill(); ctx.stroke()
  ctx.font = '36px ui-sans-serif'; ctx.fillStyle = '#fff'; ctx.fillText('🚗', 64, sy + 205)
  ctx.font = '700 34px ui-sans-serif'; ctx.fillText('UniPool', 140, sy + 190)
  ctx.fillStyle = '#9aa1ad'; ctx.font = '400 24px ui-sans-serif'; ctx.fillText('5 min away · home for break', 140, sy + 228)
  ctx.fillStyle = ACCENT2; ctx.font = '800 38px ui-sans-serif'; ctx.textAlign = 'right'; ctx.fillText('$4', w - 64, sy + 205); ctx.textAlign = 'left'
  // request button
  ctx.fillStyle = ACCENT; rr(ctx, 36, h - 150, w - 72, 86, 24); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = '800 36px ui-sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Request UniRide', w / 2, h - 96); ctx.textAlign = 'left'
}

// ---------- 3. In21 — phone streak / circular progress ----------
function drawStreakApp(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#141021'); g.addColorStop(1, '#0c0a14')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  statusBar(ctx, w, 'transparent', '#fff')
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'; ctx.font = '800 48px ui-sans-serif'; ctx.fillText('in21', 44, 150)
  ctx.fillStyle = ACCENT; ctx.font = '500 24px ui-sans-serif'; ctx.fillText('build the habit', 44, 188)

  // circular progress ring (2/3 complete)
  const cx = w / 2, cy = h * 0.46, R = 220
  ctx.lineWidth = 40; ctx.lineCap = 'round'
  ctx.strokeStyle = '#241f33'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
  const start = -Math.PI / 2
  const end = start + (2 / 3) * Math.PI * 2
  const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R)
  grad.addColorStop(0, ACCENT); grad.addColorStop(1, ACCENT3)
  ctx.strokeStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, R, start, end); ctx.stroke()
  // center text
  ctx.textAlign = 'center'
  ctx.fillStyle = '#fff'; ctx.font = '800 130px ui-sans-serif'; ctx.fillText('14', cx, cy + 24)
  ctx.fillStyle = '#9aa1ad'; ctx.font = '500 34px ui-sans-serif'; ctx.fillText('of 21 days', cx, cy + 86)

  // streak pill with fire
  const pw = 380, px = cx - pw / 2, py = h * 0.74
  ctx.fillStyle = '#1c1730'; rr(ctx, px, py, pw, 92, 46); ctx.fill()
  ctx.font = '52px ui-sans-serif'; ctx.textAlign = 'left'; ctx.fillText('🔥', px + 36, py + 64)
  ctx.fillStyle = '#fff'; ctx.font = '800 44px ui-sans-serif'; ctx.fillText('20 day streak', px + 104, py + 62)

  // day dots
  const dotY = h * 0.87
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i < 5 ? ACCENT2 : '#2c2740'
    ctx.beginPath(); ctx.arc(cx - 180 + i * 60, dotY, 16, 0, Math.PI * 2); ctx.fill()
  }
}

// ---------- 4. DES — BIOS setup screen ----------
function drawBios(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0a1e6e'; ctx.fillRect(0, 0, w, h)
  // title bar
  ctx.fillStyle = '#c9d4ff'; ctx.fillRect(0, 0, w, 46)
  ctx.fillStyle = '#0a1e6e'; ctx.font = '700 24px monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'
  ctx.fillText('DES Secure Firmware — Setup Utility', w / 2, 24)
  // tabs
  ctx.textAlign = 'left'; ctx.font = '600 22px monospace'
  const tabs = ['Main', 'Security', 'Boot', 'Exit']
  tabs.forEach((t, i) => {
    const x = 30 + i * 150
    if (i === 1) { ctx.fillStyle = '#c9d4ff'; ctx.fillRect(x - 12, 58, 130, 34); ctx.fillStyle = '#0a1e6e' } else ctx.fillStyle = '#9fb0ff'
    ctx.fillText(t, x, 76)
  })
  // main panel
  ctx.strokeStyle = '#6f86e0'; ctx.lineWidth = 2; ctx.strokeRect(24, 108, w * 0.6, h - 180)
  const rows: [string, string][] = [
    ['System Time', '08:42:13'],
    ['Firmware Version', 'DES 2.3.1'],
    ['AES-128 Key', 'Installed'],
    ['RSA Keypair', 'Verified'],
    ['Signature Check', '[ PASS ]'],
    ['Secure Boot', '<Enabled>'],
    ['Tamper Fuse', 'Intact'],
  ]
  ctx.font = '20px monospace'; ctx.textBaseline = 'alphabetic'
  rows.forEach(([k, v], i) => {
    const y = 150 + i * 42
    ctx.fillStyle = '#dfe6ff'; ctx.fillText(k, 48, y)
    ctx.fillStyle = i === 5 ? '#ffe27a' : '#7CFFB0'; ctx.fillText(v, 380, y)
  })
  // help panel
  ctx.strokeStyle = '#6f86e0'; ctx.strokeRect(w * 0.6 + 40, 108, w - (w * 0.6 + 64), h - 180)
  ctx.fillStyle = '#c9d4ff'; ctx.font = '18px monospace'
  wrap(ctx, 'Confidentiality, Integrity, Authentication enforced. Firmware encrypted (AES-128 CBC) and signed (RSA) before flashing.', w * 0.6 + 56, 150, w - (w * 0.6 + 96), 26)
  // footer
  ctx.fillStyle = '#9fb0ff'; ctx.font = '18px monospace'
  ctx.fillText('↑↓ Select   Enter Modify   F10 Save   ESC Exit', 30, h - 36)
  ctx.fillStyle = '#7CFFB0'; ctx.fillText('POST: 16384MB OK', w - 280, h - 36)
}

// ---------- 5. Music Recommender — desktop player ----------
function drawMusic(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0d0b14'; ctx.fillRect(0, 0, w, h)
  // sidebar
  ctx.fillStyle = '#141121'; ctx.fillRect(0, 0, 250, h)
  ctx.fillStyle = ACCENT; ctx.font = '800 26px ui-sans-serif'; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'
  ctx.fillText('♫ Recommender', 24, 56)
  ctx.fillStyle = '#8b91a0'; ctx.font = '500 20px ui-sans-serif'
  ;['Home', 'Search', 'Your Library', '— Seeds —', 'Liked songs', 'Discover'].forEach((t, i) => {
    ctx.fillStyle = t.startsWith('—') ? '#4a4f5e' : '#aeb4c2'
    ctx.fillText(t, 24, 120 + i * 46)
  })
  // album art
  const ax = 290, ay = 60, as = 250
  const ag = ctx.createLinearGradient(ax, ay, ax + as, ay + as)
  ag.addColorStop(0, ACCENT); ag.addColorStop(1, ACCENT3)
  ctx.fillStyle = ag; rr(ctx, ax, ay, as, as, 18); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(ax + as / 2, ay + as / 2, 34, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#0d0b14'; ctx.beginPath(); ctx.arc(ax + as / 2, ay + as / 2, 10, 0, Math.PI * 2); ctx.fill()
  // track info
  ctx.fillStyle = '#fff'; ctx.font = '800 44px ui-sans-serif'; ctx.fillText('Midnight Drive', ax + 290, ay + 90)
  ctx.fillStyle = ACCENT2; ctx.font = '500 24px ui-sans-serif'; ctx.fillText('Recommended from your seeds', ax + 290, ay + 130)
  ctx.fillStyle = '#8b91a0'; ctx.font = '400 20px ui-sans-serif'; ctx.fillText('K-means · cluster 3 · similarity 0.92', ax + 290, ay + 166)
  // queue
  const songs = ['Neon Fields — Ariver', 'Slow Light — Mø Tide', 'Paper Planes — Cael', 'Afterglow — Nuvi']
  songs.forEach((s, i) => {
    const y = 360 + i * 56
    ctx.fillStyle = i === 0 ? '#1b1830' : '#141121'; rr(ctx, 290, y, w - 330, 46, 10); ctx.fill()
    ctx.fillStyle = i === 0 ? ACCENT2 : '#6c7280'; ctx.font = '700 18px ui-sans-serif'; ctx.fillText(String(i + 1), 306, y + 30)
    ctx.fillStyle = '#cfd3dc'; ctx.font = '500 20px ui-sans-serif'; ctx.fillText(s, 340, y + 30)
  })
  // now-playing bar
  ctx.fillStyle = '#16131f'; ctx.fillRect(0, h - 84, w, 84)
  // progress
  ctx.fillStyle = '#2c2a3a'; rr(ctx, 250, h - 30, w - 360, 8, 4); ctx.fill()
  ctx.fillStyle = ACCENT; rr(ctx, 250, h - 30, (w - 360) * 0.38, 8, 4); ctx.fill()
  ctx.fillStyle = '#8b91a0'; ctx.font = '400 16px ui-sans-serif'; ctx.fillText('1:23', 250, h - 44); ctx.textAlign = 'right'; ctx.fillText('3:40', w - 110, h - 44); ctx.textAlign = 'left'
  // controls
  ctx.fillStyle = '#fff'
  ctx.font = '26px ui-sans-serif'; ctx.fillText('⏮', 90, h - 34)
  ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(150, h - 42, 24, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = '24px ui-sans-serif'; ctx.fillText('▶', 142, h - 33)
  ctx.fillText('⏭', 195, h - 34)
}

// ---------- 6. 2FA Pipeline — IDE with audio-viz popup ----------
function drawIdeAudio(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ideChrome(ctx, w, h, 'auth_2fa.c')
  const code: Seg[][] = [
    [{ t: '#include ', c: '#c678dd' }, { t: '"tflite_micro.h"', c: '#98c379' }],
    [{ t: '#include ', c: '#c678dd' }, { t: '"imu.h"', c: '#98c379' }],
    [],
    [{ t: '// capture mic + IMU, run on-chip NN', c: '#5c6370' }],
    [{ t: 'int ', c: '#c678dd' }, { t: 'verify_user', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: 'Frame ', c: '#e5c07b' }, { t: 'f', c: '#abb2bf' }, { t: ') {', c: '#abb2bf' }],
    [{ t: '  float ', c: '#c678dd' }, { t: 'feat', c: '#e06c75' }, { t: '[N];', c: '#abb2bf' }],
    [{ t: '  extract', c: '#61afef' }, { t: '(f.audio, f.imu, ', c: '#abb2bf' }, { t: 'feat', c: '#e06c75' }, { t: ');', c: '#abb2bf' }],
    [{ t: '  float ', c: '#c678dd' }, { t: 'p', c: '#e06c75' }, { t: ' = ', c: '#abb2bf' }, { t: 'nn_infer', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: 'feat', c: '#e06c75' }, { t: ');', c: '#abb2bf' }],
    [{ t: '  return ', c: '#c678dd' }, { t: 'p > ', c: '#abb2bf' }, { t: 'THRESH', c: '#d19a66' }, { t: ';', c: '#abb2bf' }],
    [{ t: '}', c: '#abb2bf' }],
  ]
  codeLines(ctx, code, 110, 110, 38, '20px monospace')

  // popup: audio visualisation
  const pw = w * 0.46, ph = 230, px = w - pw - 50, py = h - ph - 60
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; rr(ctx, px + 8, py + 12, pw, ph, 16); ctx.fill()
  ctx.fillStyle = '#161b24'; ctx.strokeStyle = ACCENT2; ctx.lineWidth = 2; rr(ctx, px, py, pw, ph, 16); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#fff'; ctx.font = '700 22px ui-sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  ctx.fillText('Audio capture', px + 24, py + 40)
  ctx.fillStyle = ACCENT2; ctx.font = '500 16px monospace'; ctx.fillText('● listening', px + pw - 130, py + 40)
  // waveform bars
  const bx = px + 24, bw = pw - 48, baseY = py + 150, n = 38
  const heights = [6, 14, 26, 40, 22, 52, 70, 44, 30, 60, 84, 50, 28, 16, 38, 66, 90, 58, 34, 20, 46, 72, 96, 62, 38, 22, 50, 78, 54, 30, 18, 40, 64, 42, 24, 14, 28, 10]
  for (let i = 0; i < n; i++) {
    const bh = heights[i % heights.length]
    ctx.fillStyle = ACCENT2
    rr(ctx, bx + i * (bw / n), baseY - bh, (bw / n) * 0.55, bh * 2, 3); ctx.fill()
  }
  // sine overlay
  ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.beginPath()
  for (let i = 0; i <= bw; i += 6) { const yy = baseY + Math.sin(i / 28) * 26; i === 0 ? ctx.moveTo(bx + i, yy) : ctx.lineTo(bx + i, yy) }
  ctx.stroke()
}

// ---------- 7. Eta Compiler — IDE with assembly ----------
function drawIdeAsm(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ideChrome(ctx, w, h, 'eta.s')
  const R = '#d19a66', M = '#61afef', C = '#5c6370', L = '#e5c07b', P = '#abb2bf', N = '#d19a66'
  const code: Seg[][] = [
    [{ t: '.section ', c: M }, { t: '.text', c: L }],
    [{ t: '.globl ', c: M }, { t: 'main', c: L }],
    [],
    [{ t: 'main:', c: L }],
    [{ t: '  push  ', c: M }, { t: '%rbp', c: R }],
    [{ t: '  mov   ', c: M }, { t: '%rsp, %rbp', c: R }],
    [{ t: '  mov   ', c: M }, { t: '$0, ', c: N }, { t: '%eax', c: R }, { t: '   # i = 0', c: C }],
    [{ t: 'loop:', c: L }],
    [{ t: '  cmp   ', c: M }, { t: '$10, ', c: N }, { t: '%eax', c: R }],
    [{ t: '  jge   ', c: M }, { t: 'done', c: L }],
    [{ t: '  add   ', c: M }, { t: '$1, ', c: N }, { t: '%eax', c: R }],
    [{ t: '  jmp   ', c: M }, { t: 'loop', c: L }],
    [{ t: 'done:', c: L }],
    [{ t: '  pop   ', c: M }, { t: '%rbp', c: R }],
    [{ t: '  ret', c: M }, { t: '          ', c: P }, { t: '# lex → parse → codegen', c: C }],
  ]
  codeLines(ctx, code, 110, 100, 33, '19px monospace')
}

// ---------- Financial Data Verifier — stock portfolio + verification ----------
function drawPortfolio(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0a0c10'; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#0f1218'; ctx.fillRect(0, 0, w, 64)
  ctx.fillStyle = '#fff'; ctx.font = '700 26px ui-sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  ctx.fillText('Portfolio · Verifier', 28, 33)
  ctx.fillStyle = ACCENT2; ctx.font = '700 22px ui-sans-serif'; ctx.textAlign = 'right'; ctx.fillText('+ verified vs SEC EDGAR', w - 28, 33); ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  // value + chart
  ctx.fillStyle = '#8b91a0'; ctx.font = '400 18px ui-sans-serif'; ctx.fillText('Total value', 28, 110)
  ctx.fillStyle = '#fff'; ctx.font = '800 46px ui-sans-serif'; ctx.fillText('$1,284,540', 28, 156)
  ctx.fillStyle = ACCENT2; ctx.font = '600 20px ui-sans-serif'; ctx.fillText('▲ 2.4% today', 300, 156)
  // line chart
  const cx = 28, cy = 190, cw = w - 56, chh = 150
  ctx.strokeStyle = '#1c2430'; ctx.lineWidth = 1
  for (let i = 0; i <= 3; i++) { const y = cy + (chh / 3) * i; ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + cw, y); ctx.stroke() }
  const pts = [0.6, 0.55, 0.62, 0.5, 0.58, 0.42, 0.48, 0.34, 0.4, 0.28, 0.32, 0.18, 0.12]
  ctx.strokeStyle = ACCENT2; ctx.lineWidth = 3; ctx.beginPath()
  pts.forEach((p, i) => { const x = cx + (cw / (pts.length - 1)) * i, y = cy + chh * p; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) })
  ctx.stroke()
  const grad = ctx.createLinearGradient(0, cy, 0, cy + chh)
  grad.addColorStop(0, 'rgba(35,213,171,0.25)'); grad.addColorStop(1, 'rgba(35,213,171,0)')
  ctx.lineTo(cx + cw, cy + chh); ctx.lineTo(cx, cy + chh); ctx.closePath(); ctx.fillStyle = grad; ctx.fill()
  // holdings table with verification verdicts
  const rows: [string, string, string, string][] = [
    ['AAPL', '320', '$198.4', 'EXACT'],
    ['MSFT', '140', '$432.1', 'WITHIN 0.5%'],
    ['JPM', '90', '$201.7', 'MATERIAL'],
    ['NVDA', '210', '$121.9', 'EXACT'],
  ]
  let ty = cy + chh + 56
  ctx.font = '600 18px monospace'; ctx.fillStyle = '#5b6472'
  ctx.fillText('TICKER', 28, ty); ctx.fillText('SHARES', 230, ty); ctx.fillText('PRICE', 400, ty); ctx.fillText('VERIFY', 560, ty)
  ty += 14
  rows.forEach(([tk, sh, pr, vd]) => {
    ty += 44
    ctx.fillStyle = '#11151c'; rr(ctx, 24, ty - 30, w - 48, 40, 8); ctx.fill()
    ctx.fillStyle = '#e7eaf0'; ctx.font = '700 20px monospace'; ctx.fillText(tk, 36, ty - 2)
    ctx.fillStyle = '#aeb4c2'; ctx.font = '500 20px monospace'; ctx.fillText(sh, 236, ty - 2); ctx.fillText(pr, 400, ty - 2)
    const ok = vd === 'EXACT'; const warn = vd === 'MATERIAL'
    ctx.fillStyle = warn ? '#ff6b6b' : ok ? ACCENT2 : '#ffd166'
    ctx.font = '700 18px monospace'; ctx.fillText((warn ? '⚠ ' : '✓ ') + vd, 560, ty - 2)
  })
}

// ---------- StockPuppet — search + matched stocks ----------
function drawStockSearch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#0b0f16'; ctx.fillRect(0, 0, w, h)
  // logo: blue puppet silhouette
  const lx = 40, ly = 56
  ctx.fillStyle = '#2e9be6'
  ctx.beginPath(); ctx.ellipse(lx, ly, 26, 30, 0, 0, Math.PI * 2); ctx.fill() // head
  ctx.beginPath(); ctx.ellipse(lx + 16, ly + 10, 18, 12, 0, 0, Math.PI * 2); ctx.fill() // snout
  ctx.fillStyle = '#0b0f16'; ctx.beginPath(); ctx.arc(lx - 4, ly - 8, 5, 0, Math.PI * 2); ctx.fill() // eye
  ctx.fillStyle = '#fff'; ctx.font = '800 32px ui-sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  ctx.fillText('StockPuppet', lx + 50, ly)
  // search bar
  ctx.fillStyle = '#141a24'; rr(ctx, 40, 110, w - 80, 56, 28); ctx.fill()
  ctx.strokeStyle = '#2e9be6'; ctx.lineWidth = 2; rr(ctx, 40, 110, w - 80, 56, 28); ctx.stroke()
  ctx.fillStyle = '#9aa1ad'; ctx.font = '500 24px ui-sans-serif'; ctx.fillText('🔍', 64, 139)
  ctx.fillStyle = '#e7eaf0'; ctx.fillText('semiconductor companies', 104, 140)
  ctx.fillStyle = '#5b6472'; ctx.font = '400 18px ui-sans-serif'; ctx.textBaseline = 'alphabetic'
  ctx.fillText('TF-IDF · cosine similarity · field-weighted', 44, 200)
  // results
  const res: [string, string, string, number][] = [
    ['NVDA', 'NVIDIA Corp', 'Semiconductors', 0.97],
    ['AMD', 'Advanced Micro Devices', 'Semiconductors', 0.91],
    ['TSM', 'Taiwan Semiconductor', 'Semiconductors', 0.88],
    ['INTC', 'Intel Corp', 'Semiconductors', 0.79],
    ['AVGO', 'Broadcom Inc', 'Semiconductors', 0.74],
  ]
  let y = 226
  res.forEach(([tk, nm, sec, score]) => {
    ctx.fillStyle = '#10151e'; rr(ctx, 40, y, w - 80, 62, 12); ctx.fill()
    ctx.fillStyle = '#2e9be6'; ctx.font = '800 24px monospace'; ctx.fillText(tk, 60, y + 40)
    ctx.fillStyle = '#e7eaf0'; ctx.font = '600 22px ui-sans-serif'; ctx.fillText(nm, 200, y + 32)
    ctx.fillStyle = '#6c7280'; ctx.font = '400 16px ui-sans-serif'; ctx.fillText(sec, 200, y + 52)
    // score bar
    ctx.fillStyle = '#1c2430'; rr(ctx, w - 240, y + 26, 160, 10, 5); ctx.fill()
    ctx.fillStyle = '#2e9be6'; rr(ctx, w - 240, y + 26, 160 * score, 10, 5); ctx.fill()
    ctx.fillStyle = '#9aa1ad'; ctx.font = '600 16px monospace'; ctx.textAlign = 'right'; ctx.fillText(score.toFixed(2), w - 60, y + 20); ctx.textAlign = 'left'
    y += 74
  })
}

// ---------- Clutch — uploaded lecture PDFs + summarized content ----------
function drawClutch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const GREEN = '#00ff88'
  ctx.fillStyle = '#0d0d0d'; ctx.fillRect(0, 0, w, h)
  // sidebar
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 300, h)
  ctx.fillStyle = GREEN; ctx.font = '800 28px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  ctx.fillText('clutch', 24, 56)
  ctx.fillStyle = '#7a7a7a'; ctx.font = '600 15px monospace'; ctx.fillText('UPLOADED NOTES', 24, 100)
  const pdfs = ['lecture_07_trees.pdf', 'lecture_08_graphs.pdf', 'midterm_review.pdf']
  pdfs.forEach((f, i) => {
    const y = 124 + i * 56
    ctx.fillStyle = i === 0 ? '#15211a' : '#121212'; rr(ctx, 16, y, 268, 44, 8); ctx.fill()
    ctx.fillStyle = i === 0 ? GREEN : '#9aa1a0'; ctx.font = '16px monospace'; ctx.fillText('📄', 30, y + 28)
    ctx.fillStyle = i === 0 ? '#e7faef' : '#9aa1a0'; ctx.font = '500 15px monospace'; ctx.fillText(f, 60, y + 28)
  })
  ctx.fillStyle = '#1a1a1a'; rr(ctx, 16, 320, 268, 50, 10); ctx.fill()
  ctx.strokeStyle = GREEN; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5; rr(ctx, 16, 320, 268, 50, 10); ctx.stroke(); ctx.setLineDash([])
  ctx.fillStyle = GREEN; ctx.font = '600 15px monospace'; ctx.textAlign = 'center'; ctx.fillText('+ drop PDF / TXT / MD', 150, 350); ctx.textAlign = 'left'
  // main: summary
  ctx.fillStyle = '#fff'; ctx.font = '800 34px ui-sans-serif'; ctx.fillText('Key topics', 340, 70)
  ctx.fillStyle = '#7a7a7a'; ctx.font = '400 18px ui-sans-serif'; ctx.fillText('extracted from lecture_07_trees.pdf', 340, 100)
  const topics = ['Binary search trees', 'Tree traversals (pre/in/post)', 'Balancing & rotations', 'Heaps & priority queues']
  topics.forEach((t, i) => {
    const y = 140 + i * 64
    ctx.fillStyle = '#141414'; rr(ctx, 340, y, w - 380, 50, 10); ctx.fill()
    ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(366, y + 25, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#e7eaf0'; ctx.font = '600 22px ui-sans-serif'; ctx.fillText(t, 392, y + 33)
    ctx.fillStyle = '#5b6472'; ctx.font = '400 15px monospace'; ctx.textAlign = 'right'; ctx.fillText(`${3 + i} cards`, w - 60, y + 31); ctx.textAlign = 'left'
  })
  // flashcard
  ctx.fillStyle = '#11201a'; ctx.strokeStyle = GREEN; ctx.lineWidth = 2; rr(ctx, 340, 410, w - 380, 150, 14); ctx.fill(); ctx.stroke()
  ctx.fillStyle = GREEN; ctx.font = '600 14px monospace'; ctx.fillText('FLASHCARD · flip to reveal', 364, 444)
  ctx.fillStyle = '#fff'; ctx.font = '600 24px ui-sans-serif'; ctx.fillText('What is the worst-case height of a BST?', 364, 488)
  ctx.fillStyle = '#9aa1a0'; ctx.font = '400 18px ui-sans-serif'; ctx.fillText('Tap to reveal answer →', 364, 524)
}

// ---------- Bridge — crisis coordination map ----------
function drawBridge(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const RED = '#e5484d', YELLOW = '#ffce47', GREEN = '#46c98b'
  const mapH = h * 0.64
  // map base
  ctx.fillStyle = '#11161d'; ctx.fillRect(0, 0, w, mapH)
  ctx.strokeStyle = '#1d2630'; ctx.lineWidth = 10
  for (let i = -1; i < 7; i++) { ctx.beginPath(); ctx.moveTo(0, i * 110 + 40); ctx.lineTo(w, i * 110 - 10); ctx.stroke() }
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(i * 160 + 30, 0); ctx.lineTo(i * 160 - 30, mapH); ctx.stroke() }
  // disaster zone ring (yellow)
  ctx.strokeStyle = YELLOW; ctx.lineWidth = 4; ctx.globalAlpha = 0.8
  ctx.beginPath(); ctx.arc(w * 0.7, mapH * 0.4, 110, 0, Math.PI * 2); ctx.stroke()
  ctx.globalAlpha = 0.12; ctx.fillStyle = YELLOW; ctx.beginPath(); ctx.arc(w * 0.7, mapH * 0.4, 110, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
  // pins with callout boxes
  const pins: [number, number, string, string][] = [
    [w * 0.22, mapH * 0.55, RED, 'insulin needed'],
    [w * 0.46, mapH * 0.3, RED, 'ride home'],
    [w * 0.72, mapH * 0.42, YELLOW, 'shelter'],
    [w * 0.86, mapH * 0.66, GREEN, 'car offered'],
  ]
  ctx.textBaseline = 'middle'
  for (const [x, y, col, label] of pins) {
    // callout box
    ctx.font = '600 17px ui-sans-serif'
    const bw = ctx.measureText(label).width + 28
    ctx.fillStyle = '#0c1117'; ctx.strokeStyle = col; ctx.lineWidth = 2
    rr(ctx, x - bw / 2, y - 58, bw, 34, 8); ctx.fill(); ctx.stroke()
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(label, x, y - 40)
    // pin
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#0c1117'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
  }
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  // header overlay
  ctx.fillStyle = 'rgba(8,11,16,0.7)'; ctx.fillRect(0, 0, w, 50)
  ctx.fillStyle = '#fff'; ctx.font = '800 24px ui-sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('Bridge', 24, 25)
  ctx.fillStyle = '#9aa1ad'; ctx.font = '500 16px ui-sans-serif'; ctx.fillText('coordination, not chaos', 130, 26)
  ctx.textBaseline = 'alphabetic'
  // request detail panel under the map
  ctx.fillStyle = '#0c0f14'; ctx.fillRect(0, mapH, w, h - mapH)
  ctx.fillStyle = '#6c7280'; ctx.font = '600 16px monospace'; ctx.fillText('OPEN REQUESTS NEAR YOU', 28, mapH + 34)
  const reqs: [string, string, string, string][] = [
    ['Maria T', 'insulin — grandma, urgent', 'NEED · 5', RED],
    ['jen.r', 'cold dorm, needs space heater', 'NEED · 3', RED],
    ['Devon', 'car available, 2 seats', 'OFFER', GREEN],
  ]
  let y = mapH + 54
  reqs.forEach(([who, what, tag, col]) => {
    ctx.fillStyle = '#12161d'; rr(ctx, 24, y, w - 48, 50, 10); ctx.fill()
    ctx.fillStyle = col; rr(ctx, 24, y, 5, 50, 3); ctx.fill()
    ctx.fillStyle = '#e7eaf0'; ctx.font = '700 19px ui-sans-serif'; ctx.fillText(who, 44, y + 22)
    ctx.fillStyle = '#9aa1ad'; ctx.font = '400 17px ui-sans-serif'; ctx.fillText(what, 44, y + 42)
    ctx.fillStyle = col; ctx.font = '700 15px monospace'; ctx.textAlign = 'right'; ctx.fillText(tag, w - 150, y + 30); ctx.textAlign = 'left'
    ctx.fillStyle = ACCENT; rr(ctx, w - 130, y + 11, 100, 28, 14); ctx.fill()
    ctx.fillStyle = '#fff'; ctx.font = '600 15px ui-sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Accept', w - 80, y + 30); ctx.textAlign = 'left'
    y += 60
  })
}

// ---------- shared chrome ----------
function ideChrome(ctx: CanvasRenderingContext2D, w: number, h: number, file: string) {
  ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#0a0d12'; ctx.fillRect(0, 0, 70, h) // activity bar
  ctx.fillStyle = '#11151c'; ctx.fillRect(70, 0, w - 70, 52) // tab bar
  ctx.fillStyle = '#0d1117'; ctx.fillRect(80, 0, 220, 52) // active tab
  ctx.fillStyle = ACCENT2; ctx.fillRect(80, 0, 220, 3)
  ctx.fillStyle = '#cfd3dc'; ctx.font = '500 20px monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'
  ctx.fillText(file, 100, 27)
  // gutter line
  ctx.strokeStyle = '#1b2230'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(96, 60); ctx.lineTo(96, h); ctx.stroke()
  ctx.textBaseline = 'alphabetic'
}

function statusBar(ctx: CanvasRenderingContext2D, w: number, bg: string, fg: string) {
  if (bg !== 'transparent') { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, 70) }
  ctx.fillStyle = fg; ctx.font = '600 26px ui-sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'
  ctx.fillText('9:41', 36, 38)
  ctx.textAlign = 'right'
  ctx.fillText('5G  ▮▮▮', w - 36, 38)
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = word; yy += lh }
    else line = test
  }
  if (line) ctx.fillText(line, x, yy)
}
