import { authStore } from '$lib/stores/authStore.js';
import { get } from 'svelte/store';

const BASE_URL = 'http://54.197.147.238:8080/api'; // Asegúrate que esta sea la URL base de tu API

// --- FUNCIÓN CORREGIDA ---
// Ahora busca el token en la ubicación correcta: auth.usuario.token
function getAuthToken() {
	const auth = get(authStore); // auth = { usuario: { ... } }
	// Si 'auth' y 'auth.usuario' existen, devuelve el token. Si no, null.
	return auth && auth.usuario ? auth.usuario.token : null;
}

/**
 * Obtiene los datos para el gráfico de servicios más agendados.
 * @param {string | null} fechaInicio - Formato YYYY-MM-DD
 * @param {string | null} fechaFin - Formato YYYY-MM-DD
 */
export async function obtenerServiciosMasAgendados(fechaInicio = null, fechaFin = null) {
	const token = getAuthToken();
	if (!token) {
		console.error('API-REPORTES: No se encontró token de autenticación.');
		throw new Error('Usuario no autenticado');
	}

	const params = new URLSearchParams();
	if (fechaInicio) params.append('fechaInicio', fechaInicio);
	if (fechaFin) params.append('fechaFin', fechaFin);
	const url = `${BASE_URL}/reportes/servicios-mas-agendados?${params.toString()}`;

	console.log(`API-REPORTES: Realizando petición a: ${url}`);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		console.error('API-REPORTES: La respuesta del servidor no fue OK', response);
		const errorBody = await response.text();
		console.error('API-REPORTES: Cuerpo del error:', errorBody); // Log extra para ver el error del servidor
		throw new Error('Error al obtener los datos de servicios agendados');
	}

	const data = await response.json();
	console.log('API-REPORTES: Datos de servicios recibidos:', data);
	return data;
}

/**
 * Obtiene los datos para el gráfico de días más ocupados.
 * @param {string} fechaInicio - Formato YYYY-MM-DD
 * @param {string} fechaFin - Formato YYYY-MM-DD
 */
export async function obtenerDiasMasOcupados(fechaInicio, fechaFin) {
	const token = getAuthToken();
	if (!token) {
		console.error('API-REPORTES: No se encontró token de autenticación.');
		throw new Error('Usuario no autenticado');
	}

	const url = `${BASE_URL}/reportes/dias-mas-ocupados?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
	console.log(`API-REPORTES: Realizando petición a: ${url}`);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		console.error('API-REPORTES: La respuesta del servidor no fue OK', response);
		const errorBody = await response.text();
		console.error('API-REPORTES: Cuerpo del error:', errorBody); // Log extra para ver el error del servidor
		throw new Error('Error al obtener los datos de días ocupados');
	}

	const data = await response.json();
	console.log('API-REPORTES: Datos de días recibidos:', data);
	return data;
}
