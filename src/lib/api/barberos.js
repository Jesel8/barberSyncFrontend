// src/lib/api/barberos.js (o gestion-usuarios.js)
import { apiFetch } from './fetcher';
const BASE_URL = 'http://localhost:8080/api/usuarios';

/**
 * [ADMIN] Obtiene todos los usuarios con el rol de BARBERO.
 */
export async function obtenerBarberos() {
	return apiFetch(`${BASE_URL}?rol=BARBERO`);
}

/**
 * [ADMIN] Crea un nuevo usuario (en este caso, un barbero).
 * El rolId para barbero debe ser conocido (ej. 2)
 */
export async function crearBarbero(data, rolIdBarbero) {
	const payload = { ...data, rolId: rolIdBarbero };
	return apiFetch(BASE_URL, {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

/**
 * [ADMIN] Elimina un usuario (barbero) por su ID.
 */
export async function eliminarBarbero(id) {
	return apiFetch(`${BASE_URL}/${id}`, {
		method: 'DELETE'
	});
}
 