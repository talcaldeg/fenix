// Revisa que datos.js no tenga el mismo libro en dos fichas.
//
// Regla de Fénix: una obra es una sola ficha. Si hay varias versiones (otra traducción, otro
// idioma, otra edición), van dentro de la misma ficha, en `versiones` (ver la cabecera de
// datos.js), no como fichas aparte. Se corre antes de subir cualquier libro y lo corre también
// gen_estaticos.js, que se detiene si encuentra un posible duplicado.
//
// Señales de que dos fichas son la misma obra:
//   - mismo id, mismo archivo alojado en libros/ o la misma ficha de Delibris;
//   - mismo autor (Platón = Plato) y título parecido, aunque esté en otro idioma
//     («Confesiones» = «The Confessions of St. Augustine»), o la misma portada.
// Dos obras distintas que el revisor confunde (las dos «Apología de Sócrates», de Platón y de
// Jenofonte) se declaran en `FENIX.distintos` con el porqué.
//
// Uso (desde la carpeta fenix):  node herramientas/revisar_duplicados.js
"use strict";

const PALABRAS_VACIAS = new Set(("el la los las lo un una unos unas de del al y e o u en a con por para sin su sus " +
  "the of and or an in on to with for by his her its st san santa santo beato beata fray hermano sor mons " +
  "trad trans ed sj osb ocd op").split(" "));

const plegar = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const palabras = s => plegar(s).replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").split(" ")
  .filter(w => w.length >= 3 && !PALABRAS_VACIAS.has(w));
// Raíz corta para comparar entre idiomas: imitación/imitation, confesiones/confessions, apología/apology.
const raices = s => new Set(palabras(s).map(w => w.slice(0, 4)));

function distancia(a, b){
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// Mismo autor si comparten un nombre (con una letra de diferencia: Platón/Plato, Agustín/Augustine no).
function mismoAutor(a, b){
  const xa = palabras(a).filter(w => w.length >= 4), xb = palabras(b).filter(w => w.length >= 4);
  return xa.some(x => xb.some(y => x === y || (Math.min(x.length, y.length) >= 5 && distancia(x, y) <= 1)));
}
function parecidoTitulo(a, b){
  const ra = raices(a), rb = raices(b);
  if (!ra.size || !rb.size) return 0;
  let comunes = 0; for (const r of ra) if (rb.has(r)) comunes++;
  return comunes / Math.min(ra.size, rb.size);
}

// Todas las formas de una ficha: la principal y cada versión (título, autor, archivos, portada).
function formas(l){
  const vs = [{ idioma: l.idioma, titulo: l.titulo, autor: l.autor, archivos: l.archivos, imagen: l.imagen }];
  for (const [idioma, v] of Object.entries(l.versiones || {}))
    vs.push({ idioma, titulo: v.titulo || l.titulo, autor: v.autor || l.autor, archivos: v.archivos || {}, imagen: v.imagen || l.imagen });
  return vs;
}

function revisarDuplicados(D){
  const problemas = [];
  const libros = D.libros;
  const distintos = new Set((D.distintos || []).map(d => [d.ids[0], d.ids[1]].sort().join("|")));
  const declaradoDistinto = (a, b) => distintos.has([a, b].sort().join("|"));

  // Ids y alias
  const ids = new Map();
  for (const l of libros){ if (ids.has(l.id)) problemas.push(`id repetido: ${l.id}`); ids.set(l.id, l); }
  for (const [viejo, destino] of Object.entries(D.alias || {})){
    if (ids.has(viejo)) problemas.push(`el alias ${viejo} es también el id de una ficha`);
    const l = ids.get(destino.id);
    if (!l) problemas.push(`el alias ${viejo} apunta a una ficha que no existe: ${destino.id}`);
    else if (destino.idioma && destino.idioma !== l.idioma && !(l.versiones || {})[destino.idioma]) problemas.push(`el alias ${viejo} apunta a una versión en «${destino.idioma}» que ${destino.id} no tiene`);
  }
  // Versiones: cada idioma una sola vez y nunca el de la ficha principal.
  for (const l of libros) for (const idioma of Object.keys(l.versiones || {}))
    if (idioma === l.idioma) problemas.push(`${l.id}: la versión «${idioma}» repite el idioma de la ficha; dos ediciones en el mismo idioma van como archivos o enlaces de la misma versión`);

  // Archivo alojado en dos fichas
  const archivos = new Map();
  for (const l of libros) for (const f of formas(l)) for (const ruta of Object.values(f.archivos || {})){
    if (archivos.has(ruta) && archivos.get(ruta) !== l.id) problemas.push(`el archivo ${ruta} está en ${archivos.get(ruta)} y en ${l.id}`);
    archivos.set(ruta, l.id);
  }

  // Pares de fichas que parecen la misma obra
  for (let i = 0; i < libros.length; i++) for (let j = i + 1; j < libros.length; j++){
    const a = libros[i], b = libros[j];
    if (declaradoDistinto(a.id, b.id)) continue;
    const motivos = [];
    if (a.delibris && b.delibris && a.delibris.url.replace(/^https?:\/\/(www\.)?/, "") === b.delibris.url.replace(/^https?:\/\/(www\.)?/, "")) motivos.push("la misma ficha de Delibris");
    for (const fa of formas(a)) for (const fb of formas(b)){
      if (!mismoAutor(fa.autor, fb.autor)) continue;
      const p = parecidoTitulo(fa.titulo, fb.titulo);
      if (p >= 0.5) motivos.push(`mismo autor y título parecido («${fa.titulo}» / «${fb.titulo}»)`);
      else if (fa.imagen && fb.imagen && fa.imagen.src === fb.imagen.src) motivos.push("mismo autor y la misma portada");
    }
    if (motivos.length) problemas.push(`posible duplicado: ${a.id} [${a.idioma}] y ${b.id} [${b.idioma}]: ${[...new Set(motivos)].join("; ")}. Si es la misma obra, fusionarlas en una ficha con «versiones»; si son obras distintas, declararlo en FENIX.distintos`);
  }
  return problemas;
}

module.exports = { revisarDuplicados };

if (require.main === module){
  const fs = require("fs"), path = require("path");
  global.window = {};
  eval(fs.readFileSync(path.join(__dirname, "..", "datos.js"), "utf8"));
  const problemas = revisarDuplicados(window.FENIX);
  if (problemas.length){ console.log(problemas.map(p => "- " + p).join("\n")); process.exit(1); }
  console.log(`${window.FENIX.libros.length} fichas, sin duplicados.`);
}
