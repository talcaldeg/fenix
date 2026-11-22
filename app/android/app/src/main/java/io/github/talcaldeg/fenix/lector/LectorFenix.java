package io.github.talcaldeg.fenix.lector;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
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
import java.util.ArrayList;
import java.util.List;

/**
 * Lo que el lector (lector/lector.js) le pide a Android y no tiene la web:
 * - EPUB abiertos con «Abrir con Lector Fénix» (WhatsApp, Archivos): se copian a la caché de la app y
 *   quedan en espera hasta que el lector los pida con pendientes(); el evento «lectorArchivo» le avisa.
 * - Botones de volumen para pasar página, solo mientras hay un libro abierto (volumen({activo})).
 * - Pantalla completa de Android (pantallaCompleta({activa})).
 * - Versión instalada (info()), para el aviso «Hay versión nueva».
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
