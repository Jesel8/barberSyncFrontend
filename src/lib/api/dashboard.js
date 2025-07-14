// src/lib/api/dashboard.js

const BASE_URL = 'http://localhost:8080/api';

export async function obtenerResumenDashboard() {
  try {
    const [usuariosRes, serviciosRes, citasRes, resenasRes] = await Promise.all([
      fetch(`${BASE_URL}/usuarios`),
      fetch(`${BASE_URL}/servicios`),
      fetch(`${BASE_URL}/citas`),
      fetch(`${BASE_URL}/resenas`)
    ]);

    if (!usuariosRes.ok || !serviciosRes.ok || !citasRes.ok || !resenasRes.ok) {
      throw new Error('Error al obtener los datos del dashboard');
    }

    const usuarios = await usuariosRes.json();
    const servicios = await serviciosRes.json();
    const citas = await citasRes.json();
    const resenas = await resenasRes.json();

    // Filtrar barberos por rolId = 1
    const barberos = usuarios.filter(u => u.rolId === 1);

    return {
      totalBarberos: barberos.length,
      totalServicios: servicios.length,
      totalCitas: citas.length,
      totalResenas: resenas.length
    };

  } catch (error) {
    console.error('❌ Error en obtenerResumenDashboard:', error);
    return {
      totalBarberos: 0,
      totalServicios: 0,
      totalCitas: 0,
      totalResenas: 0
    };
  }
}
