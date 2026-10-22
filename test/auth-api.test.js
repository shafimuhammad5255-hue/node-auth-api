const assert = require("node:assert/strict");
const { once } = require("node:events");
const { after, before, test } = require("node:test");

process.env.MONGODB_URI ||= "mongodb://127.0.0.1:27017/node_auth_api_test";
process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters-long";

const app = require("../src/app");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("health endpoint reports API and database status", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.database, "disconnected");
});

test("signup rejects invalid input without accessing the database", async () => {
  const response = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
});

test("login rejects invalid input without accessing the database", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "not-an-email" }),
  });

  assert.equal(response.status, 400);
});

test("malformed JSON receives a client error", async () => {
  const response = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{invalid",
  });

  assert.equal(response.status, 400);
});

test("unknown routes return 404", async () => {
  const response = await fetch(`${baseUrl}/unknown`);

  assert.equal(response.status, 404);
});
