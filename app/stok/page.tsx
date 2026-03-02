'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UnitTable from '@/components/UnitTable'
import { exportToExcel, exportToPDF } from '@/lib/export'

export default function StokPage() {
  const router = useRouter()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchUnits() {
    setLoading(true)
    const res = await fetch('/api/units?filter=stok')
    const data = await res.json()
    setUnits(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  function handleEdit(unit: any) {
    router.push(`/stok/edit/${unit.id}`)
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus unit ini?')) return
    await fetch(`/api/units?id=${id}`, { method: 'DELETE' })
    fetchUnits()
  }

  const filteredUnits = units.filter((unit: any) =>
    unit.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.nopol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-5 sm:p-8 md:p-12 pb-32 sm:pb-40 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
      <div className="mb-10 md:mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase">STOK UNIT</h1>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
            <span className="w-8 h-0.5 bg-gold-500/50 rounded-full"></span>
            MANAJEMEN KETERSEDIAAN UNIT SHOWROOM
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-72 lg:w-96 group">
            <input
              type="text"
              placeholder="Cari merek, tipe, atau nopol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a1931]/60 backdrop-blur-md border border-gold-500/20 text-white pl-12 pr-6 py-4 rounded-3xl text-[11px] font-bold tracking-[0.15em] focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-600 uppercase shadow-lg"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-500 transition-colors pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const headers = [['MEREK', 'TYPE', 'TAHUN', 'WARNA', 'NOPOL', 'HARGA BELI', 'TANGGAL MASUK']];
                const exportData = filteredUnits.map((u: any) => [
                  u.merk,
                  u.type,
                  u.tahun,
                  u.warna || '-',
                  u.nopol,
                  Number(u.harga_beli).toLocaleString('id-ID'),
                  new Date(u.tanggal_masuk).toLocaleDateString('id-ID')
                ]);
                exportToPDF(headers, exportData, `Stok_Unit_${new Date().toISOString().slice(0, 10)}`, 'DAFTAR STOK UNIT RODA DUA');
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-5 py-4 rounded-3xl text-[10px] font-bold tracking-widest transition-all"
            >
              PDF
            </button>
            <button
              onClick={() => {
                const exportData = filteredUnits.map((u: any) => ({
                  'MEREK': u.merk,
                  'TYPE': u.type,
                  'TAHUN': u.tahun,
                  'WARNA': u.warna || '-',
                  'NOPOL': u.nopol,
                  'HARGA BELI': Number(u.harga_beli),
                  'TANGGAL MASUK': u.tanggal_masuk
                }));
                exportToExcel(exportData, `Stok_Unit_${new Date().toISOString().slice(0, 10)}`);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-500 px-5 py-4 rounded-3xl text-[10px] font-bold tracking-widest transition-all"
            >
              EXCEL
            </button>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/20 px-6 py-4 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-lg">
            <span className="text-gold-400 font-display text-[10px] tracking-[0.2em] whitespace-nowrap font-bold uppercase italic">{units.length} TOTAL UNIT</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mb-8 px-6 py-3 bg-gold-500/5 rounded-2xl border border-gold-500/10 animate-pulse text-center block md:hidden">
        DAFTAR UNIT AKTIF
      </p>

      <div className="animate-in" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
            <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-display tracking-widest uppercase text-sm">MEMUAT DATA UNIT...</p>
          </div>
        ) : (
          <UnitTable
            units={filteredUnits}
            onJual={(unit) => router.push(`/stok/jual/${unit.id}`)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
