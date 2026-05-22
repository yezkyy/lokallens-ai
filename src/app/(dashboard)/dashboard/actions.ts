"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getUMKMProfile() {
  const session = await getSession();

  if (!session || !session.user) return null;

  try {
    const query = `SELECT business_name, owner_name, city, category FROM umkm_profiles WHERE user_id = $1 LIMIT 1`;
    const result = await db.query(query, [session.user.id]);
    
    if (result.rowCount === 0) {
      return {
        business_name: "",
        owner_name: "",
        city: "Samarinda",
        category: "Umum"
      };
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching profile from local DB:", error);
    return null;
  }
}
