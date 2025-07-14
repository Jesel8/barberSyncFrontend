// src/lib/api/barberos.js

const BASE_URL = 'http://localhost:8080/api';

// Obtener todos los usuarios con rol barbero (rolId = 1)
export async function obtenerBarberos() {
  const res = await fetch(`${BASE_URL}/usuarios`);
  if (!res.ok) throw new Error('Error al obtener barberos');
  const usuarios = await res.json();
  return usuarios.filter(u => u.rolId === 1);
}

// Crear un nuevo barbero
export async function crearBarbero(data) {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, rolId: 1 }) // Siempre rol de barbero
  });
  if (!res.ok) throw new Error('Error al crear barbero');
  return await res.json();
}

// Eliminar un barbero
export async function eliminarBarbero(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar barbero');
}

// Obtener especialidades del barbero
export async function obtenerEspecialidades(idUsuario) {
  const res = await fetch(`${BASE_URL}/barberos/especialidades/${idUsuario}`);
  if (!res.ok) throw new Error('Error al obtener especialidades');
  return await res.json(); // Devuelve { idUsuario, nombreCompleto, correo, especialidades: [] }
}

// Actualizar especialidades del barbero
export async function actualizarEspecialidades(idUsuario, especialidadesIds) {
  const res = await fetch(`${BASE_URL}/barberos/especialidades/${idUsuario}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUsuario, idEspecialidades: especialidadesIds })
  });
  if (!res.ok) throw new Error('Error al actualizar especialidades');
}

// Eliminar todas las especialidades
export async function eliminarEspecialidades(idUsuario) {
  const res = await fetch(`${BASE_URL}/barberos/especialidades/${idUsuario}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar especialidades');
}
