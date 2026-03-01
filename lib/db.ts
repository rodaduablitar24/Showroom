import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export default sql

// ============ UNITS ============
export async function getAllUnits() {
  return await sql`
    SELECT * FROM units ORDER BY created_at DESC
  `
}

export async function getStokUnits() {
  return await sql`
    SELECT * FROM units WHERE status = 'stok' ORDER BY created_at DESC
  `
}

export async function getUnitMasuk(bulan?: number, tahun?: number) {
  if (bulan && tahun) {
    return await sql`
      SELECT * FROM units 
      WHERE status IN ('stok', 'terjual')
      AND EXTRACT(MONTH FROM tanggal_masuk) = ${bulan}
      AND EXTRACT(YEAR FROM tanggal_masuk) = ${tahun}
      ORDER BY tanggal_masuk DESC
    `
  }
  return await sql`
    SELECT * FROM units WHERE status IN ('stok','terjual') ORDER BY tanggal_masuk DESC
  `
}

export async function getUnitKeluar(bulan?: number, tahun?: number) {
  if (bulan && tahun) {
    return await sql`
      SELECT * FROM units 
      WHERE status = 'terjual'
      AND EXTRACT(MONTH FROM tanggal_keluar) = ${bulan}
      AND EXTRACT(YEAR FROM tanggal_keluar) = ${tahun}
      ORDER BY tanggal_keluar DESC
    `
  }
  return await sql`
    SELECT * FROM units WHERE status = 'terjual' ORDER BY tanggal_keluar DESC
  `
}

export async function addUnit(data: {
  tanggal_masuk: string
  merk: string
  type: string
  tahun: number
  nopol: string
  harga_beli: number
}) {
  return await sql`
    INSERT INTO units (tanggal_masuk, merk, type, tahun, nopol, harga_beli, status)
    VALUES (${data.tanggal_masuk}, ${data.merk}, ${data.type}, ${data.tahun}, ${data.nopol}, ${data.harga_beli}, 'stok')
    RETURNING *
  `
}

export async function jualUnit(id: number, harga_jual: number, tanggal_keluar: string) {
  return await sql`
    UPDATE units 
    SET status = 'terjual', harga_jual = ${harga_jual}, tanggal_keluar = ${tanggal_keluar}
    WHERE id = ${id}
    RETURNING *
  `
}

export async function updateUnitDetails(id: number, data: {
  tanggal_masuk: string
  merk: string
  type: string
  tahun: number
  nopol: string
  harga_beli: number
}) {
  return await sql`
    UPDATE units 
    SET tanggal_masuk = ${data.tanggal_masuk}, merk = ${data.merk}, type = ${data.type}, tahun = ${data.tahun}, nopol = ${data.nopol}, harga_beli = ${data.harga_beli}
    WHERE id = ${id}
    RETURNING *
  `
}

export async function deleteUnit(id: number) {
  return await sql`DELETE FROM units WHERE id = ${id}`
}

// ============ DASHBOARD STATS ============
export async function getDashboardStats() {
  const [stok, terjual, laba] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM units WHERE status = 'stok'`,
    sql`SELECT COUNT(*) as count FROM units WHERE status = 'terjual'`,
    sql`SELECT COALESCE(SUM(harga_jual - harga_beli), 0) as total FROM units WHERE status = 'terjual'`,
  ])
  return {
    stok: Number(stok[0].count),
    terjual: Number(terjual[0].count),
    laba: Number(laba[0].total),
  }
}

// ============ LAPORAN BULANAN ============
export async function getLaporanBulanan(tahun: number) {
  return await sql`
    SELECT 
      EXTRACT(MONTH FROM tanggal_keluar) as bulan,
      COUNT(*) as unit_terjual,
      SUM(harga_jual) as total_penjualan,
      SUM(harga_beli) as total_modal,
      SUM(harga_jual - harga_beli) as laba
    FROM units
    WHERE status = 'terjual'
      AND EXTRACT(YEAR FROM tanggal_keluar) = ${tahun}
    GROUP BY EXTRACT(MONTH FROM tanggal_keluar)
    ORDER BY bulan
  `
}

// ============ AUTH ============
export async function getUserByUsername(username: string) {
  const result = await sql`SELECT * FROM users WHERE username = ${username}`
  return result[0] || null
}

export async function createUser(username: string, hashedPassword: string) {
  return await sql`
    INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword}) RETURNING id, username
  `
}
