// src/lib/api/especialidades.js
import { apiFetch } from './fetcher';
const ESPECIALIDADES_URL = 'http://localhost:8080/api/especialidades';
const BARBERO_ESPECIALIDADES_URL = 'http://localhost:8080/api/barberos/especialidades';

/**
 * [ADMIN] Obtiene el catálogo completo de especialidades.
 */
export async function obtenerCatalogoEspecialidades() {
	return apiFetch(ESPECIALIDADES_URL);
}

/**
 * [ADMIN] Crea una nueva especialidad en el catálogo.
 */
export async function crearEspecialidad(data) {
	return apiFetch(ESPECIALIDADES_URL, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

/**
 * [ADMIN] Elimina una especialidad del catálogo.
 */
export async function eliminarEspecialidad(id) {
	return apiFetch(`${ESPECIALIDADES_URL}/${id}`, {
		method: 'DELETE'
	});
}

/**
 * [BARBERO/ADMIN] Obtiene las especialidades que un barbero tiene asignadas.
 */
export async function obtenerEspecialidadesDeBarbero(idBarbero) {
	return apiFetch(`${BARBERO_ESPECIALIDADES_URL}/${idBarbero}`);
}

/**
 * [BARBERO/ADMIN] Actualiza la lista de especialidades de un barbero.
 */
export async function actualizarEspecialidadesDeBarbero(idBarbero, idsEspecialidades) {
	const payload = {
		idUsuario: idBarbero,
		idEspecialidades: idsEspecialidades
	};
	return apiFetch(`${BARBERO_ESPECIALIDADES_URL}/${idBarbero}`, {
		method: 'PUT',
		body: JSON.stringify(payload)
	});
}
