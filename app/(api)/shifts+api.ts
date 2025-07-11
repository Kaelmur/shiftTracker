import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const result = await sql`
      SELECT 
        shifts.id AS shift_id,
        shifts.worker_id,
        shifts.start_time,
        shifts.duration,
        shifts.status,
        users.name AS user_name,
        users.email AS user_email
      FROM shifts
      LEFT JOIN users ON shifts.worker_id = users.id
      WHERE shifts.status = 'Закончена'
      ORDER BY shifts.start_time DESC
`;

    return Response.json(result);
  } catch (error) {
    console.error("❌ Error fetching shifts:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
