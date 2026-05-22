"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getUMKMProfile() {
  const session = await getSession();

  if (!session || !session.user) return null;

  try {
    const query = `SELECT * FROM umkm_profiles WHERE user_id = $1 LIMIT 1`;
    const result = await db.query(query, [session.user.id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching profile from local DB:", error);
    return null;
  }
}
