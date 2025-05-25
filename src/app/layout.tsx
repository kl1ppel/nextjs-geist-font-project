import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhatsApp Business Automation',
  description: 'Send bulk messages through WhatsApp Business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} min-h-screen bg-background text-foreground`}
        style={{
          '--background': 'white',
          '--foreground': 'black',
          '--primary': '#2563eb',
          '--primary-foreground': 'white',
          '--secondary': '#f3f4f6',
          '--secondary-foreground': '#1f2937',
          '--muted': '#f3f4f6',
          '--muted-foreground': '#6b7280',
          '--accent': '#f3f4f6',
          '--accent-foreground': '#1f2937',
          '--destructive': '#ef4444',
          '--destructive-foreground': 'white',
          '--border': '#e5e7eb',
          '--input': '#e5e7eb',
          '--ring': '#2563eb',
          '--radius': '0.5rem'
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  )
}
