// src/lib/api/citas.js

// --- TODO TU CÓDIGO EXISTENTE SE MANTIENE INTACTO ---
import { apiFetch } from './fetcher';
const BASE_URL = 'http://54.197.147.238:8080/api';

// --- Helper para formatear fechas ---
function formatDateForAPI(date) {
	// ... (sin cambios)
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}
export async function obtenerDisponibilidad(idBarbero, fecha, idServicios) {
	// ... (sin cambios)
	const fechaFormateada = formatDateForAPI(fecha);
	const params = new URLSearchParams({ fecha: fechaFormateada });
	idServicios.forEach((id) => params.append('idServicios', id));
	const url = `${BASE_URL}/disponibilidad/barbero/${idBarbero}?${params.toString()}`;
	return apiFetch(url);
}
export async function obtenerTodasLasCitasPorFecha(fecha) {
	// ... (sin cambios)
	const fechaFormateada = formatDateForAPI(fecha);
	return apiFetch(`${BASE_URL}/citas/fecha/${fechaFormateada}`);
}
export async function crearCita(datosCita) {
	// ... (sin cambios)
	return apiFetch(`${BASE_URL}/citas`, {
		method: 'POST',
		body: JSON.stringify(datosCita)
	});
}
export async function obtenerCitasDeBarbero(idBarbero) {
	// ... (sin cambios)
	return apiFetch(`${BASE_URL}/citas/barbero/${idBarbero}`);
}
export async function obtenerAgendaDiaria(idBarbero, fecha) {
	// ... (sin cambios)
	const fechaFormateada = formatDateForAPI(fecha);
	return apiFetch(`${BASE_URL}/citas/barbero/${idBarbero}/fecha/${fechaFormateada}`);
}

// --- ✨ NUEVAS FUNCIONES AÑADIDAS (SIN MODIFICAR LO ANTERIOR) ✨ ---

/**
 * [BARBERO/ADMIN] Actualiza el estado de una cita (ej. a 'Completada' o 'Cancelada').
 * @param {number} idCita El ID de la cita.
 * @param {string} nuevoEstado El nuevo estado.
 * @returns {Promise<any>}
 */
export async function actualizarEstadoCita(idCita, nuevoEstado) {
	const params = new URLSearchParams({ estado: nuevoEstado });
	const url = `${BASE_URL}/citas/${idCita}/estado?${params.toString()}`;
	return apiFetch(url, {
		method: 'PATCH'
	});
}

/**
 * [BARBERO/ADMIN] Elimina permanentemente una cita.
 * @param {number} idCita El ID de la cita a eliminar.
 * @returns {Promise<any>}
 */
export async function eliminarCita(idCita) {
	return apiFetch(`${BASE_URL}/citas/${idCita}`, {
		method: 'DELETE'
	});
}
