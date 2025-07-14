// src/lib/stores/authStore.js
import { writable } from 'svelte/store';

// Función para crear nuestro store personalizado
function createAuthStore() {
  // 'writable' crea un store cuyo valor puede ser modificado
  const { subscribe, set } = writable({ usuario: null });

  return {
    subscribe, // Para que los componentes puedan "escuchar" los cambios
    
    // Función para cuando el usuario inicia sesión
    login: (datosUsuario) => {
      // Guardamos los datos del usuario en el store
      set({ usuario: datosUsuario });
      // Opcional: guardar también en localStorage para persistir la sesión
      if (typeof window !== 'undefined') {
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));
      }
    },

    // Función para cerrar sesión
    logout: () => {
      set({ usuario: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('usuario');
      }
    },
    
    // Función para cargar el usuario desde localStorage al iniciar la app
    init: () => {
      if (typeof window !== 'undefined') {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
          set({ usuario: JSON.parse(usuarioGuardado) });
        }
      }
    }
  };
}

export const authStore = createAuthStore();