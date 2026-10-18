// Páginas estáticas para buscadores e IA, a partir de datos.js.
//
// El sitio (index.html) arma todo con JavaScript y navega por #hash: Google no indexa un #hash
// como página aparte, y los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot) no ejecutan
// JavaScript, así que sin esto solo verían la portada vacía. Este script deja:
//   - libro/<id>/index.html: una página por libro, en el idioma del libro, con resumen, citas,
//     descargas, valoración moral, parecidos y datos estructurados (schema.org Book).
//   - sitemap.xml: la portada y cada libro; lastmod cambia solo si la página cambió.
//   - llms.txt: el catálogo en texto plano para los sistemas de IA (llmstxt.org).
//   - index.html: el bloque JSON-LD entre las marcas JSONLD:inicio y JSONLD:fin.
//
// Uso (desde la carpeta fenix):  node herramientas/gen_estaticos.js
// Se corre después de cambiar datos.js. Es idempotente: sin cambios en datos.js no cambia nada.
"use strict";
const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const SITIO = "https://talcaldeg.github.io/fenix/";
const leer = f => fs.readFileSync(path.join(RAIZ, f), "utf8");
const escribirSiCambia = (f, txt) => {
  const ruta = path.join(RAIZ, f);
  const antes = fs.existsSync(ruta) ? fs.readFileSync(ruta, "utf8") : null;
  if (antes === txt) return false;
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  fs.writeFileSync(ruta, txt, "utf8");
  return true;
};

global.window = {};
eval(leer("datos.js"));
const D = window.FENIX;
const INDEX = leer("index.html");

// Lo que ya vive en index.html se toma de ahí, para no tener dos copias: favicon y escala de Delibris.
const FAVICON = INDEX.match(/<link rel="icon"[^>]*>/)[0];
const ESCALA_DELIBRIS = eval("(" + INDEX.match(/const ESCALA_DELIBRIS = (\{[\s\S]*?\n  \});/)[1] + ")");

const TX = {
  es: {
    cat: { lectura: "Lectura espiritual", oracion: "Oración", novela: "Novelas", teatro: "Teatro", poesia: "Poesía", ensayo: "Ensayo e historia" },
    biblioteca: "Biblioteca gratuita", verTodo: "Ver toda la biblioteca", abrir: "Abrir en la biblioteca",
    descargar: "Descargar", enLinea: "Leer en línea", comprar: "Comprar",
    ayuda: "¿Cuál elegir? El PDF se abre en cualquier celular o computador. El EPUB es para aplicaciones de lectura (Google Play Libros, Apple Libros, Kindle o Kobo) y deja agrandar la letra.",
    resumen: "Resumen", citas: "Citas", moral: "Valoración moral", sinDelibris: "Sin valoración en Delibris",
    moralNota: "Tomada de delibris.org, un sitio de reseñas (no es un juicio oficial de la Iglesia): de 1 a 6 círculos; 6 es «Sin inconvenientes».",
    verEn: "Ver en delibris.org", parecidos: "Libros parecidos", fuente: "Fuente", portada: "Portada", dominio: "dominio público, Wikimedia Commons",
    pie: "Proyecto Fénix · Solo publicamos obras de dominio público o con permiso de difusión; las demás se enlazan a donde se pueden leer en línea o comprar.",
    de: "de", tema: "Cambiar a modo claro u oscuro", edFenix: "Edición Fénix"
  },
  en: {
    cat: { lectura: "Spiritual reading", oracion: "Prayer", novela: "Novels", teatro: "Drama", poesia: "Poetry", ensayo: "Essays and history" },
    biblioteca: "Free library", verTodo: "See the whole library", abrir: "Open in the library",
    descargar: "Download", enLinea: "Read online", comprar: "Buy",
    ayuda: "Which one? The PDF opens on any phone or computer. The EPUB is for reading apps (Google Play Books, Apple Books, Kindle or Kobo) and lets you enlarge the text.",
    resumen: "Summary", citas: "Quotes", moral: "Moral rating", sinDelibris: "Not rated by Delibris",
    moralNota: "Taken from delibris.org, a review site (not an official judgement of the Church): from 1 to 6 circles; 6 means «No drawbacks».",
    verEn: "See on delibris.org", parecidos: "Similar books", fuente: "Source", portada: "Cover", dominio: "public domain, Wikimedia Commons",
    pie: "Proyecto Fénix · We only publish public-domain works or works with permission to share; others link to where they can be read online or bought.",
    de: "of", tema: "Switch between light and dark mode", edFenix: "Fénix edition"
  }
};

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = src => /^https?:/.test(src) ? src : SITIO + src;
const porId = id => D.libros.find(l => l.id === id);
const primeraOracion = r => (String(r || "").match(/^.+?\.(?=\s|$)/) || [r || ""])[0];
const recortar = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…";
const urlLibro = l => SITIO + "libro/" + l.id + "/";
// Mismo criterio que index.html: cada idioma muestra solo lo suyo.
const externosEn = (l, lang) => (l.externos || []).filter(e => (e.idioma || l.idioma) === lang);
const visibleEn = (l, lang) => l.idioma === lang || externosEn(l, lang).length > 0;
const textoDelibris = (d, lang) => { const e = ESCALA_DELIBRIS[d.genero] || ESCALA_DELIBRIS.Literatura; return (e[lang] || e.es)[d.valor - 1]; };

