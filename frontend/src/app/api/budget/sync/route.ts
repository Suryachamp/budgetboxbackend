import { NextResponse } from "next/server";
import { Pool } from "pg";

// DIRECT DB URL (encoded password)
const DATABASE_URL =
  "postgresql://neondb_owner:npg_zxcG7yqomle9@ep-twilight-king-ahgji1tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
});

export async function POST(request: Request) {
  try {
    const budget = await request.json();

    // CREATE TABLE if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        month TEXT PRIMARY KEY,
        income NUMERIC(12,2) DEFAULT 0,
        bills NUMERIC(12,2) DEFAULT 0,
        food NUMERIC(12,2) DEFAULT 0,
        transport NUMERIC(12,2) DEFAULT 0,
        subscriptions NUMERIC(12,2) DEFAULT 0,
        miscellaneous NUMERIC(12,2) DEFAULT 0,
        updated_at BIGINT NOT NULL
      );
    `);

    // UPSERT OPERATION
    await pool.query(
      `
      INSERT INTO budgets (month, income, bills, food, transport, subscriptions, miscellaneous, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (month)
      DO UPDATE SET
        income = EXCLUDED.income,
        bills = EXCLUDED.bills,
        food = EXCLUDED.food,
        transport = EXCLUDED.transport,
        subscriptions = EXCLUDED.subscriptions,
        miscellaneous = EXCLUDED.miscellaneous,
        updated_at = EXCLUDED.updated_at;
    `,
      [
        budget.month,
        budget.income,
        budget.expenses.bills,
        budget.expenses.food,
        budget.expenses.transport,
        budget.expenses.subscriptions,
        budget.expenses.miscellaneous,
        Date.now(),
      ]
    );

    console.log("Synced:", budget.month);

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Sync error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync to database",
      },
      { status: 500 }
    );
  }
}