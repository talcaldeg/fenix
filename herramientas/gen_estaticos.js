// Páginas estáticas para buscadores e IA, a partir de datos.js.
//
// El sitio (index.html) arma todo con JavaScript y navega por #hash: Google no indexa un #hash
// como página aparte, y los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot) no ejecutan
// JavaScript, así que sin esto solo verían la portada vacía. Este script deja:
//   - libro/<id>/index.html: una página por libro, en el idioma del libro, con por qué leerlo, resumen, citas,
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
  // git en Windows puede dejar el archivo con CRLF: se compara sin \r para no marcar cambios falsos.
  const antes = fs.existsSync(ruta) ? fs.readFileSync(ruta, "utf8").replace(/\r\n/g, "\n") : null;
  if (antes === txt) return false;
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  fs.writeFileSync(ruta, txt, "utf8");
  return true;
};

global.window = {};
eval(leer("datos.js"));
const D = window.FENIX;

// Regla dura: una obra, una ficha. Si hay un posible duplicado, no se genera nada.
const { revisarDuplicados } = require("./revisar_duplicados.js");
const duplicados = revisarDuplicados(D);
if (duplicados.length){ console.error("Posibles libros duplicados en datos.js:\n" + duplicados.map(p => "- " + p).join("\n")); process.exit(1); }

// La valoración moral de cada ficha debe calzar con el índice de Delibris (una ficha con null
// mostraría «Sin valoración» aunque Delibris lo reseñe).
const { revisarDelibris } = require("./revisar_delibris.js");
const moral = revisarDelibris(D).problemas;
if (moral.length){ console.error("Valoración de Delibris desalineada con el índice:\n" + moral.map(p => "- " + p).join("\n") + "\nCorregir con: node herramientas/revisar_delibris.js --arreglar"); process.exit(1); }

// Regla fija del menú: máximo 6 entradas de primer nivel en la barra (enlaces sueltos más el
// submenú Colaborar). Lo nuevo entra en una vista existente o en el submenú, nunca como entrada.
const MAX_MENU = 6;
{
  const nav = (leer("index.html").match(/<nav class="menu"[^>]*>([\s\S]*?)<\/nav>/) || [])[1];
  if (!nav){ console.error('index.html no tiene <nav class="menu">'); process.exit(1); }
  const entradas = (nav.replace(/<details[\s\S]*?<\/details>/g, "<details>").match(/<a\b|<details>/g) || []).length;
  if (entradas > MAX_MENU){ console.error(`El menú tiene ${entradas} entradas de primer nivel; el máximo es ${MAX_MENU}. Fusionar vistas o pasar alguna al submenú.`); process.exit(1); }
}

// Mismo criterio que enIdioma() de index.html: la versión de otro idioma reemplaza los campos de la
// ficha y tiene su propia página en libro/<id>/<idioma>/.
const vista = (l, lang) => {
  const v = (l.versiones || {})[lang];
  if (!v || l.idioma === lang) return l;
  const externos = [...(v.externos || []).map(e => ({ idioma: lang, ...e })), ...(l.externos || []).map(e => ({ idioma: l.idioma, ...e }))];
  return { ...l, archivos: {}, comprar: [], ...v, idioma: lang, externos, _ruta: `libro/${l.id}/${lang}/`, _base: "../../../" };
};
// Todas las páginas de libro: la de cada ficha y la de cada versión.
const PAGINAS = D.libros.flatMap(l => [l, ...Object.keys(l.versiones || {}).map(k => vista(l, k))]);
const INDEX = leer("index.html");

// Lo que ya vive en index.html se toma de ahí, para no tener dos copias: favicon y escala de Delibris.
const FAVICON = INDEX.match(/<link rel="icon"[^>]*>/)[0];
const ESCALA_DELIBRIS = eval("(" + INDEX.match(/const ESCALA_DELIBRIS = (\{[\s\S]*?\n  \});/)[1] + ")");

