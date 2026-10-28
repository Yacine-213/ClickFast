require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3001;

// Connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configuration Prometheus
const register = new client.Registry();

client.collectDefaultMetrics({ register });

// Compteur des requêtes HTTP
const httpRequestsTotal = new client.Counter({
  name: "clickfast_http_requests_total",
  help: "Nombre total de requêtes HTTP reçues par ClickFast",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Durée des requêtes HTTP
const httpRequestDuration = new client.Histogram({
  name: "clickfast_http_request_duration_seconds",
  help: "Durée des requêtes HTTP en secondes",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

app.use(express.json());

// Mesurer les requêtes HTTP
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    if (req.path === "/metrics") return;

    const duration =
      Number(process.hrtime.bigint() - start) / 1e9;

    const route = req.route?.path
      ? `${req.baseUrl}${req.route.path}`
      : req.path;

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });

  next();
});

// Exposer les métriques Prometheus
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error("Erreur métriques :", error.message);
    res.status(500).end("Erreur lors de la collecte des métriques");
  }
});

// Vérifier l'API et PostgreSQL
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      service: "clickfast-scores-api",
      database: "connected",
    });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error.message);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// Enregistrer un score
app.post("/scores", async (req, res) => {
  const { player, score } = req.body;

  if (
    typeof player !== "string" ||
    player.trim() === "" ||
    player.trim().length > 100 ||
    !Number.isInteger(score) ||
    score < 0
  ) {
    return res.status(400).json({
      error:
        "Un joueur (100 caractères maximum) et un score entier positif sont requis.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO scores (player, score)
       VALUES ($1, $2)
       RETURNING id, player, score, created_at`,
      [player.trim(), score]
    );

    res.status(201).json({
      message: "Score enregistré",
      score: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error.message);

    res.status(500).json({
      error: "Impossible d'enregistrer le score.",
    });
  }
});

// Récupérer les scores
app.get("/scores", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, player, score, created_at
       FROM scores
       ORDER BY created_at DESC`
    );

    res.status(200).json({ scores: result.rows });
  } catch (error) {
    console.error("Erreur lors de la lecture :", error.message);

    res.status(500).json({
      error: "Impossible de lire les scores.",
    });
  }
});

// Démarrer le serveur si exécuté directement
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API ClickFast démarrée sur le port ${PORT}`);
  });
}

module.exports = { app, pool, register };
