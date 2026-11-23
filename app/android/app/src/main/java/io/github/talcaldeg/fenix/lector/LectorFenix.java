package io.github.talcaldeg.fenix.lector;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import androidx.core.content.FileProvider;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * Lo que el lector (lector/lector.js) le pide a Android y no tiene la web:
 * - EPUB abiertos con «Abrir con Lector Fénix» (WhatsApp, Archivos): se copian a la caché de la app y
 *   quedan en espera hasta que el lector los pida con pendientes(); el evento «lectorArchivo» le avisa.
 * - Botones de volumen para pasar página, solo mientras hay un libro abierto (volumen({activo})).
 * - Pantalla completa de Android (pantallaCompleta({activa})).
 * - Versión instalada (info()), para el aviso «Hay versión nueva», y actualizar() para instalarla con un toque.
 * - Altura de las barras del sistema (insets()), para no dibujar debajo de la hora.
 * Desde JS se llama con Capacitor.nativePromise("LectorFenix", "<método>", {...}).
 */
@CapacitorPlugin(name = "LectorFenix")
public class LectorFenix extends Plugin {

    static volatile boolean volumen = false;
    static volatile boolean completa = false;
    private static final List<JSObject> pendientes = new ArrayList<>();

    @PluginMethod
    public void info(PluginCall call) {
        JSObject r = new JSObject();
        try {
            PackageInfo p = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
            r.put("versionCode", p.versionCode);
            r.put("versionName", p.versionName);
        } catch (Exception e) {
            r.put("versionCode", 0);
        }
        call.resolve(r);
    }

    // Alto de la barra de estado y de la de navegación, en px de CSS. Android 15 dibuja la app debajo de
    // ellas y la WebView no siempre lo informa en env(safe-area-inset-*): el lector usa estos valores para
    // que la hora y la batería no queden encima del logo.
    @PluginMethod
    public void insets(PluginCall call) {
        Activity a = getActivity();
        a.runOnUiThread(() -> {
            JSObject r = new JSObject();
            WindowInsetsCompat w = ViewCompat.getRootWindowInsets(a.getWindow().getDecorView());
            float d = a.getResources().getDisplayMetrics().density;
            Insets i = w == null ? Insets.NONE : w.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            r.put("arriba", Math.round(i.top / d));
            r.put("abajo", Math.round(i.bottom / d));
            r.put("izquierda", Math.round(i.left / d));
            r.put("derecha", Math.round(i.right / d));
            call.resolve(r);
        });
    }

