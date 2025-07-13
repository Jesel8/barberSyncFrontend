<script>
  import { onMount } from 'svelte';
  import '$lib/Styles/pasos.css';
  import '$lib/Styles/Global.css';
  import '$lib/Styles/nav.css';
  import '$lib/Styles/servicios.css';

  let servicioSeleccionado = null;
  let servicios = [];

  let esAdmin = false;

  // Formulario (admin)
  let nombre = '';
  let duracion = '';
  let precio = '';
  let editando = false;
  let idEditando = null;

  onMount(() => {
    servicios = [
      { id: 1, nombre: 'Corte de cabello', duracion: '30 min', precio: '$120' },
      { id: 2, nombre: 'Corte + Barba', duracion: '45 min', precio: '$180' },
      { id: 3, nombre: 'Perfilado de barba', duracion: '20 min', precio: '$100' },
      { id: 4, nombre: 'Tinte para cabello', duracion: '60 min', precio: '$250' },
      { id: 5, nombre: 'Afeitado tradicional', duracion: '25 min', precio: '$110' },
      { id: 6, nombre: 'Mascarilla facial', duracion: '15 min', precio: '$90' }
    ];
  });

  function seleccionarServicio(id) {
    servicioSeleccionado = id;
  }

  function continuar() {
    if (servicioSeleccionado) {
      const servicio = servicios.find(s => s.id === servicioSeleccionado);

      let cita = {};
      const almacenado = localStorage.getItem('citaParcial');
      if (almacenado) {
        cita = JSON.parse(almacenado);
      }

      // Aquí guardamos el servicio como parte de citaParcial
      cita.servicios = [servicio];

      localStorage.setItem('citaParcial', JSON.stringify(cita));
      window.location.href = '/cliente/4-fecha';
    }
  }

  function guardarServicio() {
    if (editando) {
      servicios = servicios.map(s =>
        s.id === idEditando ? { id: idEditando, nombre, duracion, precio } : s
      );
    } else {
      const nuevo = {
        id: Math.max(...servicios.map(s => s.id)) + 1,
        nombre,
        duracion,
        precio
      };
      servicios = [...servicios, nuevo];
    }
    nombre = duracion = precio = '';
    editando = false;
    idEditando = null;
  }

  function editarServicio(servicio) {
    nombre = servicio.nombre;
    duracion = servicio.duracion;
    precio = servicio.precio;
    editando = true;
    idEditando = servicio.id;
  }

  function eliminarServicio(id) {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      servicios = servicios.filter(s => s.id !== id);
    }
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
  <span style="color: white;">Selecciona un</span> Servicio
</h1>

{#if !esAdmin}
  <div class="barra-progreso-container">
    <div class="barra-etiquetas">
      <span>Barberos</span>
      <span class="activo">Servicios</span>
      <span>Fecha y Hora</span>
      <span>Completado</span>
    </div>
    <div class="barra-fondo">
      <div class="barra-avance paso-2"></div>
    </div>
  </div>
{/if}

{#if esAdmin}
  <section class="form-admin">
    <h2>{editando ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
    <form on:submit|preventDefault={guardarServicio}>
      <input bind:value={nombre} placeholder="Nombre del servicio" required />
      <input bind:value={duracion} placeholder="Duración (ej: 30 min)" required />
      <input bind:value={precio} placeholder="Precio (ej: $120)" required />
      <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
    </form>
  </section>
{/if}

<section class="seleccion-servicios">
  <div class="lista-servicios">
    {#each servicios as servicio}
      <div
        class="item-servicio"
        class:activo={!esAdmin && servicioSeleccionado === servicio.id}
        on:click={() => !esAdmin && seleccionarServicio(servicio.id)}>

        <div class="icono-servicio">💈</div>

        <div class="info-servicio">
          <h3>{servicio.nombre}</h3>
          <p>{servicio.duracion} – {servicio.precio}</p>
        </div>

        {#if !esAdmin}
          <div class="check">
            {#if servicioSeleccionado === servicio.id}
              ✅
            {/if}
          </div>
        {/if}

        {#if esAdmin}
          <div class="acciones-admin">
            <button on:click={() => editarServicio(servicio)}>✏️</button>
            <button on:click={() => eliminarServicio(servicio.id)}>🗑️</button>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#if !esAdmin}
    <div class="boton-continuar">
      <button on:click={continuar} disabled={!servicioSeleccionado}>
        Continuar
      </button>
    </div>
  {/if}
</section>
