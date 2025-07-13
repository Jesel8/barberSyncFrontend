const BASE_URL = 'http://localhost:8080/api/citas';

// Crear nueva cita
export async function crearCita(citaRequest) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citaRequest)
  });
  if (!response.ok) throw new Error('Error al crear cita');
  return await response.json();
}

// Obtener cita por ID
export async function obtenerCitaPorId(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error('Cita no encontrada');
  return await response.json();
}

// Obtener todas las citas
export async function obtenerTodasLasCitas() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Error al obtener citas');
  return await response.json();
}

// Actualizar cita
export async function actualizarCita(id, citaRequest) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citaRequest)
  });
  if (!response.ok) throw new Error('Error al actualizar cita');
  return await response.json();
}

// Eliminar cita
export async function eliminarCita(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar cita');
}

// Obtener citas por cliente
export async function obtenerCitasPorCliente(idCliente) {
  const response = await fetch(`${BASE_URL}/cliente/${idCliente}`);
  if (!response.ok) throw new Error('Error al obtener citas del cliente');
  return await response.json();
}

// Obtener citas por barbero
export async function obtenerCitasPorBarbero(idBarbero) {
  const response = await fetch(`${BASE_URL}/barbero/${idBarbero}`);
  if (!response.ok) throw new Error('Error al obtener citas del barbero');
  return await response.json();
}

// Obtener citas por fecha
export async function obtenerCitasPorFecha(fechaISO) {
  const response = await fetch(`${BASE_URL}/fecha/${fechaISO}`);
  if (!response.ok) throw new Error('Error al obtener citas por fecha');
  return await response.json();
}

// Obtener citas por barbero y fecha
export async function obtenerCitasPorBarberoYFecha(idBarbero, fechaISO) {
  const response = await fetch(`${BASE_URL}/barbero/${idBarbero}/fecha/${fechaISO}`);
  if (!response.ok) throw new Error('Error al obtener citas por barbero y fecha');
  return await response.json();
}

// Obtener citas por cliente y estado
export async function obtenerCitasPorClienteYEstado(idCliente, estado) {
  const response = await fetch(`${BASE_URL}/cliente/${idCliente}/estado/${estado}`);
  if (!response.ok) throw new Error('Error al obtener citas del cliente por estado');
  return await response.json();
}
