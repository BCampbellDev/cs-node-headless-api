import { createServer } from "./server.js";

const app = createServer();

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`Node API running on http://localhost:${port}`);
});
