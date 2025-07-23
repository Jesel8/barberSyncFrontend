// src/lib/api/usuarios.js

import { apiFetch } from './fetcher';

const BASE_URL = 'http://localhost:8080/api/usuarios';

/**
 * Obtiene los datos de un perfil de usuario por su ID.
 */
export async function obtenerPerfilUsuario(idUsuario) {
	return apiFetch(`${BASE_URL}/${idUsuario}`);
}

/**
 * Actualiza los datos de su propio perfil.
 */
export async function actualizarPerfilUsuario(idUsuario, datosPerfil) {
	return apiFetch(`${BASE_URL}/${idUsuario}`, {
		method: 'PUT',
		body: JSON.stringify(datosPerfil)
	});
}

/**
 * Sube una imagen de perfil para un usuario.
 */
export async function subirImagenPerfil(idUsuario, archivo) {
	const formData = new FormData();
	formData.append('file', archivo);

	const url = `${BASE_URL}/${idUsuario}/imagen`;

	// ========================================================================
	// ✅ SOLUCIÓN: Leer el token directamente desde localStorage.
	// Es más simple y no requiere importar 'get' de Svelte.
	// ========================================================================
	const token = localStorage.getItem('authToken');

	const headers = {};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	} else {
		// Opcional: Si no hay token, podemos detenernos aquí para evitar un error 403.
		console.error('No se encontró token de autenticación para subir la imagen.');
		throw new Error('Usuario no autenticado. No se puede subir la imagen.');
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: formData,
			headers: headers
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Respuesta de error del servidor:', errorText);
			// El errorText puede contener el mensaje de error del backend.
			throw new Error(`Error del servidor: ${errorText || response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		// No envolvemos el error en otro, simplemente lo relanzamos
		// para que el componente reciba el mensaje correcto.
		throw error;
	}
}
