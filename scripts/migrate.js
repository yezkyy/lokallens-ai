const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lokallens_ai',
  });

  try {
    console.log('🚀 Memulai migrasi ke database Laragon...');
    
    const sqlPath = path.join(__dirname, '../laragon_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
    
    console.log('✅ Migrasi berhasil! Semua tabel telah dibuat.');
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat migrasi:');
    console.error(err.message);
    
    if (err.message.includes('database "lokallens_ai" does not exist')) {
      console.log('\n💡 TIPS: Buat database "lokallens_ai" dulu di Laragon/HeidiSQL.');
    }
  } finally {
    await pool.end();
  }
}

migrate();
