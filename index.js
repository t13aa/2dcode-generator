import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import QRCode from "qrcode";

const app = new Hono();

app.use("/*", serveStatic({ root: "./static" }));

app.post("/image", async (c) => {
  try {
    const { text } = await c.req.json();

    if (!text) {
      return c.json({ error: "text parameter is missing" }, 400);
    }

    const dataUrl = await QRCode.toDataURL(text);

    return c.json({ image: dataUrl });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  (info) => {
     console.log(`Listening on http://localhost:${info.port}`) 
  },
);
