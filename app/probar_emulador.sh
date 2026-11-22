#!/usr/bin/env bash
# Prueba del APK en el emulador de GitHub Actions (.github/workflows/apk.yml, trabajo «probar»).
# Deja capturas y el registro en capturas/ y falla si algo de lo pedido no se cumple:
#   1. abre sin red desde la primera vez (el lector viene dentro del APK);
#   2. «Abrir con»: un EPUB abierto desde otra app entra a la biblioteca y se abre;
#   3. los botones de volumen pasan de página;
#   4. con red, el catálogo de Fénix carga desde el sitio.
set -u
APK=lector-fenix.apk
PKG=io.github.talcaldeg.fenix.lector
OUT=capturas
mkdir -p "$OUT"
fallas=0
captura(){ adb exec-out screencap -p > "$OUT/$1.png"; }
falla(){ echo "FALLA: $1"; fallas=$((fallas + 1)); }
consola(){ adb logcat -d -s Capacitor/Console:* Capacitor:* chromium:* > "$OUT/logcat.txt"; }

adb install -r "$APK" || { echo "FALLA: no se instala"; exit 1; }
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0

# 1. Primera apertura, sin red.
adb shell svc wifi disable; adb shell svc data disable
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
sleep 12
captura 1-sin-red
consola
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb shell cat /sdcard/ui.xml > "$OUT/1-ui.xml"
grep -q "Mis libros" "$OUT/1-ui.xml" || falla "sin red, la biblioteca no aparece en la primera apertura"

# 2. «Abrir con»: VIEW implícito de un EPUB (resuelve el intent-filter del manifiesto).
adb push libro.epub /data/local/tmp/libro.epub
adb shell chmod 644 /data/local/tmp/libro.epub
adb shell am start -W -a android.intent.action.VIEW -t application/epub+zip -d file:///data/local/tmp/libro.epub
sleep 12
captura 2-abrir-con
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb shell cat /sdcard/ui.xml > "$OUT/2-ui.xml"

# 3. Volumen abajo dos veces y arriba una: cada toque cambia la página.
adb shell input keyevent KEYCODE_VOLUME_DOWN; sleep 2; captura 3-volumen-1
adb shell input keyevent KEYCODE_VOLUME_DOWN; sleep 2; captura 4-volumen-2
adb shell input keyevent KEYCODE_VOLUME_UP; sleep 2; captura 5-volumen-arriba
cmp -s "$OUT/2-abrir-con.png" "$OUT/3-volumen-1.png" && falla "volumen abajo no pasó de página"
cmp -s "$OUT/3-volumen-1.png" "$OUT/4-volumen-2.png" && falla "el segundo volumen abajo no pasó de página"
cmp -s "$OUT/4-volumen-2.png" "$OUT/5-volumen-arriba.png" && falla "volumen arriba no volvió de página"
consola

# Volver a la biblioteca: el libro tiene que estar en el estante.
adb shell input keyevent KEYCODE_BACK; sleep 3
captura 6-biblioteca-con-libro
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb shell cat /sdcard/ui.xml > "$OUT/6-ui.xml"
grep -qi "identificaci" "$OUT/6-ui.xml" || falla "el libro abierto con la app no quedó en la biblioteca"

# 4. Con red: el catálogo de Fénix se trae del sitio.
adb shell svc wifi enable; adb shell svc data enable
sleep 8
adb shell am force-stop "$PKG"
adb shell am start -W -n "$PKG/.MainActivity"
sleep 12
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb shell cat /sdcard/ui.xml > "$OUT/7-ui.xml"
# Toca la pestaña «Catálogo Fénix» por su posición en el árbol de la interfaz.
pos=$(grep -oE '(text|content-desc)="Catálogo Fénix"[^>]*bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"' "$OUT/7-ui.xml" | grep -o '\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]' | head -1)
if [ -n "$pos" ]; then
  x=$(echo "$pos" | sed -E 's/\[([0-9]+),([0-9]+)\]\[([0-9]+),([0-9]+)\]/\1 \3/' | awk '{print int(($1+$2)/2)}')
  y=$(echo "$pos" | sed -E 's/\[([0-9]+),([0-9]+)\]\[([0-9]+),([0-9]+)\]/\2 \4/' | awk '{print int(($1+$2)/2)}')
  adb shell input tap "$x" "$y"; sleep 8
fi
captura 7-catalogo-con-red
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb shell cat /sdcard/ui.xml > "$OUT/7b-ui.xml"
grep -q "Marmion" "$OUT/7b-ui.xml" || falla "con red, el catálogo de Fénix no cargó"
consola
grep -i "error" "$OUT/logcat.txt" | grep -i "console" | head -20

echo "Fallas: $fallas"
exit "$fallas"
