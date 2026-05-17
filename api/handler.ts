import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Dynamically import the server handler
    const { default: handler } = await import("../dist/server/index.js");

    // Create request
    const url = new URL(
      `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host || "localhost"}${req.url}`,
    );

    const request = new Request(url.toString(), {
      method: req.method || "GET",
      headers: req.headers as HeadersInit,
      body:
        req.method && req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body || {})
          : undefined,
    });

    // Get response
    const response = await handler.fetch(request, {}, {});

    // Set status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send body
    res.send(await response.text());
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
