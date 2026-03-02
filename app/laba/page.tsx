'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'
import { exportToExcel, exportToPDF } from '@/lib/export'
import { formatRupiah } from '../../lib/utils'

export default function LabaPage() {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  async function fetchUnits() {
    setLoading(true)
    const res = await fetch('/api/units?filter=terjual')
    const data = await res.json()
    setUnits(data)
    setLoading(false)
  }

  useEffect(() => {
    setIsMounted(true)
    fetchUnits()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('Hapus data laba untuk unit ini?')) return
    await fetch(`/api/units?id=${id}`, { method: 'DELETE' })
    fetchUnits()
  }

  const totalBeli = units.reduce((s, u) => s + Number(u.harga_beli), 0)
  const totalJual = units.reduce((s, u) => s + Number(u.harga_jual || 0), 0)
  const totalLaba = totalJual - totalBeli

  if (!isMounted) return null

  return (
    <div className="p-5 sm:p-8 md:p-12 pb-32 sm:pb-40 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-10 md:mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase">LABA PENJUALAN</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
            <span className="w-8 h-0.5 bg-gold-500/50 rounded-full"></span>
            KALKULASI PROFITABILITAS UNIT TERJUAL
          </p>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          <button
            onClick={() => {
              const headers = [['MERK', 'TYPE', 'TAHUN', 'WARNA', 'HARGA BELI', 'HARGA JUAL', 'LABA']];
              const exportData = units.map((u: any) => {
                const laba = Number(u.harga_jual || 0) - Number(u.harga_beli);
                return [
                  u.merk,
                  u.type,
                  u.tahun,
                  u.warna || '-',
                  Number(u.harga_beli).toLocaleString('id-ID'),
                  Number(u.harga_jual || 0).toLocaleString('id-ID'),
                  laba.toLocaleString('id-ID')
                ];
              });
              exportToPDF(headers, exportData, `Laba_Penjualan_${new Date().toISOString().slice(0, 10)}`, 'LAPORAN LABA PENJUALAN RODA DUA');
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-5 py-4 rounded-3xl text-[10px] font-bold tracking-widest transition-all"
          >
            PDF
          </button>
          <button
            onClick={() => {
              const exportData = units.map((u: any) => ({
                'MERK': u.merk,
                'TYPE': u.type,
                'TAHUN': u.tahun,
                'WARNA': u.warna || '-',
                'HARGA BELI': Number(u.harga_beli),
                'HARGA JUAL': Number(u.harga_jual || 0),
                'LABA': Number(u.harga_jual || 0) - Number(u.harga_beli)
              }));
              exportToExcel(exportData, `Laba_Penjualan_${new Date().toISOString().slice(0, 10)}`);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-500 px-5 py-4 rounded-3xl text-[10px] font-bold tracking-widest transition-all"
          >
            EXCEL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 mb-10 md:mb-16">
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mb-4 uppercase text-center xl:text-left">MODAL UNIT</p>
          <p className="font-display text-2xl md:text-3xl text-white tracking-widest leading-none italic text-center xl:text-left">{formatRupiah(totalBeli)}</p>
        </div>
        <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold mb-4 uppercase text-center xl:text-left">HASIL JUAL</p>
          <p className="font-display text-2xl md:text-3xl text-white tracking-widest leading-none italic text-center xl:text-left">{formatRupiah(totalJual)}</p>
        </div>
        <div className={`col-span-1 sm:col-span-2 lg:col-span-1 bg-[#122b54]/80 backdrop-blur-md border p-8 md:p-10 rounded-3xl active:shadow-glow-gold active:scale-95 transition-all ${totalLaba >= 0 ? 'border-gold-500/20' : 'border-red-500/20'} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-[10px] text-gold-500/60 tracking-[0.2em] font-bold mb-4 uppercase text-center xl:text-left">LABA BERSIH</p>
          <p className={`font-display text-3xl md:text-4xl tracking-widest leading-none text-center xl:text-left ${totalLaba >= 0 ? 'text-gold-400 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'text-red-400 transition-colors italic'}`}>
            {formatRupiah(totalLaba)}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-8 px-6 py-3 bg-gold-500/5 rounded-2xl border border-gold-500/10 animate-pulse text-center block md:hidden">
        LAPORAN UNIT TERJUAL
      </p>

      <div className="animate-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display tracking-widest uppercase text-sm">MEMUAT DATA...</p>
          </div>
        ) : (
          <UnitTable units={units} showHargaJual showTanggalKeluar showLaba onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
