'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UnitTable from '@/components/UnitTable'

export default function UnitMasukPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [units, setUnits] = useState([])

  async function fetchUnits() {
    setLoading(true)
    const res = await fetch('/api/units?filter=masuk')
    const data = await res.json()
    setUnits(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  function handleEdit(unit: any) {
    router.push(`/unit-masuk/edit/${unit.id}`)
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus unit ini?')) return
    await fetch(`/api/units?id=${id}`, { method: 'DELETE' })
    fetchUnits()
  }

  return (
    <>
      <div className="p-5 sm:p-8 md:p-12 pb-32 sm:pb-40 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
        <div className="mb-10 md:mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase">UNIT MASUK</h1>
            <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
              <span className="w-8 h-0.5 bg-gold-500/50 rounded-full"></span>
              RIWAYAT PENGADAAN UNIT SHOWROOM
            </p>
          </div>
          <button
            onClick={() => router.push('/unit-masuk/tambah')}
            className="w-full md:w-auto bg-gold-500 hover:bg-gold-400 text-black font-display text-[11px] tracking-[0.2em] px-6 py-4 rounded-2xl transition-all active:shadow-glow-gold active:scale-95 flex items-center justify-center gap-3 uppercase font-bold"
          >
            <span className="text-base leading-none font-bold">+</span> TAMBAH UNIT
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-8 px-6 py-3 bg-gold-500/5 rounded-2xl border border-gold-500/10 animate-pulse text-center block md:hidden">
          RIWAYAT UNIT MASUK BARU
        </p>

        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          {loading ? (
            <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-display tracking-widest uppercase text-sm">MEMUAT RIWAYAT UNIT...</p>
            </div>
          ) : (
            <UnitTable units={units} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </>
  )
}
