// src/lib/api/citas.js

const BASE_URL = 'http://localhost:8080/api';

// --- 🔐 Función Helper para obtener el token del usuario actual ---
function getToken() {
    if (typeof window === 'undefined') return null;
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) return null;
    const usuario = JSON.parse(usuarioString);
    return usuario ? usuario.token : null;
}

// --- 📅 Helper para formatear fechas como 'YYYY-MM-DD' ---
function formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 🟢 [CLIENTE] Obtiene horarios disponibles para un barbero en una fecha específica,
 * tomando en cuenta los servicios seleccionados.
 */
export async function obtenerDisponibilidad(idBarbero, fecha, idServicios) {
    const token = getToken();
    const fechaFormateada = formatDateForAPI(fecha);

    const params = new URLSearchParams();
    params.append('fecha', fechaFormateada);
    idServicios.forEach(id => params.append('idServicios', id));

    const url = `${BASE_URL}/disponibilidad/barbero/${idBarbero}?${params.toString()}`;
    console.log(`🔎 Buscando disponibilidad en: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al consultar la disponibilidad');
        }

        const data = await res.json();

        // Retornamos únicamente las horas disponibles
        return data
            .filter(item => item.disponible)
            .map(item => item.hora);

    } catch (error) {
        console.error("❌ Error en la API de disponibilidad:", error);
        throw error;
    }
}

/**
 * 🟡 [ADMIN] Obtiene todas las citas para una fecha específica (de todos los barberos).
 */
export async function obtenerTodasLasCitasPorFecha(fecha) {
    const token = getToken();
    const fechaFormateada = formatDateForAPI(fecha);
    const url = `${BASE_URL}/citas/fecha/${fechaFormateada}`;

    console.log(`[ADMIN] Pidiendo TODAS las citas a: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            if (res.status === 404) {
                console.log("⚠️ No hay citas para la fecha indicada.");
                return [];
            }
            throw new Error(`Error al obtener todas las citas: ${res.status} ${res.statusText}`);
        }

        return await res.json();

    } catch (error) {
        console.error("❌ Error en la llamada a la API de admin-citas:", error);
        throw error;
    }
}

/**
 * 🟢 [CLIENTE] Crea una nueva cita en el sistema.
 * @param {object} datosCita - Objeto con el formato del CitaRequest del backend.
 */
export async function crearCita(datosCita) {
    const token = getToken();
    const url = `${BASE_URL}/citas`;

    console.log('✅ Enviando para crear cita:', datosCita);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosCita)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'No se pudo crear la cita.');
        }

        return await res.json();
    } catch (error) {
        console.error("❌ Error al crear la cita:", error);
        throw error;
    }
}
