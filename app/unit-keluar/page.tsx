'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'

export default function UnitKeluarPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchUnits() {
    setLoading(true)
    const res = await fetch('/api/units?filter=terjual')
    const data = await res.json()
    setUnits(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('Hapus unit ini?')) return
    await fetch(`/api/units?id=${id}`, { method: 'DELETE' })
    fetchUnits()
  }

  return (
    <div className="p-5 sm:p-8 md:p-12 pb-32 sm:pb-40 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-10 md:mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase">UNIT KELUAR</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
            <span className="w-8 h-0.5 bg-gold-500/50 rounded-full"></span>
            RIWAYAT UNIT YANG SUDAH TERJUAL
          </p>
        </div>
        <div className="bg-gold-500/10 border border-gold-500/20 px-6 py-4 rounded-3xl backdrop-blur-md self-stretch xl:self-auto flex items-center justify-center shadow-lg">
          <span className="text-gold-400 font-display text-[11px] tracking-[0.2em] font-bold uppercase italic">{units.length} TOTAL TERJUAL</span>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-8 px-6 py-3 bg-gold-500/5 rounded-2xl border border-gold-500/10 animate-pulse text-center block md:hidden">
        DATA UNIT TERJUAL
      </p>

      <div className="animate-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display tracking-widest uppercase text-sm">MEMUAT DATA...</p>
          </div>
        ) : (
          <UnitTable units={units} showHargaJual showTanggalKeluar onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
