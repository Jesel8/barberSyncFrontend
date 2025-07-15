import { writable } from 'svelte/store';

// Estado inicial de una cita en proceso de creación
const estadoInicial = {
    barberoSeleccionado: null,   // { id, nombreCompleto }
    serviciosSeleccionados: [],  // [{ id, nombre, precio, duracionMinuto }]
    fechaSeleccionada: null,     // 'YYYY-MM-DD'
    horaSeleccionada: null       // 'HH:MM'
};

function crearCitaStore() {
    const { subscribe, set, update } = writable(estadoInicial);

    return {
        subscribe,

        // Selecciona barbero y reinicia todo lo demás
        seleccionarBarbero: (barbero) => {
            console.log('🛒 CitaStore: Barbero seleccionado ->', barbero);
            update(() => ({
                ...estadoInicial,
                barberoSeleccionado: barbero
            }));
        },

        // Selecciona uno o más servicios sin resetear los otros datos
        seleccionarServicios: (servicios) => {
            console.log('🛒 CitaStore: Servicios seleccionados ->', servicios);
            update(state => ({
                ...state,
                serviciosSeleccionados: servicios
            }));
        },

        // Selecciona fecha y hora
        seleccionarFechaHora: (fecha, hora) => {
            console.log('🛒 CitaStore: Fecha y hora seleccionadas ->', fecha, hora);
            update(state => ({
                ...state,
                fechaSeleccionada: fecha,
                horaSeleccionada: hora
            }));
        },

        // Limpia todo el estado (ideal al cancelar o confirmar cita)
        reset: () => {
            console.log('🛒 CitaStore: Reseteando estado.');
            set(estadoInicial);
        }
    };
}

export const citaStore = crearCitaStore();
