'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { exportToExcel, exportToPDF } from '@/lib/export'

const BULAN_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function formatRupiah(n: number) {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

export default function LaporanPage() {
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/reports')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [tahun])

  const laporan = data?.laporan || []

  const chartData = BULAN_NAMES.map((nama, i) => {
    const d = laporan.find((l: any) => Number(l.bulan) === i + 1)
    return {
      bulan: nama.slice(0, 3),
      laba: Number(d?.laba || 0),
      terjual: Number(d?.unit_terjual || 0),
      penjualan: Number(d?.total_penjualan || 0),
    }
  })

  const totalTerjual = laporan.reduce((s: number, l: any) => s + Number(l.unit_terjual), 0)
  const totalLaba = laporan.reduce((s: number, l: any) => s + Number(l.laba), 0)
  const totalPenjualan = laporan.reduce((s: number, l: any) => s + Number(l.total_penjualan), 0)

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
        <div className="md:ml-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] text-white leading-none">LAPORAN BULANAN</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3">
            <span className="w-6 h-0.5 bg-gold-500/50 rounded-full"></span>
            REKAPITULASI PENJUALAN PERIODE {tahun}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Export Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                const headers = [['BULAN OPERASIONAL', 'VOLUME TERJUAL', 'OMZET PENJUALAN', 'MODAL UNIT', 'NET PROFIT']];
                const exportData = BULAN_NAMES.map((nama, i) => {
                  const d = laporan.find((l: any) => Number(l.bulan) === i + 1);
                  return [
                    nama,
                    d ? `${d.unit_terjual} unit` : '0 unit',
                    d ? formatRupiah(d.total_penjualan) : '-',
                    d ? formatRupiah(d.total_modal) : '-',
                    d ? formatRupiah(Number(d.laba || 0)) : 'Rp 0'
                  ];
                });
                exportToPDF(headers, exportData, `Laporan_Bulanan_${tahun}`, `LAPORAN BULANAN RODA DUA - TAHUN ${tahun}`);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 px-3 sm:px-5 py-3 rounded-2xl text-[9px] sm:text-[10px] font-bold tracking-widest transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
              PDF
            </button>
            <button
              onClick={() => {
                const exportData = BULAN_NAMES.map((nama, i) => {
                  const d = laporan.find((l: any) => Number(l.bulan) === i + 1);
                  return {
                    'BULAN OPERASIONAL': nama,
                    'VOLUME TERJUAL': d ? Number(d.unit_terjual) : 0,
                    'OMZET PENJUALAN': d ? Number(d.total_penjualan) : 0,
                    'MODAL UNIT': d ? Number(d.total_modal) : 0,
                    'NET PROFIT': d ? Number(d.laba || 0) : 0
                  };
                });
                exportToExcel(exportData, `Laporan_Bulanan_${tahun}`);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-500 px-3 sm:px-5 py-3 rounded-2xl text-[9px] sm:text-[10px] font-bold tracking-widest transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
              EXCEL
            </button>
          </div>

          <div className="relative group w-full sm:w-auto">
            <select
              value={tahun}
              onChange={e => setTahun(Number(e.target.value))}
              className="w-full appearance-none bg-[#0a1931] border border-gold-500/20 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-widest focus:outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all cursor-pointer"
            >
              {[2022, 2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold-500 font-bold group-hover:text-gold-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16">
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] card-hover group">
          <p className="text-[10px] text-slate-400 tracking-[0.2em] font-bold mb-4 uppercase">UNIT TERJUAL {tahun}</p>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-4xl md:text-5xl text-white tracking-widest leading-none">{totalTerjual}</p>
            <span className="text-[10px] md:text-xs text-slate-500 font-medium italic lowercase">unit</span>
          </div>
        </div>
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] card-hover group">
          <p className="text-[10px] text-slate-400 tracking-[0.2em] font-bold mb-4 uppercase">TOTAL OMZET {tahun}</p>
          <p className="font-display text-2xl md:text-3xl text-white tracking-widest leading-none overflow-visible">{formatRupiah(totalPenjualan)}</p>
        </div>
        <div className={`bg-[#122b54]/80 backdrop-blur-md border p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] card-hover active:shadow-glow-gold active:scale-95 transition-all ${totalLaba >= 0 ? 'border-gold-500/20' : 'border-red-500/20'} sm:col-span-2 lg:col-span-1`}>
          <p className="text-[10px] text-gold-500/60 tracking-[0.2em] font-bold mb-4 uppercase">TOTAL PROFIT {tahun}</p>
          <p className={`font-display text-2xl md:text-3xl tracking-widest leading-none overflow-visible ${totalLaba >= 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-red-400'}`}>
            {formatRupiah(totalLaba)}
          </p>
        </div>
      </div>

      {/* Scroll Hint for Mobile */}
      <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-500 md:hidden animate-pulse px-2 uppercase tracking-widest bg-[#0a1931] py-2 rounded-lg justify-center border border-gold-500/5">
        <span>{'← Geser untuk detail →'}</span>
      </div>

      {/* Chart */}
      <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 rounded-2xl animate-in">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl tracking-[0.15em] text-white/90 italic">GRAFIK LABA BULANAN</h2>
          <div className="w-16 h-1 bg-gold-500/20 rounded-full"></div>
        </div>
        <div className="overflow-x-auto custom-scrollbar pb-6 px-2">
          <div style={{ minWidth: '800px', height: '300px' }}>
            <BarChart width={800} height={300} data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="bulan" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : String(v)} />
              <Tooltip
                contentStyle={{ background: '#0a1931', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
                labelStyle={{ color: '#d4af37', fontFamily: 'var(--font-display)', letterSpacing: '0.15em', marginBottom: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}
                formatter={(val: any) => [formatRupiah(val), 'Laba']}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="laba" fill="url(#colorLaba)" radius={[8, 8, 0, 0]} barSize={24} />
            </BarChart>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#0f2444]/60 backdrop-blur-md rounded-[2.5rem] border border-gold-500/10 overflow-hidden mb-12 animate-in" style={{ animationDelay: '0.2s' }}>
        <div className="px-8 py-6 border-b border-gold-500/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gold-500 rounded-full"></div>
            <h2 className="font-display text-2xl tracking-widest text-white italic">DETAIL TRANSAKSI PER BULAN</h2>
          </div>
          <span className="text-[10px] text-slate-500 md:hidden font-bold tracking-widest uppercase bg-[#0a1931] px-3 py-1 rounded-full">{'Geser Kanan →'}</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="text-sm" style={{ minWidth: '850px', width: '100%' }}>
            <thead>
              <tr className="bg-white-[0.02]">
                <th className="text-left px-8 py-5 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">BULAN OPERASIONAL</th>
                <th className="text-center px-8 py-5 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">VOLUME TERJUAL</th>
                <th className="text-right px-8 py-5 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">OMZET PENJUALAN</th>
                <th className="text-right px-8 py-5 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">MODAL UNIT</th>
                <th className="text-right px-8 py-5 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">NET PROFIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {BULAN_NAMES.map((nama, i) => {
                const d = laporan.find((l: any) => Number(l.bulan) === i + 1)
                const laba = Number(d?.laba || 0)
                return (
                  <tr key={i} className="hover:bg-white-[0.03] transition-colors group">
                    <td className="px-8 py-5 text-white font-bold tracking-widest whitespace-nowrap">{nama}</td>
                    <td className="px-8 py-5 text-center whitespace-nowrap">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-inner ${d?.unit_terjual > 0 ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'bg-[#0a1931] text-slate-600 border border-gold-500/5'}`}>
                        {d ? `${d.unit_terjual} unit` : '0 unit'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right text-white/90 tabular-nums whitespace-nowrap font-bold">{d ? formatRupiah(d.total_penjualan) : '-'}</td>
                    <td className="px-8 py-5 text-right text-slate-500 tabular-nums whitespace-nowrap">{d ? formatRupiah(d.total_modal) : '-'}</td>
                    <td className={`px-8 py-5 text-right font-black tabular-nums whitespace-nowrap ${laba > 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-slate-600'}`}>
                      {d ? formatRupiah(laba) : 'Rp 0'}
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
