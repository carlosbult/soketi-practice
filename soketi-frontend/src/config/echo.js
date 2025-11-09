// src/echo.js

import Echo from 'laravel-echo';
// 1. Usamos import * as y accedemos a .default o al objeto completo
import * as PusherModule from 'pusher-js'; 

// 2. FORZAR la asignación de la clase Pusher al objeto global
// Si la versión de Pusher.js que tienes exporta 'default', úsalo. Si no, usa el objeto completo.
window.Pusher = PusherModule.default || PusherModule; 

// 3. Verifica el tipo ANTES de inicializar Echo (diagnóstico)
if (typeof window.Pusher !== 'function') {
    console.error("ERROR CRÍTICO: Pusher no se ha inicializado como una función (constructor). Revise el bundle.");
} else {
    console.log("Pusher inicializado correctamente como constructor.");
}


// --- CONFIGURACIÓN DE ECHO (Mantenemos tu lógica de VITE) ---
const config = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    wsHost: import.meta.env.VITE_PUSHER_APP_HOST,
    wsPort: import.meta.env.VITE_PUSHER_APP_PORT
};

if (import.meta.env.VITE_PUSHER_APP_CLUSTER) {
    config.cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
}

window.Echo = new Echo(config);

console.log('Cliente Echo configurado para conectarse a Soketi...');