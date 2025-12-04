const express = require("express");
const { Pool } = require("pg");

/* -------------------------------------------
   DATABASE CONNECTION (DIRECT URL)
-------------------------------------------- */

// Your URL with @ encoded as %40
const DATABASE_URL = "postgresql://neondb_owner:npg_zxcG7yqomle9@ep-twilight-king-ahgji1tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
});

const db = {
  query: (text, params) => pool.query(text, params),
};

/* -------------------------------------------
   AUTO-CREATE TABLE
-------------------------------------------- */

async function initializeDatabase() {
  try {
    await db.query(`
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

    console.log("📦 budgets table is ready.");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err.message);
    process.exit(1);
  }
}

/* -------------------------------------------
   EXPRESS APP
-------------------------------------------- */

const app = express();
app.use(express.json());

/* -------------------------------------------
   CRUD ROUTES
-------------------------------------------- */

// GET all budgets
app.get("/budgets", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM budgets ORDER BY month ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single budget
app.get("/budgets/:month", async (req, res) => {
  try {
    const { month } = req.params;

    const result = await db.query("SELECT * FROM budgets WHERE month = $1", [month]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Budget not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE budget
app.post("/budgets", async (req, res) => {
  try {
    const {
      month,
      income = 0,
      bills = 0,
      food = 0,
      transport = 0,
      subscriptions = 0,
      miscellaneous = 0,
    } = req.body;

    const updated_at = Date.now();

    const result = await db.query(
      `INSERT INTO budgets 
      (month, income, bills, food, transport, subscriptions, miscellaneous, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [month, income, bills, food, transport, subscriptions, miscellaneous, updated_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE budget
app.put("/budgets/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const fields = req.body;
    const updated_at = Date.now();

    const existing = await db.query("SELECT * FROM budgets WHERE month = $1", [month]);
    if (existing.rows.length === 0)
      return res.status(404).json({ error: "Budget not found" });

    const current = existing.rows[0];

    const result = await db.query(
      `UPDATE budgets SET
        income=$1, bills=$2, food=$3, transport=$4,
        subscriptions=$5, miscellaneous=$6, updated_at=$7
      WHERE month=$8
      RETURNING *`,
      [
        fields.income ?? current.income,
        fields.bills ?? current.bills,
        fields.food ?? current.food,
        fields.transport ?? current.transport,
        fields.subscriptions ?? current.subscriptions,
        fields.miscellaneous ?? current.miscellaneous,
        updated_at,
        month,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE budget
app.delete("/budgets/:month", async (req, res) => {
  try {
    const { month } = req.params;

    const exists = await db.query("SELECT * FROM budgets WHERE month = $1", [month]);
    if (exists.rows.length === 0)
      return res.status(404).json({ error: "Budget not found" });

    await db.query("DELETE FROM budgets WHERE month = $1", [month]);

    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------
   START SERVER AFTER DB IS READY
-------------------------------------------- */

initializeDatabase().then(() => {
  app.listen(4001, () => {
    console.log("🚀 Server running at http://localhost:4001");
  });
});