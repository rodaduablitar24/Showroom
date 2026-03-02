import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'RODA DUA MOKAS',
  description: 'Sistem Manajemen Showroom RODA DUA MOKAS',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body bg-[#0a1931] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
