import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { shift_id } = await req.json();

    // Get existing shift
    const existing = await sql`
      SELECT start_time FROM shifts WHERE id = ${shift_id};
    `;

    if (existing.length === 0) {
      return Response.json({ error: "Shift not found" }, { status: 404 });
    }

    const startTime = new Date(existing[0].start_time);
    const now = new Date();
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000); // in seconds

    // 2. Update shift with duration and status
    const updated = await sql`
      UPDATE shifts
      SET duration = ${duration},
          status = 'Закончена'
      WHERE id = ${shift_id}
      RETURNING *;
    `;

    return Response.json({ data: updated[0] }, { status: 200 });
  } catch (error) {
    console.error("❌ Error ending shift:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
