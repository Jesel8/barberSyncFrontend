<script>
  import { onMount } from 'svelte';
  // Importaciones (estas ya estaban bien)
  import { authStore } from '$lib/stores/authStore.js';
  import {
    obtenerResenasPorBarbero,
    obtenerPromedioCalificacion,
    obtenerResenasPorBarberoEntreFechas
  } from '$lib/api/resenaApi.js';

  // Suscripción al store para obtener el usuario
  $: usuarioLogueado = $authStore.usuario;

  // Variables de estado del componente (esto está bien)
  let resenas = [];
  let promedio = 0;
  let fechaInicio = ''; // Inicializar vacío es a menudo mejor
  let fechaFin = '';   // para que el placeholder del input se vea

  // --- Bloque reactivo principal ---
  // Este es el "corazón" del componente. Se ejecuta cada vez que
  // la variable 'usuarioLogueado' cambia.
  $: {
    if (usuarioLogueado && usuarioLogueado.idUsuario) {
      // Si hay un usuario y tiene la propiedad 'idUsuario'...
      
      const idBarbero = usuarioLogueado.idUsuario; // Obtenemos el ID correcto
      console.log(`Usuario detectado. ID del barbero: ${idBarbero}`);
      
      // Llamamos a la función para cargar los datos con el ID correcto
      cargarDatos(idBarbero);

    } else {
      // Si no hay usuario logueado, limpiamos el estado del componente
      console.log("No hay usuario logueado. Limpiando datos.");
      resenas = [];
      promedio = 0;
    }
  }

  // --- Funciones de API ---
  // Ahora reciben el 'id' como parámetro para ser más puras y reutilizables.

  async function cargarDatos(id) {
    // Se usa una guarda por si acaso, aunque el bloque reactivo ya lo hace.
    if (!id) return; 

    try {
      // Usamos Promise.all para hacer las dos llamadas a la API en paralelo.
      // Es más rápido que hacerlas una después de la otra.
      const [resenasData, promedioData] = await Promise.all([
        obtenerResenasPorBarbero(id),
        obtenerPromedioCalificacion(id)
      ]);
      
      resenas = resenasData;
      promedio = promedioData;

    } catch (error) {
      console.error("Error al cargar los datos iniciales:", error);
      // Opcional: mostrar un mensaje de error en la UI
    }
  }

  async function filtrarPorFecha() {
    // Obtenemos el id del usuario logueado en el momento de hacer clic
    const idBarbero = usuarioLogueado?.idUsuario;
    if (idBarbero && fechaInicio && fechaFin) {
      resenas = await obtenerResenasPorBarberoEntreFechas(idBarbero, fechaInicio, fechaFin);
    } else {
      // Podrías poner una alerta o simplemente no hacer nada si faltan datos
      console.log("Faltan datos para filtrar (ID, fecha inicio o fecha fin)");
    }
  }

  // onMount ya no es estrictamente necesario para la carga inicial porque
  // el bloque reactivo '$:' se encarga de ello tan pronto como el store
  // se inicializa. Sin embargo, lo dejamos por si authStore necesita
  // ser inicializado.
  onMount(() => {
      authStore.init(); // Si tienes esta función en tu store, es bueno llamarla aquí
  });

</script>

<!-- Tu HTML no necesita ningún cambio. Es perfecto. -->
<main class="contenedor-resenas">
  <h2 class="titulo-panel"><span style="color: white;">Reseñas del</span> Barbero</h2>
  <p class="promedio">⭐ Promedio de calificación: <strong>{promedio.toFixed(1)}</strong> / 5</p>

  <div class="filtro-fechas">
    <label>Inicio:</label>
    <input type="date" bind:value={fechaInicio} />
    <label>Fin:</label>
    <input type="date" bind:value={fechaFin} />
    <button on:click={filtrarPorFecha}>Filtrar</button>
  </div>

  {#if resenas.length > 0}
    <ul class="lista-resenas">
      {#each resenas as resena}
        <li class="card-resena">
          <h4>{resena.nombreCliente}</h4>
          <p class="comentario">"{resena.comentario}"</p>
          <p>⭐ {resena.calificacion} | {resena.fechaResena}</p>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="no-resenas">No hay reseñas para mostrar.</p>
  {/if}
</main>

<style>
  .contenedor-resenas {
    padding: 3rem 2rem;
    background-color: #252525;
    min-height: 100vh;
  }

  .titulo-panel {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #C0A080;
  }

  .promedio {
    text-align: center;
    font-size: 1.2rem;
    color: white;
    margin-bottom: 2rem;
  }

  .filtro-fechas {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .filtro-fechas label {
    color: #fff;
  }

  .filtro-fechas input[type="date"] {
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
  }

  .filtro-fechas button {
    background-color: #C0A080;
    color: #000;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .filtro-fechas button:hover {
    background-color: #a07b5f;
  }

  .lista-resenas {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }

  .card-resena {
    background-color: #333;
    padding: 1.5rem;
    border-radius: 20px;
    width: 300px;
    color: white;
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .card-resena:hover {
    transform: scale(1.03);
    box-shadow: 0 12px 20px rgba(0,0,0,0.2);
  }

  .card-resena h4 {
    margin: 0;
    font-size: 1.3rem;
    color: #C0A080;
  }

  .card-resena .comentario {
    font-style: italic;
    margin: 1rem 0;
    color: #ddd;
  }

  .no-resenas {
    text-align: center;
    color: #ccc;
    font-size: 1.1rem;
    margin-top: 2rem;
  }
</style>