const ESTILO = `
  :root{color-scheme:light dark; --bg:#faf6ef; --card:#fffdf8; --line:#e4d8c4; --ink:#2a1f1a; --muted:#6e5d50; --vino:#6b1d24; --oro:#8a5d14; --acento:#6b1d24; --acento-ink:#fff8ec; --chip:#efe4d2}
  @media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#16110f; --card:#231b17; --line:#3a2e27; --ink:#f2e9dc; --muted:#bfae9c; --vino:#d26a72; --oro:#e8b04a; --acento:#e8b04a; --acento-ink:#1d1206; --chip:#2e241e}}
  :root[data-theme="dark"]{--bg:#16110f; --card:#231b17; --line:#3a2e27; --ink:#f2e9dc; --muted:#bfae9c; --vino:#d26a72; --oro:#e8b04a; --acento:#e8b04a; --acento-ink:#1d1206; --chip:#2e241e}
  *{box-sizing:border-box}
  body{margin:0; background:var(--bg); color:var(--ink); font:17px/1.65 Georgia,"Iowan Old Style","Palatino Linotype",serif}
  a{color:var(--vino)}
  .wrap{max-width:860px; margin:0 auto; padding:0 16px}
  header{border-bottom:1px solid var(--line)}
  .barra{display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:60px}
  .marca{color:var(--ink); text-decoration:none; font-weight:700; font-size:19px}
  .pildora{border:1px solid var(--line); background:var(--card); color:var(--ink); border-radius:999px; min-height:40px; padding:6px 14px; font:600 15px system-ui,sans-serif; cursor:pointer}
  main{padding:28px 0 48px}
  .ficha{display:grid; grid-template-columns:220px 1fr; gap:28px}
  @media (max-width:640px){.ficha{grid-template-columns:1fr; gap:16px} .ficha img{max-width:130px}}
  .ficha img{width:100%; aspect-ratio:2/3; object-fit:cover; border-radius:10px; background:var(--chip)}
  h1{font-size:clamp(28px,5vw,38px); line-height:1.15; margin:0 0 8px}
  h2{font-size:20px; margin:28px 0 8px}
  .meta{font:15px/1.5 system-ui,sans-serif; color:var(--muted); margin:0 0 14px}
  .botones{display:flex; flex-wrap:wrap; gap:10px; margin:18px 0 8px}
  .btn{display:inline-flex; align-items:center; min-height:46px; padding:10px 18px; border-radius:10px; font:600 16px system-ui,sans-serif; text-decoration:none; border:1px solid var(--line); background:var(--card); color:var(--ink)}
  .btn.prim{background:var(--acento); color:var(--acento-ink); border-color:transparent}
  .ayuda{font:15px/1.5 system-ui,sans-serif; color:var(--muted); background:var(--chip); border-radius:10px; padding:10px 14px; margin:8px 0 0}
  blockquote{margin:0 0 14px; padding:2px 0 2px 16px; border-left:3px solid var(--oro); font-style:italic}
  .circ{display:inline-flex; gap:4px; vertical-align:middle; margin-right:8px}
  .circ i{width:12px; height:12px; border-radius:50%; border:1px solid var(--muted); opacity:.45}
  .circ i.on{background:var(--oro); border-color:var(--oro); opacity:1}
  ul.parecidos{padding-left:20px}
  ul.parecidos li{margin:4px 0}
  footer{border-top:1px solid var(--line); padding:22px 0 30px; color:var(--muted); font:14px/1.5 system-ui,sans-serif}`;

