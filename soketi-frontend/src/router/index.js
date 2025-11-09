import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    // El arreglo 'routes' debe contener solo objetos de ruta
    routes: [
        // 1. Ruta principal / Console
        {
            path: '/',
            name: 'console',
            component: () => import('@/views/ConsoleView.vue')
        }
    ]
});

export default router;