const TX = {
  es: {
    cat: { lectura: "Lectura espiritual", oracion: "Oración", novela: "Novelas", teatro: "Teatro", poesia: "Poesía", ensayo: "Ensayo e historia" },
    biblioteca: "Biblioteca gratuita", verTodo: "Ver toda la biblioteca", abrir: "Abrir en la biblioteca",
    descargar: "Descargar", enLinea: "Leer en línea", comprar: "Comprar",
    ayuda: "¿Cuál elegir? El PDF se abre directo en el navegador, en cualquier celular o computador. El EPUB queda en Descargas y se lee con una aplicación de lectura (Google Play Libros en Android, Libros en iPhone, Kindle o Kobo), que deja agrandar la letra.",
    porque: "Por qué leerlo", resumen: "Resumen", citas: "Citas", masCitas: "Ver {n} citas más", moral: "Valoración moral", sinDelibris: "Sin valoración en Delibris",
    moralNota: "Tomada de delibris.org, un sitio de reseñas (no es un juicio oficial de la Iglesia): de 1 a 6 círculos; 6 es «Sin inconvenientes».",
    verEn: "Ver en delibris.org", parecidos: "Libros parecidos", fuente: "Fuente", portada: "Portada", dominio: "dominio público, Wikimedia Commons",
    pie: "Proyecto Fénix · Solo publicamos obras de dominio público o con permiso de difusión; las demás se enlazan a donde se pueden leer en línea o comprar.",
    de: "de", tema: "Cambiar a modo claro u oscuro", edFenix: "Edición Fénix", sello: "Recomendado por Fénix",
    y: "y", ebook: "ebook",
    tProp: F => `${F} gratis`, tExt: F => `${F} gratis, enlace legal`, tWeb: "Leer en línea gratis", tComprar: "Resumen y dónde comprarlo",
    sProp: F => `Gratis en ${F}`, sExt: F => `Gratis en ${F} (enlace legal)`, sWeb: "Gratis para leer en línea", sComprar: "Protegido por derechos de autor: dónde comprarlo",
    dProp: (t, a, F, ed) => `Descarga gratis «${t}» de ${a} en ${F}${ed ? ", edición Fénix" : ""}.`,
    dExt: (t, a, F, s) => `«${t}» de ${a}: gratis y legal en ${F} (${s}).`,
    dWeb: (t, a, s) => `Lee gratis «${t}» de ${a} en línea (${s}).`,
    dComprar: (t, a) => `«${t}» de ${a}: por qué leerlo, resumen y dónde comprarlo.`
  },
  en: {
    cat: { lectura: "Spiritual reading", oracion: "Prayer", novela: "Novels", teatro: "Drama", poesia: "Poetry", ensayo: "Essays and history" },
    biblioteca: "Free library", verTodo: "See the whole library", abrir: "Open in the library",
    descargar: "Download", enLinea: "Read online", comprar: "Buy",
    ayuda: "Which one? The PDF opens straight away in the browser, on any phone or computer. The EPUB is saved in Downloads and is read with a reading app (Google Play Books on Android, Books on iPhone, Kindle or Kobo), which lets you enlarge the text.",
    porque: "Why read it", resumen: "Summary", citas: "Quotes", masCitas: "See {n} more quotes", moral: "Moral rating", sinDelibris: "Not rated by Delibris",
    moralNota: "Taken from delibris.org, a review site (not an official judgement of the Church): from 1 to 6 circles; 6 means «No drawbacks».",
    verEn: "See on delibris.org", parecidos: "Similar books", fuente: "Source", portada: "Cover", dominio: "public domain, Wikimedia Commons",
    pie: "Proyecto Fénix · We only publish public-domain works or works with permission to share; others link to where they can be read online or bought.",
    de: "of", tema: "Switch between light and dark mode", edFenix: "Fénix edition", sello: "Recommended by Fénix",
    y: "and", ebook: "ebook",
    tProp: F => `Free ${F}`, tExt: F => `Free ${F}, legal link`, tWeb: "Read online free", tComprar: "Summary and where to buy",
    sProp: F => `Free ${F}`, sExt: F => `Free ${F} (legal link)`, sWeb: "Free to read online", sComprar: "Under copyright: where to buy it",
    dProp: (t, a, F, ed) => `Download «${t}» by ${a} free in ${F}${ed ? ", Fénix edition" : ""}.`,
    dExt: (t, a, F, s) => `«${t}» by ${a}: free and legal in ${F} (${s}).`,
    dWeb: (t, a, s) => `Read «${t}» by ${a} free online (${s}).`,
    dComprar: (t, a) => `«${t}» by ${a}: why read it, summary and where to buy it.`
  }
};

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = src => /^https?:/.test(src) ? src : SITIO + src;
const porId = id => D.libros.find(l => l.id === id);
const primeraOracion = r => (String(r || "").match(/^.+?\.(?=\s|$)/) || [r || ""])[0];
const recortar = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…";
const urlLibro = l => SITIO + (l._ruta || "libro/" + l.id + "/");
// Mismo criterio que index.html: cada idioma muestra solo lo suyo.
const externosEn = (l, lang) => (l.externos || []).filter(e => (e.idioma || l.idioma) === lang);
const visibleEn = (l, lang) => l.idioma === lang || externosEn(l, lang).length > 0;
// Qué ofrece la página de cada libro, para el título, la descripción y el H1: nunca se promete una
// descarga que no hay. Archivos propios > descarga en otro sitio > lectura en línea > compra.
const TIPO_MIME = { pdf: "application/pdf", epub: "application/epub+zip" };
const ORDEN_FORMATO = ["epub", "pdf", "ebook"];
const autorCorto = a => a.replace(/\s*\(.*?\)\s*/g, " ").trim();
// En el título, sin tratamiento ni siglas de orden: «Beato Columba Marmion, O.S.B.» pasa a «Columba Marmion».
const autorTitulo = a => autorCorto(a).replace(/^(San|Santa|Santo|Beato|Beata|Saint|St\.|Blessed|Brother|Fray)\s+/, "").replace(/,\s*[A-Z](\.[A-Z])*\.?$/, "").trim();
const sitioCorto = t => t.split(/[,(]/)[0].trim();
function oferta(l, lang){
  const x = TX[lang];
  const ext = externosEn(l, lang);
  const propios = l.idioma === lang ? Object.keys(l.archivos || {}) : [];
  const descargas = ext.filter(e => e.formato !== "web");
  const tipo = propios.length ? "prop" : descargas.length ? "ext" : ext.length ? "web" : "comprar";
  const fmts = [...new Set(propios.length ? propios : descargas.map(e => e.formato))].sort((a, b) => ORDEN_FORMATO.indexOf(a) - ORDEN_FORMATO.indexOf(b));
  const nombres = fmts.map(f => f === "ebook" ? x.ebook : f.toUpperCase());
  const F = nombres.length > 1 ? nombres.slice(0, -1).join(", ") + " " + x.y + " " + nombres[nombres.length - 1] : nombres[0];
  const sitio = sitioCorto(((tipo === "ext" ? descargas : ext)[0] || {}).texto || "");
  const t = l.titulo, a = autorCorto(l.autor), at = autorTitulo(l.autor);
  const cola = { prop: x.tProp(F), ext: x.tExt(F), web: x.tWeb, comprar: x.tComprar }[tipo];
  // Google corta el título cerca de los 60 caracteres: si no cabe, sale el autor y queda título + formato.
  const corto = t.split(":")[0];
  const titulo = [`${t} - ${at} | ${cola}`, `${corto} - ${at} | ${cola}`, `${t} | ${cola}`, `${corto} | ${cola}`].find(s => s.length <= 70) || `${corto} | ${cola}`;
  const sub = { prop: x.sProp(F), ext: x.sExt(F), web: x.sWeb, comprar: x.sComprar }[tipo];
  const frase = { prop: () => x.dProp(t, a, F, !!l.editorial), ext: () => x.dExt(t, a, F, sitio), web: () => x.dWeb(t, a, sitio), comprar: () => x.dComprar(t, a) }[tipo]();
  return { tipo, titulo, sub, frase, descargas, propios };
}
const textoDelibris = (d, lang) => { const e = ESCALA_DELIBRIS[d.genero] || ESCALA_DELIBRIS.Literatura; return (e[lang] || e.es)[d.valor - 1]; };

const ESTILO = `
  :root{color-scheme:light dark; --bg:#faf6ef; --card:#fffdf8; --line:#e4d8c4; --ink:#2a1f1a; --muted:#6e5d50; --vino:#6b1d24; --oro:#8a5d14; --acento:#6b1d24; --acento-ink:#fff8ec; --chip:#efe4d2}
  @media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#16110f; --card:#231b17; --line:#3a2e27; --ink:#f2e9dc; --muted:#bfae9c; --vino:#d26a72; --oro:#e8b04a; --acento:#e8b04a; --acento-ink:#1d1206; --chip:#2e241e}}
  :root[data-theme="dark"]{--bg:#16110f; --card:#231b17; --line:#3a2e27; --ink:#f2e9dc; --muted:#bfae9c; --vino:#d26a72; --oro:#e8b04a; --acento:#e8b04a; --acento-ink:#1d1206; --chip:#2e241e}
  *{box-sizing:border-box}
  body{margin:0; background:var(--bg); color:var(--ink); font:17px/1.65 Georgia,"Iowan Old Style","Palatino Linotype",serif}
  a{color:var(--vino)}
  .wrap{max-width:1040px; margin:0 auto; padding:0 16px}
  header{border-bottom:1px solid var(--line)}
  .barra{display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:60px}
  .marca{display:flex; align-items:center; gap:10px; color:var(--ink); text-decoration:none; font-weight:700; font-size:19px}
  .pildora{border:1px solid var(--line); background:var(--card); color:var(--ink); border-radius:999px; min-height:40px; padding:6px 14px; font:600 15px system-ui,sans-serif; cursor:pointer}
  main.wrap{padding-top:28px; padding-bottom:48px}
  /* Escritorio: portada grande y descargas fijas a la izquierda, texto a la derecha. Celular: título, portada, descargas y texto. */
  .ficha{display:grid; grid-template-columns:320px minmax(0,1fr); grid-template-areas:"lado cabeza" "lado cuerpo"; column-gap:44px; align-items:start}
  .ficha .lado{grid-area:lado; position:sticky; top:20px} .ficha .cabeza{grid-area:cabeza} .ficha .cuerpo{grid-area:cuerpo; max-width:640px}
  .ficha .lado .botones{flex-direction:column} .ficha .lado .btn{justify-content:center}
  @media (max-width:760px){.ficha{grid-template-columns:1fr; grid-template-areas:"cabeza" "lado" "cuerpo"} .ficha .lado{position:static} .ficha img{max-width:150px} .ficha .lado .botones{flex-direction:row}}
  .ficha img{width:100%; height:auto; aspect-ratio:2/3; object-fit:cover; border-radius:10px; background:var(--chip)}
  h1{font-size:clamp(28px,5vw,38px); line-height:1.15; margin:0 0 8px}
  h1 .sub{display:block; margin-top:6px; font:600 16px/1.4 system-ui,sans-serif; color:var(--muted)}
  h2{font-size:20px; margin:28px 0 8px}
  .meta{font:15px/1.5 system-ui,sans-serif; color:var(--muted); margin:0 0 14px}
  .botones{display:flex; flex-wrap:wrap; gap:10px; margin:18px 0 8px}
  .btn{display:inline-flex; align-items:center; min-height:46px; padding:10px 18px; border-radius:10px; font:600 16px system-ui,sans-serif; text-decoration:none; border:1px solid var(--line); background:var(--card); color:var(--ink)}
  .btn.prim{background:var(--acento); color:var(--acento-ink); border-color:transparent}
  .sello{display:inline-block; margin:0 0 10px; padding:1px 10px; border:1.5px solid var(--oro); border-radius:999px; color:var(--oro); font:700 13px system-ui,sans-serif}
  .ayuda{font:15px/1.5 system-ui,sans-serif; color:var(--muted); background:var(--chip); border-radius:10px; padding:10px 14px; margin:8px 0 0}
  blockquote{margin:0 0 20px; padding:2px 0 2px 16px; border-left:3px solid var(--oro); font-style:italic; line-height:1.6}
  details.citas summary{cursor:pointer; font:600 15px system-ui,sans-serif; color:var(--vino); margin-bottom:14px}
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

// La medición (GoatCounter) se copia tal cual del bloque MEDICION de index.html, para que haya una sola versión.
const MEDICION = (fs.readFileSync(path.join(RAIZ, "index.html"), "utf8").match(/<!-- MEDICION:inicio[\s\S]*?<!-- MEDICION:fin -->/) || [""])[0];
// Igual el aviso de qué aplicación abre el EPUB en el celular (bloque AVISO_EPUB de index.html).
const AVISO_EPUB = (fs.readFileSync(path.join(RAIZ, "index.html"), "utf8").match(/<!-- AVISO_EPUB:inicio[\s\S]*?<!-- AVISO_EPUB:fin -->/) || [""])[0];

function paginaLibro(l){
  const lang = l.idioma, x = TX[lang];
  const resumen = l.resumen[lang] || l.resumen.es;
  const of = oferta(l, lang);
  const descripcion = recortar(of.frase + " " + resumen, 158);
  const titulo = of.titulo;
  const img = l.imagen ? abs(l.imagen.src) : SITIO + "img/compartir.jpg";
  const B = l._base || "../../";
  const inicio = B + (lang === "en" ? "?l=en" : "");
  const botones = [
    ...Object.entries(l.idioma === lang ? (l.archivos || {}) : {}).map(([f, u]) => `<a class="btn prim" href="${B}${esc(u)}" data-archivo ${f === "pdf" ? `target="_blank" rel="noopener"` : "download"}>${esc(x.descargar)} ${f.toUpperCase()}</a>`),
    ...externosEn(l, lang).sort((a, b) => (b.formato === "epub") - (a.formato === "epub")).map(e => `<a class="btn prim" href="${esc(e.url)}" rel="noopener">${e.formato === "web" ? esc(x.enLinea) : esc(x.descargar) + " " + esc(e.formato.toUpperCase())} · ${esc(e.texto)}</a>`),
    ...(l.idioma === lang ? (l.comprar || []) : []).map(c => `<a class="btn" href="${esc(c.url)}" rel="noopener">${esc(x.comprar)} · ${esc(c.texto)}</a>`)
  ];
  const tieneArchivos = Object.keys(l.archivos || {}).length > 0;
  const parecidos = (l.parecidos || []).map(porId).filter(p => p && visibleEn(vista(p, lang), lang)).map(p => vista(p, lang));
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
        isAccessibleForFree: of.tipo !== "comprar",
        ...(of.tipo === "prop" || of.tipo === "ext" ? { bookFormat: "https://schema.org/EBook", workExample: [
          ...of.propios.map(f => ({ "@type": "Book", bookFormat: "https://schema.org/EBook", inLanguage: lang, encodingFormat: TIPO_MIME[f], url: SITIO + l.archivos[f], isAccessibleForFree: true })),
          ...(of.tipo === "ext" ? of.descargas : []).map(e => ({ "@type": "Book", bookFormat: "https://schema.org/EBook", inLanguage: lang, ...(TIPO_MIME[e.formato] ? { encodingFormat: TIPO_MIME[e.formato] } : {}), url: e.url, isAccessibleForFree: true, provider: { "@type": "Organization", name: sitioCorto(e.texto) } }))
        ] } : {}),
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
<link rel="canonical" href="${urlLibro(l)}">${Object.keys(porId(l.id).versiones || {}).length ? [porId(l.id), ...Object.keys(porId(l.id).versiones).map(k => vista(porId(l.id), k))].map(p => `
<link rel="alternate" hreflang="${p.idioma}" href="${urlLibro(p)}">`).join("") : ""}
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
<header><div class="wrap barra"><a class="marca" href="${inicio}"><img src="${B}img/favicon.svg" alt="" width="28" height="28">Proyecto Fénix</a><button class="pildora" id="btnTema" type="button" aria-label="${esc(x.tema)}" title="${esc(x.tema)}">◐</button></div></header>
<main class="wrap">
  <div class="ficha">
    <div class="lado">${l.imagen ? `<img src="${esc(l.imagen.src.startsWith("http") ? l.imagen.src : B + l.imagen.src)}" alt="${esc(l.imagen.credito[lang] || l.imagen.credito.es)}" width="400" height="600">` : ""}
      <div class="botones">${botones.join("\n        ")}</div>
      ${tieneArchivos && l.idioma === lang ? `<p class="ayuda">${esc(x.ayuda)}</p>` : ""}
    </div>
    <div class="cabeza">
      ${(D.recomendadosFenix || []).includes(l.id) ? `<span class="sello">✦ ${esc(x.sello)}</span>` : ""}
      <h1>${esc(l.titulo)}<span class="sub">${esc(of.sub)}</span></h1>
      <p class="meta">${esc(l.autor)} · ${esc(l.anio)} · ${esc(x.cat[l.categoria])}</p>
    </div>
    <div class="cuerpo">
      ${l.porque ? `<h2>${esc(x.porque)}</h2>
      <p>${esc(l.porque[lang] || l.porque.es)}</p>` : ""}
      <h2>${esc(x.resumen)}</h2>
      <p>${esc(resumen)}</p>
      ${l.editorial ? `<h2>${esc(x.edFenix)}</h2>\n      <p>${esc(l.editorial[lang] || l.editorial.es)}</p>` : ""}
      ${(l.citas || []).length ? `<h2>${esc(x.citas)}</h2>\n      ${l.citas.slice(0, 2).map(c => `<blockquote>${esc(c)}</blockquote>`).join("\n      ")}${l.citas.length > 2 ? `\n      <details class="citas"><summary>${esc(x.masCitas.replace("{n}", l.citas.length - 2))}</summary>${l.citas.slice(2).map(c => `<blockquote>${esc(c)}</blockquote>`).join("")}</details>` : ""}` : ""}
      <h2>${esc(x.moral)}</h2>
      ${d ? `<p><span class="circ" aria-hidden="true">${[1, 2, 3, 4, 5, 6].map(n => `<i class="${n <= d.valor ? "on" : ""}"></i>`).join("")}</span><strong>${d.valor} ${esc(x.de)} 6</strong>: ${esc(textoDelibris(d, lang))}. <a href="${esc(d.url)}" rel="noopener">${esc(x.verEn)}</a></p>` : `<p>${esc(x.sinDelibris)}</p>`}
      <p class="meta">${esc(x.moralNota)}</p>
      ${parecidos.length ? `<h2>${esc(x.parecidos)}</h2>\n      <ul class="parecidos">${parecidos.map(p => `<li><a href="${l._ruta ? "../../" : "../"}${esc((vista(p, lang)._ruta || "libro/" + p.id + "/").slice(6))}">${esc(p.titulo)}</a> · ${esc(p.autor)}</li>`).join("")}</ul>` : ""}
      <div class="botones"><a class="btn" href="${B}?${lang === "en" ? "l=en&amp;" : ""}abrir=${encodeURIComponent(l.id)}">${esc(x.abrir)}</a><a class="btn" href="${inicio}#biblioteca">${esc(x.verTodo)}</a></div>
      ${l.fuente ? `<p class="meta">${esc(x.fuente)}: <a href="${esc(l.fuente.url)}" rel="noopener">${esc(l.fuente.texto)}</a></p>` : ""}
      ${l.imagen ? `<p class="meta">${esc(x.portada)}: <a href="${esc(l.imagen.url)}" rel="noopener">${esc(l.imagen.credito[lang] || l.imagen.credito.es)}</a> (${esc(l.imagen.aviso ? (l.imagen.aviso[lang] || l.imagen.aviso.es) : x.dominio)})</p>` : ""}
    </div>
  </div>
</main>
<footer><div class="wrap">${esc(x.pie)}</div></footer>
${SCRIPT_TEMA}
${AVISO_EPUB}
${MEDICION}
</body>
</html>
`;
}