const SCRIPT_TEMA = `<script>
(function(){var r=document.documentElement,k="fenix:tema";try{var g=JSON.parse(localStorage.getItem(k));if(g)r.dataset.theme=g}catch(e){}
document.getElementById("btnTema").onclick=function(){var o=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.dataset.theme=o?"light":"dark";try{localStorage.setItem(k,JSON.stringify(r.dataset.theme))}catch(e){}};})();
</script>`;

function paginaLibro(l){
  const lang = l.idioma, x = TX[lang];
  const resumen = l.resumen[lang] || l.resumen.es;
  const descripcion = recortar(resumen, 158);
  const titulo = `${l.titulo} - ${l.autor} | Proyecto Fénix`;
  const img = l.imagen ? abs(l.imagen.src) : SITIO + "img/compartir.jpg";
  const inicio = "../../" + (lang === "en" ? "?l=en" : "");
  const botones = [
    ...Object.entries(l.idioma === lang ? (l.archivos || {}) : {}).map(([f, u]) => `<a class="btn prim" href="../../${esc(u)}" download>${esc(x.descargar)} ${f.toUpperCase()}</a>`),
    ...externosEn(l, lang).map(e => `<a class="btn prim" href="${esc(e.url)}" rel="noopener">${e.formato === "web" ? esc(x.enLinea) : esc(x.descargar) + " " + esc(e.formato.toUpperCase())} · ${esc(e.texto)}</a>`),
    ...(l.idioma === lang ? (l.comprar || []) : []).map(c => `<a class="btn" href="${esc(c.url)}" rel="noopener">${esc(x.comprar)} · ${esc(c.texto)}</a>`)
  ];
  const tieneArchivos = Object.keys(l.archivos || {}).length > 0;
  const parecidos = (l.parecidos || []).map(porId).filter(p => p && visibleEn(p, lang));
  const d = l.delibris;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": urlLibro(l) + "#libro",
        name: l.titulo,
        author: { "@type": "Person", name: l.autor },
        inLanguage: lang,
        datePublished: String(l.anio),
        genre: x.cat[l.categoria],
        description: resumen,
        image: img,
        url: urlLibro(l),
        isAccessibleForFree: botones.length > 0 && !(l.comprar || []).length,
        ...(tieneArchivos ? { workExample: Object.entries(l.archivos).map(([f, u]) => ({ "@type": "Book", bookFormat: "https://schema.org/EBook", encodingFormat: f === "pdf" ? "application/pdf" : "application/epub+zip", url: SITIO + u })) } : {}),
        isPartOf: { "@id": SITIO + "#sitio" }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Proyecto Fénix", item: SITIO },
          { "@type": "ListItem", position: 2, name: l.titulo, item: urlLibro(l) }
        ]
      }
    ]
  };
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
${FAVICON}
<meta name="description" content="${esc(descripcion)}">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${urlLibro(l)}">
<meta property="og:type" content="book">
<meta property="og:site_name" content="Proyecto Fénix">
<meta property="og:title" content="${esc(l.titulo + " - " + l.autor)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${urlLibro(l)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:locale" content="${lang === "en" ? "en_US" : "es_CL"}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(l.titulo + " - " + l.autor)}">
<meta name="twitter:description" content="${esc(descripcion)}">
<meta name="twitter:image" content="${esc(img)}">
<!-- Generada por herramientas/gen_estaticos.js desde datos.js. No editar a mano. -->
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
<style>${ESTILO}
</style>
</head>
<body>
<header><div class="wrap barra"><a class="marca" href="${inicio}">Proyecto Fénix</a><button class="pildora" id="btnTema" type="button" aria-label="${esc(x.tema)}" title="${esc(x.tema)}">◐</button></div></header>
<main class="wrap">
  <div class="ficha">
    <div>${l.imagen ? `<img src="${esc(l.imagen.src.startsWith("http") ? l.imagen.src : "../../" + l.imagen.src)}" alt="${esc(l.imagen.credito[lang] || l.imagen.credito.es)}" width="400" height="600">` : ""}</div>
    <div>
      <h1>${esc(l.titulo)}</h1>
      <p class="meta">${esc(l.autor)} · ${esc(l.anio)} · ${esc(x.cat[l.categoria])}</p>
      <div class="botones">${botones.join("\n        ")}</div>
      ${tieneArchivos && l.idioma === lang ? `<p class="ayuda">${esc(x.ayuda)}</p>` : ""}
      <h2>${esc(x.resumen)}</h2>
      <p>${esc(resumen)}</p>
      ${l.editorial ? `<h2>${esc(x.edFenix)}</h2>\n      <p>${esc(l.editorial[lang] || l.editorial.es)}</p>` : ""}
      ${(l.citas || []).length ? `<h2>${esc(x.citas)}</h2>\n      ${l.citas.map(c => `<blockquote>${esc(c)}</blockquote>`).join("\n      ")}` : ""}
      <h2>${esc(x.moral)}</h2>
      ${d ? `<p><span class="circ" aria-hidden="true">${[1, 2, 3, 4, 5, 6].map(n => `<i class="${n <= d.valor ? "on" : ""}"></i>`).join("")}</span><strong>${d.valor} ${esc(x.de)} 6</strong>: ${esc(textoDelibris(d, lang))}. <a href="${esc(d.url)}" rel="noopener">${esc(x.verEn)}</a></p>` : `<p>${esc(x.sinDelibris)}</p>`}
      <p class="meta">${esc(x.moralNota)}</p>
      ${parecidos.length ? `<h2>${esc(x.parecidos)}</h2>\n      <ul class="parecidos">${parecidos.map(p => `<li><a href="../${esc(p.id)}/">${esc(p.titulo)}</a> · ${esc(p.autor)}</li>`).join("")}</ul>` : ""}
      <div class="botones"><a class="btn" href="${inicio}#libro/${esc(l.id)}">${esc(x.abrir)}</a><a class="btn" href="${inicio}#biblioteca">${esc(x.verTodo)}</a></div>
      ${l.fuente ? `<p class="meta">${esc(x.fuente)}: <a href="${esc(l.fuente.url)}" rel="noopener">${esc(l.fuente.texto)}</a></p>` : ""}
      ${l.imagen ? `<p class="meta">${esc(x.portada)}: <a href="${esc(l.imagen.url)}" rel="noopener">${esc(l.imagen.credito[lang] || l.imagen.credito.es)}</a> (${esc(l.imagen.aviso ? (l.imagen.aviso[lang] || l.imagen.aviso.es) : x.dominio)})</p>` : ""}
    </div>
  </div>
