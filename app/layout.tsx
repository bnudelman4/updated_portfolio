import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ben Nudelman — CS @ Cornell',
  description:
    'Ben Nudelman — Computer Science at Cornell. Full-stack, mobile, and embedded software. Selected work and experience.',
  openGraph: {
    title: 'Ben Nudelman — CS @ Cornell',
    description:
      'Full-stack, mobile, and embedded software. Selected work and experience.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans bg-bg text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
