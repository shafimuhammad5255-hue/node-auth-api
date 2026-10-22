const app = require("./app");
const connectDatabase = require("./config/database");
const { port } = require("./config/env");

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Auth API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the API:", error);
  process.exitCode = 1;
});
