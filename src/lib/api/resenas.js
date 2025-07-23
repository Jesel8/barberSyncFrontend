// src/lib/api/resenas.js
import { apiFetch } from './fetcher';
const BASE_URL = 'http://54.197.147.238:8080/api/resenas';

/**
 * [ADMIN] Obtiene todas las reseñas del sistema.
 */
export async function obtenerTodasLasResenas() {
	return apiFetch(BASE_URL);
}

/**
 * [ADMIN] Elimina una reseña por su ID.
 */
export async function eliminarResena(id) {
	return apiFetch(`${BASE_URL}/${id}`, {
		method: 'DELETE'
	});
}

/**
 * [BARBERO] Obtiene las reseñas dejadas para el barbero actual.
 */
export async function obtenerResenasDeBarbero(idBarbero) {
	// Ojo: La URL correcta es /api/resenas/barbero/{id}
	return apiFetch(`${BASE_URL}/barbero/${idBarbero}`);
}
