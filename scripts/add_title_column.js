const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Adding title column to marketing_schedules...');
    await pool.query('ALTER TABLE marketing_schedules ADD COLUMN IF NOT EXISTS title TEXT;');
    console.log('Success!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

runMigration();
