'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'
import { exportToExcel, exportToPDF } from '@/lib/export'

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const headers = [['TGL KELUAR', 'MEREK', 'TYPE', 'TAHUN', 'WARNA', 'NOPOL', 'HARGA BELI', 'HARGA JUAL']];
                const exportData = units.map((u: any) => [
                  u.tanggal_keluar ? new Date(u.tanggal_keluar).toLocaleDateString('id-ID') : '-',
                  u.merk,
                  u.type,
                  u.tahun,
                  u.warna || '-',
                  u.nopol,
                  Number(u.harga_beli).toLocaleString('id-ID'),
                  Number(u.harga_jual || 0).toLocaleString('id-ID')
                ]);
                exportToPDF(headers, exportData, `Unit_Keluar_${new Date().toISOString().slice(0, 10)}`, 'DAFTAR UNIT TERJUAL RODA DUA');
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-5 py-4 rounded-3xl text-[10px] font-bold tracking-widest transition-all"
            >
              PDF
            </button>
            <button
              onClick={async () => {
                const exportData = units.map((u: any) => ({
                  'TGL KELUAR': u.tanggal_keluar ? new Date(u.tanggal_keluar).toLocaleDateString('id-ID') : '-',
                  'MEREK': u.merk,
                  'TYPE': u.type,
                  'TAHUN': u.tahun,
                  'WARNA': u.warna || '-',
                  'NOPOL': u.nopol,
                  'HARGA BELI': Number(u.harga_beli),
                  'HARGA JUAL': Number(u.harga_jual || 0)
                }));
                await exportToExcel(exportData, `Unit_Keluar_${new Date().toISOString().slice(0, 10)}`);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-500 px-5 py-4 rounded-3xl text-[10px] font-bold tracking-widest transition-all"
            >
              EXCEL
            </button>
          </div>
          <div className="bg-gold-500/10 border border-gold-500/20 px-6 py-4 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-lg">
            <span className="text-gold-400 font-display text-[11px] tracking-[0.2em] font-bold uppercase italic">{units.length} TOTAL TERJUAL</span>
          </div>
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
          <UnitTable units={units} showHargaJual showHargaBeli showTanggalKeluar onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
