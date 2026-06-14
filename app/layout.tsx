import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

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
    <html lang="en">
      <body className="font-sans bg-bg text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
