<script>
	import { onMount } from 'svelte';
	// 👇 CAMBIO CLAVE: Importamos la nueva función específica para el admin
	import { obtenerTodasLasCitasPorFecha } from '$lib/api/citas.js';

	// --- ESTADO DEL COMPONENTE (ahora mucho más simple) ---
	let citas = [];
	let cargando = true;
	let error = null;
	let fechaInput = new Date().toISOString().split('T')[0]; // Inicia con hoy

	// --- FUNCIÓN DE CARGA PARA EL ADMIN ---
	async function cargarAgendaGeneral() {
		cargando = true;
		error = null;
		try {
			// Convertimos el string 'YYYY-MM-DD' a un objeto Date para la API
			const [year, month, day] = fechaInput.split('-').map(Number);
			const fechaParaAPI = new Date(year, month - 1, day);
			
			// 👇 CAMBIO CLAVE: Llamamos a la función correcta, sin pasarle ningún ID de usuario
			citas = await obtenerTodasLasCitasPorFecha(fechaParaAPI);
		} catch (e) {
			console.error('❌ Error atrapado en la agenda de Admin:', e);
			error = 'Hubo un problema al cargar la agenda general. Revisa la consola para más detalles.';
			citas = [];
		} finally {
			cargando = false;
		}
	}

	// Al cargar la página, se buscan las citas del día de hoy.
	onMount(() => {
		cargarAgendaGeneral();
	});

	// Cuando el admin cambia la fecha, se vuelven a cargar las citas.
	function handleDateChange() {
		cargarAgendaGeneral();
	}
</script>

<main class="contenido-agenda">
	<div class="header-agenda">
		<!-- El título ahora refleja que es una vista general -->
		<h1 class="titulo-principal">Agenda General de Citas</h1>
		<div class="selector-fecha">
			<label for="fecha">Selecciona una fecha:</label>
			<input type="date" id="fecha" bind:value={fechaInput} on:change={handleDateChange} />
		</div>
	</div>

	{#if cargando}
		<p class="mensaje-estado">Cargando agenda...</p>
	{:else if error}
		<p class="mensaje-error">{error}</p>
	{:else if citas.length === 0}
		<div class="agenda-vacia">
			<img src="/icons/calendar-check.svg" alt="Calendario vacío" style="width: 80px; margin-bottom: 1rem; filter: invert(75%);"/>
			<h2>No hay citas programadas para esta fecha</h2>
		</div>
	{:else}
		<div class="grid-citas">
			<!-- Ordenamos por hora para una vista cronológica clara -->
			{#each citas.sort((a, b) => a.hora.localeCompare(b.hora)) as cita (cita.id)}
				<div class={`card-cita estado-${cita.estado.toLowerCase()}`}>
					<div class="card-header">
						<span class="hora-cita">{cita.hora.substring(0, 5)}</span>
						<span class="estado-cita">{cita.estado}</span>
					</div>

					<div class="card-body">
						<!-- 👇 INFORMACIÓN ESENCIAL PARA EL ADMIN 👇 -->
						<p class="nombre-barbero"><strong>Barbero:</strong> {cita.nombreBarbero}</p>
						<p class="nombre-cliente"><strong>Cliente:</strong> {cita.nombreCliente}</p>
						<p class="info-adicional">Duración: {cita.duracionTotalMinutos} min</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	/* (Copia y pega todos los estilos que ya tenías, están perfectos) */
	/* Añado solo el estilo nuevo para el nombre del barbero para que se vea bien */
	.contenido-agenda {
		max-width: 1100px;
		margin: 2rem auto;
		padding: 2rem;
		color: white;
	}
	.header-agenda {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.titulo-principal {
		color: #c0a080;
		margin: 0;
	}
	.selector-fecha label {
		margin-right: 0.5rem;
		color: #ccc;
	}
	.selector-fecha input[type='date'] {
		background-color: #2f2f2f;
		color: white;
		border: 1px solid #c0a080;
		padding: 0.5rem;
		border-radius: 8px;
		font-family: inherit;
	}
	.mensaje-estado, .mensaje-error {
		text-align: center;
		font-size: 1.2rem;
		padding: 2rem;
		color: #aaa;
	}
	.mensaje-error {
		color: #ff6b6b;
	}
	.agenda-vacia {
		text-align: center;
		padding: 4rem 2rem;
		background-color: #252525;
		border-radius: 12px;
		opacity: 0.8;
	}
	.grid-citas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}
	.card-cita {
		background-color: #2f2f2f;
		border-left: 5px solid #c0a080;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}
	.card-cita.estado-confirmada { border-left-color: #4caf50; }
	.card-cita.estado-pendiente { border-left-color: #ffc107; }
	.card-cita.estado-cancelada { border-left-color: #f44336; }
	.card-cita.estado-completada { border-left-color: #2196f3; }
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #444;
		padding-bottom: 0.75rem;
		margin-bottom: 0.75rem;
	}
	.hora-cita {
		font-size: 1.5rem;
		font-weight: bold;
		color: #c0a080;
	}
	.estado-cita {
		background-color: rgba(255, 255, 255, 0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: bold;
		text-transform: uppercase;
	}
	.card-body .nombre-barbero,
	.card-body .nombre-cliente {
		font-size: 1.1rem;
		font-weight: 500;
		margin: 0.25rem 0;
	}
	.card-body .info-adicional {
		font-size: 0.9rem;
		color: #aaa;
		margin-top: 0.75rem;
	}
</style>