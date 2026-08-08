function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

function config() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  return { url, key };
}

module.exports = async function handler(req, res) {
  const { url, key } = config();
  if (!url || !key) return send(res, 500, { error: "Database is not configured." });

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/feedback`;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };

  try {
    if (req.method === "GET") {
      const response = await fetch(`${endpoint}?select=id,name,role,message,rating,created_at&approved=eq.true&order=created_at.desc&limit=30`, {
        headers,
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`Supabase GET ${response.status}: ${await response.text()}`);
      const rows = await response.json();
      return send(res, 200, { feedback: rows });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const name = clean(body.name, 40);
      const role = clean(body.role, 55);
      const message = clean(body.message, 400);
      const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));

      if (name.length < 2) return send(res, 400, { error: "Please add your name." });
      if (message.length < 10) return send(res, 400, { error: "Please write at least 10 characters." });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ name, role: role || null, message, rating, approved: true })
      });
      if (!response.ok) throw new Error(`Supabase POST ${response.status}: ${await response.text()}`);
      const rows = await response.json();
      return send(res, 201, { feedback: rows[0] });
    }

    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error("feedback-api", error);
    return send(res, 500, { error: "Feedback service is temporarily unavailable." });
  }
};