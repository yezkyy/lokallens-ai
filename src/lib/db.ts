import { Pool, types } from 'pg';

// Force DATE (OID 1082) to be returned as a string instead of a Date object
// This prevents timezone-related shifting (e.g., 2026-05-22 becoming 2026-05-21)
types.setTypeParser(1082, (val) => val);

// Menggunakan variable dari .env.local
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
