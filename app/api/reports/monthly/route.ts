import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getLaporanBulanan } from '@/lib/db'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const year = Number(searchParams.get('year')) || new Date().getFullYear()

    const laporan = await getLaporanBulanan(year)
    return NextResponse.json(laporan)
}
