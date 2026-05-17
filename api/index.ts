import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedHandler: any = null;

async function getHandler() {
  if (cachedHandler) {
    return cachedHandler;
  }

  try {
    // Dynamically import the server worker
    const serverModule = await import("../dist/server/index.js");
    cachedHandler = serverModule.default;
    return cachedHandler;
  } catch (err) {
    console.error("Failed to load server module:", err);
    throw err;
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const handler = await getHandler();

    // Build the URL
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || "localhost";
    const url = `${protocol}://${host}${req.url}`;

    // Create the request object
    const request = new Request(url, {
      method: req.method || "GET",
      headers: req.headers as any,
      ...(req.method && req.method !== "GET" && req.method !== "HEAD" && req.body
        ? { body: JSON.stringify(req.body) }
        : {}),
    });

    // Call the handler - it should have a fetch method
    const response = await handler.fetch(request, {}, {});

    // Send the response
    res.status(response.status);

    // Copy response headers
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // Send body
    const text = await response.text();
    res.send(text);
  } catch (error: any) {
    console.error("Request failed:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error?.message,
    });
  }
};
