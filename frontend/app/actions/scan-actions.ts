'use server';

import { Pool } from 'pg';

// ---- SINGLETON POOL (CRITICAL FOR NEXT.JS) ----
let pool: Pool;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Supabase requires this
      },
      max: 5,               // 🔥 DO NOT increase (Supabase limit)
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
};

// ---- TYPES ----
export interface ScanLog {
  id: number;
  guard_name?: string;
  qr_id?: string;
  qr_name?: string;
  lat?: number;
  log?: number;
  status?: string;
  factory_code?: string;
  scan_time: string;
}

// ---- QUERIES ----
export const getAllScanLogs = async (): Promise<ScanLog[]> => {
  try {
    const db = getPool();
    const res = await db.query(
      `SELECT *
       FROM public.scanning_details
       ORDER BY scan_time DESC`
    );
    return res.rows;
  } catch (error) {
    console.error('❌ Error fetching scan logs:', error);
    throw new Error('Database query failed');
  }
};

export const getScanLogsByFactory = async (
  factoryCode: string
): Promise<ScanLog[]> => {
  try {
    const db = getPool();
    const res = await db.query(
      `SELECT *
       FROM public.scanning_details
       WHERE factory_code = $1
       ORDER BY scan_time DESC`,
      [factoryCode]
    );
    return res.rows;
  } catch (error) {
    console.error(`❌ Error fetching logs for factory ${factoryCode}:`, error);
    throw new Error('Database query failed');
  }
};
