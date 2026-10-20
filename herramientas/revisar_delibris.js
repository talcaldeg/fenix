// Cruza la valoración moral de cada ficha de datos.js con el índice de Delibris (delibris/*.json).
//
// El campo `delibris` de una ficha se llena a mano al subir el libro; si quien la arma no lo
// encuentra en delibris.org, queda null y el sitio muestra «Sin valoración en Delibris» aunque
// Delibris sí lo reseñe (pasó con «A la luz del Evangelio»). Este revisor lo detecta:
//   - ficha con delibris null y el libro está en el índice (mismo título sin subtítulo ni
//     artículo, y algún nombre del autor en común, igual que valoracionDelibris de index.html);
//   - ficha con valoración cuya página de Delibris está en el índice con otro valor.
// gen_estaticos.js lo corre y se detiene si hay problemas. Si el cruce confunde dos obras
// distintas, el id se declara en FENIX.sinDelibris con el porqué.
//
// Uso (desde la carpeta fenix):
//   node herramientas/revisar_delibris.js             revisa
//   node herramientas/revisar_delibris.js --arreglar  escribe en datos.js lo que trae el índice
"use strict";

const fs = require("fs"), path = require("path");
const RAIZ = path.join(__dirname, "..");

// Mismas reglas que index.html (norm, corto, claveDelibris, cruzan).
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, " ").trim();
const sinArticulo = s => s.replace(/^(el|la|los|las|lo|un|una|unos|unas|the|a|an) /, "");
const corto = s => sinArticulo(norm(String(s || "").split(/[:.(\[]/)[0]));
const claveDelibris = ti => (norm(ti).replace(/^(el|la|los|las|lo|un|una|unos|unas) /, "").replace(/ /g, "").slice(0, 2) || "__").padEnd(2, "_");
const palabras = autores => new Set(autores.flatMap(a => norm(a).split(" ")).filter(w => w.length >= 4));
const cruzan = (a, b) => { const pa = palabras(a); return [...palabras(b)].some(w => pa.has(w)); };
const sinWww = u => String(u || "").replace(/^https?:\/\/(www\.)?/, "");

function revisarDelibris(D){
  const dir = path.join(RAIZ, "delibris");
  if (!fs.existsSync(path.join(dir, "_meta.json"))) return { problemas: [], arreglos: [] };
  const trozos = {};
  const trozo = k => trozos[k] || (trozos[k] = fs.existsSync(path.join(dir, `${k}.json`)) ? JSON.parse(fs.readFileSync(path.join(dir, `${k}.json`), "utf8")) : []);
  const ignorar = new Set((D.sinDelibris || []).map(x => x.id));
  const problemas = [], arreglos = [];

  for (const l of D.libros){
    if (ignorar.has(l.id)) continue;
    const formas = [{ titulo: l.titulo, autor: l.autor }, ...Object.values(l.versiones || {}).map(v => ({ titulo: v.titulo || l.titulo, autor: v.autor || l.autor }))];
    if (!l.delibris){
      let hallado = null;
      for (const f of formas){
        hallado = trozo(claveDelibris(f.titulo)).find(x => corto(x.t) === corto(f.titulo) && cruzan(x.a, [f.autor]));
        if (hallado) break;
      }
      if (hallado){
        const d = { valor: hallado.v, genero: hallado.g, url: hallado.u };
        problemas.push(`${l.id}: delibris es null, pero Delibris lo valora ${d.valor}/6 («${hallado.t}», ${hallado.a.join("; ")}, ${d.url})`);
        arreglos.push({ id: l.id, d });
      }
    } else {
      // La página de la ficha, buscada en el trozo de cada título de la ficha y en el del título de Delibris.
      for (const f of formas){
        const x = trozo(claveDelibris(f.titulo)).find(x => sinWww(x.u) === sinWww(l.delibris.url));
        if (x && x.v !== l.delibris.valor){
          problemas.push(`${l.id}: datos.js dice ${l.delibris.valor}/6 y Delibris ahora ${x.v}/6 (${x.u})`);
          arreglos.push({ id: l.id, d: { valor: x.v, genero: x.g, url: x.u } });
        }
        if (x) break;
      }
    }
  }
  return { problemas, arreglos };
}

module.exports = { revisarDelibris };

if (require.main === module){
  const ruta = path.join(RAIZ, "datos.js");
  global.window = {};
  eval(fs.readFileSync(ruta, "utf8"));
  const { problemas, arreglos } = revisarDelibris(window.FENIX);
  if (process.argv.includes("--arreglar") && arreglos.length){
    let t = fs.readFileSync(ruta, "utf8");
    for (const { id, d } of arreglos){
      // La primera línea «delibris:» de la ficha, antes de que empiece la siguiente (datos.js va en CRLF).
      const ini = t.indexOf(`id: "${id}"`);
      const sig = t.indexOf("\n      id: ", ini + 1);
      const re = /\n([ \t]*)delibris: [^\r\n]*?(,?)(\r?\n)/y;
      const pos = t.indexOf("\n      delibris: ", ini);
      re.lastIndex = pos;
      const m = ini < 0 || pos < 0 || (sig > 0 && pos > sig) ? null : re.exec(t);
      if (!m){ console.log(`- ${id}: no se encontró su línea delibris; arreglar a mano`); continue; }
      t = t.slice(0, pos) + `\n${m[1]}delibris: ${JSON.stringify(d)}${m[2]}${m[3]}` + t.slice(re.lastIndex);
      console.log(`Arreglado ${id}: ${d.valor}/6 ${d.genero} ${d.url}`);
    }
    fs.writeFileSync(ruta, t, "utf8");
    process.exit(0);
  }
  if (problemas.length){ console.log(problemas.map(p => "- " + p).join("\n") + "\nCorregir con: node herramientas/revisar_delibris.js --arreglar"); process.exit(1); }
  console.log(`${window.FENIX.libros.length} fichas, valoración de Delibris al día con el índice.`);
}
