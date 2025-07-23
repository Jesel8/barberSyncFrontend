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

<!-- === NAVBAR AÑADIDA === -->
<nav class="top">
	<label for="menu-toggle" class="menu-icon">
		<img src="/src/static/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>
	<div class="logo">
		<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
	</div>
	<div class="salir">
		<a href="/admin/1-paneladmin" title="Cerrar Sesión">
			<img src="/src/static/assets/icons/Salir.svg" alt="Cerrar Sesión" />
		</a>
	</div>
</nav>

<main class="contenido-agenda">
	<div class="header-agenda">
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
			<img
				src="/icons/calendar-check.svg"
				alt="Calendario vacío"
				style="width: 80px; margin-bottom: 1rem; filter: invert(75%);"
			/>
			<h2>No hay citas programadas para esta fecha</h2>
			<p>Selecciona otro día en el calendario.</p>
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
						<div class="info-item">
							<span class="info-label">Barbero:</span>
							<span class="info-value">{cita.nombreBarbero}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Cliente:</span>
							<span class="info-value">{cita.nombreCliente}</span>
						</div>
					</div>
					<div class="card-footer">
						<p class="info-adicional">Duración: {cita.duracionTotalMinutos} min</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>
```

<style>
	/* --- ESTILOS DE NAVBAR AÑADIDOS --- */
	nav.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background-color: #1f1f1f;
		border-bottom: 1px solid #444;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.logo img {
		height: 50px;
		vertical-align: middle;
	}

	.menu-icon,
	.salir {
		display: flex;
		align-items: center;
	}

	.menu-icon img,
	.salir img {
		height: 24px;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.menu-icon:hover img,
	.salir a:hover img {
		opacity: 0.8;
	}

	@media (min-width: 768px) {
		.menu-icon {
			display: none;
		}
	}
	/* --- FIN DE ESTILOS DE NAVBAR --- */

	/* --- VARIABLES DE COLOR PARA CONSISTENCIA --- */
	:root {
		--color-primario: #c0a080;
		--color-fondo: #1e1e1e;
		--color-superficie: #2f2f2f;
		--color-texto-principal: #ffffff;
		--color-texto-secundario: #a0a0a0;

		--estado-confirmada: #4caf50;
		--estado-pendiente: #ffc107;
		--estado-cancelada: #f44336;
		--estado-completada: #2196f3;
	}

	/* --- CONTENEDOR PRINCIPAL --- */
	.contenido-agenda {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 2rem;
		color: var(--color-texto-principal);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	/* --- ENCABEZADO Y SELECTOR DE FECHA --- */
	.header-agenda {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.titulo-principal {
		color: var(--color-primario);
		margin: 0;
		font-size: 2.25rem;
		font-weight: 600;
	}

	.selector-fecha {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.selector-fecha label {
		font-size: 1rem;
		color: var(--color-texto-secundario);
	}

	.selector-fecha input[type='date'] {
		background-color: var(--color-superficie);
		color: var(--color-texto-principal);
		border: 1px solid #444;
		padding: 0.6rem 0.8rem;
		border-radius: 8px;
		font-family: inherit;
		font-size: 1rem;
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.selector-fecha input[type='date']:focus {
		outline: none;
		border-color: var(--color-primario);
	}

	/* --- ESTADOS (CARGANDO, ERROR, VACÍO) --- */
	.mensaje-estado,
	.mensaje-error {
		text-align: center;
		font-size: 1.2rem;
		padding: 3rem 1rem;
		color: var(--color-texto-secundario);
	}

	.mensaje-error {
		color: var(--estado-cancelada);
	}

	.agenda-vacia {
		text-align: center;
		padding: 4rem 2rem;
		background-color: rgba(41, 41, 41, 0.8);
		border: 1px dashed #444;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.agenda-vacia h2 {
		color: #eee;
		margin: 0;
	}

	.agenda-vacia p {
		color: var(--color-texto-secundario);
		margin: 0;
	}

	/* --- GRID DE CITAS --- */
	.grid-citas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.75rem;
	}

	/* --- TARJETA DE CITA INDIVIDUAL --- */
	.card-cita {
		background-color: var(--color-superficie);
		border-left: 5px solid var(--color-primario);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
	}

	.card-cita:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
	}

	/* Asignación de color de borde por estado */
	.card-cita.estado-confirmada {
		border-left-color: var(--estado-confirmada);
	}
	.card-cita.estado-pendiente {
		border-left-color: var(--estado-pendiente);
	}
	.card-cita.estado-cancelada {
		border-left-color: var(--estado-cancelada);
	}
	.card-cita.estado-completada {
		border-left-color: var(--estado-completada);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #444;
	}

	.hora-cita {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-texto-principal);
	}

	.estado-cita {
		padding: 0.3rem 0.8rem;
		border-radius: 16px;
		font-size: 0.75rem;
		font-weight: bold;
		text-transform: uppercase;
		color: #fff;
	}

	/* Colores de fondo para las etiquetas de estado */
	.estado-confirmada .estado-cita {
		background-color: var(--estado-confirmada);
	}
	.estado-pendiente .estado-cita {
		background-color: var(--estado-pendiente);
		color: #1e1e1e;
	}
	.estado-cancelada .estado-cita {
		background-color: var(--estado-cancelada);
	}
	.estado-completada .estado-cita {
		background-color: var(--estado-completada);
	}

	.card-body {
		padding: 1.25rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
	}

	.info-label {
		font-size: 0.8rem;
		color: var(--color-texto-secundario);
		margin-bottom: 0.1rem;
	}

	.info-value {
		font-size: 1.1rem;
		font-weight: 500;
		color: #eee;
	}

	.card-footer {
		padding: 0.75rem 1.25rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-top: 1px solid #444;
		border-radius: 0 0 10px 10px;
	}

	.info-adicional {
		font-size: 0.9rem;
		color: var(--color-texto-secundario);
		text-align: right;
		margin: 0;
	}
</style>
