// Este es tu svelte.config.js MODIFICADO

import adapter from '@sveltejs/adapter-static'; // ✅ PASO 1: Cambia la importación
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Es una buena práctica añadir el preprocesador si no estaba.
	preprocess: vitePreprocess(),

	kit: {
		// ✅ PASO 2: Cambia la configuración del adaptador
		adapter: adapter({
			// Con esta configuración, creará una carpeta llamada 'build' en la raíz.
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // Necesario para que el enrutamiento del lado del cliente funcione
			precompress: false
		})
	}
};

export default config;
