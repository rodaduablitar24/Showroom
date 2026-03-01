'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'
import { exportToExcel, exportToPDF } from '@/lib/export'

function formatRupiah(n: number) {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

export default function LabaPage() {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/units?filter=terjual')
      .then(r => r.json())
      .then(data => { setUnits(data); setLoading(false) })
  }, [])

  const totalBeli = units.reduce((s, u) => s + Number(u.harga_beli), 0)
  const totalJual = units.reduce((s, u) => s + Number(u.harga_jual || 0), 0)
  const totalLaba = totalJual - totalBeli

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
        <div className="md:ml-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] text-white leading-none">LABA PENJUALAN</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3">
            <span className="w-6 h-0.5 bg-gold-500/50 rounded-full"></span>
            KALKULASI PROFITABILITAS UNIT TERJUAL
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              const headers = [['MERK', 'TYPE', 'TAHUN', 'HARGA BELI', 'HARGA JUAL', 'LABA']];
              const exportData = units.map((u: any) => {
                const laba = Number(u.harga_jual || 0) - Number(u.harga_beli);
                return [
                  u.merk,
                  u.type,
                  u.tahun,
                  Number(u.harga_beli).toLocaleString('id-ID'),
                  Number(u.harga_jual || 0).toLocaleString('id-ID'),
                  laba.toLocaleString('id-ID')
                ];
              });
              exportToPDF(headers, exportData, `Laba_Penjualan_${new Date().toISOString().slice(0, 10)}`, 'LAPORAN LABA PENJUALAN RODA DUA');
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 px-3 sm:px-5 py-3 rounded-2xl text-[9px] sm:text-[10px] font-bold tracking-widest transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
            PDF
          </button>
          <button
            onClick={() => {
              const exportData = units.map((u: any) => ({
                'MERK': u.merk,
                'TYPE': u.type,
                'TAHUN': u.tahun,
                'HARGA BELI': Number(u.harga_beli),
                'HARGA JUAL': Number(u.harga_jual || 0),
                'LABA': Number(u.harga_jual || 0) - Number(u.harga_beli)
              }));
              exportToExcel(exportData, `Laba_Penjualan_${new Date().toISOString().slice(0, 10)}`);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-500 px-3 sm:px-5 py-3 rounded-2xl text-[9px] sm:text-[10px] font-bold tracking-widest transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
            EXCEL
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16 text-center md:text-left">
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] card-hover">
          <p className="text-[10px] text-slate-400 tracking-[0.2em] font-bold mb-4 uppercase">TOTAL MODAL UNIT</p>
          <p className="font-display text-2xl md:text-3xl text-white tracking-widest leading-none overflow-visible">{formatRupiah(totalBeli)}</p>
        </div>
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] card-hover">
          <p className="text-[10px] text-slate-400 tracking-[0.2em] font-bold mb-4 uppercase">TOTAL PENJUALAN</p>
          <p className="font-display text-2xl md:text-3xl text-white tracking-widest leading-none overflow-visible">{formatRupiah(totalJual)}</p>
        </div>
        <div className={`bg-[#122b54]/80 backdrop-blur-md border p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] card-hover active:shadow-glow-gold active:scale-95 transition-all ${totalLaba >= 0 ? 'border-gold-500/20' : 'border-red-500/20'} sm:col-span-2 lg:col-span-1`}>
          <p className="text-[10px] text-gold-500/60 tracking-[0.2em] font-bold mb-4 uppercase">TOTAL LABA BERSIH</p>
          <p className={`font-display text-2xl md:text-3xl tracking-widest leading-none overflow-visible ${totalLaba >= 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-red-400'}`}>
            {formatRupiah(totalLaba)}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 md:hidden mb-4 tracking-[0.2em] font-bold uppercase animate-pulse text-center bg-white/5 py-2 rounded-lg">← Geser tabel untuk detail laporan →</p>
      <div className="animate-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display tracking-widest uppercase text-sm">MENGHITUNG LABA...</p>
          </div>
        ) : (
          <UnitTable units={units} showHargaJual showTanggalKeluar showLaba />
        )}
      </div>
    </div>
  )
}
