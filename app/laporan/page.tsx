'use client'

import { useEffect, useState } from 'react'
import { formatRupiah } from '../../lib/utils'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts'

const BULAN_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export default function LaporanPage() {
  const [laporan, setLaporan] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tahun, setTahun] = useState(2025)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setTahun(new Date().getFullYear())
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetch(`/api/reports/monthly?year=${tahun}`)
        .then(r => r.json())
        .then(data => { setLaporan(data); setLoading(false) })
    }
  }, [tahun, isMounted])

  if (!isMounted) return null

  const chartData = BULAN_NAMES.map((name, index) => {
    const monthNumber = index + 1
    const monthData = laporan.find((l: any) => Number(l.bulan) === monthNumber)
    return {
      bulan: monthNumber,
      name,
      laba: monthData ? Number(monthData.laba) : 0,
      unit_terjual: monthData ? monthData.unit_terjual : 0,
      total_penjualan: monthData ? monthData.total_penjualan : 0,
      total_modal: monthData ? monthData.total_modal : 0
    }
  })

  const totalTerjual = laporan.reduce((s: number, l: any) => s + (l.unit_terjual || 0), 0)
  const totalLaba = laporan.reduce((s: number, l: any) => s + Number(l.laba), 0)
  const totalPenjualan = laporan.reduce((s: number, l: any) => s + Number(l.total_penjualan), 0)

  return (
    <div className="p-5 sm:p-8 md:p-12 pb-32 sm:pb-40 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-10 md:mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase">LAPORAN BULANAN</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
            <span className="w-8 h-0.5 bg-gold-500/50 rounded-full"></span>
            REKAPITULASI PENJUALAN PERIODE {tahun}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center bg-[#0a1931]/60 backdrop-blur-md border border-gold-500/20 rounded-3xl p-1.5 focus-within:border-gold-500/50 transition-all shadow-lg">
            <span className="px-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">Tahun</span>
            <input
              type="number"
              value={tahun}
              onChange={e => setTahun(Number(e.target.value))}
              className="bg-transparent text-white px-2 py-2 w-24 text-sm font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 mb-10 md:mb-16">
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mb-4 uppercase text-center xl:text-left">VOLUME TERJUAL {tahun}</p>
          <div className="flex items-baseline gap-2 justify-center xl:justify-start">
            <p className="font-display text-4xl md:text-5xl text-white tracking-widest leading-none italic">{totalTerjual}</p>
            <span className="text-[10px] md:text-xs text-gold-500 font-bold italic uppercase tracking-widest">unit</span>
          </div>
        </div>
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mb-4 uppercase text-center xl:text-left">OMZET PENJUALAN {tahun}</p>
          <p className="font-display text-2xl md:text-3xl text-white tracking-widest leading-none italic text-center xl:text-left">{formatRupiah(totalPenjualan)}</p>
        </div>
        <div className={`col-span-1 sm:col-span-2 lg:col-span-1 bg-[#122b54]/80 backdrop-blur-md border p-8 md:p-10 rounded-3xl active:shadow-glow-gold active:scale-95 transition-all ${totalLaba >= 0 ? 'border-gold-500/20' : 'border-red-500/20'} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-[10px] text-gold-500/60 tracking-[0.2em] font-bold mb-4 uppercase text-center xl:text-left">NET PROFIT {tahun}</p>
          <p className={`font-display text-3xl md:text-4xl tracking-widest leading-none text-center xl:text-left ${totalLaba >= 0 ? 'text-gold-400 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'text-red-400 transition-colors italic'}`}>
            {formatRupiah(totalLaba)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-5 sm:p-10 rounded-3xl animate-in shadow-2xl relative overflow-hidden group mb-16">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <h2 className="font-display text-xl sm:text-2xl tracking-widest text-white/90 italic">DINAMIKA LABA {tahun}</h2>
          <div className="hidden sm:block w-16 h-1 bg-gold-500/20 rounded-full"></div>
        </div>
        <div className="w-full h-[350px] sm:h-[450px] overflow-x-auto custom-scrollbar-horizontal cursor-grab active:cursor-grabbing">
          <div className="min-w-[700px] md:min-w-full h-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={15}
                    interval={0}
                    tick={{ fill: '#94a3b8', fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload
                        return (
                          <div className="bg-[#0a1931] border border-gold-500/20 p-5 rounded-3xl shadow-2xl backdrop-blur-xl">
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-3 uppercase italic border-b border-white/5 pb-2">
                              {BULAN_NAMES[d.bulan - 1]} {tahun}
                            </p>
                            <div className="space-y-2">
                              <p className="text-gold-400 font-display text-lg tracking-widest italic">{formatRupiah(d.laba)}</p>
                              <p className="text-[9px] text-slate-400 font-bold tracking-widest">{d.unit_terjual} UNIT TERJUAL</p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="laba" radius={[8, 8, 0, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Number(entry.laba) >= 0 ? '#D4AF37' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Card/Table Section */}
      <div className="space-y-6 animate-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-6 md:h-8 bg-gold-500 rounded-full"></div>
          <h2 className="font-display text-2xl md:text-3xl tracking-widest text-white italic">REKAP OPERASIONAL</h2>
        </div>

        {/* Mobile View: Monthly Cards */}
        <div className="grid grid-cols-1 gap-5 md:hidden">
          {BULAN_NAMES.map((nama, i) => {
            const d = laporan.find((l: any) => Number(l.bulan) === i + 1)
            const laba = Number(d?.laba || 0)
            return (
              <div key={i} className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 rounded-3xl relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full pointer-events-none"></div>

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display tracking-widest text-white italic uppercase">{nama}</h3>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${d?.unit_terjual > 0 ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-[#0a1931] text-slate-500 border border-white/5'}`}>
                    {d ? `${d.unit_terjual} UNIT` : 'EMPTY'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-5 mb-6">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Omzet Jual</p>
                    <p className="text-sm text-white font-bold tracking-tight">{d ? formatRupiah(d.total_penjualan) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Modal Unit</p>
                    <p className="text-sm text-slate-400 font-medium">{d ? formatRupiah(d.total_modal) : '-'}</p>
                  </div>
                  <div className="col-span-2 pt-3 border-t border-white/5">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] text-gold-500/60 font-bold tracking-widest uppercase mb-1">Net Profit</p>
                        <p className={`text-xl font-display tracking-widest ${laba > 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-slate-600'}`}>
                          {d ? formatRupiah(laba) : 'Rp 0'}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-600 font-black italic tracking-tighter">
                        {d?.total_penjualan > 0 ? `${((laba / d.total_penjualan) * 100).toFixed(1)}% MARGIN` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-hidden bg-[#0f2444]/40 backdrop-blur-md border border-gold-500/10 rounded-[2rem] shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#0a1931]/60">
              <tr className="border-b border-gold-500/10">
                <th className="px-8 py-6 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Bulan</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Unit Terjual</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase text-right">Modal Pokok</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase text-right">Total Penjualan</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-[0.2em] text-gold-500 uppercase text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {BULAN_NAMES.map((nama, i) => {
                const d = laporan.find((l: any) => Number(l.bulan) === i + 1)
                const laba = Number(d?.laba || 0)
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 text-white font-display tracking-widest italic uppercase group-hover:text-gold-400 transition-colors">{nama}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest ${d?.unit_terjual > 0 ? 'bg-gold-500 text-black' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                        {d ? `${d.unit_terjual} UNIT` : '-'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-slate-400 font-medium">{d ? formatRupiah(d.total_modal) : '-'}</td>
                    <td className="px-8 py-6 text-right text-white font-bold">{d ? formatRupiah(d.total_penjualan) : '-'}</td>
                    <td className={`px-8 py-6 text-right font-display tracking-widest text-lg ${laba > 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-slate-600'}`}>
                      {d ? formatRupiah(laba) : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
