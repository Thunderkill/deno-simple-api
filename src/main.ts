import { app } from "./app.ts";
import { db } from "./db.ts";

const HOST = "0.0.0.0";
const PORT = 7700;

if (import.meta.main) {
  console.log(`Listening on port: ${PORT}`);
  await app.listen(`${HOST}:${PORT}`);
}

await db.close();
