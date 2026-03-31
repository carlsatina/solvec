package com.solvec.evtaxi;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.solvec.evtaxi.plugins.NativePlacesPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativePlacesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
