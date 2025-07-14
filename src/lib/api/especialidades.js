// src/lib/api/especialidades.js

const BASE_URL = 'http://localhost:8080/api';

/**
 * Obtiene la lista de especialidades disponibles desde la API.
 * @returns {Promise<Array>} Arreglo de objetos: [{ id, especialidad, descripcion }]
 */
export async function obtenerEspecialidadesDisponibles() {
  try {
    const response = await fetch(`${BASE_URL}/especialidades`);
    if (!response.ok) {
      throw new Error('Error al obtener especialidades');
    }
    return await response.json(); // Ejemplo de retorno: [{ id: 1, especialidad: "Fade", descripcion: "..." }]
  } catch (error) {
    console.error('❌ Error en obtenerEspecialidadesDisponibles:', error);
    return [];
  }
}
export async function crearEspecialidad(especialidad) {
  const res = await fetch(`${BASE_URL}/especialidades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(especialidad)
  });
  if (!res.ok) throw new Error('Error al crear especialidad');
  return await res.json();
}

export async function eliminarEspecialidad(id) {
  const res = await fetch(`${BASE_URL}/especialidades/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar especialidad');
}
