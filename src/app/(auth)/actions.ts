"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return { error: "Email atau kata sandi salah." };
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: user.id, email: user.email }, expires });

    (await cookies()).set("session", session, { expires, httpOnly: true });
    
    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada sistem." };
  }
}

export async function signupAction(data: any) {
  const { email, password, businessName, ownerName, city, phoneNumber, businessCategory } = data;

  try {
    // 1. Check if user exists
    const checkUser = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) return { error: "Email sudah terdaftar." };

    // 2. Create User
    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, passwordHash]
    );
    const userId = userResult.rows[0].id;

    // 3. Create UMKM Profile
    await db.query(
      `INSERT INTO umkm_profiles (
        user_id, business_name, owner_name, email, city, phone_number, business_category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, businessName, ownerName, email, city, phoneNumber, businessCategory]
    );

    // 4. Create Session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: userId, email }, expires });
    (await cookies()).set("session", session, { expires, httpOnly: true });

    return { success: true };
  } catch (error) {
    console.error("Signup Error:", error);
    return { error: "Gagal mendaftarkan akun UMKM." };
  }
}

export async function logoutAction() {
  (await cookies()).set("session", "", { expires: new Date(0) });
  redirect("/login");
}
