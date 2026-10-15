const express = require("express");

const BASE_URL = (process.env.FORTIRECON_BASE_URL || "https://api.fortirecon.forticloud.com").replace(/\/+$/, "");
const API_KEY = process.env.FORTIRECON_API_KEY;
const ORG_ID = process.env.FORTIRECON_ORG_ID;
const PORT = process.env.PORT || 3000;

if (!API_KEY || !ORG_ID) {
  console.error("FORTIRECON_API_KEY and FORTIRECON_ORG_ID must be set (see .env.example)");
  process.exit(1);
}

// Call a FortiRecon ACI endpoint and forward the caller's query string
// (e.g. page, size — FortiRecon defaults to 10 per page, max 500).
async function fortirecon(path, query) {
  const url = new URL(`${BASE_URL}/aci/${encodeURIComponent(ORG_ID)}${path}`);
  for (const [key, value] of Object.entries(query)) {
    for (const v of [].concat(value)) url.searchParams.append(key, v);
  }

  const res = await fetch(url, {
    headers: { Authorization: API_KEY, Accept: "application/json" },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }
  return { status: res.status, body };
}

function proxy(path) {
  return async (req, res) => {
    try {
      const { status, body } = await fortirecon(path, req.query);
      res.status(status).json(body);
    } catch (err) {
      res.status(502).json({ error: "Failed to reach FortiRecon", detail: err.message });
    }
  };
}

const app = express();

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Stealer infections lists
app.get("/stealer-infections/leaked", proxy("/stealers_infections/leaked"));
app.get("/stealer-infections/on-sale", proxy("/stealers_infections/on_sale"));

// Stealer infections stats
const STATS = {
  "leaked/count-by-affiliated-domain": "/stats/stealers_infections/leaked/count_by_affiliated_domain",
  "leaked/count-by-status": "/stats/stealers_infections/leaked/count_by_status",
  "leaked/count-by-stealer": "/stats/stealers_infections/leaked/count_by_stealer",
  "on-sale/count-by-matched-domain": "/stats/stealers_infections/on_sale/count_by_matched_domain",
  "on-sale/count-by-stealer": "/stats/stealers_infections/on_sale/count_by_stealer",
};
for (const [route, path] of Object.entries(STATS)) {
  app.get(`/stealer-infections/stats/${route}`, proxy(path));
}

app.listen(PORT, () => {
  console.log(`Stealer infections API listening on http://localhost:${PORT}`);
});
