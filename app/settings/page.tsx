'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        // We can't use getSession directly in client side easily without an API or a server component passing it
        // But for simplicity, we'll try to get the current username from the token in local context if any or just let it be blank initially
        // Let's assume the user knows their current username or we can add a simple API to get user info if needed
        setLoading(false)
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (form.password && form.password !== form.confirmPassword) {
            setError('Password baru tidak cocok')
            return
        }

        setSubmitting(true)

        const res = await fetch('/api/auth/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: form.username,
                password: form.password
            }),
        })

        const data = await res.json()

        if (res.ok) {
            setSuccess('Pengaturan berhasil diperbarui')
            setForm({ ...form, password: '', confirmPassword: '' })
        } else {
            setError(data.error || 'Gagal memperbarui pengaturan')
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
            <div className="mb-10 flex flex-col items-center text-center">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white leading-none uppercase italic">PENGATURAN AKUN</h1>
                <div className="w-24 h-1 bg-gold-500/20 mt-4 rounded-full"></div>
                <p className="text-slate-400 text-[10px] sm:text-xs mt-4 font-bold flex items-center gap-3 italic">
                    UBAH USERNAME DAN PASSWORD AKSES ANDA
                </p>
            </div>

            <div className="max-w-xl mx-auto">
                <div className="bg-[#0f2444]/60 backdrop-blur-md border border-gold-500/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-bold tracking-widest uppercase text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-[10px] font-bold tracking-widest uppercase text-center animate-in">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left italic">Username Baru</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-bold shadow-inner"
                                placeholder="Masukkan username baru..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left italic">Password Baru</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 pr-12 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-bold shadow-inner"
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-500 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left italic">Konfirmasi Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full bg-[#0f2444] border border-gold-500/10 text-white px-5 py-3.5 pr-12 rounded-2xl text-sm focus:outline-none focus:border-gold-500/50 transition-all font-bold shadow-inner"
                                    placeholder="Masukkan ulang password baru..."
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-500 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gold-500 hover:bg-gold-400 text-black font-display text-lg tracking-[0.2em] py-4 rounded-2xl transition-all active:shadow-glow-gold active:scale-[0.97] uppercase font-bold disabled:opacity-50"
                            >
                                {submitting ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                            </button>
                            <Link
                                href="/dashboard"
                                className="w-full bg-[#0f2444] hover:bg-[#1e293b] text-white font-display text-lg tracking-[0.2em] py-4 rounded-2xl transition-all border border-gold-500/10 active:scale-[0.97] uppercase flex items-center justify-center italic"
                            >
                                KEMBALI
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-12 text-center text-slate-500 text-[9px] font-bold tracking-widest uppercase italic max-w-md mx-auto leading-relaxed">
                Peringatan: Jika Anda mengubah password, pastikan untuk mencatatnya dengan aman demi keamanan akun Anda.
            </div>
        </div>
    )
}
