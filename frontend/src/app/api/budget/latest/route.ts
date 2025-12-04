import { NextResponse } from "next/server";
import { Pool } from "pg";

// Use environment variable for DB connection
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_zxcG7yqomle9@ep-twilight-king-ahgji1tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true, // SSL required for Neon
});

export async function GET() {
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'budgets'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      return NextResponse.json({ budget: null });
    }

    // Fetch latest updated budget
    const result = await pool.query(`
      SELECT * FROM budgets
      ORDER BY updated_at DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ budget: null });
    }

    const row = result.rows[0];

    const latestBudget = {
      id: row.month,
      month: row.month,
      income: Number(row.income),
      expenses: {
        bills: Number(row.bills),
        food: Number(row.food),
        transport: Number(row.transport),
        subscriptions: Number(row.subscriptions),
        miscellaneous: Number(row.miscellaneous),
      },
      updatedAt: Number(row.updated_at),
      isSynced: true,
    };

    return NextResponse.json({ budget: latestBudget });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ budget: null });
  }
}