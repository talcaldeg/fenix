// Copia lector/ a app/www, que Capacitor mete dentro del APK: así la app abre sin red desde la primera vez.
// El lector se da cuenta solo de que corre dentro de la app (window.Capacitor) y pide catálogo y libros a
// https://talcaldeg.github.io/fenix/ en vez de a «../». Lo corre .github/workflows/apk.yml (npm run preparar).
const fs = require("fs");
const path = require("path");

const origen = path.join(__dirname, "..", "lector");
const destino = path.join(__dirname, "www");
fs.rmSync(destino, { recursive: true, force: true });
fs.cpSync(origen, destino, { recursive: true });
console.log("lector/ copiado a", destino);
