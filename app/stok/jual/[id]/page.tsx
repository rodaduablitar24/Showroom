'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function JualUnitPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id

    const [loading, setLoading] = useState(true)
    const [unit, setUnit] = useState<any>(null)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        harga_jual: '',
        tanggal_keluar: new Date().toISOString().slice(0, 10)
    })

    useEffect(() => {
        async function fetchUnit() {
            const res = await fetch(`/api/units/${id}`)
            if (res.ok) {
                const data = await res.json()
                setUnit(data)
            } else {
                router.push('/stok')
            }
            setLoading(false)
        }
        fetchUnit()
    }, [id, router])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)

        const res = await fetch('/api/units', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: unit.id,
                harga_jual: Number(form.harga_jual),
                tanggal_keluar: form.tanggal_keluar
            }),
        })

        if (res.ok) {
            router.push('/stok')
        }
        setSubmitting(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a1931]">
                <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="p-5 sm:p-8 md:p-12 pb-32 max-w-[1200px] mx-auto animate-in">
            <div className="mb-10 flex flex-col items-center">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase italic">JUAL UNIT</h1>
                <div className="w-24 h-1 bg-gold-500/20 mt-4 rounded-full"></div>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
                    KONFIRMASI PENJUALAN UNIT TERPILIH
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

                    <div className="mb-10 p-8 bg-[#0a1931]/80 rounded-[2.5rem] border border-gold-500/10 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <h2 className="text-white font-display text-2xl md:text-3xl tracking-widest uppercase italic mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{unit.merk} {unit.type}</h2>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 py-6 border-t border-white/5">
                            <div className="text-center">
                                <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-2">Tahun</p>
                                <p className="text-white text-lg font-bold">{unit.tahun}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-2">Nomor Polisi</p>
                                <p className="text-gold-400 text-lg font-mono font-bold tracking-widest">{unit.nopol}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-2">Warna</p>
                                <p className="text-white text-lg font-bold italic">{unit.warna || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left italic">Tanggal Keluar</label>
                            <input
                                type="date"
                                value={form.tanggal_keluar}
                                onChange={e => setForm({ ...form, tanggal_keluar: e.target.value })}
                                className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-bold shadow-inner"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left italic">Harga Jual (Rp)</label>
                            <input
                                type="number"
                                value={form.harga_jual}
                                onChange={e => setForm({ ...form, harga_jual: e.target.value })}
                                className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-bold shadow-inner"
                                placeholder="Masukkan nominal harga jual..."
                                required
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-display text-lg md:text-xl tracking-[0.2em] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all active:shadow-glow-gold active:scale-[0.97] uppercase font-bold disabled:opacity-50"
                            >
                                {submitting ? 'MEMPROSES...' : 'KONFIRMASI'}
                            </button>
                            <Link
                                href="/stok"
                                className="flex-1 bg-[#0f2444] hover:bg-[#1e293b] text-white font-display text-lg md:text-xl tracking-[0.2em] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all border border-gold-500/10 active:scale-[0.97] uppercase flex items-center justify-center"
                            >
                                BATAL
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
