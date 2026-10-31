"use strict";

const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const ROOT = __dirname;
const START_PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8"
};

function notFoundPage() {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sidan hittades inte – Porto Drac</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:2rem;
         background:#fbf4ea; color:#3a2e26;
         font-family:Georgia, "Times New Roman", serif; text-align:center; }
  h1 { font-size:clamp(2rem,6vw,3.5rem); margin:0 0 .5rem; }
  p { font-family:system-ui, sans-serif; color:#6e5f52; margin:0 0 1.5rem; }
  a { display:inline-block; padding:.8rem 1.4rem; border-radius:999px;
      background:#b85c38; color:#fff8f0; text-decoration:none;
      font-family:system-ui, sans-serif; font-weight:600; }
</style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>Sidan finns inte. / Page not found.</p>
    <a href="/">Till startsidan / Back home</a>
  </main>
</body>
</html>`;
}

async function resolveFile(urlPath) {
  let relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  let filePath = path.resolve(ROOT, relative);

  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return { forbidden: true };
  }

  let stats;
  try {
    stats = await fsp.stat(filePath);
  } catch (error) {
    return { missing: true };
  }

  if (stats.isDirectory()) {
    filePath = path.join(filePath, "index.html");
    try {
      stats = await fsp.stat(filePath);
    } catch (error) {
      return { missing: true };
    }
  }

  return { filePath, stats };
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, "http://localhost");
    let pathname;
    try {
      pathname = decodeURIComponent(requestUrl.pathname);
    } catch (error) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }

    const resolved = await resolveFile(pathname);

    if (resolved.forbidden) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    if (resolved.missing) {
      response.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      });
      response.end(notFoundPage());
      return;
    }

    const extension = path.extname(resolved.filePath).toLowerCase();
    const mime = MIME_TYPES[extension] || "application/octet-stream";

    response.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": resolved.stats.size,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(resolved.filePath)
      .on("error", () => {
        if (!response.headersSent) {
          response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        }
        response.end("Kunde inte läsa filen. / Could not read the file.");
      })
      .pipe(response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end("Serverfel / Server error");
  }
});

let port = START_PORT;

function start() {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < START_PORT + 10) {
      port += 1;
      start();
      return;
    }
    console.error("Kunde inte starta servern:", error.message);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log("");
    console.log("  Porto Drac – Sant Elm, Mallorca");
    console.log("  Servern körs på: http://localhost:" + port);
    console.log("  Avsluta med Ctrl+C");
    console.log("");
  });
}

start();

process.on("SIGINT", () => {
  console.log("\nServern stoppas.");
  server.close(() => process.exit(0));
});
