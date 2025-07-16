// src/lib/api/usuarios.js
import { apiFetch } from './fetcher';
const BASE_URL = 'http://localhost:8080/api/usuarios';

/**
 * 🟡 [BARBERO/CLIENTE/ADMIN] Obtiene los datos de un perfil de usuario por su ID.
 * Ruta: GET /api/usuarios/{id}
 */
export async function obtenerPerfilUsuario(idUsuario) {
	return apiFetch(`${BASE_URL}/${idUsuario}`);
}

/**
 * 🟡 [BARBERO/CLIENTE/ADMIN] Actualiza los datos de su propio perfil.
 * Ruta: PUT /api/usuarios/{id}
 */
export async function actualizarPerfilUsuario(idUsuario, datosPerfil) {
	return apiFetch(`${BASE_URL}/${idUsuario}`, {
		method: 'PUT',
		body: JSON.stringify(datosPerfil)
	});
}
