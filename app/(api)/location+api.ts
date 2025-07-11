import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { latitude, longitude, email } = await request.json();

    const result = await sql`
      UPDATE users
      SET latitude = ${latitude},
          longitude = ${longitude}
      WHERE email = ${email};
    `;

    return new Response(JSON.stringify({ data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
      SELECT id, name, email, role, latitude, longitude 
      FROM users
    `;
    return Response.json(result);
  } catch (error) {
    console.error("Error fetching user locations:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
