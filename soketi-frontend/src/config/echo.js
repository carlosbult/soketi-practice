import Echo from 'laravel-echo';
import * as PusherModule from 'pusher-js';

window.Pusher = PusherModule.default || PusherModule;

if (typeof window.Pusher !== 'function') {
    console.error('ERROR CRÍTICO: Pusher no se ha inicializado como una función (constructor). Revise el bundle.');
} else {
    console.log('Pusher inicializado correctamente como constructor.');
}

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
