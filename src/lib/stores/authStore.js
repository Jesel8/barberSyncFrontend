import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialState = {
	usuario: null
};

function createAuthStore() {
	const { subscribe, set } = writable(initialState);

	return {
		subscribe,

		// ✅ Función al iniciar sesión
		login: (datosUsuario) => {
			set({ usuario: datosUsuario });

			if (browser) {
				localStorage.setItem('usuario', JSON.stringify(datosUsuario));
				localStorage.setItem('authToken', datosUsuario.token); // Para fetcher.js
			}
		},

		// ✅ Función al cerrar sesión
		logout: () => {
			set(initialState);

			if (browser) {
				localStorage.removeItem('usuario');
				localStorage.removeItem('authToken');
			}
		},

		// ✅ Función para restaurar sesión desde localStorage
		init: () => {
			if (browser) {
				const usuarioGuardadoString = localStorage.getItem('usuario');

				if (usuarioGuardadoString) {
					try {
						const usuario = JSON.parse(usuarioGuardadoString);
						console.log('✅ authStore.init(): Sesión restaurada desde localStorage →', usuario);
						set({ usuario });
					} catch (e) {
						console.error('❌ Error al parsear usuario de localStorage', e);
						set(initialState);
						localStorage.removeItem('usuario');
						localStorage.removeItem('authToken');
					}
				}
			}
		}
	};
}

export const authStore = createAuthStore();

// ✅ Inicializar inmediatamente si estamos en el navegador
if (browser) {
	authStore.init();
}
