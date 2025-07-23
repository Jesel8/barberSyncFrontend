import { apiFetch } from './fetcher';

// URLs base claras y con un único propósito
const USUARIOS_URL = 'http://:8080/api/usuarios';
const BARBEROS_URL = 'http://localhost:8080/api/barberos';

/**
 * Obtiene la lista de todos los usuarios con el rol de BARBERO.
 */
export async function obtenerBarberos() {
	return apiFetch(BARBEROS_URL);
}

/**
 * Crea un nuevo usuario.
 */
export async function crearBarbero(data, rolIdBarbero) {
	const payload = { ...data, rolId: rolIdBarbero };
	return apiFetch(USUARIOS_URL, {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

/**
 * Elimina un usuario (barbero) por su ID.
 */
export async function eliminarBarbero(id) {
	return apiFetch(`${USUARIOS_URL}/${id}`, {
		method: 'DELETE'
	});
}

// ==========================================================
// ✅ LÓGICA CORRECTA PARA GESTIONAR ESPECIALIDADES DE UN BARBERO
// ==========================================================

/**
 * Obtiene las especialidades asignadas a UN barbero específico.
 */
export async function obtenerEspecialidadesDeBarbero(barberoId) {
	// Llama a la URL que configuramos en el backend: GET /api/barberos/{id}/especialidades
	return apiFetch(`${BARBEROS_URL}/${barberoId}/especialidades`);
}

/**
 * Asigna o actualiza la lista completa de especialidades de un barbero.
 * Reemplaza todas las funciones antiguas.
 */
export async function actualizarEspecialidadesDeBarbero(barberoId, listaDeIdsDeEspecialidades) {
	// Llama a la URL y método correctos del backend que arreglamos antes.
	// Envía la lista de IDs directamente en el cuerpo.
	return apiFetch(`${BARBEROS_URL}/${barberoId}/especialidades`, {
		method: 'POST',
		body: JSON.stringify(listaDeIdsDeEspecialidades)
	});
}
