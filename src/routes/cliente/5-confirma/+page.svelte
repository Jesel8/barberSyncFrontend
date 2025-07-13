<script>
  import { onMount } from 'svelte';
  import '$lib/Styles/Global.css';
  import '$lib/Styles/nav.css';
  import '$lib/Styles/pasos.css';
  import { agendarCita } from '$lib/api/citaApi';
  let cita = null;

  onMount(() => {
    const almacenado = localStorage.getItem('citaParcial');
    if (almacenado) {
      const datos = JSON.parse(almacenado);

      // Asegurar compatibilidad
      if (Array.isArray(datos.servicios)) {
        datos.servicio = datos.servicios[0]; // Para mostrarlo más fácil
      }

      cita = datos;
    }
  });

async function confirmarCita() {
  try {
    const almacenado = localStorage.getItem('citaParcial');
    const cita = JSON.parse(almacenado);

    const request = {
      idCliente: 1, // Reemplazar con ID real del cliente autenticado
      idBarbero: cita.barbero.id,
      estadoCitaId: 1, // Siempre inicia como Pendiente
      fecha: formatearFechaISO(cita.fecha),
      hora: cita.hora,
      idServicios: [cita.servicios[0].id]
    };

    const resultado = await agendarCita(request);

    alert('✅ Cita registrada con ID: ' + resultado.id);
    localStorage.clear();
    window.location.href = '/cliente/1-panel';

  } catch (error) {
    console.error(error);
    alert('❌ Error al registrar cita');
  }
}

function formatearFechaISO(fecha) {
  // Si viene como dd/mm/yyyy → lo convertimos a yyyy-mm-dd
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}
</script>

<!-- NAVBAR -->
<nav class="top">
  <div class="logo">
    <img src="/images/logo blanco.png" alt="Logo BarberSync" />
  </div>
</nav>

<!-- TÍTULO -->
<h1 class="titulo-panel">
  <span style="color: white;">Confirma tu</span> Cita
</h1>

<!-- BARRA DE PROGRESO -->
<div class="barra-progreso-container">
  <div class="barra-etiquetas">
    <span>Barberos</span>
    <span>Servicios</span>
    <span>Fecha y Hora</span>
    <span class="activo">Completado</span>
  </div>
  <div class="barra-fondo">
    <div class="barra-avance paso-4"></div>
  </div>
</div>

{#if cita}
  <main class="contenedor-resumen">
    <div class="caja">
      <h2>👨‍🔧 Barbero</h2>
      <p><strong>Nombre:</strong> {cita.barbero?.nombre}</p>
      <p><strong>Especialidad:</strong> {cita.barbero?.especialidad}</p>
    </div>

    <div class="caja">
      <h2>💈 Servicio</h2>
      <p><strong>Nombre:</strong> {cita.servicio?.nombre}</p>
      <p><strong>Duración:</strong> {cita.servicio?.duracion}</p>
      <p><strong>Precio:</strong> {cita.servicio?.precio}</p>
    </div>

    <div class="caja">
      <h2>📅 Fecha y Hora</h2>
      <p><strong>Fecha:</strong> {cita.fecha}</p>
      <p><strong>Hora:</strong> {cita.hora}</p>
    </div>

    <div class="boton-confirmar">
      <button on:click={confirmarCita}>Confirmar Cita</button>
    </div>
  </main>
{:else}
  <p style="text-align: center; color: #ccc; margin-top: 2rem;">
    No hay datos de cita almacenados.
  </p>
{/if}

<style>
  .contenedor-resumen {
    max-width: 600px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    border-radius: 16px;
    background: #252525;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    color: white;
  }

  .caja {
    background: #2f2f2f;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  }

  .caja h2 {
    color: #C0A080;
    margin-bottom: 0.5rem;
  }

  .caja p {
    margin: 0.3rem 0;
  }

  .boton-confirmar {
    text-align: center;
  }

  .boton-confirmar button {
    background-color: #C0A080;
    padding: 1rem 2rem;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    color: black;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .boton-confirmar button:hover {
    background-color: #d1b08c;
  }
</style>
