import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { email } = await request.json();

    const userResult = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (userResult.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const workerId = userResult[0].id;

    if (!workerId) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const existingShift = await sql`
    SELECT id FROM shifts
    WHERE worker_id = ${workerId} AND status = 'Активна';
  `;

    if (existingShift.length > 0) {
      return new Response(JSON.stringify({ error: "Shift already active" }), {
        status: 400,
      });
    }

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Almaty",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Output example: 04/07/2025, 12:30:45
    const parts = formatter.formatToParts(now).reduce(
      (acc, part) => {
        if (part.type !== "literal") acc[part.type] = part.value;
        return acc;
      },
      {} as Record<string, string>
    );

    // Convert to SQL timestamp: '2025-07-04 12:30:45'
    const localTimestamp = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
    // Create new shift
    const insert = await sql`
      INSERT INTO shifts (worker_id, start_time, duration, status)
      VALUES (${workerId}, ${localTimestamp}, 0, 'Активна')
      RETURNING *;
    `;

    return Response.json(insert[0], { status: 201 });
  } catch (error) {
    console.error("Error starting shift:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
