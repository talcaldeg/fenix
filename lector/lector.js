// Lector Fénix: lee EPUB en el navegador, sin conexión.
//
// - Los libros y todo lo del lector viven en IndexedDB del dispositivo; la red solo se usa para traer
//   libros del catálogo, buscar versiones nuevas, mandar correcciones y sincronizar con la nube. Toda
//   llamada a la red va en try/catch y sin conexión simplemente espera: nada de lo de leer depende de ella.
// - El EPUB se desarma con fflate (lector/vendor/) y se muestra capítulo a capítulo, con el CSS del libro
//   acotado a #texto. Sin epub.js: así la posición, los subrayados y la edición bilingüe son nuestros.
// - Posición, marcadores y notas se anclan por texto (la cita y lo que la rodea), no por CFI: cuando
//   llega una versión nueva del libro (corregida, rearmada) siguen cayendo en su lugar.
// - Las correcciones viajan a Fénix por FormSubmit (como el formulario de errores del sitio); sin
//   conexión quedan en cola. herramientas/lector.py las lee del correo para corregir el libro.
// - Nube opcional en Google Drive (carpeta «Fénix - Lector», permiso drive.file): se activa con
//   GOOGLE_CLIENTE. herramientas/lector.py nube lee lo mismo desde el PC.
"use strict";
(() => {
  // ID de cliente OAuth web de Google Cloud (origen https://talcaldeg.github.io). Vacío = sin nube.
  const GOOGLE_CLIENTE = "";
  const FORMULARIO = "https://formsubmit.co/ajax/talcaldeg@gmail.com";
  // Dentro del APK de Android (app/, Capacitor) el lector viene en la propia app: catálogo y libros se
  // piden al sitio, y lo que la web no tiene (abrir con, volumen, pantalla completa) lo hace LectorFenix.java.
  const APP = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const SITIO = APP ? "https://talcaldeg.github.io/fenix/" : "../";
  const CATALOGO = APP ? SITIO + "lector/catalogo.json" : "catalogo.json";
  const APK = "https://github.com/talcaldeg/fenix/releases/latest/download/lector-fenix.apk";
  const nativo = (metodo, datos = {}) => APP ? window.Capacitor.nativePromise("LectorFenix", metodo, datos) : Promise.resolve(null);
  const CARPETA_NUBE = "Fénix - Lector";
  const ARCHIVO_NUBE = "lector.json";
  const CADA_ACTUALIZAR = 6 * 3600e3;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").replace(/\s+/g, " ").trim();
  const clave = s => norm(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const enLinea = () => navigator.onLine !== false;
  const espera = ms => new Promise(r => setTimeout(r, ms));

  // Ningún error suelto debe romper la lectura: se anota y se sigue.
  window.addEventListener("unhandledrejection", e => { console.warn("Lector:", e.reason); e.preventDefault(); });

  // ---------- avisos ----------
  let toastT;
  function aviso(texto, ms = 4200){
    const t = $("#toast"); t.textContent = texto; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, ms);
  }
  function cargando(texto){
    let c = $(".carga");
    if (!texto){ if (c) c.remove(); return; }
    if (!c){ c = document.createElement("div"); c.className = "carga"; document.body.append(c); }
    c.textContent = texto;
  }
  function confirmar(titulo, texto, si = "Eliminar"){
    const d = $("#dlgConfirmar");
    $("#confTitulo").textContent = titulo; $("#confTexto").textContent = texto; $("#confSi").textContent = si;
    d.returnValue = "";
    d.showModal();
    return new Promise(ok => d.addEventListener("close", () => ok(d.returnValue === "si"), { once: true }));
  }
  $$("dialog [data-cerrar]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));
  $$("dialog.panel, #dlgLibro").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));

  // ---------- IndexedDB ----------
  // libros: ficha sin el archivo · archivos: {id, blob} · estado: posición, marcadores y notas por libro
  // cola: correcciones por enviar · config: ajustes, catálogo guardado, borrados (para la nube).
  const DB = (() => {
    let p;
    const abrir = () => p || (p = new Promise((ok, mal) => {
      const r = indexedDB.open("fenix-lector", 1);
      r.onupgradeneeded = () => {
        const d = r.result;
        for (const s of ["libros", "archivos", "estado", "cola", "config"])
          if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: s === "config" ? "clave" : "id" });
      };
      r.onsuccess = () => { r.result.onversionchange = () => r.result.close(); ok(r.result); };
      r.onerror = () => { p = null; mal(r.error); };
    }));
    function tx(stores, modo, fn){
      return abrir().then(d => new Promise((ok, mal) => {
        const t = d.transaction(stores, modo);
        const res = fn(...[].concat(stores).map(s => t.objectStore(s)));
        t.oncomplete = () => ok(res && "result" in res ? res.result : res);
        t.onerror = t.onabort = () => mal(t.error);
      }));
    }
    return {
      get: (s, k) => tx(s, "readonly", st => st.get(k)),
      todos: s => tx(s, "readonly", st => st.getAll()),
      poner: (s, v) => tx(s, "readwrite", st => st.put(v)),
      borrar: (s, k) => tx(s, "readwrite", st => st.delete(k)),
      // Libro y archivo juntos: o quedan los dos o ninguno (una versión nueva a medias no reemplaza a la vieja).
      ponerLibro: (libro, blob) => tx(["libros", "archivos"], "readwrite", (l, a) => { l.put(libro); if (blob) a.put({ id: libro.id, blob }); }),
      borrarLibro: id => tx(["libros", "archivos"], "readwrite", (l, a) => { l.delete(id); a.delete(id); }),
    };
  })();
  const conf = {
    async leer(k, def){ try { const r = await DB.get("config", k); return r ? r.valor : def; } catch { return def; } },
    poner(k, valor){ return DB.poner("config", { clave: k, valor }).catch(e => console.warn(e)); },
  };
  async function estadoDe(id){
    const e = await DB.get("estado", id).catch(() => null);
    return e || { id, pos: null, marcadores: [], notas: [], modificado: 0 };
  }
  async function guardarEstado(e){ e.modificado = Date.now(); await DB.poner("estado", e); Nube.pendiente(); }

  // ---------- EPUB ----------
  const dirDe = ruta => ruta.includes("/") ? ruta.slice(0, ruta.lastIndexOf("/") + 1) : "";
  function resolver(base, href){
    const [p, frag] = String(href).split("#");
    let ruta = p;
    if (p) { try { ruta = decodeURIComponent(new URL(p, "https://e.pub/" + base).pathname.slice(1)); } catch { ruta = base + p; } }
    return { ruta, frag: frag ? decodeURIComponent(frag) : "" };
  }
  const xml = s => new DOMParser().parseFromString(s, "application/xml");
  const porTag = (doc, tag) => [...doc.getElementsByTagNameNS("*", tag)];

  function leerEpub(buf){
    let zip;
    try { zip = fflate.unzipSync(new Uint8Array(buf)); } catch { throw new Error("El archivo no es un EPUB válido (no se pudo abrir el zip)."); }
    const dec = new TextDecoder("utf-8");
    const bytes = ruta => zip[ruta] || zip[decodeURI(ruta)] || zip[Object.keys(zip).find(k => k.toLowerCase() === ruta.toLowerCase())];
    const txt = ruta => { const b = bytes(ruta); if (!b) throw new Error("Falta " + ruta + " dentro del EPUB."); return dec.decode(b); };
    const cont = xml(txt("META-INF/container.xml"));
    const rf = porTag(cont, "rootfile")[0];
    if (!rf) throw new Error("El EPUB no declara su contenido (container.xml).");
    const opfRuta = rf.getAttribute("full-path");
    const opf = xml(txt(opfRuta));
    const base = dirDe(opfRuta);
    const md = tag => porTag(opf, tag).map(e => norm(e.textContent)).filter(Boolean);
    const uidId = opf.documentElement.getAttribute("unique-identifier");
    const ids = porTag(opf, "identifier");
    const ident = norm((ids.find(e => e.getAttribute("id") === uidId) || ids[0] || {}).textContent || "");
    const manifiesto = {};
    for (const it of porTag(opf, "item")) {
      manifiesto[it.getAttribute("id")] = { href: resolver(base, it.getAttribute("href")).ruta, tipo: it.getAttribute("media-type") || "", props: it.getAttribute("properties") || "" };
    }
    const spineEl = porTag(opf, "spine")[0];
    const spine = porTag(opf, "itemref").map(r => manifiesto[r.getAttribute("idref")])
      .filter(it => it && /x?html|xml/.test(it.tipo) && bytes(it.href))
      .map(it => ({ href: it.href, tipo: it.tipo, tam: bytes(it.href).length }));
    if (!spine.length) throw new Error("El EPUB no trae capítulos legibles.");
    // Portada: properties="cover-image" (EPUB 3) o <meta name="cover"> (EPUB 2).
    let portada = Object.values(manifiesto).find(it => /cover-image/.test(it.props));
    if (!portada) { const m = porTag(opf, "meta").find(m => m.getAttribute("name") === "cover"); if (m) portada = manifiesto[m.getAttribute("content")]; }
    if (portada && !/^image\//.test(portada.tipo)) portada = null;
    // Índice: nav de EPUB 3; si no, el NCX.
    let toc = [];
    const nav = Object.values(manifiesto).find(it => /\bnav\b/.test(it.props));
    if (nav && bytes(nav.href)) {
      const d = new DOMParser().parseFromString(txt(nav.href), "text/html");
      const navEl = $$("nav", d).find(n => /toc/.test(n.getAttribute("epub:type") || n.getAttribute("role") || "")) || $("nav", d);
      const lista = ol => [...(ol ? ol.children : [])].filter(li => li.tagName === "LI").map(li => {
        const a = $(":scope > a, :scope > span", li);
        const href = a && a.getAttribute("href");
        return { titulo: norm(a ? a.textContent : ""), ...(href ? resolver(dirDe(nav.href), href) : { ruta: "", frag: "" }), hijos: lista($(":scope > ol", li)) };
      }).filter(x => x.titulo);
      if (navEl) toc = lista($("ol", navEl));
    }
    if (!toc.length) {
      const ncxId = spineEl && spineEl.getAttribute("toc");
      const ncx = (ncxId && manifiesto[ncxId]) || Object.values(manifiesto).find(it => it.tipo === "application/x-dtbncx+xml");
      if (ncx && bytes(ncx.href)) {
        const d = xml(txt(ncx.href));
        const puntos = padre => [...padre.children].filter(e => e.localName === "navPoint").map(np => {
          const label = [...np.children].find(e => e.localName === "navLabel");
          const content = [...np.children].find(e => e.localName === "content");
          return { titulo: norm(label ? label.textContent : ""), ...resolver(dirDe(ncx.href), content ? content.getAttribute("src") : ""), hijos: puntos(np) };
        }).filter(x => x.titulo);
        const navMap = porTag(d, "navMap")[0];
        if (navMap) toc = puntos(navMap);
      }
    }
    return {
      titulo: md("title")[0] || "Sin título", autor: md("creator").join(", "), idioma: (md("language")[0] || "").slice(0, 5),
      ident, modificado: (porTag(opf, "meta").find(m => m.getAttribute("property") === "dcterms:modified") || {}).textContent || "",
      spine, toc, portada: portada ? portada.href : "", bytes, txt,
    };
  }

  async function sha256(buf){
    try { const h = await crypto.subtle.digest("SHA-256", buf); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join(""); }
    catch { return ""; } // sin crypto.subtle (http sin TLS): no hay huella, se usa el tamaño
  }
  function tipoImagen(ruta){
    const ext = (ruta.split(".").pop() || "").toLowerCase();
    return { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", svg: "image/svg+xml", webp: "image/webp" }[ext] || "application/octet-stream";
  }
  // Una vista previa de la portada, chica, para la biblioteca.
  async function portadaChica(ep){
    if (!ep.portada || !ep.bytes(ep.portada)) return null;
    const blob = new Blob([ep.bytes(ep.portada)], { type: tipoImagen(ep.portada) });
    try {
      const img = await createImageBitmap(blob);
      const ancho = 360, alto = Math.round(img.height * ancho / img.width);
      const c = document.createElement("canvas"); c.width = ancho; c.height = alto;
      c.getContext("2d").drawImage(img, 0, 0, ancho, alto);
      return await new Promise(ok => c.toBlob(b => ok(b || blob), "image/jpeg", .82));
    } catch { return blob; }
  }

  // ---------- catálogo Fénix ----------
  let catalogo = null;
  async function traerCatalogo(){
    if (enLinea()) {
      try {
        const r = await fetch(CATALOGO, { cache: "no-cache" });
        if (r.ok) { const j = await r.json(); if (Array.isArray(j.libros)) { catalogo = j; conf.poner("catalogo", j); return j; } }
      } catch (e) { console.warn("Catálogo sin red:", e); }
    }
    if (!catalogo) catalogo = await conf.leer("catalogo", null);
    // La app recién instalada y sin señal: el catálogo que trae adentro, para que al menos se vea.
    if (!catalogo && APP) try { catalogo = await (await fetch("catalogo.json")).json(); } catch {}
    return catalogo;
  }
  const idFenix = c => `fenix-${c.id}-${c.idioma}`;

  // ---------- agregar y actualizar libros ----------
  // Un libro se identifica por su dc:identifier; si no trae, por título y autor. Al agregar uno que ya
  // está, se reemplaza el archivo y se conservan posición, marcadores y notas (que viven aparte, en estado).
  async function guardarEpub(buf, origen){
    const ep = leerEpub(buf);
    const sha = await sha256(buf);
    const libros = await DB.todos("libros");
    let previo = origen.fenix ? libros.find(l => l.id === idFenix(origen.fenix)) : null;
    if (!previo && ep.ident) previo = libros.find(l => l.ident === ep.ident);
    if (!previo) previo = libros.find(l => clave(l.titulo) === clave(ep.titulo) && clave(l.autor) === clave(ep.autor) && !!l.bilingue === !!origen.bilingue);
    // Un EPUB de Fénix agregado a mano queda unido al catálogo, para que se actualice solo.
    let fenix = origen.fenix || (previo && previo.fenix) || null;
    if (!fenix && sha && catalogo) { const c = catalogo.libros.find(x => x.sha === sha); if (c) fenix = { id: c.id, idioma: c.idioma }; }
    // El id sale del identificador (o título y autor): el mismo libro tiene el mismo id en todos los dispositivos.
    const huellaId = previo || fenix ? "" : await sha256(new TextEncoder().encode((origen.bilingue ? "bil|" : "") + (ep.ident || clave(ep.titulo + "|" + ep.autor))));
    const id = previo ? previo.id : fenix ? idFenix(fenix) : "ep-" + (huellaId ? huellaId.slice(0, 16) : nuevoId());
    const muestra = ep.spine.slice(0, 12).map(s => { try { return ep.txt(s.href); } catch { return ""; } }).join("");
    const libro = {
      id, titulo: ep.titulo, autor: ep.autor, idioma: ep.idioma, ident: ep.ident, sha, bytes: buf.byteLength,
      fenix, origen: fenix ? "fenix" : "archivo", bilingue: /class="[^"]*\borig\b/.test(muestra),
      portada: await portadaChica(ep), agregado: previo ? previo.agregado : Date.now(), actualizado: Date.now(),
      version: (previo ? (previo.version || 1) + (previo.sha !== sha ? 1 : 0) : 1), driveId: previo && previo.sha === sha ? previo.driveId : "",
      leido: previo ? previo.leido : 0, avance: previo ? previo.avance : 0, nuevaVersion: !!previo && previo.sha !== sha,
    };
    await DB.ponerLibro(libro, new Blob([buf], { type: "application/epub+zip" }));
    const borrados = await conf.leer("borrados", {});
    if (borrados[id]) { delete borrados[id]; await conf.poner("borrados", borrados); }
    Nube.pendiente();
    return { libro, reemplazo: !!previo && previo.sha !== sha, igual: !!previo && previo.sha === sha };
  }

  async function bajarDeFenix(c){
    const r = await fetch(SITIO + c.epub, { cache: "no-cache" });
    if (!r.ok) throw new Error(`Fénix respondió ${r.status} al pedir ${c.titulo}.`);
    const buf = await r.arrayBuffer();
    const res = await guardarEpub(buf, { fenix: { id: c.id, idioma: c.idioma } });
    // La huella que anunció el catálogo: si no calza con la del archivo (catálogo a medio publicar),
    // igual se anota, para no bajar el mismo libro en cada revisión.
    res.libro.shaFenix = c.sha;
    await DB.poner("libros", res.libro);
    return res;
  }

  async function agregarDeFenix(c, abrirAlTerminar){
    if (!enLinea()) { aviso("Sin conexión: este libro se podrá agregar cuando vuelva la señal."); return; }
    cargando(`Bajando «${c.titulo}»…`);
    try {
      const { libro } = await bajarDeFenix(c);
      cargando();
      aviso(`«${libro.titulo}» quedó en tu biblioteca y se lee sin conexión.`);
      await pintarBiblioteca();
      if (abrirAlTerminar) abrirLibro(libro.id);
    } catch (e) { cargando(); aviso(e.message || "No se pudo bajar el libro. Inténtalo de nuevo."); }
  }

  let actualizando = false;
  async function buscarActualizaciones(){
    if (actualizando || !enLinea()) return;
    actualizando = true;
    try {
      const cat = await traerCatalogo();
      if (!cat) return;
      const libros = (await DB.todos("libros")).filter(l => l.fenix);
      for (const l of libros) {
        const c = cat.libros.find(x => x.id === l.fenix.id && x.idioma === l.fenix.idioma);
        if (!c || !c.sha || c.sha === l.sha || c.sha === l.shaFenix) continue;
        try {
          await bajarDeFenix(c);
          const abierto = lectura && lectura.libro.id === l.id;
          aviso(`«${l.titulo}» se actualizó a la versión nueva de Fénix. Tu página, marcadores y notas siguen igual${abierto ? "; verás los cambios al volver a abrirlo" : ""}.`, 7000);
        } catch (e) { console.warn("Actualización pendiente:", l.titulo, e); }
      }
      await conf.poner("ultimaRevision", Date.now());
      if (!lectura) pintarBiblioteca();
    } finally { actualizando = false; }
  }

  async function agregarArchivos(archivos){
    for (const f of archivos) {
      cargando(`Agregando «${f.name}»…`);
      try {
        const { libro, reemplazo, igual } = await guardarEpub(await f.arrayBuffer(), { bilingue: /bilingue/i.test(f.name) });
        aviso(igual ? `«${libro.titulo}» ya estaba en tu biblioteca.` : reemplazo ? `«${libro.titulo}»: se reemplazó por la versión nueva, sin duplicarlo. Tu página, marcadores y notas se mantienen.` : `«${libro.titulo}» quedó en tu biblioteca.`, 6000);
      } catch (e) { aviso(`«${f.name}»: ${e.message || "no se pudo leer."}`, 7000); }
    }
    cargando();
    pintarBiblioteca();
  }
  $("#archivoEpub").addEventListener("change", e => { const fs = [...e.target.files]; e.target.value = ""; if (fs.length) agregarArchivos(fs); });
  // Soltar un EPUB sobre la biblioteca, en el computador.
  document.addEventListener("dragover", e => { if (!lectura) e.preventDefault(); });
  document.addEventListener("drop", e => {
    if (lectura) return;
    e.preventDefault();
    const fs = [...(e.dataTransfer?.files || [])].filter(f => /\.epub$/i.test(f.name));
    if (fs.length) agregarArchivos(fs);
  });
  // App de Android: EPUB abiertos con «Abrir con Lector Fénix» (WhatsApp, Archivos). Android los deja en la
  // caché de la app y avisa con «lectorArchivo»; al arrancar se piden los que llegaron antes que el lector.
  async function recibirDeAndroid(){
    const r = await nativo("pendientes").catch(() => null);
    for (const a of (r && r.archivos) || []) {
      if (a.error || !a.ruta) { aviso(`«${a.nombre || "El archivo"}»: no se pudo abrir.`, 7000); continue; }
      cargando(`Agregando «${a.nombre}»…`);
      try {
        const buf = await (await fetch(window.Capacitor.convertFileSrc(a.ruta))).arrayBuffer();
        const { libro, reemplazo, igual } = await guardarEpub(buf, { bilingue: /bilingue/i.test(a.nombre) });
        cargando();
        nativo("descartar", { ruta: a.ruta }).catch(() => {});
        if (!igual) aviso(reemplazo ? `«${libro.titulo}»: se reemplazó por la versión nueva. Tu página, marcadores y notas se mantienen.` : `«${libro.titulo}» quedó en tu biblioteca.`, 6000);
        await pintarBiblioteca();
        abrirLibro(libro.id);
      } catch (e) { cargando(); aviso(`«${a.nombre}»: ${e.message || "no es un EPUB que se pueda leer."}`, 7000); }
    }
  }
  if (APP) addEventListener("lectorArchivo", recibirDeAndroid);

  async function eliminarLibro(l){
    if (!await confirmar("Eliminar libro", `¿Eliminar «${l.titulo}» de este dispositivo${Nube.activa() ? " y de tu nube" : ""}? Tus marcadores y notas se guardan por si lo vuelves a agregar.`)) return;
    await DB.borrarLibro(l.id);
    const borrados = await conf.leer("borrados", {});
    borrados[l.id] = Date.now();
    await conf.poner("borrados", borrados);
    Nube.pendiente();
    aviso(`«${l.titulo}» se eliminó.`);
    pintarBiblioteca();
  }

  // ---------- biblioteca ----------
  const urlsPortada = [];
  function tarjeta(l){
    const b = document.createElement("div");
    b.className = "tarjeta"; b.tabIndex = 0; b.setAttribute("role", "button"); b.dataset.id = l.id;
    let img = `<div class="sin">${esc(l.titulo)}</div>`;
    if (l.portada) { const u = URL.createObjectURL(l.portada); urlsPortada.push(u); img = `<img alt="" src="${u}">`; }
    const pct = Math.round((l.avance || 0) * 100);
    b.innerHTML = `<div class="tapa">${img}</div>
      <div class="t">${esc(l.titulo)}</div><div class="a">${esc(l.autor)}</div>
      <div class="avance" title="${pct} % leído"><i style="width:${pct}%"></i></div>
      <div class="chips">${pct ? `<span class="chip">${pct} %</span>` : ""}${l.bilingue ? `<span class="chip">Bilingüe</span>` : ""}${l.fenix ? `<span class="chip">Fénix</span>` : ""}${l.nuevaVersion ? `<span class="chip nuevo">Versión nueva</span>` : ""}</div>
      <button class="mas" type="button" aria-label="Opciones de ${esc(l.titulo)}">⋯</button>`;
    b.addEventListener("click", e => { if (e.target.closest(".mas")) { e.stopPropagation(); fichaLocal(l); } else abrirLibro(l.id); });
    b.addEventListener("keydown", e => { if (e.key === "Enter") abrirLibro(l.id); });
    return b;
  }
  async function pintarBiblioteca(){
    urlsPortada.splice(0).forEach(u => URL.revokeObjectURL(u));
    let libros = [];
    try { libros = await DB.todos("libros"); }
    catch { $("#estante").innerHTML = ""; $("#estanteVacio").hidden = false; $("#estanteVacio").textContent = "Este navegador no deja guardar libros (¿ventana privada?). Ábrelo en una ventana normal."; return; }
    libros.sort((a, b) => (b.leido || b.agregado) - (a.leido || a.agregado));
    const est = $("#estante"); est.innerHTML = "";
    libros.forEach(l => est.append(tarjeta(l)));
    $("#estanteVacio").hidden = libros.length > 0;
    pintarCatalogo();
  }
  function fichaLocal(l){
    const d = $("#dlgLibro");
    $("#libroTitulo").textContent = l.titulo;
    const fecha = t => t ? new Date(t).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }) : "-";
    $("#libroInfo").innerHTML = `<p style="margin:0 0 6px">${esc(l.autor)}</p>
      <p class="etq" style="margin:0 0 4px">${l.fenix ? "De Proyecto Fénix: se actualiza solo cuando sale una versión corregida" : "Agregado desde un archivo"}</p>
      <p class="etq" style="margin:0">Versión ${l.version || 1} · actualizada el ${esc(fecha(l.actualizado))} · ${(l.bytes / 1048576).toFixed(1)} MB</p>`;
    const acc = $("#libroAcciones"); acc.innerHTML = "";
    const boton = (txt, clase, fn) => { const b = document.createElement("button"); b.type = "button"; b.className = "btn " + clase; b.textContent = txt; b.onclick = fn; acc.append(b); };
    boton("Eliminar", "peligro", () => { d.close(); eliminarLibro(l); });
    if (l.fenix) boton("Buscar versión nueva", "", async () => {
      d.close();
      if (!enLinea()) return aviso("Sin conexión: se buscará sola cuando vuelva la señal.");
      cargando("Buscando versión nueva…");
      const cat = await traerCatalogo(); cargando();
      const c = cat && cat.libros.find(x => x.id === l.fenix.id && x.idioma === l.fenix.idioma);
      if (!c) return aviso("Este libro ya no está en el catálogo de Fénix; tu copia sigue aquí.");
      if (c.sha === l.sha || c.sha === l.shaFenix) return aviso("Ya tienes la última versión.");
      await buscarActualizaciones();
    });
    boton("Leer", "prim", () => { d.close(); abrirLibro(l.id); });
    d.showModal();
  }

  let filtroCat = "";
  async function pintarCatalogo(){
    if ($("#secFenix").hidden) return;
    const cat = await traerCatalogo();
    const lista = $("#catalogo"), vacio = $("#catalogoVacio");
    lista.innerHTML = "";
    if (!cat) { vacio.hidden = false; vacio.textContent = "Sin conexión: el catálogo aparecerá cuando vuelva la señal. Tus libros se leen igual."; return; }
    const tengo = new Set((await DB.todos("libros").catch(() => [])).map(l => l.id));
    const q = clave(filtroCat);
    const items = cat.libros.filter(c => !q || clave(c.titulo + " " + c.autor).includes(q));
    vacio.hidden = items.length > 0; vacio.textContent = "Ningún libro coincide.";
    for (const c of items.slice(0, 400)) {
      const f = document.createElement("div"); f.className = "fila";
      const ya = tengo.has(idFenix(c));
      f.innerHTML = `${c.portada ? `<img alt="" loading="lazy" src="${SITIO}${esc(c.portada)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'mini'}))">` : `<div class="mini"></div>`}
        <div class="txt"><div class="t">${esc(c.titulo)}</div><div class="a">${esc(c.autor)}${c.idioma !== "es" ? " · " + esc(c.idioma.toUpperCase()) : ""}</div></div>
        <button class="btn ${ya ? "" : "prim"}" type="button">${ya ? "Leer" : "Agregar"}</button>`;
      f.querySelector("button").onclick = () => ya ? abrirLibro(idFenix(c)) : agregarDeFenix(c, false);
      lista.append(f);
    }
  }
  function pestana(cual){
    $("#tabMios").setAttribute("aria-selected", cual === "mios");
    $("#tabFenix").setAttribute("aria-selected", cual === "fenix");
    $("#secMios").hidden = cual !== "mios"; $("#secFenix").hidden = cual !== "fenix";
    if (cual === "fenix") pintarCatalogo();
  }
  $("#tabMios").onclick = () => pestana("mios");
  $("#tabFenix").onclick = () => pestana("fenix");
  $("#irCatalogo").onclick = e => { e.preventDefault(); pestana("fenix"); };
  $("#buscarCat").addEventListener("input", e => { filtroCat = e.target.value; pintarCatalogo(); });

  function pintarRed(){
    const a = $("#avisoRed");
    a.hidden = enLinea();
    a.innerHTML = "<b>Sin conexión.</b> Tus libros, marcadores y notas funcionan igual; las correcciones y la nube esperan a que vuelva la señal.";
  }
  window.addEventListener("online", () => { pintarRed(); enviarCola(); buscarActualizaciones(); Nube.sincronizar(false); });
  window.addEventListener("offline", pintarRed);

  // ---------- ajustes de lectura ----------
  const AJ_DEF = { tam: 20, interlineado: 1.6, ancho: 36, letra: "garamond", tema: "auto", bilingue: "auto", pantalla: "si" };
  let aj = { ...AJ_DEF };
  const LETRAS = { garamond: 'var(--letra)', georgia: 'Georgia,"Times New Roman",serif', sans: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', libro: 'var(--letra)' };
  function aplicarAjustes(){
    const v = $("#vistaLectura");
    v.style.setProperty("--tam", aj.tam + "px");
    v.style.setProperty("--interlineado", aj.interlineado);
    v.style.setProperty("--ancho", aj.ancho + "em");
    v.style.setProperty("--letra-lectura", LETRAS[aj.letra] || LETRAS.garamond);
    v.dataset.letra = aj.letra;
    v.dataset.bilingue = lectura && lectura.bilingue ? (aj.bilingue === "auto" ? (innerWidth > 760 ? "lado" : "inter") : aj.bilingue) : "";
    if (aj.tema === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = aj.tema;
    const oscuro = aj.tema === "dark" || (aj.tema === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    $('meta[name="theme-color"]').content = oscuro ? "#16110f" : aj.tema === "sepia" ? "#f1e5cc" : "#faf6ef";
  }
  function pintarAjustes(){
    const grupo = (titulo, k, opciones) => `<div class="ajuste"><span>${titulo}</span><div class="segmentos">${opciones.map(([v, t]) =>
      `<button type="button" data-k="${k}" data-v="${v}" aria-pressed="${String(aj[k]) === String(v)}">${t}</button>`).join("")}</div></div>`;
    $("#ajustes").innerHTML =
      `<div class="ajuste"><span>Tamaño de letra</span><div class="segmentos"><button type="button" data-paso="-1" aria-label="Letra más chica">A−</button><button type="button" disabled>${aj.tam} px</button><button type="button" data-paso="1" aria-label="Letra más grande">A+</button></div></div>` +
      grupo("Letra", "letra", [["garamond", "Garamond"], ["georgia", "Georgia"], ["sans", "Sin serifa"], ["libro", "La del libro"]]) +
      grupo("Colores", "tema", [["auto", "Como el sistema"], ["light", "Claro"], ["sepia", "Sepia"], ["dark", "Oscuro"]]) +
      grupo("Interlineado", "interlineado", [[1.35, "Junto"], [1.6, "Normal"], [1.9, "Amplio"]]) +
      grupo("Ancho del texto", "ancho", [[30, "Angosto"], [36, "Normal"], [46, "Ancho"]]) +
      (APP || (tactil && document.fullscreenEnabled) ? grupo("Pantalla completa al leer", "pantalla", [["si", "Sí"], ["no", "No"]]) : "") +
      (lectura && lectura.bilingue ? grupo("Edición bilingüe", "bilingue", [["auto", "Automático"], ["lado", "Lado a lado"], ["inter", "Intercalado"], ["trad", "Solo traducción"], ["orig", "Solo original"]]) +
        `<p class="etq">Lado a lado necesita una pantalla ancha; en el celular se muestra intercalado.</p>` : "");
  }
  $("#ajustes").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.paso) aj.tam = Math.min(34, Math.max(13, aj.tam + 2 * b.dataset.paso));
    else if (b.dataset.k) aj[b.dataset.k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
    else return;
    try { localStorage.setItem("lector.ajustes", JSON.stringify(aj)); } catch {}
    conf.poner("ajustes", aj);
    aplicarAjustes(); pintarAjustes();
    if (aj.pantalla === "no") salirPantallaCompleta();
    else if (APP && lectura) pantallaCompleta();
    if (lectura) reajustar();
  });

  // ---------- lectura ----------
  let lectura = null; // { libro, ep, estado, i, recursos: Map, bloques: [], bilingue }
  const barraAlto = () => $("#vistaLectura header").offsetHeight || 56;

  async function abrirLibro(id, ancla){
    pantallaCompleta(); // antes de cualquier await: el navegador la permite solo en respuesta a un toque
    cargando("Abriendo…");
    try {
      const libro = await DB.get("libros", id);
      const arch = await DB.get("archivos", id);
      if (!libro || !arch) throw new Error("Este libro ya no está en el dispositivo.");
      const ep = leerEpub(await arch.blob.arrayBuffer());
      cerrarLectura(false);
      lectura = { libro, ep, estado: await estadoDe(id), i: 0, recursos: new Map(), bloques: [], bilingue: !!libro.bilingue };
      if (libro.nuevaVersion) { libro.nuevaVersion = false; DB.poner("libros", libro); }
      $("#vistaBiblio").hidden = true; $("#vistaLectura").hidden = false;
      nativo("volumen", { activo: true }).catch(() => {});
      $("#tituloLectura").textContent = libro.titulo;
      document.title = libro.titulo + " · Lector Fénix";
      const destino = ancla || lectura.estado.pos;
      if (location.hash !== "#leer=" + encodeURIComponent(id)) history.pushState({ leer: id }, "", "#leer=" + encodeURIComponent(id));
      if (destino) await irAPosicion(destino, true);
      else await mostrarCapitulo(primerCapituloConTexto(), 0);
      mostrarControles(false);
      cargando();
      try {
        if (!localStorage.getItem("lector.ayudaPaginas")) {
          aviso(`Toca los bordes o desliza para pasar de página${APP ? " (también con los botones de volumen)" : ""}; toca al centro para ver el menú.`, 7000);
          localStorage.setItem("lector.ayudaPaginas", "1");
        }
      } catch {}
      Nube.sincronizar(false);
    } catch (e) {
      cargando(); console.warn(e);
      aviso(e.message || "No se pudo abrir el libro.", 6000);
      volverBiblioteca();
    }
  }
  // Se salta la portada y lo que no trae texto (la imagen de tapa no es un buen comienzo).
  function primerCapituloConTexto(){
    const sp = lectura.ep.spine;
    for (let i = 0; i < Math.min(sp.length, 4); i++) {
      try { const t = lectura.ep.txt(sp[i].href).replace(/<[^>]+>/g, " "); if (norm(t).length > 200) return i; } catch {}
    }
    return 0;
  }
  function cerrarLectura(pintar = true){
    if (!lectura) return;
    guardarPosicion(true);
    for (const u of lectura.recursos.values()) URL.revokeObjectURL(u);
    lectura = null;
    $("#texto").innerHTML = "";
    if (pintar) pintarBiblioteca();
  }
  function volverBiblioteca(){
    cerrarSeleccion();
    cerrarLectura();
    mostrarControles(false); salirPantallaCompleta(); pantallaEncendida(false);
    nativo("volumen", { activo: false }).catch(() => {});
    $("#vistaLectura").hidden = true; $("#vistaBiblio").hidden = false;
    document.title = "Lector Fénix";
    if (location.hash.startsWith("#leer=")) history.replaceState(null, "", location.pathname);
    aplicarAjustes();
    Nube.sincronizar(false);
  }
  $("#btnVolver").onclick = volverBiblioteca;
  window.addEventListener("popstate", () => {
    const m = location.hash.match(/^#leer=(.+)$/);
    if (!m && lectura) volverBiblioteca();
    else if (m && (!lectura || lectura.libro.id !== decodeURIComponent(m[1]))) abrirLibro(decodeURIComponent(m[1]));
  });

  function urlRecurso(ruta){
    const L = lectura;
    if (L.recursos.has(ruta)) return L.recursos.get(ruta);
    const b = L.ep.bytes(ruta);
    const u = b ? URL.createObjectURL(new Blob([b], { type: tipoImagen(ruta) })) : "data:,";
    L.recursos.set(ruta, u);
    return u;
  }

  // CSS del libro acotado a #texto: cada selector pasa a «#texto <selector>» y html/body a #texto.
  function cssAcotado(texto, rutaCss){
    texto = texto.replace(/@import[^;]*;/g, "").replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) =>
      /^data:/.test(u) ? m : /^(https?:)?\/\//.test(u) ? 'url("data:,")' : `url("${urlRecurso(resolver(dirDe(rutaCss), u).ruta)}")`);
    let hoja;
    try { hoja = new CSSStyleSheet(); hoja.replaceSync(texto); } catch { return ""; }
    const sel = s => s.split(",").map(x => {
      x = x.trim().replace(/(^|[\s>+~])(html|body)(?=$|[\s>+~.#:[])/gi, "$1").replace(/^[\s>+~]+/, "").trim();
      // html y body del libro van al capítulo, no a #texto: un margen o relleno en #texto corre las
      // columnas y la página se ve cortada a la derecha.
      return x ? `#texto ${x}` : "#texto .lx-cap";
    }).join(", ");
    const regla = r => {
      if (r instanceof CSSStyleRule) {
        // Nada de fijar posiciones ni tapar la barra: el libro no manda en el marco del lector.
        const css = r.style.cssText.replace(/(^|;)\s*position\s*:\s*(fixed|sticky)[^;]*/gi, "$1");
        return `${sel(r.selectorText)}{${css}}`;
      }
      if (r instanceof CSSMediaRule) return `@media ${r.media.mediaText}{${[...r.cssRules].map(regla).join("")}}`;
      if (r instanceof CSSFontFaceRule) return r.cssText;
      if (typeof CSSSupportsRule !== "undefined" && r instanceof CSSSupportsRule) return `@supports ${r.conditionText}{${[...r.cssRules].map(regla).join("")}}`;
      return "";
    };
    return [...hoja.cssRules].map(regla).join("\n");
  }

  const PROHIBIDOS = "script,style,link,meta,iframe,frame,frameset,object,embed,form,input,button,textarea,select,base,noscript,audio,video,source,track,title,head";
  // Desarma el capítulo y lo deja seguro: sin scripts ni eventos, imágenes desde el propio EPUB,
  // enlaces internos como data-ir y los id con prefijo para que no choquen con los del lector.
  function prepararCapitulo(i){
    const L = lectura, it = L.ep.spine[i];
    const fuente = L.ep.txt(it.href);
    let doc = new DOMParser().parseFromString(fuente, /html\+xml|xml/.test(it.tipo) ? "application/xhtml+xml" : "text/html");
    if (!doc.body || doc.querySelector("parsererror")) doc = new DOMParser().parseFromString(fuente, "text/html");
    const base = dirDe(it.href);
    let css = "";
    for (const l of $$("link", doc)) {
      if (!/stylesheet/i.test(l.getAttribute("rel") || "")) continue;
      const r = resolver(base, l.getAttribute("href") || "").ruta;
      try { css += cssAcotado(L.ep.txt(r), r) + "\n"; } catch {}
    }
    for (const s of $$("style", doc)) css += cssAcotado(s.textContent, it.href) + "\n";
    const cuerpo = doc.body;
    $$(PROHIBIDOS, cuerpo).forEach(e => e.remove());
    for (const e of [cuerpo, ...cuerpo.querySelectorAll("*")]) {
      for (const at of [...e.attributes]) {
        const n = at.name.toLowerCase();
        if (n.startsWith("on") || n === "srcset" || n === "autofocus" || n === "contenteditable" || n === "tabindex") e.removeAttribute(at.name);
        else if (n === "style" && /url\(|position\s*:\s*(fixed|sticky)|expression/i.test(at.value)) e.removeAttribute(at.name);
        else if (n === "id") e.setAttribute("id", "e_" + at.value);
      }
      const tag = e.localName;
      if (tag === "img") { const s = e.getAttribute("src"); e.setAttribute("src", s && !/^data:/.test(s) ? (/^https?:/.test(s) ? "data:," : urlRecurso(resolver(base, s).ruta)) : (s || "data:,")); e.setAttribute("loading", "lazy"); }
      if (tag === "image") {
        for (const k of ["href", "xlink:href"]) { const s = e.getAttribute(k); if (s) e.setAttribute(k, /^https?:/.test(s) ? "data:," : urlRecurso(resolver(base, s).ruta)); }
      }
      if (tag === "a") {
        const h = e.getAttribute("href");
        if (!h) continue;
        if (/^(https?:|mailto:)/i.test(h)) { e.setAttribute("target", "_blank"); e.setAttribute("rel", "noopener noreferrer"); }
        else if (/^javascript:/i.test(h)) e.removeAttribute("href");
        else { const r = resolver(base, h); e.dataset.ir = (r.ruta || it.href) + "#" + r.frag; e.setAttribute("href", "#"); }
      }
    }
    const div = document.createElement("div");
    div.className = "lx-cap";
    if (doc.documentElement.getAttribute("lang") || doc.documentElement.getAttribute("xml:lang")) div.lang = doc.documentElement.getAttribute("lang") || doc.documentElement.getAttribute("xml:lang");
    div.append(...[...cuerpo.childNodes].map(n => document.importNode(n, true)));
    return { div, css };
  }

  // Edición bilingüe de Fénix: cada <p class="orig" lang="xx"> sigue a su párrafo traducido. Se arma
  // un par por cada uno para poder mostrarlos lado a lado, intercalados o uno solo.
  function emparejar(raiz){
    const origs = $$(".orig", raiz);
    if (!origs.length) return null;
    const idiomas = new Set();
    for (const o of origs) {
      if (o.lang) idiomas.add(o.lang);
      const prev = o.previousElementSibling;
      if (!prev || prev.classList.contains("orig") || prev.classList.contains("lx-par")) continue;
      const par = document.createElement("div"); par.className = "lx-par";
      prev.before(par); prev.classList.add("lx-trad"); par.append(prev, o);
    }
    return [...idiomas][0] || "";
  }
  const NOMBRE_IDIOMA = { fr: "Original francés", en: "Original inglés", la: "Original latino", it: "Original italiano", de: "Original alemán", pt: "Original portugués", es: "Original" };

  async function mostrarCapitulo(i, pagina){
    const L = lectura;
    i = Math.max(0, Math.min(L.ep.spine.length - 1, i));
    cerrarSeleccion(); cerrarFlotante();
    let prep;
    try { prep = prepararCapitulo(i); }
    catch (e) { console.warn(e); prep = { div: Object.assign(document.createElement("p"), { textContent: "Este capítulo no se pudo mostrar." }), css: "" }; }
    L.i = i;
    const texto = $("#texto");
    texto.innerHTML = "";
    texto.lang = (L.libro.idioma || "es").slice(0, 2);
    const estilo = document.createElement("style"); estilo.textContent = prep.css;
    texto.append(estilo);
    const idioma = emparejar(prep.div);
    if (idioma !== null) {
      L.bilingue = true;
      const cab = document.createElement("div"); cab.className = "lx-idiomas"; cab.setAttribute("aria-hidden", "true");
      cab.innerHTML = `<span>Traducción</span><span>${esc(NOMBRE_IDIOMA[idioma.slice(0, 2)] || "Original")}</span>`;
      texto.append(cab);
    }
    // Marca el final del texto: su columna dice cuántas páginas tiene el capítulo.
    const fin = document.createElement("span"); fin.className = "lx-fin"; fin.setAttribute("aria-hidden", "true");
    prep.div.append(fin);
    texto.append(prep.div);
    // Sin carga diferida: en columnas las imágenes quedan fuera de la pantalla y no cargarían nunca. La que
    // llega tarde cambia el alto del texto y se vuelve a paginar.
    $$("img", prep.div).forEach(im => { im.removeAttribute("loading"); if (!im.complete) im.addEventListener("load", reajustar, { once: true }); });
    aplicarAjustes();
    // Bloques de texto sin otro bloque adentro (un li con párrafos cuenta por sus párrafos): en orden y
    // sin anidar; las posiciones guardadas antes de las páginas (21-nov-2026) apuntan a uno de ellos.
    const BLOQUE = "p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, dt, dd, td, figcaption";
    L.bloques = $$(BLOQUE, prep.div).filter(e => !e.querySelector(BLOQUE) && norm(e.textContent));
    pintarMarcas();
    $("#capAnterior").disabled = i === 0;
    $("#capSiguiente").disabled = i === L.ep.spine.length - 1;
    $("#capActual").textContent = tituloCapitulo();
    await maquetar();
    irPagina(pagina === "fin" ? L.paginas - 1 : (pagina || 0), false);
    marcarIndice();
  }
  $("#capAnterior").onclick = async () => { if (!lectura) return; await mostrarCapitulo(lectura.i - 1, 0); guardarPosicion(); };
  $("#capSiguiente").onclick = async () => { if (!lectura) return; await mostrarCapitulo(lectura.i + 1, 0); guardarPosicion(); };

  // ---------- páginas ----------
  // Mide la hoja y arma las columnas: una página por pantalla, o dos (libro abierto) en pantalla ancha y
  // apaisada. Corre al abrir un capítulo, al girar el teléfono, al cambiar la letra y al cargar una imagen.
  async function maquetar(){
    const L = lectura; if (!L) return;
    try { await Promise.race([document.fonts.ready, espera(800)]); } catch {}
    if (!lectura) return;
    const v = $("#vistaLectura"), hoja = $("#hoja"), marco = $("#marco"), texto = $("#texto");
    const lado = innerWidth < 500 ? 18 : 28, gap = 2 * lado;
    const disp = Math.max(160, hoja.clientWidth - 2 * lado);
    const ladoAlado = v.dataset.bilingue === "lado";
    const anchoCol = aj.ancho * aj.tam * (ladoAlado ? 1.9 : 1);
    const dos = !ladoAlado && innerWidth >= 900 && innerWidth > innerHeight && disp >= 1.6 * anchoCol + gap;
    const col = dos ? Math.min(anchoCol, (disp - gap) / 2) : Math.min(anchoCol, disp);
    const ancho = Math.floor(dos ? 2 * col + gap : col);
    marco.style.width = texto.style.width = ancho + "px";
    texto.style.columnCount = dos ? 2 : 1;
    texto.style.columnGap = gap + "px";
    v.style.setProperty("--alto-pag", Math.floor(hoja.clientHeight * 0.96) + "px");
    L.paso = ancho + gap;
    const f = $("#texto .lx-fin");
    L.paginas = f ? Math.max(1, Math.floor((f.getBoundingClientRect().left - texto.getBoundingClientRect().left + 2) / L.paso) + 1) : 1;
    L.cachePag = new Map();
  }
  function irPagina(p, animar = true, ancla = null){
    const L = lectura; if (!L) return;
    L.pag = Math.max(0, Math.min(L.paginas - 1, Math.round(p) || 0));
    const t = $("#texto");
    t.classList.toggle("sin-animar", !animar);
    t.style.transform = `translateX(${-L.pag * L.paso}px)`;
    cerrarFlotante();
    // El ancla se toma acá y no al girar o cambiar la letra: para entonces el texto ya se movió. Al
    // repaginar se conserva la de antes (va en algún lugar de la página nueva); si se tomara de nuevo, cada
    // cambio de letra la correría hacia atrás.
    L.ancla = ancla || posicionActual();
    actualizarProgreso();
    guardarPosicion();
    pantallaEncendida(true);
  }
  let ocupado = false;
  async function siguiente(){
    const L = lectura; if (!L || ocupado) return;
    if (L.pag < L.paginas - 1) return irPagina(L.pag + 1);
    if (L.i >= L.ep.spine.length - 1) { irPagina(L.pag); aviso("Fin del libro."); return; }
    ocupado = true;
    try { await mostrarCapitulo(L.i + 1, 0); } finally { ocupado = false; }
  }
  async function anterior(){
    const L = lectura; if (!L || ocupado) return;
    if (L.pag > 0) return irPagina(L.pag - 1);
    if (L.i === 0) { irPagina(0); return; }
    ocupado = true;
    try { await mostrarCapitulo(L.i - 1, "fin"); } finally { ocupado = false; }
  }
  let reajT;
  function reajustar(){
    clearTimeout(reajT);
    reajT = setTimeout(async () => {
      const L = lectura; if (!L) return;
      const ancla = L.ancla;
      await maquetar();
      if (lectura === L) irPagina(ancla ? paginaDePos(ancla) : L.pag, false, ancla);
    }, 150);
  }
  $("#deslizador").addEventListener("input", e => irPagina(+e.target.value - 1, false));
  function mostrarControles(si){ $("#vistaLectura").toggleAttribute("data-controles", !!si); }

  // ---------- toques y deslizar ----------
  // Tercio izquierdo: página anterior; tercio derecho: siguiente; centro: muestra u oculta los controles.
  // Deslizar con el dedo arrastra la página. Dejar el dedo apretado selecciona texto y no pasa la página.
  let gesto = null;
  const hoja = $("#hoja");
  hoja.addEventListener("pointerdown", e => {
    if (!lectura || (e.pointerType === "mouse" && e.button !== 0)) return;
    gesto = { x: e.clientX, y: e.clientY, t: Date.now(), tipo: e.pointerType, dx: 0, arrastre: false,
      flotante: !$("#nota-flotante").hidden, sel: !getSelection().isCollapsed, sobre: !!e.target.closest("a[data-ir], a[href^='http'], mark[data-n]") };
  });
  hoja.addEventListener("pointermove", e => {
    const g = gesto; if (!g || g.tipo === "mouse" || !lectura) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.arrastre) {
      if (Math.abs(dx) < 12 || Math.abs(dx) < 1.2 * Math.abs(dy) || !getSelection().isCollapsed) return;
      g.arrastre = true; $("#texto").classList.add("sin-animar");
    }
    g.dx = dx;
    $("#texto").style.transform = `translateX(${-lectura.pag * lectura.paso + dx}px)`;
  });
  hoja.addEventListener("pointerup", e => {
    const g = gesto; gesto = null;
    if (!g || !lectura) return;
    if (g.arrastre) {
      const rapido = Math.abs(g.dx) / Math.max(1, Date.now() - g.t) > 0.35;
      if (g.dx < -50 || (g.dx < -20 && rapido)) siguiente();
      else if (g.dx > 50 || (g.dx > 20 && rapido)) anterior();
      else irPagina(lectura.pag);
      return;
    }
    if (Math.hypot(e.clientX - g.x, e.clientY - g.y) > 10 || Date.now() - g.t > 600 || g.sobre || g.flotante) return;
    if (g.sel || !getSelection().isCollapsed) { getSelection().removeAllRanges(); return; }
    tocar(e.clientX);
  });
  hoja.addEventListener("pointercancel", () => { if (gesto && gesto.arrastre && lectura) irPagina(lectura.pag); gesto = null; });
  function tocar(x){
    if ($("#vistaLectura").hasAttribute("data-controles")) { mostrarControles(false); return; }
    const r = $("#hoja").getBoundingClientRect(), f = (x - r.left) / r.width;
    if (f < 0.3) anterior(); else if (f > 0.7) siguiente(); else mostrarControles(true);
    pantallaCompleta();
  }
  let ruedaT = 0;
  hoja.addEventListener("wheel", e => {
    if (!lectura) return;
    e.preventDefault();
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 8 || Date.now() - ruedaT < 300) return;
    ruedaT = Date.now();
    if (d > 0) siguiente(); else anterior();
  }, { passive: false });
  document.addEventListener("keydown", e => {
    if (!lectura || e.target.closest("input, textarea, dialog") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); siguiente(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); anterior(); }
    else if (e.key === "Escape") mostrarControles(false);
  });
  // App de Android: volumen abajo, página siguiente; volumen arriba, anterior (MainActivity.dispatchKeyEvent).
  if (APP) addEventListener("lectorVolumen", e => {
    if (!lectura || $("dialog[open]")) return;
    if (e.paso > 0) siguiente(); else anterior();
  });

  // ---------- pantalla completa y pantalla encendida ----------
  const tactil = matchMedia("(pointer: coarse)").matches;
  const instalado = () => matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches || navigator.standalone === true;
  function pantallaCompleta(){
    // En la app, la de Android: sin barra de estado ni botones de navegación (vuelven deslizando del borde).
    if (APP) { if (aj.pantalla !== "no") nativo("pantallaCompleta", { activa: true }).catch(() => {}); return; }
    if (aj.pantalla === "no" || !tactil || !document.fullscreenEnabled || document.fullscreenElement || matchMedia("(display-mode: fullscreen)").matches) return;
    try { document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {}); } catch {}
  }
  function salirPantallaCompleta(){ if (APP) nativo("pantallaCompleta", { activa: false }).catch(() => {}); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
  // La pantalla no se apaga mientras se lee; si pasan diez minutos sin cambiar de página, vuelve a apagarse sola.
  let despierta = null, despiertaT;
  async function pantallaEncendida(si){
    clearTimeout(despiertaT);
    try {
      if (si) {
        despiertaT = setTimeout(() => pantallaEncendida(false), 10 * 60e3);
        if (!despierta && "wakeLock" in navigator && document.visibilityState === "visible") {
          despierta = await navigator.wakeLock.request("screen");
          despierta.addEventListener("release", () => { despierta = null; });
        }
      } else if (despierta) { const d = despierta; despierta = null; await d.release(); }
    } catch {}
  }

  // ---------- posición ----------
  // La posición es el primer carácter de la página: su texto (cita y lo que la antecede), no un número de
  // página. Al cambiar la letra, girar el teléfono o llegar una versión nueva del libro, se busca ese texto
  // y se abre la página donde quedó.
  function paginaDeRect(r){
    const L = lectura;
    return Math.max(0, Math.min(L.paginas - 1, Math.floor((r.left - $("#texto").getBoundingClientRect().left + 2) / L.paso)));
  }
  const rectVisible = rg => [...rg.getClientRects()].find(r => r.width || r.height) || null;
  function nodoEn(plano, off){
    let lo = 0, hi = plano.nodos.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (plano.nodos[m].ini <= off) lo = m; else hi = m - 1; }
    return [lo, off - (plano.nodos[lo] ? plano.nodos[lo].ini : 0)];
  }
  // Desde off en adelante, el primer carácter que se ve: { k, pag }. Salta espacios y texto oculto (el
  // original de una edición bilingüe en «Solo traducción»).
  function primeroVisible(plano, off){
    let [idx, o] = nodoEn(plano, off);
    const rg = document.createRange();
    for (let c = 0; idx < plano.nodos.length && c < 400; idx++, o = 0, c++) {
      const { n, ini } = plano.nodos[idx], d = n.data;
      let j = Math.max(0, o);
      while (j < d.length && /\s/.test(d[j])) j++;
      if (j >= d.length) continue;
      rg.setStart(n, j); rg.setEnd(n, j + 1);
      const r = rectVisible(rg);
      if (r) return { k: ini + j, pag: paginaDeRect(r) };
    }
    return { k: plano.texto.length, pag: Infinity };
  }
  // Primer carácter de la página p: bisección sobre el texto, que corre en orden por las columnas.
  function primerCaracter(plano, p){
    let lo = 0, hi = plano.texto.length - 1, res = plano.texto.length;
    while (lo <= hi) { const m = (lo + hi) >> 1, v = primeroVisible(plano, m); if (v.pag >= p) { res = v.k; hi = m - 1; } else lo = m + 1; }
    return res;
  }
  function posicionActual(){
    const L = lectura, cap = $("#texto .lx-cap");
    const pos = { href: L.ep.spine[L.i].href, i: L.i, frac: L.paginas > 1 ? L.pag / (L.paginas - 1) : 0, t: Date.now() };
    if (!cap) return pos;
    const plano = textoPlano(cap), k = primerCaracter(plano, L.pag || 0);
    if (k < plano.texto.length) { pos.off = k; pos.cita = plano.texto.slice(k, k + 120); pos.prefijo = plano.texto.slice(Math.max(0, k - 48), k); }
    return pos;
  }
  // Página de una posición guardada: primero su texto (también el de las posiciones de antes de las
  // páginas, que guardaban el comienzo de un párrafo), después el número de párrafo y al final la fracción.
  function paginaDePos(pos){
    const L = lectura, cap = $("#texto .lx-cap");
    if (cap && pos.cita) {
      // Se mide el primer carácter que se ve desde el comienzo de la cita, no el rectángulo del rango: ese
      // puede empezar en el final de la línea anterior, en la página de antes.
      const plano = textoPlano(cap);
      const r = rangoDeCita(plano, { exacto: pos.cita.slice(0, 80), prefijo: pos.prefijo || "", sufijo: "" });
      const k = r ? offsetEn(plano, r.startContainer, r.startOffset) : -1;
      if (k >= 0) { const v = primeroVisible(plano, k); if (v.pag !== Infinity) return v.pag; }
    }
    if (pos.b != null && L.bloques[pos.b]) { const rc = L.bloques[pos.b].getClientRects()[0]; if (rc) return paginaDeRect(rc); }
    return Math.round((pos.frac || 0) * (L.paginas - 1));
  }
  function paginaDeElemento(el){
    const rc = [...el.getClientRects()].find(r => r.width || r.height) || el.getBoundingClientRect();
    return paginaDeRect(rc);
  }
  async function irAPosicion(pos, pintar){
    const L = lectura;
    let i = L.ep.spine.findIndex(s => s.href === pos.href);
    if (i < 0) i = Math.min(pos.i || 0, L.ep.spine.length - 1);
    if (pintar || i !== L.i) await mostrarCapitulo(i);
    const ancla = pos.cita ? { href: L.ep.spine[i].href, i, cita: pos.cita, prefijo: pos.prefijo, frac: pos.frac, t: Date.now() } : null;
    if (lectura === L) irPagina(paginaDePos(pos), false, ancla);
  }
  let guardarT;
  function guardarPosicion(ahora){
    if (!lectura) return;
    clearTimeout(guardarT);
    const hacer = async () => {
      if (!lectura) return;
      // Todo lo que mira la pantalla se calcula antes del primer await: al cerrar el libro, lectura
      // queda en null y el texto se borra mientras esto sigue guardando.
      const L = lectura, avance = avanceTotal();
      L.estado.pos = L.ancla || posicionActual();
      await guardarEstado(L.estado).catch(e => console.warn(e));
      const l = await DB.get("libros", L.libro.id).catch(() => null);
      if (l) { l.leido = Date.now(); l.avance = avance; await DB.poner("libros", l).catch(() => {}); }
    };
    if (ahora) hacer(); else guardarT = setTimeout(hacer, 700);
  }
  function avanceTotal(){
    const L = lectura; if (!L) return 0;
    const tams = L.ep.spine.map(s => s.tam), total = tams.reduce((a, b) => a + b, 0) || 1;
    const antes = tams.slice(0, L.i).reduce((a, b) => a + b, 0);
    return Math.min(1, (antes + tams[L.i] * ((L.pag || 0) + 1) / (L.paginas || 1)) / total);
  }
  function paginaMarcador(m){
    const c = lectura.cachePag;
    if (!c.has(m.id)) c.set(m.id, paginaDePos(m));
    return c.get(m.id);
  }
  function marcadorAqui(){
    const L = lectura, href = L.ep.spine[L.i].href;
    return L.estado.marcadores.find(m => !m.borrado && m.href === href && paginaMarcador(m) === L.pag);
  }
  function actualizarProgreso(){
    const L = lectura; if (!L) return;
    const a = avanceTotal(), quedan = L.paginas - L.pag - 1;
    $("#pieLectura").textContent = `${L.pag + 1} de ${L.paginas}` + (quedan ? ` · quedan ${quedan}` : " · fin del capítulo");
    $("#paginaTxt").textContent = `Pág. ${L.pag + 1} de ${L.paginas} · ${Math.round(a * 100)} % del libro`;
    const d = $("#deslizador"); d.max = L.paginas; d.value = L.pag + 1; d.disabled = L.paginas < 2;
    $("#btnMarcador").setAttribute("aria-pressed", !!marcadorAqui());
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") { guardarPosicion(true); Nube.sincronizar(false); }
    else if (lectura) pantallaEncendida(true);
  });
  addEventListener("pagehide", () => guardarPosicion(true));
  addEventListener("resize", () => { if (lectura) { aplicarAjustes(); reajustar(); } });

  // ---------- índice ----------
  function pintarIndice(){
    const L = lectura;
    const lista = items => `<ol>${items.map(x => `<li><a href="#" data-ruta="${esc(x.ruta)}" data-frag="${esc(x.frag)}">${esc(x.titulo)}</a>${x.hijos && x.hijos.length ? lista(x.hijos) : ""}</li>`).join("")}</ol>`;
    const items = L.ep.toc.length ? L.ep.toc : L.ep.spine.map((s, k) => ({ titulo: `Sección ${k + 1}`, ruta: s.href, frag: "", hijos: [] }));
    $("#indice").innerHTML = lista(items);
    marcarIndice();
  }
  function marcarIndice(){
    if (!lectura) return;
    const actual = lectura.ep.spine[lectura.i].href;
    $$("#indice a").forEach(a => a.toggleAttribute("aria-current", a.dataset.ruta === actual && !a.dataset.frag));
  }
  $("#btnIndice").onclick = () => { pintarIndice(); $("#dlgIndice").showModal(); const a = $("#indice a[aria-current]"); if (a) a.scrollIntoView({ block: "center" }); };
  $("#indice").addEventListener("click", async e => {
    const a = e.target.closest("a"); if (!a) return;
    e.preventDefault();
    $("#dlgIndice").close();
    await irADestino(a.dataset.ruta, a.dataset.frag);
  });
  async function irADestino(ruta, frag){
    const L = lectura;
    const i = L.ep.spine.findIndex(s => s.href === ruta);
    if (i < 0) return;
    if (i !== L.i) await mostrarCapitulo(i, 0);
    const el = frag ? document.getElementById("e_" + frag) : null;
    if (el) { irPagina(paginaDeElemento(el), false); el.classList.add("lx-destello"); setTimeout(() => el.classList.remove("lx-destello"), 1700); }
    else irPagina(0, false);
    mostrarControles(false);
  }

  // Enlaces del libro: una llamada a nota se muestra flotando, sin perder la página; lo demás navega.
  $("#texto").addEventListener("click", e => {
    const m = e.target.closest("mark[data-n]");
    if (m && !String(getSelection()).trim()) { e.preventDefault(); mostrarNotaFlotante(m.dataset.n, m); return; }
    const a = e.target.closest("a[data-ir]");
    if (!a) return;
    e.preventDefault();
    const [ruta, frag] = a.dataset.ir.split("#");
    const tipo = (a.getAttribute("epub:type") || "") + " " + a.className;
    const esNota = /noteref|\bref\b|footnote|nota/i.test(tipo) || (!!a.closest("sup") || /^\s*\[?\*?\d{1,3}\]?\s*$/.test(a.textContent));
    if (esNota && frag) {
      const L = lectura;
      let destino = ruta === L.ep.spine[L.i].href ? document.getElementById("e_" + frag) : null;
      if (!destino) {
        const i = L.ep.spine.findIndex(s => s.href === ruta);
        if (i >= 0) { try { destino = prepararCapitulo(i).div.querySelector(`[id="e_${CSS.escape(frag)}"]`); } catch {} }
      }
      if (destino) {
        const c = destino.cloneNode(true);
        $$("a[data-ir]", c).filter(x => /^\s*(↩|↑|\^|\d+\.?)\s*$/.test(x.textContent) || /backlink|volver/i.test(x.className + (x.getAttribute("epub:type") || ""))).forEach(x => x.remove());
        flotante(`<div>${c.innerHTML}</div><div class="acciones"><button type="button" data-ir-nota>Ir a la nota</button></div>`, a);
        $("#nota-flotante [data-ir-nota]").onclick = () => { cerrarFlotante(); irADestino(ruta, frag); };
        return;
      }
    }
    irADestino(ruta, frag);
  });

  // ---------- anclas de texto (subrayados, notas, correcciones) ----------
  function textoPlano(raiz){
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest("style, .lx-idiomas") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodos = []; let total = 0;
    while (w.nextNode()) { nodos.push({ n: w.currentNode, ini: total }); total += w.currentNode.data.length; }
    return { nodos, texto: nodos.map(x => x.n.data).join("") };
  }
  function offsetEn(plano, nodo, off){
    if (nodo.nodeType !== 3) {
      // Un borde entre elementos: se busca el primer texto desde ahí.
      const hijo = nodo.childNodes[off];
      const w = document.createTreeWalker(hijo || nodo, NodeFilter.SHOW_TEXT);
      const t = hijo ? (hijo.nodeType === 3 ? hijo : w.nextNode()) : null;
      if (!t) { const ult = plano.nodos.filter(x => nodo.contains(x.n)).pop(); return ult ? ult.ini + ult.n.data.length : 0; }
      nodo = t; off = 0;
    }
    const x = plano.nodos.find(x => x.n === nodo);
    return x ? x.ini + off : -1;
  }
  function citaDeRango(rango){
    const raiz = $("#texto .lx-cap");
    const plano = textoPlano(raiz);
    const ini = offsetEn(plano, rango.startContainer, rango.startOffset), fin = offsetEn(plano, rango.endContainer, rango.endOffset);
    if (ini < 0 || fin <= ini) return null;
    return { exacto: plano.texto.slice(ini, fin), prefijo: plano.texto.slice(Math.max(0, ini - 48), ini), sufijo: plano.texto.slice(fin, fin + 48) };
  }
  function rangoDeCita(plano, c){
    const ex = c.exacto;
    if (!ex) return null;
    let mejor = null, puntaje = -1, k = plano.texto.indexOf(ex);
    // Si el texto cambió de espacios (versión nueva), se busca con los espacios normalizados.
    if (k < 0) return rangoNormalizado(plano, c);
    while (k >= 0) {
      const antes = plano.texto.slice(Math.max(0, k - 48), k), despues = plano.texto.slice(k + ex.length, k + ex.length + 48);
      let p = 0;
      for (let j = 1; j <= Math.min(antes.length, (c.prefijo || "").length) && antes.at(-j) === c.prefijo.at(-j); j++) p++;
      for (let j = 0; j < Math.min(despues.length, (c.sufijo || "").length) && despues[j] === c.sufijo[j]; j++) p++;
      if (p > puntaje) { puntaje = p; mejor = k; }
      k = plano.texto.indexOf(ex, k + 1);
    }
    return rangoEntre(plano, mejor, mejor + ex.length);
  }
  function rangoNormalizado(plano, c){
    // Mapa de la versión sin espacios repetidos al texto real.
    const mapa = []; let s = "", previoEsp = false;
    for (let j = 0; j < plano.texto.length; j++) {
      const ch = plano.texto[j], esp = /\s/.test(ch);
      if (esp && previoEsp) continue;
      s += esp ? " " : ch; mapa.push(j); previoEsp = esp;
    }
    const ex = norm(c.exacto);
    const k = s.indexOf(ex);
    if (k < 0 || !ex) return null;
    return rangoEntre(plano, mapa[k], mapa[k + ex.length - 1] + 1);
  }
  function rangoEntre(plano, ini, fin){
    const punto = off => {
      for (const x of plano.nodos) if (off <= x.ini + x.n.data.length) return [x.n, off - x.ini];
      const u = plano.nodos.at(-1); return [u.n, u.n.data.length];
    };
    const r = document.createRange();
    const [a, ao] = punto(ini), [b, bo] = punto(fin);
    r.setStart(a, ao); r.setEnd(b, bo);
    return r;
  }
  function envolver(rango, id, clase){
    const raiz = rango.commonAncestorContainer.nodeType === 1 ? rango.commonAncestorContainer : rango.commonAncestorContainer.parentNode;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    const tramos = [];
    while (w.nextNode()) {
      const n = w.currentNode;
      if (!rango.intersectsNode(n)) continue;
      const ini = n === rango.startContainer ? rango.startOffset : 0, fin = n === rango.endContainer ? rango.endOffset : n.data.length;
      if (fin > ini && n.data.slice(ini, fin).trim()) tramos.push([n, ini, fin]);
    }
    for (let [n, ini, fin] of tramos) {
      if (fin < n.data.length) n.splitText(fin);
      if (ini > 0) n = n.splitText(ini);
      const m = document.createElement("mark"); m.className = clase; m.dataset.n = id;
      n.before(m); m.append(n);
    }
  }
  const claseDe = n => n.tipo === "corr" ? "lx-corr" : n.tipo === "nota" ? "lx-nota" : "lx-sub";
  function pintarMarcas(){
    const L = lectura, raiz = $("#texto .lx-cap");
    if (!L || !raiz) return;
    const href = L.ep.spine[L.i].href;
    for (const n of L.estado.notas.filter(n => !n.borrado && n.href === href)) {
      const plano = textoPlano(raiz); // se recalcula: cada marca parte nodos de texto
      const r = rangoDeCita(plano, n);
      n.perdida = !r;
      if (r) envolver(r, n.id, claseDe(n));
    }
  }
  function quitarMarca(id){
    $$(`#texto mark[data-n="${CSS.escape(id)}"]`).forEach(m => { const p = m.parentNode; m.replaceWith(...m.childNodes); p.normalize(); });
  }

  // ---------- selección ----------
  let seleccion = null; // { cita, href }
  function revisarSeleccion(){
    const s = getSelection();
    if (!lectura || !s || s.isCollapsed || !s.rangeCount) { cerrarSeleccion(); return; }
    const r = s.getRangeAt(0);
    const cap = $("#texto .lx-cap");
    if (!cap || !cap.contains(r.commonAncestorContainer)) { cerrarSeleccion(); return; }
    const cita = citaDeRango(r);
    if (!cita || !cita.exacto.trim()) { cerrarSeleccion(); return; }
    seleccion = { cita, href: lectura.ep.spine[lectura.i].href };
    $("#seleccion").hidden = false;
  }
  function cerrarSeleccion(){ seleccion = null; $("#seleccion").hidden = true; }
  let selT;
  document.addEventListener("selectionchange", () => { clearTimeout(selT); selT = setTimeout(revisarSeleccion, 250); });
  // En el celular el menú nativo tapa arriba; la barra va abajo y no le roba la selección.
  $("#seleccion").addEventListener("pointerdown", e => e.preventDefault());
  $("#seleccion").addEventListener("click", async e => {
    const b = e.target.closest("button[data-accion]");
    if (!b || !seleccion) return;
    const { cita, href } = seleccion, acc = b.dataset.accion;
    if (acc === "copiar") {
      try { await navigator.clipboard.writeText(cita.exacto); aviso("Copiado."); } catch { aviso("No se pudo copiar."); }
      return;
    }
    getSelection().removeAllRanges(); cerrarSeleccion();
    if (acc === "sub") return crearNota({ tipo: "sub", href, ...cita, texto: "" });
    const texto = await escribir(acc === "corr" ? "corr" : "nota", cita.exacto, "");
    if (texto == null) return;
    await crearNota({ tipo: acc, href, ...cita, texto });
  });
  function escribir(tipo, citado, valor){
    const d = $("#dlgEscribir");
    $("#escribirTitulo").textContent = tipo === "corr" ? "Corrección para Fénix" : "Nota";
    $("#escribirEtq").textContent = tipo === "corr" ? "¿Qué está mal y cómo debería decir?" : "Tu nota";
    $("#escribirAyuda").hidden = tipo !== "corr";
    $("#escribirCita").textContent = citado;
    $("#escribirTexto").value = valor || "";
    d.returnValue = "";
    d.showModal();
    setTimeout(() => $("#escribirTexto").focus(), 50);
    return new Promise(ok => d.addEventListener("close", () => ok(d.returnValue === "si" && $("#escribirTexto").value.trim() ? $("#escribirTexto").value.trim() : null), { once: true }));
  }
  async function crearNota(n){
    const L = lectura;
    const nota = { id: nuevoId(), creado: Date.now(), modificado: Date.now(), capitulo: tituloCapitulo(), ...n };
    L.estado.notas.push(nota);
    const r = rangoDeCita(textoPlano($("#texto .lx-cap")), nota);
    if (r) envolver(r, nota.id, claseDe(nota));
    await guardarEstado(L.estado);
    if (nota.tipo === "corr") {
      await encolarCorreccion(nota);
      aviso(enLinea() ? "Corrección enviada a Fénix. ¡Gracias!" : "Corrección guardada: se enviará a Fénix cuando vuelva la conexión.");
    }
  }
  function tituloCapitulo(){
    const L = lectura, href = L.ep.spine[L.i].href;
    let t = "";
    const buscar = items => items.forEach(x => { if (!t && x.ruta === href) t = x.titulo; if (x.hijos) buscar(x.hijos); });
    buscar(L.ep.toc);
    if (!t) { const h = $("#texto .lx-cap :is(h1,h2,h3)"); t = h ? norm(h.textContent) : `Sección ${L.i + 1}`; }
    return t;
  }

  // ---------- nota flotante ----------
  function flotante(html, cerca){
    const f = $("#nota-flotante");
    f.innerHTML = html; f.hidden = false;
    const r = cerca.getBoundingClientRect();
    const ancho = Math.min(420, innerWidth - 20);
    f.style.left = Math.max(10, Math.min(innerWidth - ancho - 10, r.left)) + "px";
    const abajo = r.bottom + 8, alto = f.offsetHeight;
    f.style.top = (abajo + alto < innerHeight - 10 ? abajo : Math.max(barraAlto() + 6, r.top - alto - 8)) + "px";
  }
  function cerrarFlotante(){ $("#nota-flotante").hidden = true; }
  document.addEventListener("pointerdown", e => { if (!e.target.closest("#nota-flotante, mark[data-n], a[data-ir]")) cerrarFlotante(); });
  addEventListener("scroll", cerrarFlotante, { passive: true });
  function mostrarNotaFlotante(id, el){
    const n = lectura.estado.notas.find(x => x.id === id);
    if (!n) return;
    const tipo = { sub: "Subrayado", nota: "Nota", corr: "Corrección para Fénix" }[n.tipo];
    flotante(`<div class="etq">${tipo}${n.tipo === "corr" ? " · " + esc(estadoCorr(n)) : ""}</div>${n.texto ? `<p style="margin:6px 0 0">${esc(n.texto)}</p>` : ""}
      <div class="acciones">${n.tipo !== "sub" && !n.enviada ? `<button type="button" data-edit>Editar</button>` : ""}<button type="button" data-del>Quitar</button></div>`, el);
    const f = $("#nota-flotante");
    const e = $("[data-edit]", f);
    if (e) e.onclick = async () => { cerrarFlotante(); const t = await escribir(n.tipo, n.exacto, n.texto); if (t != null) { n.texto = t; n.modificado = Date.now(); await guardarEstado(lectura.estado); if (n.tipo === "corr") await encolarCorreccion(n); } };
    $("[data-del]", f).onclick = async () => { cerrarFlotante(); await borrarNota(n); };
  }
  async function borrarNota(n){
    n.borrado = true; n.modificado = Date.now();
    if (lectura) quitarMarca(n.id);
    if (n.tipo === "corr" && !n.enviada) await DB.borrar("cola", n.id).catch(() => {});
    await guardarEstado(lectura.estado);
    if ($("#dlgNotas").open) pintarNotas();
  }

  // ---------- marcadores ----------
  $("#btnMarcador").onclick = async () => {
    const L = lectura; if (!L) return;
    const ya = marcadorAqui();
    if (ya) { ya.borrado = true; ya.modificado = Date.now(); aviso("Marcador quitado."); }
    else { L.estado.marcadores.push({ id: nuevoId(), ...posicionActual(), capitulo: tituloCapitulo(), avance: avanceTotal(), creado: Date.now(), modificado: Date.now() }); aviso("Marcador puesto."); }
    await guardarEstado(L.estado);
    actualizarProgreso();
  };

  function estadoCorr(n){ return n.enviada ? "enviada a Fénix el " + new Date(n.enviada).toLocaleDateString("es-CL") : "por enviar (se manda sola con conexión)"; }
  function pintarNotas(){
    const L = lectura, cont = $("#listaNotas");
    const marc = L.estado.marcadores.filter(m => !m.borrado).sort((a, b) => (a.avance || 0) - (b.avance || 0));
    const notas = L.estado.notas.filter(n => !n.borrado);
    const orden = n => L.ep.spine.findIndex(s => s.href === n.href);
    notas.sort((a, b) => orden(a) - orden(b) || a.creado - b.creado);
    if (!marc.length && !notas.length) { cont.innerHTML = `<p class="vacio">Sin marcadores ni notas todavía.<br>Toca el marcador arriba, o selecciona texto para subrayar, anotar o mandar una corrección.</p>`; return; }
    const fecha = t => new Date(t).toLocaleDateString("es-CL", { day: "numeric", month: "short" });
    cont.innerHTML =
      (marc.length ? `<p class="etq">Marcadores</p>` + marc.map(m => `<div class="nota-item"><p>${esc(m.capitulo || "")} · ${Math.round((m.avance || 0) * 100)} %</p><blockquote>${esc((m.cita || "").slice(0, 140))}</blockquote>
        <div class="acciones">${fecha(m.creado)}<button type="button" data-ir-m="${m.id}">Ir</button><button type="button" data-del-m="${m.id}">Quitar</button></div></div>`).join("") : "") +
      (notas.length ? `<p class="etq">Subrayados, notas y correcciones</p>` + notas.map(n => `<div class="nota-item">
        <div class="etq">${{ sub: "Subrayado", nota: "Nota", corr: "Corrección" }[n.tipo]} · ${esc(n.capitulo || "")}${n.tipo === "corr" ? " · " + esc(estadoCorr(n)) : ""}${n.perdida ? " · no se ubicó en esta versión" : ""}</div>
        <blockquote>${esc(n.exacto.slice(0, 220))}</blockquote>${n.texto ? `<p>${esc(n.texto)}</p>` : ""}
        <div class="acciones">${fecha(n.creado)}<button type="button" data-ir-n="${n.id}">Ir</button><button type="button" data-del-n="${n.id}">Quitar</button></div></div>`).join("") : "");
  }
  $("#btnNotas").onclick = () => { pintarNotas(); $("#dlgNotas").showModal(); };
  $("#listaNotas").addEventListener("click", async e => {
    const L = lectura, b = e.target.closest("button"); if (!b || !L) return;
    if (b.dataset.irM) { const m = L.estado.marcadores.find(x => x.id === b.dataset.irM); $("#dlgNotas").close(); await irAPosicion(m, false); mostrarControles(false); }
    if (b.dataset.delM) { const m = L.estado.marcadores.find(x => x.id === b.dataset.delM); m.borrado = true; m.modificado = Date.now(); await guardarEstado(L.estado); pintarNotas(); actualizarProgreso(); }
    if (b.dataset.irN) {
      const n = L.estado.notas.find(x => x.id === b.dataset.irN); $("#dlgNotas").close();
      const i = L.ep.spine.findIndex(s => s.href === n.href);
      if (i >= 0 && i !== L.i) await mostrarCapitulo(i, 0);
      const m = $(`#texto mark[data-n="${CSS.escape(n.id)}"]`);
      if (m) { irPagina(paginaDeElemento(m), false); m.classList.add("lx-destello"); setTimeout(() => m.classList.remove("lx-destello"), 1700); }
      mostrarControles(false);
    }
    if (b.dataset.delN) await borrarNota(L.estado.notas.find(x => x.id === b.dataset.delN));
  });
  $("#btnAjustes").onclick = () => { pintarAjustes(); $("#dlgAjustes").showModal(); };

  // ---------- correcciones a Fénix ----------
  async function encolarCorreccion(n){
    const L = lectura, l = L.libro;
    const datos = {
      _subject: `Fénix - corrección desde el lector: ${l.titulo}`,
      _template: "table", _captcha: "false",
      libro: l.titulo, autor: l.autor, id_fenix: l.fenix ? `${l.fenix.id} (${l.fenix.idioma})` : "(EPUB agregado a mano)",
      identificador_epub: l.ident || "", version_sha: (l.sha || "").slice(0, 16),
      capitulo: n.capitulo || "", archivo_xhtml: n.href,
      texto_marcado: n.exacto, contexto: `…${n.prefijo}[[${n.exacto}]]${n.sufijo}…`,
      correccion: n.texto, nota_id: n.id, origen: "lector",
    };
    await DB.poner("cola", { id: n.id, libro: l.id, datos, creado: Date.now() });
    enviarCola();
  }
  let enviando = false;
  async function enviarCola(){
    if (enviando || !enLinea()) return;
    enviando = true;
    try {
      const cola = await DB.todos("cola").catch(() => []);
      for (const c of cola.sort((a, b) => a.creado - b.creado)) {
        let ok = false;
        try {
          const r = await fetch(FORMULARIO, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(c.datos) });
          const j = await r.json().catch(() => ({}));
          ok = r.ok && String(j.success) !== "false";
        } catch { ok = false; }
        if (!ok) break; // sin red o FormSubmit caído: se reintenta después, en orden
        await DB.borrar("cola", c.id);
        const e = await estadoDe(c.libro);
        const n = e.notas.find(x => x.id === c.id);
        if (n) { n.enviada = Date.now(); n.modificado = Date.now(); await guardarEstado(e); }
        if (lectura && lectura.libro.id === c.libro) { const m = lectura.estado.notas.find(x => x.id === c.id); if (m) m.enviada = n ? n.enviada : Date.now(); }
      }
    } finally { enviando = false; }
  }

  // ---------- nube (Google Drive) ----------
  const Nube = (() => {
    let token = null, vence = 0, cliente = null, sucio = false, sincronizando = false, carpetaId = "", archivoId = "";
    const activa = () => { try { return !!GOOGLE_CLIENTE && localStorage.getItem("lector.nube") === "1"; } catch { return false; } };
    try { const t = JSON.parse(sessionStorage.getItem("lector.token") || "null"); if (t && t.vence > Date.now() + 60e3) { token = t.token; vence = t.vence; } } catch {}
    const valido = () => token && vence > Date.now() + 60e3;
    function pintar(estado){
      const b = $("#btnNube");
      b.hidden = !GOOGLE_CLIENTE;
      $("#nubeTxt").textContent = estado || (activa() ? (sucio ? "Sincronizar" : "En la nube") : "Guardar en la nube");
      b.title = activa() ? "Sincronizar ahora con tu Google Drive" : "Guardar libros, avances y notas en tu Google Drive";
    }
    function cargarGis(){
      if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
      return new Promise((ok, mal) => {
        const s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client"; s.async = true;
        s.onload = ok; s.onerror = () => mal(new Error("No se pudo cargar Google (¿sin conexión?)."));
        document.head.append(s);
      });
    }
    // Pedir el permiso necesita un toque del lector (Google abre una ventana): solo desde el botón.
    async function pedirToken(primeraVez){
      await cargarGis();
      return new Promise((ok, mal) => {
        cliente = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENTE, scope: "https://www.googleapis.com/auth/drive.file",
          callback: r => {
            if (r.error) return mal(new Error("Google no dio el permiso."));
            token = r.access_token; vence = Date.now() + (r.expires_in || 3600) * 1000;
            try { sessionStorage.setItem("lector.token", JSON.stringify({ token, vence })); } catch {}
            ok();
          },
          error_callback: () => mal(new Error("Se cerró la ventana de Google.")),
        });
        cliente.requestAccessToken({ prompt: primeraVez ? "consent" : "" });
      });
    }
    async function api(metodo, url, cuerpo, tipo){
      const r = await fetch(url, { method: metodo, headers: { Authorization: "Bearer " + token, ...(tipo ? { "Content-Type": tipo } : {}) }, body: cuerpo });
      if (r.status === 401) { token = null; throw new Error("La sesión de Google venció."); }
      if (!r.ok) throw new Error(`Drive respondió ${r.status}.`);
      return r;
    }
    const DRIVE = "https://www.googleapis.com/drive/v3/files";
    const SUBIR = "https://www.googleapis.com/upload/drive/v3/files";
    async function buscar(q){
      const r = await api("GET", `${DRIVE}?q=${encodeURIComponent(q)}&fields=files(id,name,modifiedTime)&spaces=drive`);
      return (await r.json()).files || [];
    }
    async function carpeta(){
      if (carpetaId) return carpetaId;
      const f = await buscar(`name='${CARPETA_NUBE}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
      if (f.length) return (carpetaId = f[0].id);
      const r = await api("POST", DRIVE, JSON.stringify({ name: CARPETA_NUBE, mimeType: "application/vnd.google-apps.folder" }), "application/json");
      return (carpetaId = (await r.json()).id);
    }
    async function subir(nombre, blob, tipo, id){
      const meta = id ? {} : { name: nombre, parents: [await carpeta()] };
      const fd = new FormData();
      fd.append("metadata", new Blob([JSON.stringify(meta)], { type: "application/json" }));
      fd.append("file", new Blob([blob], { type: tipo }));
      const r = await api(id ? "PATCH" : "POST", `${SUBIR}${id ? "/" + id : ""}?uploadType=multipart&fields=id`, fd);
      return (await r.json()).id;
    }
    // Une lo local con lo de la nube: posición más reciente; notas y marcadores por id, gana el
    // modificado más nuevo (un borrado también es una modificación); un libro borrado se borra en todos.
    function unirEstado(a, b){
      if (!a) return b; if (!b) return a;
      const lista = (x, y) => { const m = new Map(); [...(x || []), ...(y || [])].forEach(n => { const p = m.get(n.id); if (!p || (n.modificado || 0) > (p.modificado || 0)) m.set(n.id, n); }); return [...m.values()]; };
      return { id: a.id, pos: (a.pos && b.pos ? (a.pos.t >= b.pos.t ? a.pos : b.pos) : a.pos || b.pos), marcadores: lista(a.marcadores, b.marcadores), notas: lista(a.notas, b.notas), modificado: Math.max(a.modificado || 0, b.modificado || 0) };
    }
    async function sincronizar(conToque){
      pintar();
      if (!activa() || sincronizando || !enLinea()) return;
      if (!valido()) { if (!conToque) return; try { await pedirToken(false); } catch (e) { aviso(e.message); return; } }
      sincronizando = true; pintar("Sincronizando…");
      try {
        const dir = await carpeta();
        if (!archivoId) { const f = await buscar(`name='${ARCHIVO_NUBE}' and '${dir}' in parents and trashed=false`); archivoId = f[0] ? f[0].id : ""; }
        const remoto = archivoId ? await (await api("GET", `${DRIVE}/${archivoId}?alt=media`)).json().catch(() => ({})) : {};
        const libros = await DB.todos("libros"), borrados = { ...(remoto.borrados || {}), ...(await conf.leer("borrados", {})) };
        for (const [id, t] of Object.entries(remoto.borrados || {})) if ((borrados[id] || 0) < t) borrados[id] = t;
        // Libros borrados en otro dispositivo después de agregarse aquí.
        for (const l of libros) if (borrados[l.id] && borrados[l.id] > (l.actualizado || l.agregado)) await DB.borrarLibro(l.id);
        await conf.poner("borrados", borrados);
        // Estado: local + remoto.
        const estados = {};
        for (const e of await DB.todos("estado")) estados[e.id] = e;
        for (const [id, e] of Object.entries(remoto.estado || {})) estados[id] = unirEstado(estados[id], e);
        for (const e of Object.values(estados)) await DB.poner("estado", e);
        if (lectura && estados[lectura.libro.id]) { const n = estados[lectura.libro.id]; lectura.estado.notas = n.notas; lectura.estado.marcadores = n.marcadores; }
        // Libros que están en la nube y no aquí: los de Fénix se bajan de Fénix; los propios, de Drive.
        const aqui = new Set((await DB.todos("libros")).map(l => l.id));
        const cat = await traerCatalogo();
        for (const [id, m] of Object.entries(remoto.libros || {})) {
          if (aqui.has(id) || (borrados[id] && borrados[id] >= (m.actualizado || 0))) continue;
          try {
            if (m.fenix && cat) { const c = cat.libros.find(x => x.id === m.fenix.id && x.idioma === m.fenix.idioma); if (c) await bajarDeFenix(c); }
            else if (m.driveId) { const buf = await (await api("GET", `${DRIVE}/${m.driveId}?alt=media`)).arrayBuffer(); const { libro } = await guardarEpub(buf, { bilingue: m.bilingue }); libro.driveId = m.driveId; await DB.poner("libros", libro); }
          } catch (e) { console.warn("Nube: no se bajó", m.titulo, e); }
        }
        // Libros propios que la nube aún no tiene.
        const fichas = {};
        for (const l of await DB.todos("libros")) {
          if (l.origen === "archivo" && !l.driveId) {
            const a = await DB.get("archivos", l.id);
            if (a) { l.driveId = await subir(`${l.titulo} - ${l.id}.epub`, a.blob, "application/epub+zip"); await DB.poner("libros", l); }
          }
          fichas[l.id] = { titulo: l.titulo, autor: l.autor, idioma: l.idioma, fenix: l.fenix, origen: l.origen, driveId: l.driveId || "", bilingue: l.bilingue, sha: l.sha, version: l.version, avance: l.avance || 0, leido: l.leido || 0, actualizado: l.actualizado || l.agregado };
        }
        const todo = { formato: 1, generado: new Date().toISOString(), libros: fichas, estado: Object.fromEntries((await DB.todos("estado")).map(e => [e.id, e])), borrados };
        archivoId = await subir(ARCHIVO_NUBE, JSON.stringify(todo), "application/json", archivoId || "");
        sucio = false;
        await conf.poner("nubeUltima", Date.now());
        if (!lectura) pintarBiblioteca();
      } catch (e) { console.warn("Nube:", e); sucio = true; if (conToque) aviso(e.message || "No se pudo sincronizar; se intentará de nuevo."); }
      finally { sincronizando = false; pintar(); }
    }
    let empuje;
    return {
      activa,
      pintar,
      sincronizar,
      pendiente(){ if (!activa()) return; sucio = true; pintar(); clearTimeout(empuje); empuje = setTimeout(() => sincronizar(false), 20e3); },
      async boton(){
        if (!enLinea()) return aviso("Sin conexión: la nube se sincroniza cuando vuelva la señal.");
        if (!activa()) {
          try { await pedirToken(true); } catch (e) { return aviso(e.message); }
          localStorage.setItem("lector.nube", "1");
          aviso("Listo: tus libros, avances y notas se guardan en tu Google Drive, carpeta «Fénix - Lector».", 6000);
        }
        sincronizar(true);
      },
    };
  })();
  $("#btnNube").onclick = () => Nube.boton();

  // Para las pruebas de herramientas/revisar_diseno.py: dónde va la lectura, sin tocar nada.
  window.lectorEstado = () => lectura && { i: lectura.i, pag: lectura.pag, paginas: lectura.paginas, ancla: lectura.ancla };

  // ---------- instalar ----------
  let pedirInstalar = null;
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); pedirInstalar = e; $("#btnInstalar").hidden = false; });
  addEventListener("appinstalled", () => { $("#avisoGuardar").hidden = true; });
  $("#btnInstalar").onclick = async () => {
    if (!pedirInstalar) return;
    pedirInstalar.prompt();
    const r = await pedirInstalar.userChoice.catch(() => null);
    pedirInstalar = null; $("#btnInstalar").hidden = true;
    if (r && r.outcome === "accepted") $("#avisoGuardar").hidden = true;
  };
  $("#btnEntendido").onclick = () => { $("#avisoGuardar").hidden = true; try { localStorage.setItem("lector.avisoGuardar", "1"); } catch {} };

  // ---------- app de Android ----------
  // En la web: el botón para bajar el APK (no en iPhone, donde no se instala). En la app: el aviso cuando
  // hay un APK más nuevo; cada Release de GitHub se llama lector-v<versionCode> (.github/workflows/apk.yml).
  $$("a.apk").forEach(a => { a.href = APK; });
  if (!APP && !/iPhone|iPad|iPod/.test(navigator.userAgent) && !(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) $("#btnApp").hidden = false;
  $("#btnApp").onclick = () => $("#dlgApp").showModal();
  async function buscarVersionApp(){
    if (!APP || !enLinea()) return;
    try {
      const [yo, r] = await Promise.all([nativo("info"), fetch("https://api.github.com/repos/talcaldeg/fenix/releases/latest", { cache: "no-cache" })]);
      if (!r.ok) return;
      const n = parseInt(String((await r.json()).tag_name || "").replace(/\D+/g, ""), 10);
      if (n && yo && n > yo.versionCode) $("#avisoApp").hidden = false;
    } catch (e) { console.warn("Versión de la app:", e); }
  }

  // ---------- arranque ----------
  async function iniciar(){
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    try { const g = JSON.parse(localStorage.getItem("lector.ajustes") || "null"); if (g) aj = { ...AJ_DEF, ...g }; } catch {}
    aplicarAjustes();
    pintarRed();
    Nube.pintar();
    // Que el navegador no borre los libros cuando falte espacio. Si no lo promete y el lector no está
    // instalado, se sugiere instalarlo (instalado, el teléfono no los borra).
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(ok => {
        let visto = false; try { visto = localStorage.getItem("lector.avisoGuardar") === "1"; } catch {}
        if (!ok && !instalado() && !visto && !APP) $("#avisoGuardar").hidden = false;
      }).catch(() => {});
    } catch {}
    // En la app el lector ya viene adentro: sin service worker, y el logo lleva al sitio (se abre en el navegador).
    if (APP) $(".marca").href = SITIO;
    else if ("serviceWorker" in navigator) navigator.serviceWorker.register("../sw.js").catch(() => {});
    await pintarBiblioteca();
    if (APP) { recibirDeAndroid(); buscarVersionApp(); setInterval(buscarVersionApp, CADA_ACTUALIZAR); }
    // Enlace desde la ficha de Fénix: lector/#fenix=<id>&l=<idioma> agrega el libro (si falta) y lo abre.
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get("fenix")) {
      const id = h.get("fenix"), idioma = h.get("l") || "es";
      history.replaceState(null, "", location.pathname);
      const ya = await DB.get("libros", `fenix-${id}-${idioma}`).catch(() => null);
      if (ya) abrirLibro(ya.id);
      else {
        const cat = await traerCatalogo();
        const c = cat && cat.libros.find(x => x.id === id && x.idioma === idioma);
        if (c) agregarDeFenix(c, true);
        else aviso(enLinea() ? "Ese libro no está en el catálogo del lector." : "Sin conexión: el libro se podrá agregar cuando vuelva la señal.");
      }
    } else if (h.get("leer")) abrirLibro(h.get("leer"));
    enviarCola();
    const ultima = await conf.leer("ultimaRevision", 0);
    if (Date.now() - ultima > 60e3) buscarActualizaciones(); else traerCatalogo();
    setInterval(() => { buscarActualizaciones(); enviarCola(); }, CADA_ACTUALIZAR);
    setInterval(enviarCola, 5 * 60e3);
    Nube.sincronizar(false);
  }
  iniciar().catch(e => { console.warn(e); cargando(); aviso("El lector partió con un problema; recarga la página."); });
})();
