'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'

export default function UnitKeluarPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/units?filter=terjual')
      .then(r => r.json())
      .then(data => { setUnits(data); setLoading(false) })
  }, [])

  return (
    <div className="p-4 sm:p-6 md:p-10 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
        <div className="md:ml-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] text-white leading-none">UNIT KELUAR</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3">
            <span className="w-6 h-0.5 bg-gold-500/50 rounded-full"></span>
            RIWAYAT UNIT YANG SUDAH TERJUAL
          </p>
        </div>
        <div className="bg-gold-500/10 border border-gold-500/20 px-5 py-3 rounded-2xl backdrop-blur-md self-start md:self-auto flex items-center justify-center">
          <span className="text-gold-400 font-display text-[10px] sm:text-[11px] tracking-[0.2em] font-bold uppercase">{units.length} TERJUAL</span>
        </div>
      </div>

      <div className="animate-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display tracking-widest uppercase text-sm">MEMUAT DATA...</p>
          </div>
        ) : (
          <UnitTable units={units} showHargaJual showTanggalKeluar />
        )}
      </div>
    </div>
  )
}
