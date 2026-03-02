'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatRupiah } from '../../lib/utils'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const BULAN_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [currentYear, setCurrentYear] = useState(2025)

  useEffect(() => {
    setIsMounted(true)
    setCurrentYear(new Date().getFullYear())
    fetch('/api/reports')
      .then(r => r.json())
      .then(res => {
        if (res.stats) setData(res)
      })
  }, [])

  if (!data || !isMounted) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
    </div>
  )

  const stats = [
    {
      label: 'Stok Tersedia',
      value: data.stats.stok,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M12 18h3l2-4h2a2 2 0 1 0 0-4h-3l-2-4h-3a2 2 0 0 0-2 2v2" />
          <path d="M9 12h3l1-2" />
          <path d="M15 10l-1 2" />
        </svg>
      ),
      color: 'blue',
      href: '/stok',
      suffix: 'unit'
    },
    {
      label: 'Unit Terjual',
      value: data.stats.terjual,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11l-4 4-2-2" />
        </svg>
      ),
      color: 'gold',
      href: '/unit-keluar',
      suffix: 'unit'
    },
    {
      label: 'Total Laba',
      value: formatRupiah(data.stats.laba),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: 'emerald',
      href: '/laba',
      suffix: ''
    },
    {
      label: 'Performance',
      value: data.laporan.length,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      color: 'green',
      href: '/laporan',
      suffix: 'bln aktif'
    },
  ]

  // Prepare chart data for all 12 months
  const chartData = BULAN_NAMES.map((name, index) => {
    const monthNumber = index + 1
    const monthData = data.laporan.find((item: any) => Number(item.bulan) === monthNumber)
    return {
      name,
      total: monthData ? Number(monthData.laba) : 0
    }
  })

  return (
    <div className="p-5 sm:p-8 md:p-12 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-10 md:mb-16">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase">DASHBOARD</h1>
        <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
          <span className="w-8 h-0.5 bg-gold-500/50 rounded-full"></span>
          OVERVIEW MANAJEMEN SHOWROOM
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-20">
        {stats.map((s, i) => (
          <Link href={s.href} key={i}>
            <StatCard {...s} />
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-5 sm:p-8 rounded-3xl animate-in shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-8 gap-4">
          <h2 className="font-display text-xl sm:text-2xl tracking-widest text-white/90 italic">PROFIT BULANAN {currentYear}</h2>
          <div className="hidden sm:block w-16 h-1 bg-gold-500/20 rounded-full"></div>
        </div>
        <div className="w-full h-[350px] sm:h-[400px] overflow-x-auto custom-scrollbar-horizontal cursor-grab active:cursor-grabbing pb-2">
          <div className="min-w-[700px] md:min-w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8' }}
                  dy={10}
                  interval={0}
                  minTickGap={0}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0a1931] border border-gold-500/20 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
                          <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-1 uppercase italic">{payload[0].payload.name}</p>
                          <p className="text-gold-400 font-display text-sm tracking-widest italic">{formatRupiah(payload[0].value as number)}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.total >= 0 ? 'url(#barGradient)' : '#ef4444'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, suffix }: any) {
  const iconBg: any = {
    blue: 'bg-blue-500/10 text-blue-400',
    gold: 'bg-gold-500/10 text-gold-400',
    green: 'bg-green-500/10 text-green-400',
    emerald: 'bg-emerald-500/10 text-emerald-400'
  }
  const textColors: any = {
    blue: 'text-blue-500',
    gold: 'text-gold-500',
    green: 'text-green-500',
    emerald: 'text-emerald-500'
  }

  return (
    <div className={`bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 md:p-8 rounded-2xl md:rounded-[2rem] card-hover relative overflow-hidden group active:shadow-glow-gold active:scale-95 transition-all h-full cursor-pointer`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
      <div className="flex items-start justify-between relative z-10 gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-[0.2em] mb-4 uppercase truncate">{label}</p>
          <div className="flex flex-wrap items-baseline gap-2">
            <p className={`text-2xl sm:text-3xl md:text-4xl font-display tracking-widest ${textColors[color]} leading-tight break-all sm:break-normal italic`}>
              {value}
            </p>
            {suffix && <span className="text-[10px] md:text-xs text-slate-500 font-medium lowercase italic">{suffix}</span>}
          </div>
        </div>
        <div className={`p-3 md:p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 flex-shrink-0 ${iconBg[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
