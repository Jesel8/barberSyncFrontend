<script context="module">
  export const ssr = false;
</script>

<script>
  import '$lib/Styles/Global.css';
  import '$lib/Styles/nav.css';
  import '$lib/Styles/pasos.css';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import { Spanish } from 'flatpickr/dist/l10n/es.js';
  import { onMount } from 'svelte';

  let fechaSeleccionada = '';
  let horaSeleccionada = '';

  const horarios = [
    "09:00", "09:30", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00"
  ];

  function formatearFecha(fecha) {
    if (!(fecha instanceof Date)) return fecha;
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  function agendar() {
    if (fechaSeleccionada && horaSeleccionada) {
      let cita = {};
      const almacenado = localStorage.getItem('citaParcial');
      if (almacenado) {
        cita = JSON.parse(almacenado);
      }

      const fechaFormateada = formatearFecha(new Date(fechaSeleccionada));
      cita.fecha = fechaFormateada;
      cita.hora = horaSeleccionada;

      localStorage.setItem('citaParcial', JSON.stringify(cita));
      window.location.href = '5-confirma';
    }
  }
</script>

<!-- NAVBAR -->
<nav class="top">
  <div class="logo">
    <img src="/images/logo blanco.png" alt="Logo BarberSync" />
  </div>
</nav>

<!-- TÍTULO Y BARRA DE PROGRESO -->
<h1 class="titulo-panel">
  <span style="color: white;">Selecciona</span> Fecha y Hora
</h1>

<div class="barra-progreso-container">
  <div class="barra-etiquetas">
    <span>Barberos</span>
    <span>Servicios</span>
    <span class="activo">Fecha y Hora</span>
    <span>Completado</span>
  </div>
  <div class="barra-fondo">
    <div class="barra-avance paso-3"></div>
  </div>
</div>

<!-- FORMULARIO -->
<main class="contenedor">
  <div class="bloque">
    <p class="etiqueta">Fecha</p>
    <Flatpickr
      bind:value={fechaSeleccionada}
      options={{
        minDate: 'today',
        dateFormat: 'd-m-Y',
        locale: Spanish
      }}
      class="input"
    />
  </div>

  <div class="bloque">
    <p class="etiqueta">Hora</p>
    <div class="horas">
      {#each horarios as hora}
        <button
          class:selected={hora === horaSeleccionada}
          on:click={() => horaSeleccionada = hora}>
          {hora}
        </button>
      {/each}
    </div>
  </div>

  <div class="confirmar">
    <button on:click={agendar} disabled={!fechaSeleccionada || !horaSeleccionada}>
      Confirmar
    </button>
  </div>
</main>

<style>
  .contenedor {
    max-width: 500px;
    margin: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .bloque {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .etiqueta {
    font-weight: bold;
    color: #ccc;
  }

  .horas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  button {
    background: #444;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  button:hover {
    background: #555;
  }

  button.selected {
    background-color: #C0A080;
    font-weight: bold;
  }

  .confirmar {
    text-align: center;
  }

  .confirmar button {
    background-color: #C0A080;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    border: none;
    font-weight: bold;
    min-width: 220px;
    border-radius: 10px;
    color: rgb(0, 0, 0);
    cursor: pointer;
  }

  .confirmar button:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
</style>
