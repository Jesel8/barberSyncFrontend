// src/lib/api/servicios.js

const API_URL = 'http://54.197.147.238:8080/api/servicios';

// --- Función Helper para obtener el Token ---
function getToken() {
    if (typeof window === 'undefined') return null;
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) return null;
    const usuario = JSON.parse(usuarioString);
    return usuario ? usuario.token : null;
}

// --- Función para manejar las respuestas de la API ---
async function handleResponse(response) {
    if (response.ok) {
        // Si el status es 204 (No Content), como en un DELETE exitoso, no hay JSON que parsear.
        if (response.status === 204) {
            return; 
        }
        return response.json();
    } else {
        // Intenta parsear el error del backend, si no, usa el statusText.
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
}

/**
 * Obtiene todos los servicios.
 * Ruta: GET /api/servicios
 * Requiere: Autenticación
 */
export async function getServicios() {
    const token = getToken();
    const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
}

/**
 * Crea un nuevo servicio.
 * Ruta: POST /api/servicios
 * Requiere: Rol de ADMIN
 */
export async function createServicio(servicioData) {
    const token = getToken();
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicioData),
    });
    return handleResponse(response);
}

/**
 * Actualiza un servicio existente por su ID.
 * Ruta: PUT /api/servicios/{id}
 * Requiere: Rol de ADMIN
 */
export async function updateServicio(id, servicioData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicioData),
    });
    return handleResponse(response);
}

/**
 * Elimina un servicio por su ID.
 * Ruta: DELETE /api/servicios/{id}
 * Requiere: Rol de ADMIN
 */
export async function deleteServicio(id) {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
}