import { apiFetch } from './fetcher';
const ESPECIALIDADES_URL = 'http://localhost:8080/api/especialidades';

/**
 * [ADMIN] Obtiene el catálogo completo de especialidades disponibles.
 * Esta es la función que se usa para llenar el modal.
 */
export async function obtenerEspecialidadesDisponibles() {
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