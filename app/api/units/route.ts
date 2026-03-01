import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllUnits, addUnit, jualUnit, deleteUnit, updateUnitDetails } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') // stok | terjual | all

  let units = await getAllUnits()
  if (filter === 'stok') units = units.filter((u: any) => u.status === 'stok')
  if (filter === 'terjual') units = units.filter((u: any) => u.status === 'terjual')

  return NextResponse.json(units)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const result = await addUnit(body)
  return NextResponse.json(result[0])
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, harga_jual, tanggal_keluar } = await req.json()
  const result = await jualUnit(id, harga_jual, tanggal_keluar)
  return NextResponse.json(result[0])
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body
  const result = await updateUnitDetails(id, data)
  return NextResponse.json(result[0])
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  await deleteUnit(Number(id))
  return NextResponse.json({ success: true })
}
