#!/usr/bin/env bash
# Prueba del APK en el emulador de GitHub Actions (.github/workflows/apk.yml, trabajo «probar»).
# Deja capturas y el registro en capturas/ y falla si algo de lo pedido no se cumple:
#   1. abre sin red desde la primera vez (el lector viene dentro del APK);
#   2. «Abrir con»: un EPUB abierto desde otra app entra a la biblioteca y se abre;
#   3. los botones de volumen pasan de página;
#   4. con red, el catálogo de Fénix llega del sitio.
# Lo que pasa dentro de la WebView no lo ve uiautomator: se lee de los hitos «LECTOR ...» que lector.js
# manda a LectorFenix.hito, que los escribe en el logcat con la etiqueta LECTOR.
set -u
APK=lector-fenix.apk
PKG=io.github.talcaldeg.fenix.lector
OUT=capturas
mkdir -p "$OUT"
fallas=0
captura(){ adb exec-out screencap -p > "$OUT/$1.png"; }
falla(){ echo "FALLA: $1"; fallas=$((fallas + 1)); }
hitos(){ adb logcat -d -s LECTOR:I | grep -o "LECTOR *: .*" | sed "s/^LECTOR *: /LECTOR /" > "$OUT/hitos-$1.txt"; cat "$OUT/hitos-$1.txt"; }

adb install -r "$APK" || { echo "FALLA: no se instala"; exit 1; }
# El aviso de Android «Viewing full screen» (solo la primera vez) se queda con las teclas: se da por visto.
adb shell settings put secure immersive_mode_confirmations confirmed

# 1. Primera apertura, sin red.
adb shell svc wifi disable; adb shell svc data disable
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
sleep 12
captura 1-sin-red
hitos 1
grep -q "LECTOR biblioteca 0" "$OUT/hitos-1.txt" || falla "sin red, la biblioteca no aparece en la primera apertura"
# La barra del lector no queda debajo de la hora: la app conoce el alto de la barra de estado.
grep -Eq "LECTOR bordes [1-9]" "$OUT/hitos-1.txt" || falla "la app no conoce el alto de la barra de estado (la hora queda encima del logo)"

# 2. «Abrir con»: VIEW implícito de un EPUB (resuelve el intent-filter del manifiesto).
adb push libro.epub /data/local/tmp/libro.epub
adb shell chmod 644 /data/local/tmp/libro.epub
adb logcat -c
adb shell am start -W -a android.intent.action.VIEW -t application/epub+zip -d file:///data/local/tmp/libro.epub
sleep 12
captura 2-abrir-con
hitos 2
grep -q "LECTOR abierto: " "$OUT/hitos-2.txt" || falla "el EPUB abierto con la app no se abrió"
grep -q "LECTOR biblioteca 1" "$OUT/hitos-2.txt" || falla "el EPUB abierto con la app no quedó en la biblioteca"

# 3. Volumen abajo dos veces y arriba una: cada toque cambia de página.
adb logcat -c
adb shell input keyevent KEYCODE_VOLUME_DOWN; sleep 2; captura 3-volumen-1
adb shell input keyevent KEYCODE_VOLUME_DOWN; sleep 2; captura 4-volumen-2
adb shell input keyevent KEYCODE_VOLUME_UP; sleep 2; captura 5-volumen-arriba
hitos 3
[ "$(grep -c "LECTOR volumen 1:" "$OUT/hitos-3.txt")" -eq 2 ] || falla "volumen abajo no pasó de página"
grep -q "LECTOR volumen -1:" "$OUT/hitos-3.txt" || falla "volumen arriba no volvió de página"
[ "$(sort -u "$OUT/hitos-3.txt" | wc -l)" -eq 3 ] || falla "el volumen no cambió la página (se repite la posición)"

# 4. Con red: el catálogo de Fénix se trae del sitio.
adb shell svc wifi enable; adb shell svc data enable
sleep 10
adb shell am force-stop "$PKG"
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
sleep 15
captura 6-con-red
hitos 4
grep -q "LECTOR catálogo de la red: " "$OUT/hitos-4.txt" || falla "con red, el catálogo de Fénix no llegó del sitio"
grep -q "LECTOR biblioteca 1" "$OUT/hitos-4.txt" || falla "al volver a abrir la app, el libro ya no estaba"

adb logcat -d -b crash > "$OUT/cierres.txt"
[ -s "$OUT/cierres.txt" ] && { falla "la app se cerró sola"; head -40 "$OUT/cierres.txt"; }
adb logcat -d "*:W" > "$OUT/avisos.txt"

echo "Fallas: $fallas"
exit "$fallas"
