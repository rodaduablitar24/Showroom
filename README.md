# 🚗 RODA DUA — Motor Bekas Blitar

Sistem manajemen showroom kendaraan berbasis Next.js + Neon Database.

## Fitur
- 🔐 Login / Autentikasi
- 📊 Dashboard dengan grafik laba bulanan
- 📦 Stok Unit (dengan fitur jual)
- ⬇️ Unit Masuk (tambah unit baru)
- ⬆️ Unit Keluar (unit terjual)
- 💰 Laba Penjualan
- 📋 Laporan Bulanan

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Buat file `.env.local`
```bash
cp .env.example .env.local
```

Isi file `.env.local`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
JWT_SECRET="random-string-panjang-dan-aman"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password-lo"
```

> Connection string Neon ada di: Dashboard → Project → Connection Details

### 3. Jalankan migrasi database
```bash
npm run db:migrate
```

Ini akan otomatis:
- Buat tabel `users` dan `units`
- Buat akun admin default

### 4. Jalankan aplikasi
```bash
npm run dev
```

Buka http://localhost:3000

Login dengan username/password yang lo set di `.env.local`

## Struktur Database

### Tabel `units`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| tanggal_masuk | DATE | Tanggal unit masuk |
| tanggal_keluar | DATE | Tanggal terjual (nullable) |
| merk | VARCHAR | Merek kendaraan |
| type | VARCHAR | Tipe/model |
| tahun | INTEGER | Tahun kendaraan |
| nopol | VARCHAR | Nomor polisi |
| harga_beli | BIGINT | Harga beli |
| harga_jual | BIGINT | Harga jual (nullable) |
| status | VARCHAR | 'stok' atau 'terjual' |

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL | Primary key |
| username | VARCHAR | Username unik |
| password | VARCHAR | Bcrypt hash |

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Neon (PostgreSQL serverless)
- **Auth**: JWT + bcrypt
- **Charts**: Recharts
- **Styling**: Tailwind CSS
