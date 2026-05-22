import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { product_id, scheduled_date, scheduled_time, platform, status, title } = await req.json();
    const { id } = await params;

    const finalProductId = (product_id && product_id !== "") ? product_id : null;

    const result = await db.query(
      `UPDATE marketing_schedules 
       SET product_id = $1, scheduled_date = $2, scheduled_time = $3, platform = $4, status = $5, title = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [finalProductId, scheduled_date, scheduled_time, platform, status || 'pending', title, id, session.user.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("PUT Update Error:", error);
    return NextResponse.json({ error: "Failed to update schedule", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const result = await db.query(
      "DELETE FROM marketing_schedules WHERE id = $1 AND user_id = $2",
      [id, session.user.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Schedule deleted" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete schedule", details: error.message }, { status: 500 });
  }
}
