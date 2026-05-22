import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    let query = "SELECT * FROM generated_images WHERE user_id = $1";
    let params = [session.user.id];

    if (search) {
      query += " AND prompt_used ILIKE $2";
      params.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";
    
    const result = await db.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { image_url, prompt_used, settings } = await req.json();

    const result = await db.query(
      `INSERT INTO generated_images (user_id, image_url, prompt_used, settings)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [session.user.id, image_url, prompt_used, settings]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Gallery Save Error:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
