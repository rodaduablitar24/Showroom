'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'
import { exportToExcel, exportToPDF } from '@/lib/export'

export default function StokPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showJualModal, setShowJualModal] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [jualForm, setJualForm] = useState({ harga_jual: '', tanggal_keluar: new Date().toISOString().slice(0, 10) })

  async function fetchUnits() {
    setLoading(true)
    const res = await fetch('/api/units?filter=stok')
    const data = await res.json()
    setUnits(data)
    setLoading(false)
  }

  useEffect(() => { fetchUnits() }, [])

  async function handleJual(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/units', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedUnit.id, ...jualForm }),
    })
    setShowJualModal(false)
    fetchUnits()
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
    <>
      <div className="p-4 sm:p-6 md:p-10 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
          <div className="md:ml-0">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] text-white leading-none">STOK UNIT</h1>
            <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3">
              <span className="w-6 h-0.5 bg-gold-500/50 rounded-full"></span>
              MANAJEMEN KETERSEDIAAN UNIT SHOWROOM
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64 lg:w-80 group">
              <input
                type="text"
                placeholder="Cari Merk, Tipe, atau Nopol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a1931] border border-gold-500/20 text-white pl-10 pr-10 py-3 rounded-2xl text-[10px] sm:text-xs font-bold tracking-widest focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-500 uppercase"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-500 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  const headers = [['MERK', 'TYPE', 'TAHUN', 'NOPOL', 'HARGA BELI', 'TANGGAL MASUK']];
                  const exportData = filteredUnits.map((u: any) => [
                    u.merk,
                    u.type,
                    u.tahun,
                    u.nopol,
                    Number(u.harga_beli).toLocaleString('id-ID'),
                    new Date(u.tanggal_masuk).toLocaleDateString('id-ID')
                  ]);
                  exportToPDF(headers, exportData, `Stok_Unit_${new Date().toISOString().slice(0, 10)}`, 'DAFTAR STOK UNIT RODA DUA');
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 px-3 sm:px-5 py-3 rounded-2xl text-[9px] sm:text-[10px] font-bold tracking-widest transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                PDF
              </button>
              <button
                onClick={() => {
                  const exportData = filteredUnits.map((u: any) => ({
                    'MERK': u.merk,
                    'TYPE': u.type,
                    'TAHUN': u.tahun,
                    'NOPOL': u.nopol,
                    'HARGA BELI': Number(u.harga_beli),
                    'TANGGAL MASUK': u.tanggal_masuk
                  }));
                  exportToExcel(exportData, `Stok_Unit_${new Date().toISOString().slice(0, 10)}`);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-500 px-3 sm:px-5 py-3 rounded-2xl text-[9px] sm:text-[10px] font-bold tracking-widest transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                EXCEL
              </button>
            </div>

            <div className="bg-gold-500/10 border border-gold-500/20 px-5 py-3 rounded-2xl backdrop-blur-md self-stretch sm:self-auto flex items-center justify-center">
              <span className="text-gold-400 font-display text-[10px] sm:text-[11px] tracking-[0.2em] whitespace-nowrap font-bold uppercase">{units.length} TOTAL UNIT</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 md:hidden mb-4 tracking-[0.2em] font-bold uppercase animate-pulse text-center bg-white/5 py-2 rounded-lg">← Geser tabel untuk detail unit →</p>

        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          {loading ? (
            <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-display tracking-widest uppercase text-sm">MEMUAT DATA UNIT...</p>
            </div>
          ) : (
            <UnitTable
              units={filteredUnits}
              onJual={(unit) => { setSelectedUnit(unit); setShowJualModal(true) }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal Jual */}
      {showJualModal && (
        <div className="fixed inset-0 bg-[#0a1931]/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 text-center md:text-left">
          <div className="bg-[#0a1931] border border-gold-500/20 p-8 md:p-10 w-full max-w-lg rounded-[3rem] shadow-2xl animate-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

            <div className="text-center mb-8">
              <h2 className="font-display text-3xl tracking-widest text-white mb-2 italic">JUAL UNIT</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full">
                <span className="text-gold-400 text-[10px] font-bold tracking-[0.2em] uppercase">{selectedUnit?.merk} {selectedUnit?.type} — {selectedUnit?.nopol}</span>
              </div>
            </div>

            <form onSubmit={handleJual} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Tanggal Keluar</label>
                <input
                  type="date"
                  value={jualForm.tanggal_keluar}
                  onChange={e => setJualForm({ ...jualForm, tanggal_keluar: e.target.value })}
                  className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Harga Jual (Rp)</label>
                <input
                  type="number"
                  value={jualForm.harga_jual}
                  onChange={e => setJualForm({ ...jualForm, harga_jual: e.target.value })}
                  className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Masukkan nominal harga jual..."
                  required
                />
              </div>
              <div className="flex gap-4 mt-10">
                <button type="submit" className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-display text-lg tracking-[0.2em] py-4 rounded-2xl transition-all active:shadow-glow-gold active:scale-95 uppercase">
                  KONFIRMASI JUAL
                </button>
                <button type="button" onClick={() => setShowJualModal(false)} className="flex-1 bg-[#0f2444] hover:bg-[#1e293b] text-white font-display text-lg tracking-[0.2em] py-4 rounded-2xl transition-all border border-gold-500/10 active:scale-95 uppercase">
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
