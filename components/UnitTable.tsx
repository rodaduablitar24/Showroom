'use client'

function formatRupiah(n: number) {
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface Unit {
  id: number
  tanggal_masuk: string
  tanggal_keluar?: string
  merk: string
  type: string
  tahun: number
  nopol: string
  harga_beli: number
  harga_jual?: number
  status: string
}

interface Props {
  units: Unit[]
  showHargaJual?: boolean
  showTanggalKeluar?: boolean
  showLaba?: boolean
  onEdit?: (unit: Unit) => void
  onJual?: (unit: Unit) => void
  onDelete?: (id: number) => void
}

export default function UnitTable({ units, showHargaJual, showTanggalKeluar, showLaba, onEdit, onJual, onDelete }: Props) {
  if (units.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="font-display text-2xl tracking-wider mb-2 uppercase">Data Tidak Tersedia</p>
        <p className="text-sm">Belum ada unit yang terdaftar di showroom</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto custom-scrollbar bg-navy-850/40 backdrop-blur-sm rounded-2xl border border-gold-500/10 shadow-soft-xl">
      <table className="w-full text-sm" style={{ minWidth: '850px' }}>
        <thead>
          <tr className="border-b border-gold-500/10 bg-white/5 backdrop-blur-md">
            <th className="text-left px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">TGL MASUK</th>
            {showTanggalKeluar && <th className="text-left px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">TGL KELUAR</th>}
            <th className="text-left px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">MERK</th>
            <th className="text-left px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">TYPE</th>
            <th className="text-left px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">THN</th>
            <th className="text-left px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">NOPOL</th>
            <th className="text-right px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">HARGA BELI</th>
            {showHargaJual && <th className="text-right px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">HARGA JUAL</th>}
            {showLaba && <th className="text-right px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">LABA</th>}
            {(onEdit || onJual || onDelete) && <th className="text-center px-6 py-4 text-[10px] text-slate-400 tracking-[0.2em] font-bold uppercase whitespace-nowrap">AKSI</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {units.map((unit) => {
            const laba = unit.harga_jual ? unit.harga_jual - unit.harga_beli : 0
            return (
              <tr key={unit.id} className="hover:bg-white-[0.02] transition-colors group border-b border-gold-500/5 last:border-0">
                <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs font-medium">{formatDate(unit.tanggal_masuk)}</td>
                {showTanggalKeluar && <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs font-medium">{formatDate(unit.tanggal_keluar || '')}</td>}
                <td className="px-6 py-4 text-white font-bold tracking-wide whitespace-nowrap">{unit.merk}</td>
                <td className="px-6 py-4 text-white/80 whitespace-nowrap font-medium">{unit.type}</td>
                <td className="px-6 py-4 text-white/80 whitespace-nowrap font-medium">{unit.tahun}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-[#0f2444] border border-gold-500/10 px-3 py-1 rounded-lg text-[10px] text-white font-bold tracking-widest shadow-inner">{unit.nopol}</span>
                </td>
                <td className="px-6 py-4 text-right text-slate-300 tabular-nums whitespace-nowrap font-medium">{formatRupiah(unit.harga_beli)}</td>
                {showHargaJual && <td className="px-6 py-4 text-right text-gold-400 tabular-nums whitespace-nowrap font-bold">{unit.harga_jual ? formatRupiah(unit.harga_jual) : '-'}</td>}
                {showLaba && (
                  <td className={`px-6 py-4 text-right font-bold tabular-nums whitespace-nowrap ${laba > 0 ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-red-400'}`}>
                    {unit.harga_jual ? formatRupiah(laba) : '-'}
                  </td>
                )}
                {(onEdit || onJual || onDelete) && (
                  <td className="px-6 py-4">
                    <div className="flex gap-3 justify-center">
                      {onEdit && unit.status === 'stok' && (
                        <button
                          onClick={() => onEdit(unit)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-[0.2em] transition-all border border-white/5 rounded-lg active:scale-95 uppercase"
                        >
                          EDIT
                        </button>
                      )}
                      {onJual && unit.status === 'stok' && (
                        <button
                          onClick={() => onJual(unit)}
                          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-bold tracking-[0.2em] transition-all rounded-lg active:shadow-glow-gold ring-1 ring-white/10 active:scale-95 uppercase"
                        >
                          JUAL
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(unit.id)}
                          className="px-4 py-2 bg-[#0f2444] hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-[10px] font-bold tracking-[0.2em] transition-all border border-gold-500/10 hover:border-red-500/30 rounded-lg active:scale-95 uppercase"
                        >
                          HAPUS
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
