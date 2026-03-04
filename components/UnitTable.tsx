'use client'

import { formatRupiah } from '../lib/utils'

interface Unit {
  id: number
  merk: string
  type: string
  tahun: number
  nopol: string
  harga_beli: number
  harga_jual?: number
  tanggal_masuk: string
  tanggal_keluar?: string
  status: 'stok' | 'terjual'
  warna?: string
}

interface UnitTableProps {
  units: Unit[]
  onEdit?: (unit: Unit) => void
  onJual?: (unit: Unit) => void
  onDelete?: (id: number) => void
  showHargaJual?: boolean
  showHargaBeli?: boolean
  showTanggalKeluar?: boolean
  showLaba?: boolean
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const d = date.getDate().toString().padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const m = months[date.getMonth()]
  const y = date.getFullYear()
  return `${d} ${m} ${y}`
}

export default function UnitTable({
  units,
  onEdit,
  onJual,
  onDelete,
  showHargaJual = false,
  showHargaBeli = false,
  showTanggalKeluar = false,
  showLaba = false
}: UnitTableProps) {
  return (
    <div className="space-y-4">
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-5 md:hidden">
        {units.length === 0 ? (
          <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-12 rounded-3xl text-center animate-in">
            <div className="w-16 h-16 bg-gold-500/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <p className="font-display tracking-[0.2em] text-slate-500 text-sm uppercase italic">TIDAK ADA DATA UNIT</p>
          </div>
        ) : (
          units.map((unit, i) => {
            const laba = Number(unit.harga_jual || 0) - Number(unit.harga_beli)
            return (
              <div key={unit.id} className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-5 rounded-3xl relative overflow-hidden group shadow-xl animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-display tracking-widest text-white italic truncate uppercase">{unit.merk} {unit.type}</h3>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest">{unit.nopol}</p>
                  </div>
                  <span className="text-[9px] text-gold-500/50 font-bold tracking-widest">#{unit.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 mb-6">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Tahun</p>
                    <p className="text-sm text-white font-bold">{unit.tahun}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Warna</p>
                    <p className="text-sm text-white/70 font-bold">{unit.warna || '-'}</p>
                  </div>
                  {(showHargaBeli || !showHargaJual) && (
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Harga Beli</p>
                      <p className="text-sm text-gold-400 font-bold">{formatRupiah(Number(unit.harga_beli))}</p>
                    </div>
                  )}
                  {showHargaJual && unit.harga_jual && (
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Harga Jual</p>
                      <p className="text-sm text-green-400 font-bold">{formatRupiah(Number(unit.harga_jual))}</p>
                    </div>
                  )}
                  {showTanggalKeluar && unit.tanggal_keluar && (
                    <div className="col-span-2 flex justify-between items-center pt-3 border-t border-white/5">
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">Tgl Keluar</p>
                        <p className="text-xs text-slate-400 italic">{formatDate(unit.tanggal_keluar)}</p>
                      </div>
                      {onDelete && !showLaba && (
                        <button onClick={() => onDelete(unit.id)} className="p-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl transition-all active:scale-95">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      )}
                    </div>
                  )}
                  {showLaba && (
                    <div className="col-span-2 pt-3 border-t border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] text-gold-500/60 font-bold tracking-widest uppercase mb-1">Laba</p>
                        <p className={`text-xl font-display tracking-widest ${laba >= 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-red-400'}`}>
                          {formatRupiah(laba)}
                        </p>
                      </div>
                      {onDelete && (
                        <button onClick={() => onDelete(unit.id)} className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl transition-all active:scale-95">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onJual && (
                    <button onClick={() => onJual(unit)} className="flex-1 bg-gold-500 hover:bg-gold-400 text-black py-3 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 uppercase">
                      JUAL UNIT
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(unit)} className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 uppercase">
                      EDIT
                    </button>
                  )}
                  {onDelete && !showLaba && !showTanggalKeluar && (
                    <button onClick={() => onDelete(unit.id)} className="p-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl transition-all active:scale-95">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-hidden bg-[#0f2444]/40 backdrop-blur-md rounded-[2rem] border border-gold-500/10 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold-500/10 bg-[#0a1931]/60">
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">{showTanggalKeluar ? 'Tgl Keluar' : 'Tanggal Masuk'}</th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Merek</th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Type</th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Tahun</th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Warna</th>
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Nopol</th>
              {(showHargaBeli || !showHargaJual) && <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase text-right">Harga Beli</th>}
              {showHargaJual && <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase text-right">Harga Jual</th>}
              {showLaba && <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-gold-500/60 uppercase text-right">Laba</th>}
              <th className="px-6 py-5 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {units.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-20 text-center">
                  <p className="font-display tracking-[0.2em] text-slate-600 text-sm uppercase italic">TIDAK ADA DATA UNIT YANG DITEMUKAN</p>
                </td>
              </tr>
            ) : (
              units.map((unit) => {
                const laba = Number(unit.harga_jual || 0) - Number(unit.harga_beli)
                return (
                  <tr key={unit.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-6 min-w-[120px]">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-slate-300 font-bold tracking-wider">
                          {showTanggalKeluar && unit.tanggal_keluar ? formatDate(unit.tanggal_keluar) : formatDate(unit.tanggal_masuk)}
                        </span>
                        {showTanggalKeluar && unit.tanggal_keluar && (
                          <span className="text-[10px] text-gold-500/50 italic mt-0.5 font-bold uppercase">MASUK: {formatDate(unit.tanggal_masuk)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-gold-500 font-display tracking-widest text-[13px] group-hover:text-gold-400 transition-colors uppercase italic font-black">{unit.merk}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-white/90 font-bold text-[13px] uppercase tracking-wide">{unit.type}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-white/70 font-bold text-[13px]">{unit.tahun}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-white/60 text-[13px] italic font-bold uppercase">{unit.warna || '-'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-blue-400/80 font-mono text-[13px] font-bold tracking-[0.15em]">{unit.nopol}</span>
                    </td>
                    {(showHargaBeli || !showHargaJual) && (
                      <td className="px-6 py-6 text-right">
                        <span className="text-gold-500 font-bold tracking-widest text-[13px] uppercase italic">{formatRupiah(Number(unit.harga_beli))}</span>
                      </td>
                    )}
                    {showHargaJual && (
                      <td className="px-6 py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-green-500 font-bold tracking-widest text-[13px] uppercase italic">{formatRupiah(Number(unit.harga_jual || 0))}</span>
                          {(!showHargaBeli) && (
                            <span className="text-[10px] text-slate-500 line-through opacity-50 font-bold uppercase">{formatRupiah(Number(unit.harga_beli))}</span>
                          )}
                        </div>
                      </td>
                    )}
                    {showLaba && (
                      <td className="px-6 py-6 text-right">
                        <span className={`font-display tracking-widest text-[13px] font-bold italic ${laba >= 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-red-400'}`}>
                          {formatRupiah(laba)}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-6">
                      <div className="flex justify-end gap-2">
                        {onJual && (
                          <button onClick={() => onJual(unit)} className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-lg shadow-gold-500/10 uppercase">
                            JUAL
                          </button>
                        )}
                        {onEdit && (
                          <button onClick={() => onEdit(unit)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all border border-white/10 active:scale-95 uppercase">
                            EDIT
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(unit.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/10 active:scale-95">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
