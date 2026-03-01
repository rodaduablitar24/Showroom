'use client'

import { useEffect, useState } from 'react'
import UnitTable from '@/components/UnitTable'

const emptyForm = {
  tanggal_masuk: new Date().toISOString().slice(0, 10),
  merk: '',
  type: '',
  tahun: new Date().getFullYear(),
  nopol: '',
  harga_beli: '',
}

export default function UnitMasukPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editUnit, setEditUnit] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  async function fetchUnits() {
    setLoading(true)
    const res = await fetch('/api/units')
    const data = await res.json()
    setUnits(data)
    setLoading(false)
  }

  useEffect(() => { fetchUnits() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const method = editUnit ? 'PATCH' : 'POST'
    const body = editUnit
      ? { id: editUnit.id, ...form, tahun: Number(form.tahun), harga_beli: Number(form.harga_beli) }
      : { ...form, tahun: Number(form.tahun), harga_beli: Number(form.harga_beli) }

    await fetch('/api/units', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setForm(emptyForm)
    setEditUnit(null)
    setShowForm(false)
    setSubmitting(false)
    fetchUnits()
  }

  const handleEdit = (unit: any) => {
    setEditUnit(unit)
    setForm({
      tanggal_masuk: unit.tanggal_masuk.slice(0, 10),
      merk: unit.merk,
      type: unit.type,
      tahun: unit.tahun,
      nopol: unit.nopol,
      harga_beli: unit.harga_beli,
    })
    setShowForm(true)
  }

  return (
    <>
      <div className="p-4 sm:p-6 md:p-10 animate-in max-w-[1600px] mx-auto overflow-x-hidden">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
          <div className="md:ml-0">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] text-white leading-none">UNIT MASUK</h1>
            <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3">
              <span className="w-6 h-0.5 bg-gold-500/50 rounded-full"></span>
              RIWAYAT PENGADAAN UNIT SHOWROOM
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold-500 hover:bg-gold-400 text-black font-display text-[11px] tracking-[0.2em] px-5 sm:px-6 py-3 rounded-2xl transition-all active:shadow-glow-gold active:scale-95 flex items-center gap-2 self-start md:self-auto uppercase font-bold"
          >
            <span className="text-sm sm:text-base leading-none font-bold">+</span> TAMBAH UNIT
          </button>
        </div>

        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          {loading ? (
            <div className="p-20 text-center text-slate-400 bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 rounded-2xl">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-display tracking-widest uppercase text-sm">MEMUAT RIWAYAT UNIT...</p>
            </div>
          ) : (
            <UnitTable units={units} onEdit={handleEdit} />
          )}
        </div>
      </div>

      {/* Add Unit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#0a1931]/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 text-center md:text-left">
          <div className="bg-[#0a1931] border border-gold-500/20 p-8 md:p-10 w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

            <div className="text-center mb-6 md:mb-10">
              <h2 className="font-display text-2xl md:text-3xl tracking-widest text-white mb-2 italic">
                {editUnit ? 'PERBARUI DETAIL UNIT' : 'TAMBAH UNIT BARU'}
              </h2>
              <div className="w-12 md:w-16 h-1 bg-gold-500/20 mx-auto rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Tanggal Masuk</label>
                  <input type="date" value={form.tanggal_masuk}
                    onChange={e => setForm({ ...form, tanggal_masuk: e.target.value })}
                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Tahun Produksi</label>
                  <input type="number" value={form.tahun}
                    onChange={e => setForm({ ...form, tahun: Number(e.target.value) })}
                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Merk Kendaraan</label>
                  <input type="text" value={form.merk} placeholder="Contoh: Toyota, Honda, dll"
                    onChange={e => setForm({ ...form, merk: e.target.value })}
                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Tipe / Model</label>
                  <input type="text" value={form.type} placeholder="Contoh: Avanza, Civic, dll"
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Nomor Polisi</label>
                  <input type="text" value={form.nopol} placeholder="B 1234 ABC"
                    onChange={e => setForm({ ...form, nopol: e.target.value.toUpperCase() })}
                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-mono font-bold tracking-widest shadow-inner" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left">Harga Beli (Rp)</label>
                  <input type="number" value={form.harga_beli} placeholder="150000000"
                    onChange={e => setForm({ ...form, harga_beli: e.target.value })}
                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-display text-lg md:text-xl tracking-[0.2em] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all active:shadow-glow-gold active:scale-[0.97] uppercase disabled:opacity-50 font-bold">
                  {submitting ? 'MEMPROSES...' : editUnit ? 'SIMPAN PERUBAHAN' : 'SIMPAN UNIT'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditUnit(null); setForm(emptyForm); }}
                  className="flex-1 bg-[#0f2444] hover:bg-[#1e293b] text-white font-display text-lg md:text-xl tracking-[0.2em] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all border border-gold-500/10 active:scale-[0.97] uppercase">
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
