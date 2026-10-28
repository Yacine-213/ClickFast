const request = require("supertest");
const { app, pool } = require("../server");

describe("API ClickFast", () => {
  test("GET /health retourne le statut de l'API", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("clickfast-scores-api");
    expect(response.body.database).toBe("connected");
  });

  test("POST /scores refuse un score négatif", async () => {
    const response = await request(app)
      .post("/scores")
      .send({ player: "Test", score: -5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("POST /scores refuse un nom vide", async () => {
    const response = await request(app)
      .post("/scores")
      .send({ player: "   ", score: 10 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("POST /scores refuse un score non entier", async () => {
    const response = await request(app)
      .post("/scores")
      .send({ player: "Test", score: 10.5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("GET /scores retourne une liste de scores", async () => {
    const response = await request(app).get("/scores");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.scores)).toBe(true);
  });
});

afterAll(async () => {
  await pool.end();
});
