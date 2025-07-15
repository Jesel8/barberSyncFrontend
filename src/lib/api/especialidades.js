// src/lib/api/especialidades.js

const BASE_URL = 'http://localhost:8080/api';

// --- Reutilizamos la misma función para obtener el token ---
function getToken() {
    if (typeof window === 'undefined') return null;
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) return null;
    const usuario = JSON.parse(usuarioString);
    return usuario ? usuario.token : null;
}

// Obtener todas las especialidades disponibles
export async function obtenerEspecialidadesDisponibles() {
  const token = getToken();
  if (!token) throw new Error('No autenticado');

  const res = await fetch(`${BASE_URL}/especialidades`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al obtener las especialidades disponibles');
  return await res.json();
}

// Crear una nueva especialidad
export async function crearEspecialidad(data) {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  
  const res = await fetch(`${BASE_URL}/especialidades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear la especialidad');
  return await res.json();
}

// Eliminar una especialidad
export async function eliminarEspecialidad(id) {
  const token = getToken();
  if (!token) throw new Error('No autenticado');

  const res = await fetch(`${BASE_URL}/especialidades/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al eliminar la especialidad');
}