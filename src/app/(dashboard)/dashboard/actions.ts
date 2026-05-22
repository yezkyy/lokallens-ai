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

export async function updateUMKMProfile(data: {
  business_name: string;
  owner_name: string;
  city: string;
  category: string;
}) {
  const session = await getSession();
  if (!session || !session.user) return { error: "Unauthorized" };

  try {
    const checkQuery = `SELECT id FROM umkm_profiles WHERE user_id = $1`;
    const checkResult = await db.query(checkQuery, [session.user.id]);

    if (checkResult.rowCount === 0) {
      await db.query(
        `INSERT INTO umkm_profiles (user_id, business_name, owner_name, city, category)
         VALUES ($1, $2, $3, $4, $5)`,
        [session.user.id, data.business_name, data.owner_name, data.city, data.category]
      );
    } else {
      await db.query(
        `UPDATE umkm_profiles 
         SET business_name = $1, owner_name = $2, city = $3, category = $4, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $5`,
        [data.business_name, data.owner_name, data.city, data.category, session.user.id]
      );
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Gagal memperbarui profil" };
  }
}
