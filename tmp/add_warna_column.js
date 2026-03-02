const { neon } = require('@neondatabase/serverless')
require('dotenv').config()

const sql = neon(process.env.DATABASE_URL)

async function addWarnaColumn() {
    console.log('🚀 Adding warna column to units table...')
    try {
        await sql`
      ALTER TABLE units ADD COLUMN IF NOT EXISTS warna VARCHAR(50) DEFAULT ''
    `
        console.log('✅ Column added successfully!')
    } catch (error) {
        console.error('❌ Error adding column:', error)
    }
}

addWarnaColumn()
