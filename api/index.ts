// Vercel Serverless Function Handler for TanStack Start SSR App
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Polyfill for fetch if needed
if (!global.fetch) {
  global.fetch = (url, options) => {
    return new Promise((resolve, reject) => {
      // This would need a proper polyfill implementation
      reject(new Error("Fetch not available"));
    });
  };
}

let serverHandler = null;

async function loadServerHandler() {
  if (serverHandler) return serverHandler;

  try {
    // Import the SSR handler
    const module = await import("../dist/server/index.js");
    serverHandler = module.default;
    return serverHandler;
  } catch (error) {
    console.error("Failed to load server handler:", error);
    throw error;
  }
}

export default async (req, res) => {
  try {
    const handler = await loadServerHandler();

    // Create a Request object compatible with the handler
    const url = new URL(`http://${req.headers.host}${req.url}`);
    const requestInit = {
      method: req.method,
      headers: req.headers,
    };

    // Only add body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      let body = "";
      for await (const chunk of req) {
        body += chunk.toString();
      }
      if (body) {
        requestInit.body = body;
      }
    }

    const request = new Request(url.toString(), requestInit);
    const response = await handler(request, {}, {});

    // Set response status and headers
    res.status(response.status);
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }

    // Send response body
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
