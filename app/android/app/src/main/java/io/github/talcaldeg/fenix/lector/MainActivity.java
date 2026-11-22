package io.github.talcaldeg.fenix.lector;

import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(LectorFenix.class);
        super.onCreate(savedInstanceState);
    }

    // BridgeActivity.load() también pasa por aquí con el intent con que se abrió la app.
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        LectorFenix.recibir(getApplicationContext(), bridge, intent);
    }

    // Con un libro abierto, volumen abajo pasa a la página siguiente y volumen arriba a la anterior.
    @Override
    public boolean dispatchKeyEvent(KeyEvent e) {
        int k = e.getKeyCode();
        if (LectorFenix.volumen && (k == KeyEvent.KEYCODE_VOLUME_DOWN || k == KeyEvent.KEYCODE_VOLUME_UP)) {
            if (e.getAction() == KeyEvent.ACTION_DOWN && e.getRepeatCount() == 0 && bridge != null) {
                bridge.triggerWindowJSEvent("lectorVolumen", "{\"paso\":" + (k == KeyEvent.KEYCODE_VOLUME_DOWN ? 1 : -1) + "}");
            }
            return true;
        }
        return super.dispatchKeyEvent(e);
    }

    // Al volver de otra app, Android muestra las barras: si se estaba leyendo a pantalla completa, se vuelven a esconder.
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && LectorFenix.completa) LectorFenix.aplicarPantalla(this);
    }
}
