// Service worker de Fénix: deja el sitio instalable como app en el celular y legible sin señal.
//
// - Páginas, datos.js y demás texto: primero la red (así nadie se queda con una ficha vieja); si no
//   hay señal o tarda más de 4 s, lo guardado de la última visita.
// - Imágenes: lo guardado al tiro y se refresca por detrás.
// - libros/ (EPUB y PDF) no se guarda: se descarga al teléfono, y duplicarlo llenaría la memoria.
// - Lo de otros sitios (Open Library, GoatCounter, Delibris) pasa directo.
// VERSION la reescribe herramientas/gen_estaticos.js cuando cambian index.html o datos.js: el
// navegador ve un sw.js distinto, instala el nuevo y este borra las cachés viejas.
const VERSION = "fenix-df12c2963a";
const BASICO = ["./", "datos.js", "manifest.webmanifest", "img/favicon.svg", "img/icono-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASICO)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("fenix-") && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const SIN_SENAL = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark"><title>Proyecto Fénix · Sin conexión</title>
<style>:root{color-scheme:light dark}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:16px;background:#faf6ef;color:#2a1f1a;font:17px/1.6 Georgia,serif;text-align:center}
@media (prefers-color-scheme:dark){body{background:#16110f;color:#f2e9dc}}a{color:#e8b04a}</style>
<main><h1>Sin conexión</h1><p>Esta página todavía no está guardada en tu teléfono. Lo que ya abriste antes se puede leer sin señal.</p>
<p lang="en">You're offline. Pages you opened before can still be read.</p><p><a href="./">Volver a la biblioteca · Back to the library</a></p></main></html>`;

// Respuesta de la red con plazo; si falla o tarda, lo guardado. Lo bueno de la red se guarda.
async function redPrimero(req, cache){
  const guardado = cache.match(req, { ignoreSearch: req.mode === "navigate" && new URL(req.url).pathname.endsWith("/") });
  const red = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; });
  const plazo = new Promise(ok => setTimeout(ok, 4000)).then(() => guardado);
  try {
    const r = await Promise.race([red, plazo]);
    if (r) return r;
    return await red;
  } catch (err) {
    const g = await guardado;
    if (g) return g;
    if (req.mode === "navigate") return new Response(SIN_SENAL, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    throw err;
  }
}

async function guardadoPrimero(req, cache){
  const g = await cache.match(req);
  const red = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => g);
  return g || red;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  const raiz = new URL("./", self.registration.scope);
  if (url.origin !== raiz.origin || !url.pathname.startsWith(raiz.pathname)) return;
  const ruta = url.pathname.slice(raiz.pathname.length);
  if (ruta.startsWith("libros/") || ruta === "sw.js") return;
  e.respondWith(caches.open(VERSION).then(c => ruta.startsWith("img/") ? guardadoPrimero(req, c) : redPrimero(req, c)));
});
