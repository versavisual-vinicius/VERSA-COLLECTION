import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');

// Carrega os handlers compilados de dist-server
let handlers = null;
async function loadHandlers() {
  if (handlers) return handlers;
  const [
    collectionsIndex,
    collectionSlug,
    collectionSession,
    exportRequests,
    adminCollections,
    adminExportRequests,
    adminMigrate,
    collectionFavorites,
    adminMetrics,
    photos,
    dbLib,
  ] = await Promise.all([
    import('./dist-server/api/collections/index.js'),
    import('./dist-server/api/collections/[slug].js'),
    import('./dist-server/api/collections/[slug]/session.js'),
    import('./dist-server/api/export-requests.js'),
    import('./dist-server/api/admin/collections.js'),
    import('./dist-server/api/admin/export-requests.js'),
    import('./dist-server/api/admin/migrate-local.js'),
    import('./dist-server/api/collections/[slug]/favorites.js').catch(() => ({ default: null })),
    import('./dist-server/api/admin/metrics.js').catch(() => ({ default: null })),
    import('./dist-server/api/photos.js').catch(() => ({ default: null })),
    import('./dist-server/api/_lib/db.js'),
  ]);

  handlers = {
    collectionsIndex: collectionsIndex.default,
    collectionSlug: collectionSlug.default,
    collectionSession: collectionSession.default,
    exportRequests: exportRequests.default,
    adminCollections: adminCollections.default,
    adminExportRequests: adminExportRequests.default,
    adminMigrate: adminMigrate.default,
    collectionFavorites: collectionFavorites.default,
    adminMetrics: adminMetrics?.default,
    photos: photos?.default,
    closeDbPool: dbLib.closeDbPool,
  };
  return handlers;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.googleusercontent.com https://drive.google.com https://*.google.com https://images.unsplash.com https://api.qrserver.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
};

function nodeReqToWebRequest(req, fullUrl) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  const isBodyAllowed = !['GET', 'HEAD'].includes(req.method);
  return new Request(fullUrl, {
    method: req.method,
    headers,
    body: isBodyAllowed ? req : undefined,
    duplex: isBodyAllowed ? 'half' : undefined,
  });
}

async function sendWebResponse(webRes, res) {
  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      const cookies = webRes.headers.getSetCookie ? webRes.headers.getSetCookie() : [value];
      res.setHeader('Set-Cookie', cookies);
    } else {
      res.setHeader(key, value);
    }
  });

  if (webRes.body) {
    const reader = webRes.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      res.end();
    }
  } else {
    res.end();
  }
}

function serveStaticFile(filePath, req, res) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      serveIndexHtml(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isAsset = filePath.includes(`${path.sep}assets${path.sep}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.setHeader(k, v);
    }
    if (isAsset) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

function serveIndexHtml(res) {
  const indexPath = path.join(DIST_DIR, 'index.html');
  fs.stat(indexPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('404 Not Found - Build de frontend ausente em dist/');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      res.setHeader(k, v);
    }
    fs.createReadStream(indexPath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const fullUrl = new URL(req.url, `${proto}://${host}`);
  const pathname = fullUrl.pathname;

  // Health check endpoint para Cloud Run
  if (pathname === '/healthz' || pathname === '/_health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('OK');
    return;
  }

  // Roteamento de API
  if (pathname.startsWith('/api/')) {
    try {
      const h = await loadHandlers();
      const webReq = nodeReqToWebRequest(req, fullUrl.toString());

      if (pathname === '/api/collections') {
        const webRes = await h.collectionsIndex(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      const sessionMatch = pathname.match(/^\/api\/collections\/([^/]+)\/session$/);
      if (sessionMatch) {
        const webRes = await h.collectionSession(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      const favoritesMatch = pathname.match(/^\/api\/collections\/([^/]+)\/favorites(?:\/.*)?$/);
      if (favoritesMatch && h.collectionFavorites) {
        const webRes = await h.collectionFavorites(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      const collectionMatch = pathname.match(/^\/api\/collections\/([^/]+)$/);
      if (collectionMatch) {
        const webRes = await h.collectionSlug(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      if (pathname === '/api/export-requests') {
        const webRes = await h.exportRequests(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      if (pathname === '/api/admin/collections') {
        const webRes = await h.adminCollections(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      if (pathname === '/api/admin/export-requests') {
        const webRes = await h.adminExportRequests(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      if (pathname === '/api/admin/metrics' && h.adminMetrics) {
        const webRes = await h.adminMetrics(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      if (pathname === '/api/photos' && h.photos) {
        const webRes = await h.photos(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      if (pathname === '/api/admin/migrate-local') {
        const webRes = await h.adminMigrate(webReq);
        await sendWebResponse(webRes, res);
        return;
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Endpoint não encontrado.' } }));
      return;
    } catch (err) {
      console.error('API Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno no servidor.' } }));
      return;
    }
  }

  // Arquivos estáticos e SPA fallback
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidatePath = path.join(DIST_DIR, safePath);

  if (pathname !== '/' && fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
    serveStaticFile(candidatePath, req, res);
  } else {
    serveIndexHtml(res);
  }
});

const PORT = parseInt(process.env.PORT || '8080', 10);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Versa Collection Cloud Run Server rodando na porta ${PORT}`);
});

// Encerramento gracioso
const shutdown = async (signal) => {
  console.log(`Recebido sinal ${signal}. Encerrando servidor graciosamente...`);
  server.close(async () => {
    try {
      if (handlers?.closeDbPool) {
        await handlers.closeDbPool();
      }
      console.log('Pool do banco encerrado. Finalizando processo.');
      process.exit(0);
    } catch (e) {
      console.error('Erro ao fechar pool:', e);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Timeout de encerramento excedido. Forçando shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

