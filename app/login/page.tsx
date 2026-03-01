'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError(data.error || 'Login gagal')
    }
  }

  return (
    <div className="h-screen w-full bg-[#0a1931] flex flex-col items-center justify-center relative overflow-hidden selection:bg-gold-400 selection:text-black p-4">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Main Card */}
        <div className="w-full max-w-sm bg-[#122340] border border-gold-500/30 p-8 md:p-10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative">

          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="relative w-40 h-24">
                <img
                  src="/logo.png"
                  alt="RODA DUA Logo"
                  className="object-contain w-full h-full drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent my-2"></div>
              <h1 className="font-display text-lg tracking-[0.05em] text-gold-500 uppercase italic font-black whitespace-nowrap">
                RODA DUA MOTOR BEKAS BLITAR
              </h1>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] animate-shake uppercase tracking-wider font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full bg-[#fdfdfd] border-none text-[#0f2444] px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all placeholder:text-slate-400 font-bold"
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-1">
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#fdfdfd] border-none text-[#0f2444] px-5 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all placeholder:text-slate-400 font-bold"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f4cb38] hover:bg-[#e6bf32] text-black font-display text-xl tracking-[0.2em] py-4 rounded-xl transition-all mt-4 font-bold active:scale-[0.97] uppercase disabled:opacity-50"
            >
              {loading ? 'MEMPROSES...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center text-center gap-1.5 px-4 opacity-70">
          <p className="text-white text-[11px] tracking-[0.1em] font-medium uppercase">
            © RODA DUA MOTOR BEKAS BLITAR
          </p>
          <p className="text-white/60 text-[10px] leading-relaxed max-w-[280px]">
            Jl. Irian No. 50 Lingkungan Jajar Kanigoro Blitar No. HP 085236582023
          </p>
        </div>
      </div>
    </div>
  )
}
