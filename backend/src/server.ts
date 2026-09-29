import { PORT } from "./config/constants";
import { pool } from "./config/db";
import { createApp } from "./app";

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

const shutdown = () => {
  server.close(() => pool.end().finally(() => process.exit(0)));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
