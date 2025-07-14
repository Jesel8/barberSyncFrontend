// src/lib/api/servicioApi.js

// La URL base de tu API. Tenerla en una constante facilita su modificación futura.
const API_URL = 'http://localhost:8080/api/servicios';

/**
 * Maneja las respuestas de la API. Si la respuesta no es OK,
 * extrae el mensaje de error del cuerpo y lanza una excepción.
 * @param {Response} response La respuesta del fetch.
 * @returns {Promise<any>} El cuerpo de la respuesta en formato JSON si es exitosa.
 */
async function handleResponse(response) {
    if (response.ok) {
        // Si la respuesta es un 204 No Content (como en DELETE), no hay cuerpo que parsear.
        if (response.status === 204) {
            return;
        }
        return response.json();
    } else {
        // Intenta obtener el mensaje de error del backend.
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido en la respuesta de la API.' }));
        // Lanza un error que pueda ser capturado por el componente que llama.
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
}

/**
 * Obtiene todos los servicios.
 * Corresponde a: GET /api/servicios
 * @returns {Promise<Array>} Una promesa que resuelve a un array de servicios.
 */
export async function getServicios() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

/**
 * Crea un nuevo servicio.
 * Corresponde a: POST /api/servicios
 * @param {object} servicioData - Los datos del servicio a crear.
 * @returns {Promise<object>} Una promesa que resuelve al objeto del servicio recién creado.
 */
export async function createServicio(servicioData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicioData),
    });
    return handleResponse(response);
}

/**
 * Actualiza un servicio existente por su ID.
 * Corresponde a: PUT /api/servicios/{id}
 * @param {number} id - El ID del servicio a actualizar.
 * @param {object} servicioData - Los nuevos datos para el servicio.
 * @returns {Promise<object>} Una promesa que resuelve al objeto del servicio actualizado.
 */
export async function updateServicio(id, servicioData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicioData),
    });
    return handleResponse(response);
}

/**
 * Elimina un servicio por su ID.
 * Corresponde a: DELETE /api/servicios/{id}
 * @param {number} id - El ID del servicio a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la eliminación es exitosa.
 */
export async function deleteServicio(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
}

// Opcional pero recomendado: función para obtener un solo servicio por ID.
// Útil si quieres una página de "detalle" del servicio.
/**
 * Obtiene un servicio por su ID.
 * Corresponde a: GET /api/servicios/{id}
 * @param {number} id - El ID del servicio a obtener.
 * @returns {Promise<object>} Una promesa que resuelve al objeto del servicio.
 */
export async function getServicioById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response);
}