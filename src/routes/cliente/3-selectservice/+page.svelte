<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { citaStore } from '$lib/stores/citaStore.js';
	import { getServicios } from '$lib/api/servicios.js'; // Reutilizamos la API
	// Para leer el valor del store una sola vez
	import { get } from 'svelte/store';

	// --- ESTADO ---
	let todosLosServicios = [];
	let serviciosSeleccionadosIds = new Set(); // Usamos un Set para eficiencia al agregar/quitar
	let barbero = get(citaStore).barberoSeleccionado; // Leemos el barbero al inicio
	let isLoading = true;
	let error = null;

	onMount(async () => {
		// Si no hay barbero seleccionado (ej. el usuario entró a la URL directamente), lo redirigimos
		if (!barbero) {
			goto('/cliente/2-SelectBarbero');
			return;
		}
		try {
			todosLosServicios = await getServicios();
		} catch (e) {
			error = 'No se pudieron cargar los servicios.';
		} finally {
			isLoading = false;
		}
	});

	function toggleServicio(id) {
		if (serviciosSeleccionadosIds.has(id)) {
			serviciosSeleccionadosIds.delete(id);
		} else {
			serviciosSeleccionadosIds.add(id);
		}
		// Forzamos una re-asignación para que Svelte detecte el cambio en el Set
		serviciosSeleccionadosIds = serviciosSeleccionadosIds;
	}

	function continuar() {
		if (serviciosSeleccionadosIds.size === 0) {
			alert('Por favor, selecciona al menos un servicio.');
			return;
		}
		// Filtramos la lista completa de servicios para obtener los objetos completos de los seleccionados
		const serviciosObjetos = todosLosServicios.filter((s) => serviciosSeleccionadosIds.has(s.id));
		// Guardamos los objetos completos en el store
		citaStore.seleccionarServicios(serviciosObjetos);
		goto('/cliente/4-fecha');
	}
</script>

<main class="contenedor-principal">
	{#if barbero}
		<div class="info-reserva">
			Reservando con <strong>{barbero.nombreCompleto}</strong>
		</div>
	{/if}
	<div class="paso-indicador">Paso 2 de 4</div>
	<h1>Elige tus Servicios</h1>
	<p class="subtitulo">Puedes seleccionar uno o varios servicios.</p>

	{#if isLoading}
		<div class="spinner"></div>
	{:else if error}
		<p class="error-message">{error}</p>
	{:else}
		<div class="lista-servicios">
			{#each todosLosServicios as servicio (servicio.id)}
				<button
					class="card-servicio"
					class:seleccionado={serviciosSeleccionadosIds.has(servicio.id)}
					on:click={() => toggleServicio(servicio.id)}
				>
					<div class="info">
						<span class="nombre">{servicio.nombre}</span>
						<span class="descripcion">{servicio.descripcion}</span>
					</div>
					<div class="precio-duracion">
						<span class="precio"
							>{servicio.precio.toLocaleString('es-MX', {
								style: 'currency',
								currency: 'MXN'
							})}</span
						>
						<span class="duracion">{servicio.duracionMinuto} min</span>
					</div>
				</button>
			{/each}
		</div>
		<div class="acciones">
			<button
				class="boton-continuar"
				on:click={continuar}
				disabled={serviciosSeleccionadosIds.size === 0}
			>
				Continuar
			</button>
		</div>
	{/if}
</main>

<style>
	.contenedor-principal {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.info-reserva {
		text-align: center;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: #252525;
		border-radius: 8px;
		color: #c0a080;
	}
	.paso-indicador {
		text-align: center;
		color: #c0a080;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	h1 {
		text-align: center;
		color: #f0f0f0;
		margin-bottom: 0.5rem;
	}
	.subtitulo {
		text-align: center;
		color: #aaa;
		margin-bottom: 2rem;
	}
	.lista-servicios {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.card-servicio {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem;
		background-color: #2f2f2f;
		border: 2px solid #444;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		color: white;
		width: 100%;
	}
	.card-servicio:hover {
		border-color: #666;
	}
	.card-servicio.seleccionado {
		border-color: #c0a080;
		background-color: #3f3c38;
	}
	.card-servicio .info {
		display: flex;
		flex-direction: column;
	}
	.card-servicio .nombre {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
	.card-servicio .descripcion {
		color: #ccc;
		font-size: 0.9rem;
	}
	.precio-duracion {
		text-align: right;
	}
	.precio-duracion .precio {
		font-size: 1.1rem;
		font-weight: bold;
		color: #c0a080;
		display: block;
	}
	.precio-duracion .duracion {
		font-size: 0.9rem;
		color: #aaa;
	}
	.acciones {
		text-align: center;
	}
	.boton-continuar {
		background-color: #c0a080;
		color: black;
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1.1rem;
		transition: all 0.2s;
	}
	.boton-continuar:disabled {
		background-color: #555;
		cursor: not-allowed;
	}
	.error-message {
		color: #ff6b6b;
		text-align: center;
	}
	.spinner {
		margin: 4rem auto;
		width: 50px;
		height: 50px;
		border: 5px solid #444;
		border-top-color: #c0a080;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
