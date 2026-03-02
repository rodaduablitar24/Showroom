import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUnitById } from '@/lib/db'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const unit = await getUnitById(id)
    if (!unit) return NextResponse.json({ error: 'Unit not found' }, { status: 404 })

    return NextResponse.json(unit)
}
