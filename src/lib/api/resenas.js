// src/lib/api/resenas.js

const API_URL = 'http://localhost:8080/api/resenas';

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
        if (response.status === 204) return; // Éxito sin contenido (para DELETE)
        return response.json();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
}

/**
 * [ADMIN] Obtiene todas las reseñas del sistema.
 * Ruta: GET /api/resenas
 */
export async function obtenerTodasLasResenas() {
    const token = getToken();
    const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
}

/**
 * [ADMIN] Elimina una reseña por su ID.
 * Ruta: DELETE /api/resenas/{id}
 */
export async function eliminarResena(id) {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
}