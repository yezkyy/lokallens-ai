import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await db.query(
      "SELECT id, product_name, category FROM products WHERE user_id = $1 ORDER BY product_name ASC",
      [session.user.id]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
