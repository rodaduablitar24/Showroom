'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/reports').then(r => r.json()).then(setData)
  }, [])

  const chartData = BULAN.map((bulan, i) => {
    const d = data?.laporan?.find((l: any) => Number(l.bulan) === i + 1)
    return {
      bulan,
      laba: Number(d?.laba || 0),
      terjual: Number(d?.unit_terjual || 0),
    }
  })

  const stats = data?.stats || { stok: 0, terjual: 0, laba: 0 }

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-6 md:mb-10 md:ml-0">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] text-white leading-none">DASHBOARD</h1>
        <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3">
          <span className="w-6 h-0.5 bg-gold-500/50 rounded-full"></span>
          OVERVIEW MANAJEMEN SHOWROOM
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
        <StatCard
          label="STOK UNIT"
          value={stats.stok}
          suffix="unit"
          color="brand"
          icon={
            <svg width="24" height="24" viewBox="0 0 64 64" fill="currentColor">
              <circle cx="12" cy="44" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M20 44 L28 28 L36 28 L42 20 L50 20 L52 36 M20 44 L12 44" strokeWidth="3" stroke="currentColor" fill="none" />
            </svg>
          }
        />
        <StatCard
          label="UNIT TERJUAL"
          value={stats.terjual}
          suffix="unit"
          color="green"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          }
        />
        <StatCard
          label="TOTAL LABA"
          value={formatRupiah(stats.laba)}
          color="yellow"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          }
        />
      </div>

      {/* Chart */}
      <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 rounded-2xl animate-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-xl tracking-widest text-white/90 italic">LABA BULANAN {new Date().getFullYear()}</h2>
          <div className="w-12 h-1 bg-gold-500/20 rounded-full"></div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="bulan" tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}jt` : v.toString()} />
            <Tooltip
              contentStyle={{ background: '#0a1930', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
              labelStyle={{ color: '#d4af37', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', marginBottom: '4px' }}
              formatter={(val: any) => [formatRupiah(val), 'Laba']}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="laba" fill="url(#colorLaba)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatCard({ label, value, suffix, color, icon }: any) {
  const borderColors: any = {
    brand: 'border-gold-500/20',
    green: 'border-green-500/20',
    yellow: 'border-gold-500/20',
  }
  const textColors: any = {
    brand: 'text-gold-400',
    green: 'text-green-400',
    yellow: 'text-gold-400',
  }
  const iconBg: any = {
    brand: 'bg-gold-500/10 text-gold-400',
    green: 'bg-green-500/10 text-green-400',
    yellow: 'bg-gold-500/10 text-gold-400',
  }

  return (
    <div className={`bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 md:p-8 rounded-2xl md:rounded-[2rem] card-hover relative overflow-hidden group active:shadow-glow-gold active:scale-95 transition-all`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
      <div className="flex items-start justify-between relative z-10 gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-[0.2em] mb-4 uppercase truncate">{label}</p>
          <div className="flex flex-wrap items-baseline gap-2">
            <p className={`text-2xl sm:text-3xl md:text-4xl font-display tracking-widest ${textColors[color]} leading-tight break-all sm:break-normal`}>
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