    // Actualizar la app con un toque: baja el APK nuevo (url) a la caché con su nombre de versión
    // (lector-fenix-1.N.apk) y abre el instalador de Android, que lo pone encima sin borrar libros ni notas.
    // La primera vez Android pide permitir instalar desde el Lector Fénix.
    @PluginMethod
    public void actualizar(PluginCall call) {
        String url = call.getString("url", "");
        String nombre = call.getString("nombre", "lector-fenix.apk").replaceAll("[^A-Za-z0-9._-]", "_");
        if (!url.startsWith("https://github.com/talcaldeg/fenix/releases/")) {
            call.reject("Dirección no permitida");
            return;
        }
        Context ctx = getContext();
        new Thread(() -> {
            try {
                File dir = new File(ctx.getCacheDir(), "apk");
                File[] viejos = dir.listFiles();
                if (viejos != null) for (File f : viejos) f.delete();
                dir.mkdirs();
                File destino = new File(dir, nombre);
                HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                c.setInstanceFollowRedirects(true);
                c.setConnectTimeout(20000);
                c.setReadTimeout(60000);
                if (c.getResponseCode() != 200) throw new Exception("HTTP " + c.getResponseCode());
                try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(destino)) {
                    byte[] buf = new byte[65536];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                } finally {
                    c.disconnect();
                }
                Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".fileprovider", destino);
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setDataAndType(uri, "application/vnd.android.package-archive");
                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(i);
                call.resolve();
            } catch (Exception e) {
                call.reject(String.valueOf(e.getMessage()));
            }
        }).start();
    }

    @PluginMethod
    public void pendientes(PluginCall call) {
        JSArray lista = new JSArray();
        synchronized (pendientes) {
            for (JSObject o : pendientes) lista.put(o);
            pendientes.clear();
        }
        JSObject r = new JSObject();
        r.put("archivos", lista);
        call.resolve(r);
    }

    // El lector ya guardó el libro en su biblioteca: se borra la copia de la caché.
    @PluginMethod
    public void descartar(PluginCall call) {
        String ruta = call.getString("ruta", "");
        File f = new File(ruta);
        File dir = new File(getContext().getCacheDir(), "entrantes");
        if (f.getParentFile() != null && f.getParentFile().equals(dir)) f.delete();
        call.resolve();
    }

    // Hitos del lector al logcat (etiqueta LECTOR), para app/probar_emulador.sh: el APK firmado no pasa
    // la consola de la WebView al logcat.
    @PluginMethod
    public void hito(PluginCall call) {
        android.util.Log.i("LECTOR", call.getString("t", ""));
        call.resolve();
    }

    @PluginMethod
    public void volumen(PluginCall call) {
        volumen = Boolean.TRUE.equals(call.getBoolean("activo", false));
        call.resolve();
    }

    @PluginMethod
    public void pantallaCompleta(PluginCall call) {
        completa = Boolean.TRUE.equals(call.getBoolean("activa", false));
        Activity a = getActivity();
        a.runOnUiThread(() -> aplicarPantalla(a));
        call.resolve();
    }

    static void aplicarPantalla(Activity a) {
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(a.getWindow(), a.getWindow().getDecorView());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        if (completa) c.hide(WindowInsetsCompat.Type.systemBars());
        else c.show(WindowInsetsCompat.Type.systemBars());
    }

    // Un EPUB que llega de otra app: VIEW (Archivos, WhatsApp «Abrir con») o SEND (Compartir).
    static void recibir(Context ctx, Bridge bridge, Intent intent) {
        if (intent == null) return;
        Uri uri = null;
        if (Intent.ACTION_VIEW.equals(intent.getAction())) uri = intent.getData();
        else if (Intent.ACTION_SEND.equals(intent.getAction())) uri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        if (uri == null) return;
        final Uri origen = uri;
        // Que el mismo intent no se vuelva a importar al recrear la actividad (girar la pantalla).
        intent.setAction(Intent.ACTION_MAIN);
        intent.setData(null);
        new Thread(() -> {
            JSObject o = new JSObject();
            try {
                String nombre = nombreDe(ctx, origen);
                File dir = new File(ctx.getCacheDir(), "entrantes");
                dir.mkdirs();
                File destino = new File(dir, System.currentTimeMillis() + "-" + nombre.replaceAll("[^\\p{L}\\p{N}._ -]", "_"));
                try (InputStream in = ctx.getContentResolver().openInputStream(origen); OutputStream out = new FileOutputStream(destino)) {
                    if (in == null) throw new Exception("sin datos");
                    byte[] buf = new byte[65536];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                }
                o.put("ruta", destino.getAbsolutePath());
                o.put("nombre", nombre);
            } catch (Exception e) {
                o.put("error", String.valueOf(e.getMessage()));
                o.put("nombre", origen.getLastPathSegment());
            }
            synchronized (pendientes) {
                pendientes.add(o);
            }
            if (bridge != null) bridge.triggerWindowJSEvent("lectorArchivo");
        }).start();
    }

    private static String nombreDe(Context ctx, Uri uri) {
        String nombre = null;
        if ("content".equals(uri.getScheme())) {
            try (Cursor c = ctx.getContentResolver().query(uri, new String[] { OpenableColumns.DISPLAY_NAME }, null, null, null)) {
                if (c != null && c.moveToFirst()) nombre = c.getString(0);
            } catch (Exception ignored) {}
        }
        if (nombre == null || nombre.isEmpty()) nombre = uri.getLastPathSegment();
        if (nombre == null || nombre.isEmpty()) nombre = "libro.epub";
        return nombre;
    }
}
