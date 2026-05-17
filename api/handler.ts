import type { VercelRequest, VercelResponse } from "@vercel/node";

let handler: any;

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Load handler once
    if (!handler) {
      const module = await import("../dist/server/index.js");
      handler = module.default;
    }

    // Normalize headers (Vercel uses lowercase)
    const protocol = req.headers["x-forwarded-proto"] as string || "https";
    const host = req.headers.host as string || "localhost";
    const pathname = req.url || "/";
    
    const url = new URL(`${protocol}://${host}${pathname}`);

    // Build Request object with proper headers
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        headers[key] = value[0];
      } else if (value) {
        headers[key] = value;
      }
    }

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      if (req.body) {
        body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      }
    }

    const request = new Request(url.toString(), {
      method: req.method || "GET",
      headers,
      body,
    });

    // Call handler
    const response = await handler.fetch(request);

    // Return response
    res.status(response.status);
    
    // Copy headers
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    const text = await response.text();
    res.send(text);
  } catch (error: any) {
    console.error("Handler error:", error?.message || error);
    res.status(500).json({ error: "Internal server error", message: error?.message });
  }
};