</main>
<footer><div class="wrap">${esc(x.pie)}</div></footer>
${SCRIPT_TEMA}
</body>
</html>
`;
}

// ---------- páginas de libro ----------
const cambiadas = new Set();
for (const l of D.libros) if (escribirSiCambia(`libro/${l.id}/index.html`, paginaLibro(l))) cambiadas.add(urlLibro(l));
// Libros que salieron del catálogo: se borra su página.
const ids = new Set(D.libros.map(l => l.id));
const dirLibro = path.join(RAIZ, "libro");
for (const d of fs.readdirSync(dirLibro)) if (!ids.has(d)) { fs.rmSync(path.join(dirLibro, d), { recursive: true }); console.log("borrada libro/" + d); }

// ---------- JSON-LD de la portada ----------
const ldInicio = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": SITIO + "#sitio",
      url: SITIO,
      name: "Proyecto Fénix",
      description: "Biblioteca gratuita de clásicos: filosofía, lectura espiritual, oración y novelas para descargar en EPUB y PDF, con resumen, citas y valoración moral.",
      inLanguage: ["es", "en"],
      author: { "@type": "Person", name: "Tomás Alcalde", url: "https://talcaldeg.github.io/" }
    },
    {
      "@type": "CollectionPage",
      "@id": SITIO + "#catalogo",
      url: SITIO,
      name: "Proyecto Fénix · Biblioteca gratuita",
      isPartOf: { "@id": SITIO + "#sitio" },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: D.libros.length,
        itemListElement: D.libros.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: urlLibro(l), name: l.titulo }))
      }
    }
  ]
};
const bloque = `<!-- JSONLD:inicio - lo genera herramientas/gen_estaticos.js desde datos.js; no editar a mano -->
<script type="application/ld+json">
${JSON.stringify(ldInicio, null, 2)}
</script>
<!-- JSONLD:fin -->`;
const indexNuevo = INDEX.replace(/<!-- JSONLD:inicio[\s\S]*?<!-- JSONLD:fin -->/, bloque);
if (indexNuevo === INDEX && !INDEX.includes("<!-- JSONLD:inicio")) throw new Error("index.html no tiene las marcas JSONLD:inicio y JSONLD:fin");
if (escribirSiCambia("index.html", indexNuevo)) cambiadas.add(SITIO);

// ---------- sitemap.xml ----------
const hoy = new Date().toISOString().slice(0, 10);
const previo = fs.existsSync(path.join(RAIZ, "sitemap.xml")) ? leer("sitemap.xml") : "";
const lastmodPrevio = {};
for (const m of previo.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) lastmodPrevio[m[1]] = m[2];
const urls = [SITIO, ...D.libros.map(urlLibro)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${cambiadas.has(u) || !lastmodPrevio[u] ? hoy : lastmodPrevio[u]}</lastmod>
  </url>`).join("\n")}
