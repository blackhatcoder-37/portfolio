import type { VercelRequest, VercelResponse } from "@vercel/node";

let cachedHandler: any = null;

async function getHandler() {
  if (cachedHandler) {
    return cachedHandler;
  }

  try {
    // Import the server module
    const serverModule = await import("../dist/server/index.js");
    
    // The module exports the handler as default
    cachedHandler = serverModule.default;
    
    if (!cachedHandler) {
      throw new Error("No default export found in server module");
    }
    
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
    const pathname = req.url || "/";
    const url = `${protocol}://${host}${pathname}`;

    console.log(`[${req.method}] ${url}`);

    // Build headers object
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") {
        headers.set(key, value);
      }
    }

    // Create the request
    let body: any = undefined;
    if (req.method && req.method !== "GET" && req.method !== "HEAD") {
      if (req.body) {
        body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      }
    }

    const request = new Request(url, {
      method: req.method || "GET",
      headers,
      ...(body ? { body } : {}),
    });

    // Call the handler with fetch method
    let response: Response;
    
    if (typeof handler === "function" && handler.fetch) {
      // Handler has a fetch method (like Cloudflare Worker)
      response = await handler.fetch(request, {}, {});
    } else if (typeof handler === "function") {
      // Handler is a function, call it directly
      response = await handler(request, {}, {});
    } else {
      throw new Error(`Handler is not a function: ${typeof handler}`);
    }

    // Send the response
    res.status(response.status);

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send body
    const text = await response.text();
    res.send(text);
  } catch (error: any) {
    console.error("Request failed:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error?.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    });
  }
};