// ---------- páginas de libro ----------
const cambiadas = new Set();
for (const l of PAGINAS) if (escribirSiCambia((l._ruta || `libro/${l.id}/`) + "index.html", paginaLibro(l))) cambiadas.add(urlLibro(l));
// Fichas fusionadas en otra (alias): su dirección vieja redirige a la página nueva.
for (const [viejo, a] of Object.entries(D.alias || {})){
  const destino = vista(porId(a.id), a.idioma || porId(a.id).idioma);
  const url = urlLibro(destino);
  escribirSiCambia(`libro/${viejo}/index.html`, `<!doctype html>
<html lang="${destino.idioma}">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>${esc(destino.titulo)} | Proyecto Fénix</title>
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${url}">
</head>
<body><p><a href="${url}">${esc(destino.titulo)}</a></p></body>
</html>
`);
}
// Libros que salieron del catálogo: se borra su página.
const ids = new Set([...D.libros.map(l => l.id), ...Object.keys(D.alias || {})]);
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
      description: "Novelas, teatro, poesía, ensayo y clásicos de todas las épocas, escogidos uno a uno y gratis en EPUB y PDF, con por qué leerlo, citas y valoración moral. Sin publicidad ni registro.",
      inLanguage: ["es", "en"],
      author: { "@type": "Person", name: "Tomás Alcalde", url: "https://talcaldeg.github.io/" }
    },
    {
      "@type": "CollectionPage",
      "@id": SITIO + "#catalogo",
      url: SITIO,
      name: "Proyecto Fénix · Buenos libros, gratis y escogidos",
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
// Catálogo en HTML plano dentro de <noscript>: los rastreadores que no ejecutan JavaScript (los de IA)
// y Google en su primera pasada ven así un enlace a cada libro desde la portada. El visitante no lo ve.
const catalogo = `<!-- CATALOGO:inicio - lo genera herramientas/gen_estaticos.js desde datos.js; no editar a mano -->
  <noscript><nav aria-label="Catálogo"><h2>Catálogo</h2><ul>
${PAGINAS.map(l => `    <li><a href="${(l._ruta || "libro/" + l.id + "/")}">${esc(l.titulo)}</a> - ${esc(l.autor)}</li>`).join("\n")}
  </ul></nav></noscript>
  <!-- CATALOGO:fin -->`;
const conCatalogo = INDEX.includes("<!-- CATALOGO:inicio")
  ? INDEX.replace(/<!-- CATALOGO:inicio[\s\S]*?<!-- CATALOGO:fin -->/, catalogo)
  : INDEX.replace("<main>\n", `<main>\n  ${catalogo}\n`);
if (!conCatalogo.includes("<!-- CATALOGO:inicio")) throw new Error("index.html no tiene <main> para el catálogo");
const indexNuevo = conCatalogo.replace(/<!-- JSONLD:inicio[\s\S]*?<!-- JSONLD:fin -->/, bloque);
if (indexNuevo === conCatalogo && !INDEX.includes("<!-- JSONLD:inicio")) throw new Error("index.html no tiene las marcas JSONLD:inicio y JSONLD:fin");
if (escribirSiCambia("index.html", indexNuevo)) cambiadas.add(SITIO);

// ---------- sitemap.xml ----------
const hoy = new Date().toISOString().slice(0, 10);
const previo = fs.existsSync(path.join(RAIZ, "sitemap.xml")) ? leer("sitemap.xml") : "";
const lastmodPrevio = {};
for (const m of previo.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) lastmodPrevio[m[1]] = m[2];
const urls = [SITIO, ...PAGINAS.map(urlLibro)];
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

> Biblioteca digital gratuita, en español e inglés: novelas, teatro, poesía, ensayo y clásicos de todas las épocas, escogidos uno a uno, para descargar en EPUB y PDF o leer en línea, cada uno con por qué leerlo, resumen, citas, libros parecidos y la valoración moral de delibris.org. Sin publicidad ni registro.

Fénix existe para que los buenos libros no se pierdan: los busca, revisa sus derechos y, si se puede, los publica en ediciones que se leen bien en el celular.

Algunos libros son ediciones propias de Proyecto Fénix (traducción, revisión o edición digital); su página dice qué se hizo.

Solo se alojan obras de dominio público o con permiso de difusión; las protegidas se enlazan a donde se pueden leer en línea o comprar. Cada libro tiene su propia página, en el idioma del libro.

${ORDEN.map(c => { const xs = PAGINAS.filter(l => l.categoria === c); return xs.length ? `## ${TX.es.cat[c]}\n\n${xs.map(linea).join("\n")}\n` : ""; }).filter(Boolean).join("\n")}
## Sitio

- [Portada y buscador del catálogo](${SITIO}) - biblioteca completa con filtros por categoría y formato, plan de vida (libros para la oración y la lectura espiritual de cada día), oraciones, formularios para proponer un libro o avisar un error, una invitación a ser editor de un libro (#editores) y la lista de libros que Fénix busca, para prepararlos con un agente de IA (#encuadernadores).
- [Instrucciones para el agente de IA que prepara un libro para Fénix](https://raw.githubusercontent.com/talcaldeg/fenix/main/editorial/ENCUADERNAR.md) - derechos, criterio moral, vía más barata (Gutenberg, texto limpio, escaneo o traducción) y formato del paquete de entrega.
- [Mapa del sitio](${SITIO}sitemap.xml)
`;
escribirSiCambia("llms.txt", llms);

console.log(`${D.libros.length} libros; páginas cambiadas: ${cambiadas.size}`);
