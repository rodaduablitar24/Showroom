'use client'

import { useEffect, useState, useRef } from 'react'

interface DateInputProps {
    value: string // Format database: YYYY-MM-DD
    onChange: (value: string) => void
    label: string
}

export default function DateInput({ value, onChange, label }: DateInputProps) {
    const [d, setD] = useState('')
    const [m, setM] = useState('')
    const [y, setY] = useState('')
    const dateInputRef = useRef<HTMLInputElement>(null)

    // Sinkronisasi dari value (YYYY-MM-DD) ke sub-inputs
    useEffect(() => {
        if (value) {
            const [year, month, day] = value.split('-')
            setD(day || '')
            setM(month || '')
            setY(year || '')
        } else {
            // Jika kosong, set ke waktu real-time sekarang
            const now = new Date()
            const day = String(now.getDate()).padStart(2, '0')
            const month = String(now.getMonth() + 1).padStart(2, '0')
            const year = String(now.getFullYear())
            onChange(`${year}-${month}-${day}`)
        }
    }, [value, onChange])

    const updateParent = (newD: string, newM: string, newY: string) => {
        if (newD.length === 2 && newM.length === 2 && newY.length === 4) {
            onChange(`${newY}-${newM}-${newD}`)
        }
    }

    const handleDay = (val: string) => {
        const v = val.replace(/\D/g, '').substring(0, 2)
        setD(v)
        updateParent(v, m, y)
        if (v.length === 2) document.getElementById(`mnt-${label}`)?.focus()
    }

    const handleMonth = (val: string) => {
        const v = val.replace(/\D/g, '').substring(0, 2)
        setM(v)
        updateParent(d, v, y)
        if (v.length === 2) document.getElementById(`yr-${label}`)?.focus()
    }

    const handleYear = (val: string) => {
        const v = val.replace(/\D/g, '').substring(0, 4)
        setY(v)
        updateParent(d, m, v)
    }

    return (
        <div className="space-y-2">
            <label className="block text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold ml-1 text-left italic">
                {label}
            </label>
            <div className="relative group flex items-center bg-[#0f2444] border border-gold-500/10 px-5 py-3.5 rounded-2xl focus-within:border-gold-500/50 transition-all shadow-inner">

                {/* Segmen Tanggal */}
                <div className="flex items-center gap-1 flex-1">
                    <input
                        type="text"
                        value={d}
                        placeholder="DD"
                        onChange={(e) => handleDay(e.target.value)}
                        className="bg-transparent w-7 text-white text-sm font-bold focus:outline-none text-center placeholder:text-slate-600"
                        maxLength={2}
                    />
                    <span className="text-gold-500/30 font-bold select-none">/</span>
                    <input
                        id={`mnt-${label}`}
                        type="text"
                        value={m}
                        placeholder="MM"
                        onChange={(e) => handleMonth(e.target.value)}
                        className="bg-transparent w-7 text-white text-sm font-bold focus:outline-none text-center placeholder:text-slate-600"
                        maxLength={2}
                    />
                    <span className="text-gold-500/30 font-bold select-none">/</span>
                    <input
                        id={`yr-${label}`}
                        type="text"
                        value={y}
                        placeholder="YYYY"
                        onChange={(e) => handleYear(e.target.value)}
                        className="bg-transparent w-12 text-white text-sm font-bold focus:outline-none text-center placeholder:text-slate-600"
                        maxLength={4}
                    />
                </div>

                {/* Picker Kalender Asli (Tetap ada sebagai akses cepat) */}
                <div className="relative ml-2 flex items-center h-full">
                    <input
                        type="date"
                        ref={dateInputRef}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-gold-500/40 group-focus-within:text-gold-500 transition-colors pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                </div>
            </div>
            <p className="text-[9px] text-slate-500/50 ml-1 italic font-bold uppercase tracking-tighter">Otomatis Terisi Waktu Real-Time</p>
        </div>
    )
}