</urlset>
`;
escribirSiCambia("sitemap.xml", sitemap);

// ---------- llms.txt ----------
const ORDEN = ["lectura", "oracion", "novela", "teatro", "poesia", "ensayo"];
const linea = l => `- [${l.titulo} - ${l.autor} (${l.anio})](${urlLibro(l)}) - ${primeraOracion(l.resumen[l.idioma] || l.resumen.es)}${Object.keys(l.archivos || {}).length ? " Descarga gratuita en " + Object.keys(l.archivos).map(f => f.toUpperCase()).join(" y ") + "." : (l.externos || []).length ? " Se lee gratis en el sitio del titular." : " Protegido por derechos de autor: se enlaza a donde comprarlo."}`;
const llms = `# Proyecto Fénix

> Biblioteca gratuita en español e inglés de clásicos de filosofía, lectura espiritual, oración y novelas, para descargar en EPUB y PDF o leer en línea. Cada libro trae resumen, citas escogidas, libros parecidos y la valoración moral de delibris.org. Sin publicidad ni registro.

Fénix nació para dar a conocer una idea de la teología espiritual: ser para Cristo «como otra humanidad». Santa Isabel de la Trinidad pidió en 1904 al Espíritu Santo ser para Cristo «una humanidad de añadidura» en la que Él renueve todo Su misterio, y el jesuita Paul de Jaegher la hizo oración al final de «One with Jesus». No se trata de una nueva encarnación: es la vida de la gracia, que nos une a Cristo como miembros de Su Cuerpo (Catecismo, nn. 521 y 1997).

Algunos libros son ediciones propias de Proyecto Fénix (traducción, revisión o edición digital); su página dice qué se hizo.

Solo se alojan obras de dominio público o con permiso de difusión; las protegidas se enlazan a donde se pueden leer en línea o comprar. Cada libro tiene su propia página, en el idioma del libro.

${ORDEN.map(c => { const xs = D.libros.filter(l => l.categoria === c); return xs.length ? `## ${TX.es.cat[c]}\n\n${xs.map(linea).join("\n")}\n` : ""; }).filter(Boolean).join("\n")}
## Sitio

- [Portada y buscador del catálogo](${SITIO}) - biblioteca completa con filtros por categoría y formato, plan de vida (libros para la oración y la lectura espiritual de cada día), oraciones y formularios para proponer un libro o avisar un error.
- [Mapa del sitio](${SITIO}sitemap.xml)
`;
escribirSiCambia("llms.txt", llms);

console.log(`${D.libros.length} libros; páginas cambiadas: ${cambiadas.size}`);
