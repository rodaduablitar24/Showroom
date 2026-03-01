import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getDashboardStats, getLaporanBulanan } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stats = await getDashboardStats()
  const tahun = new Date().getFullYear()
  const laporan = await getLaporanBulanan(tahun)

  return NextResponse.json({ stats, laporan })
}
