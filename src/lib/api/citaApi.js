export async function agendarCita(request) {
  const response = await fetch('http://54.197.147.238:8080/api/citas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error('Error al agendar cita');
  }

  return await response.json();
}
export async function obtenerCitasPorCliente(idCliente) {
  const response = await fetch(`http://54.197.147.238:8080/api/citas/cliente/${idCliente}`);
  if (!response.ok) throw new Error('No se pudieron cargar las citas');
  return await response.json();
}
