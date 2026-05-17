import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

let handler: any;

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const pathname = req.url || "/";

    // Serve static assets from dist/client
    if (pathname.startsWith("/assets/")) {
      const filePath = path.join(process.cwd(), "dist/client", pathname);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        
        // Set correct content type
        if (pathname.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (pathname.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        } else if (pathname.endsWith(".svg")) {
          res.setHeader("Content-Type", "image/svg+xml");
        } else if (pathname.endsWith(".png")) {
          res.setHeader("Content-Type", "image/png");
        } else if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
          res.setHeader("Content-Type", "image/jpeg");
        }
        
        res.setHeader("Cache-Control", "public, max-age=31536000");
        return res.send(content);
      }
      return res.status(404).send("Not found");
    }

    // Load SSR handler once
    if (!handler) {
      const module = await import("../dist/server/index.js");
      handler = module.default;
    }

    // Normalize headers
    const protocol = req.headers["x-forwarded-proto"] as string || "https";
    const host = req.headers.host as string || "localhost";
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

    // Call SSR handler
    const response = await handler.fetch(request);

    // Return response
    res.status(response.status);
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
