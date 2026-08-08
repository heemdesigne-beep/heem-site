const { Client } = require("pg");

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (!process.env.POSTGRES_URL) return send(res, 500, { error: "Database is not configured." });
  const client = new Client({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();

    if (req.method === "GET") {
      const result = await client.query(
        "SELECT id, name, role, message, rating, created_at FROM public.feedback WHERE approved = TRUE ORDER BY created_at DESC LIMIT 30"
      );
      return send(res, 200, { feedback: result.rows });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const name = clean(body.name, 40);
      const role = clean(body.role, 55);
      const message = clean(body.message, 400);
      const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));

      if (name.length < 2) return send(res, 400, { error: "Please add your name." });
      if (message.length < 10) return send(res, 400, { error: "Please write at least 10 characters." });

      const result = await client.query(
        "INSERT INTO public.feedback (name, role, message, rating, approved) VALUES ($1, $2, $3, $4, TRUE) RETURNING id, name, role, message, rating, created_at",
        [name, role || null, message, rating]
      );
      return send(res, 201, { feedback: result.rows[0] });
    }

    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error("feedback-api", error);
    return send(res, 500, { error: "Feedback service is temporarily unavailable." });
  } finally {
    try { await client.end(); } catch {}
  }
};