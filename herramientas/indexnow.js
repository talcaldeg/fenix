// Avisa a IndexNow (Bing, Yandex, Seznam, Naver) de las URL del sitemap. Bing alimenta además la
// búsqueda de ChatGPT y de Copilot, así que esto acelera también que las IA encuentren los libros.
//
// La clave vive en la raíz del dominio (repo talcaldeg.github.io, archivo 7bc93f64a82e1d05.txt):
// si ese archivo se borra, IndexNow rechaza los envíos.
//
// Uso (desde la carpeta fenix, después de publicar):
//   node herramientas/indexnow.js           solo las URL con lastmod de hoy
//   node herramientas/indexnow.js --todas   todo el sitemap
"use strict";
const fs = require("fs");
const path = require("path");

const HOST = "talcaldeg.github.io";
const CLAVE = "7bc93f64a82e1d05";
const sitemap = fs.readFileSync(path.join(__dirname, "..", "sitemap.xml"), "utf8");
const hoy = new Date().toISOString().slice(0, 10);
const todas = process.argv.includes("--todas");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
  .filter(m => todas || m[2] === hoy).map(m => m[1]);
if (!urls.length){ console.log("Nada que enviar (ninguna URL con lastmod de hoy; use --todas para todo)."); process.exit(0); }

(async () => {
  for (let intento = 1; intento <= 3; intento++){
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: CLAVE, keyLocation: `https://${HOST}/${CLAVE}.txt`, urlList: urls })
    });
    console.log(`IndexNow: ${urls.length} URL, HTTP ${r.status}`);
    if (r.status === 200 || r.status === 202) return;
    if (r.status < 500 && r.status !== 429){ console.error(await r.text()); process.exit(1); }
    await new Promise(ok => setTimeout(ok, 5000 * intento));
  }
  process.exit(1);
})();
