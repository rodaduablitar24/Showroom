const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  console.log('🚀 Running migrations...')

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS units (
      id SERIAL PRIMARY KEY,
      tanggal_masuk DATE NOT NULL,
      tanggal_keluar DATE,
      merk VARCHAR(100) NOT NULL,
      type VARCHAR(100) NOT NULL,
      tahun INTEGER NOT NULL,
      nopol VARCHAR(20) NOT NULL,
      harga_beli BIGINT NOT NULL DEFAULT 0,
      harga_jual BIGINT,
      status VARCHAR(20) NOT NULL DEFAULT 'stok',
      warna VARCHAR(100) DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  // Create default admin
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

  await sql`
    INSERT INTO users (username, password)
    VALUES (${process.env.ADMIN_USERNAME || 'admin'}, ${hashedPassword})
    ON CONFLICT (username) DO NOTHING
  `

  console.log('✅ Migration complete!')
  console.log(`👤 Admin: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`)
}

migrate().catch(console.error)
