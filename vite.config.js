import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/main.jsx'], // Apunta a tu archivo de entrada de React
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: 'public/react', // Carpeta de salida para los archivos compilados
        emptyOutDir: true,
        manifest: true, // Laravel usa manifest para versionar archivos
        rollupOptions: {
            input: 'resources/js/main.jsx',
        },
    },
});
