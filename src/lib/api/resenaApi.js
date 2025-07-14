// src/lib/api/resenaApi.js

const BASE_URL = 'http://localhost:8080/api/resenas';

// 🔍 Obtener reseñas por barbero
export async function obtenerResenasPorBarbero(idBarbero) {
  try {
    const response = await fetch(`${BASE_URL}/barbero/${idBarbero}`);
    if (!response.ok) throw new Error('Error al obtener reseñas del barbero');
    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener reseñas del barbero:', error);
    return [];
  }
}

// 🧾 Obtener reseñas por cliente
export async function obtenerResenasPorCliente(idCliente) {
  try {
    const response = await fetch(`${BASE_URL}/cliente/${idCliente}`);
    if (!response.ok) throw new Error('Error al obtener reseñas del cliente');
    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener reseñas del cliente:', error);
    return [];
  }
}

// ⭐ Obtener promedio de calificación del barbero
export async function obtenerPromedioCalificacion(idBarbero) {
  try {
    const response = await fetch(`${BASE_URL}/barbero/${idBarbero}/promedio`);
    if (!response.ok) throw new Error('Error al obtener promedio de calificación');
    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener promedio:', error);
    return 0;
  }
}

// 📅 Filtrar reseñas por fechas para un barbero
export async function obtenerResenasPorBarberoEntreFechas(idBarbero, inicio, fin) {
  try {
    const response = await fetch(`${BASE_URL}/barbero/${idBarbero}/fechas?inicio=${inicio}&fin=${fin}`);
    if (!response.ok) throw new Error('Error al obtener reseñas filtradas');
    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener reseñas por fecha:', error);
    return [];
  }
}
