'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  {
    href: '/dashboard',
    label: 'DASHBOARD',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    href: '/stok',
    label: 'STOK UNIT',
    icon: (
      <svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="12" cy="44" r="8" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="12" cy="44" r="4" />
        <circle cx="52" cy="44" r="8" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="52" cy="44" r="4" />
        <path d="M20 44 L28 28 L36 28 L42 20 L50 20 L52 36 M20 44 L12 44" strokeWidth="4" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 28 L44 36 L52 36" strokeWidth="4" stroke="currentColor" fill="none" strokeLinecap="round" />
        <path d="M36 28 L36 36" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/unit-masuk',
    label: 'UNIT MASUK',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
  },
  {
    href: '/unit-keluar',
    label: 'UNIT KELUAR',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
      </svg>
    ),
  },
  {
    href: '/laba',
    label: 'LABA PENJUALAN',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
  },
  {
    href: '/laporan',
    label: 'LAPORAN BULANAN',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'PENGATURAN',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.91,7.62,6.29L5.23,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.72,8.87 c-0.11,0.21-0.06,0.47,0.12,0.61l2.03,1.58C4.84,11.36,4.81,11.69,4.81,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
      </svg>
    ),
  },
]

const bottomNavItems = navItems.slice(0, 5)

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  function handleNavClick() {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a1931]/80 backdrop-blur-md border-b border-gold-500/10 flex items-center px-4 z-40 gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gold-500 text-black rounded-xl shadow-lg shadow-gold-500/20 active:scale-90 transition-all flex-shrink-0"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <div className="flex items-center gap-2 min-w-0 flex-shrink">
          <div className="w-8 h-8 bg-gold-500/10 rounded-lg p-1.5 border border-gold-500/20 flex-shrink-0">
            <img src="/logo.png" alt="logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          <span className="font-display text-white text-base tracking-[0.1em] truncate italic -skew-x-6 uppercase">RODA DUA MOKAS</span>
        </div>


      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0a1931]/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[#0a1931] border-r border-gold-500/10 flex flex-col z-40 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:w-64`}>
        {/* Precision Logo Header */}
        <div className="py-10 px-6 border-b border-gold-500/10 flex flex-col items-center">
          <div className="relative w-full aspect-[16/9] max-w-[150px]">
            <img
              src="/logo.png"
              alt="RODA DUA MOKAS Logo"
              className="object-contain w-full h-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`group flex items-center gap-3 px-4 py-3.5 text-[11px] font-bold tracking-[0.15em] transition-all rounded-xl ${active
                  ? 'bg-gold-500 text-black active:shadow-glow-gold ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`transition-colors ${active ? 'text-black' : 'text-slate-500 group-hover:text-gold-400'}`}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-[11px] font-bold tracking-[0.15em] text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all rounded-xl"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            KELUAR
          </button>
        </div>
      </aside>

    </>
  )
}
