// src/lib/api/citas.js
import { apiFetch } from './fetcher';
const BASE_URL = 'http://localhost:8080/api';

// --- Helper para formatear fechas ---
function formatDateForAPI(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * [CLIENTE] Obtiene horarios disponibles.
 */
// VERSIÓN GET (LA QUE FUNCIONARÁ CON TU CONTROLLER MODIFICADO)
export async function obtenerDisponibilidad(idBarbero, fecha, idServicios) {
	const fechaFormateada = formatDateForAPI(fecha);

	// Construimos los parámetros de la URL
	const params = new URLSearchParams({ fecha: fechaFormateada });
	idServicios.forEach((id) => params.append('idServicios', id));

	// Creamos la URL completa y hacemos la petición GET (método por defecto de apiFetch)
	const url = `${BASE_URL}/disponibilidad/barbero/${idBarbero}?${params.toString()}`;
	return apiFetch(url);
}

/**
 * [ADMIN] Obtiene todas las citas para una fecha.
 */
export async function obtenerTodasLasCitasPorFecha(fecha) {
	const fechaFormateada = formatDateForAPI(fecha);
	return apiFetch(`${BASE_URL}/citas/fecha/${fechaFormateada}`);
}

/**
 * [CLIENTE/ADMIN] Crea una nueva cita.
 */
export async function crearCita(datosCita) {
	return apiFetch(`${BASE_URL}/citas`, {
		method: 'POST',
		body: JSON.stringify(datosCita)
	});
}

/**
 * [BARBERO] Obtiene las citas asignadas al barbero.
 */
export async function obtenerCitasDeBarbero(idBarbero) {
	return apiFetch(`${BASE_URL}/citas/barbero/${idBarbero}`);
}

/**
 * [BARBERO] Obtiene la agenda de un día específico para el barbero.
 */
export async function obtenerAgendaDiaria(idBarbero, fecha) {
	const fechaFormateada = formatDateForAPI(fecha);
	return apiFetch(`${BASE_URL}/citas/barbero/${idBarbero}/fecha/${fechaFormateada}`);
}
