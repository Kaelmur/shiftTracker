import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const result = await sql`
      SELECT role FROM users WHERE email = ${email}
    `;

    const role = result[0]?.role;

    if (!role) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ role }, { status: 200 });
  } catch (error) {
    console.error("DB Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
