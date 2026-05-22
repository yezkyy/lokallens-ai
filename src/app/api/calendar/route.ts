import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await db.query(
      `SELECT ms.*, p.product_name, c.generated_caption 
       FROM marketing_schedules ms
       LEFT JOIN products p ON ms.product_id = p.id
       LEFT JOIN ai_generated_captions c ON ms.caption_id = c.id
       WHERE ms.user_id = $1
       ORDER BY scheduled_date ASC`,
      [session.user.id]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("GET Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    console.log("POST Body received:", body);
    
    const { product_id, scheduled_date, scheduled_time, platform, title } = body;
    
    // Ensure numeric product_id if provided, otherwise null
    const finalProductId = (product_id && product_id !== "") ? product_id : null;
    
    const result = await db.query(
      `INSERT INTO marketing_schedules 
       (user_id, product_id, scheduled_date, scheduled_time, platform, title, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [session.user.id, finalProductId, scheduled_date, scheduled_time, platform, title || 'Tanpa Judul']
    );
    
    console.log("Insert Success:", result.rows[0]);
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("CRITICAL POST ERROR:", error);
    // Provide detailed error back to frontend for debugging
    return NextResponse.json({ 
      error: "Gagal menyimpan jadwal ke database",
      details: error.message,
      hint: error.hint
    }, { status: 500 });
  }
}
