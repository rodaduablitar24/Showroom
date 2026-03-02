'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditUnitStokPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id

    const [loading, setLoading] = useState(true)
    const [unit, setUnit] = useState<any>(null)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        merk: '',
        type: '',
        tahun: 2024,
        nopol: '',
        harga_beli: '',
        warna: '',
        tanggal_masuk: ''
    })

    useEffect(() => {
        async function fetchUnit() {
            const res = await fetch(`/api/units/${id}`)
            if (res.ok) {
                const data = await res.json()
                setUnit(data)
                setForm({
                    merk: data.merk,
                    type: data.type,
                    tahun: data.tahun,
                    nopol: data.nopol,
                    harga_beli: data.harga_beli.toString(),
                    warna: data.warna || '',
                    tanggal_masuk: data.tanggal_masuk.slice(0, 10)
                })
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
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: unit.id, ...form }),
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
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase italic">EDIT UNIT</h1>
                <div className="w-24 h-1 bg-gold-500/20 mt-4 rounded-full"></div>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
                    PERBARUI INFORMASI UNIT KENDARAAN (STOK)
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Tanggal Masuk</label>
                                <input type="date" value={form.tanggal_masuk}
                                    onChange={e => setForm({ ...form, tanggal_masuk: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Tahun Produksi</label>
                                <input type="number" value={form.tahun}
                                    onChange={e => setForm({ ...form, tahun: Number(e.target.value) })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Merek Kendaraan</label>
                                <input type="text" value={form.merk} placeholder="Contoh: Honda, Yamaha, dll"
                                    onChange={e => setForm({ ...form, merk: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Tipe / Model</label>
                                <input type="text" value={form.type} placeholder="Contoh: Avanza, Civic, dll"
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Nomor Polisi</label>
                                <input type="text" value={form.nopol} placeholder="B 1234 ABC"
                                    onChange={e => setForm({ ...form, nopol: e.target.value.toUpperCase() })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-mono font-bold tracking-widest shadow-inner" required />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Harga Beli (Rp)</label>
                                <input type="number" value={form.harga_beli} placeholder="150000000"
                                    onChange={e => setForm({ ...form, harga_beli: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1">Warna</label>
                                <input type="text" value={form.warna} placeholder="Contoh: Hitam, Putih, dll"
                                    onChange={e => setForm({ ...form, warna: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all shadow-inner" required />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
                            <button type="submit" disabled={submitting}
                                className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-display text-lg md:text-xl tracking-[0.2em] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all active:shadow-glow-gold active:scale-[0.97] uppercase disabled:opacity-50 font-bold">
                                {submitting ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}
                            </button>
                            <Link href="/stok"
                                className="flex-1 bg-[#0f2444] hover:bg-[#1e293b] text-white font-display text-lg md:text-xl tracking-[0.2em] py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all border border-gold-500/10 active:scale-[0.97] uppercase flex items-center justify-center">
                                BATAL
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
