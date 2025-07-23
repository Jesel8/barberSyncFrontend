<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { obtenerCitasDeBarbero, actualizarEstadoCita, eliminarCita } from '$lib/api/citas.js';
	import { fly } from 'svelte/transition';

	let citas = [];
	let isLoading = true;
	let error = null;

	onMount(async () => {
		const idBarbero = $authStore.usuario?.idUsuario;
		if (!idBarbero) {
			error = 'No se pudo identificar al barbero. Por favor, inicia sesión de nuevo.';
			isLoading = false;
			return;
		}

		try {
			const todasLasCitas = await obtenerCitasDeBarbero(idBarbero);
			// ✅ 1. Filtro corregido y simplificado
			citas = todasLasCitas.filter((c) => !['Realizada', 'Cancelada'].includes(c.estado));
		} catch (e) {
			error = `Error al cargar las citas: ${e.message}`;
		} finally {
			isLoading = false;
		}
	});

	// ✅ 2. Nombre de función y lógica corregida
	async function handleMarcarRealizada(idCita) {
		try {
			// ✅ ¡LA CORRECCIÓN CLAVE!
			await actualizarEstadoCita(idCita, 'Realizada');
			citas = citas.filter((c) => c.id !== idCita);
		} catch (err) {
			// Mensaje de alerta actualizado para consistencia
			alert(`Error al marcar la cita como realizada: ${err.message}`);
		}
	}

	async function handleEliminarCita(idCita) {
		if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) return;
		try {
			await eliminarCita(idCita);
			citas = citas.filter((c) => c.id !== idCita);
		} catch (err) {
			alert(`Error al eliminar la cita: ${err.message}`);
		}
	}

	$: citasAgrupadas = citas.reduce((acc, cita) => {
		const fecha = new Date(cita.fechaHora).toDateString();
		if (!acc[fecha]) acc[fecha] = [];
		acc[fecha].push(cita);
		return acc;
	}, {});

	function formatDisplayDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="contenedor-vista">
	<h1>Mis Próximas Citas</h1>

	{#if isLoading}
		<div class="mensaje-carga">Cargando citas...</div>
	{:else if error}
		<div class="mensaje-error">{error}</div>
	{:else if citas.length === 0}
		<div class="mensaje-vacio">¡Todo listo! No tienes citas pendientes.</div>
	{:else}
		{#each Object.entries(citasAgrupadas).sort((a, b) => new Date(a[0]) - new Date(b[0])) as [fecha, citasDelDia]}
			<h2 class="fecha-grupo">{formatDisplayDate(fecha)}</h2>
			<div class="grid-citas">
				{#each citasDelDia.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)) as cita (cita.id)}
					<div
						class="card-cita estado-{cita.estado.toLowerCase()}"
						transition:fly={{ y: 20, duration: 300 }}
					>
						<div class="card-header">
							<span class="hora-cita">
								{new Date(cita.fechaHora).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}
							</span>
							<span class="estado-cita">{cita.estado}</span>
						</div>
						<div class="card-body">
							<p class="nombre-cliente">{cita.clienteNombre}</p>
							<p class="info-servicios">{cita.servicios.map((s) => s.nombre).join(' + ')}</p>
						</div>
						<div class="card-footer">
							<span class="duracion-total">{cita.duracionTotalMinutos} min</span>
							<div class="acciones-cita">
								<!-- ✅ 3. Texto del 'title' y llamada a la función corregidos -->
								<button
									class="btn-accion btn-completar"
									title="Marcar como Realizada"
									on:click={() => handleMarcarRealizada(cita.id)}
								>
									✔️
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>

<style>
	/* -- Aquí va todo el CSS que te pasé en la respuesta anterior -- */
	/* -- Pega aquí los estilos para: :root, .contenedor-vista, h1, .fecha-grupo, etc. -- */
	/* -- Y no olvides añadir los nuevos estilos para los botones de acción -- */
	:root {
		--color-fondo: #121212;
		--color-superficie: #1e1e1e;
		--color-borde: #2c2c2c;
		--color-primario: #c0a080;
		--color-texto-principal: #e0e0e0;
		--color-texto-secundario: #a0a0a0;
		--sombra-card: 0 4px 15px rgba(0, 0, 0, 0.4);
		--estado-pendiente: #e0a800;
		--estado-confirmada: #28a745;
		--estado-completada: #6c757d;
		--estado-cancelada: #dc3545;
	}
	.contenedor-vista {
		max-width: 1200px;
		margin: auto;
		padding: 2rem;
		color: var(--color-texto-principal);
	}
	h1 {
		color: var(--color-primario);
		margin-bottom: 2rem;
		text-align: center;
		font-size: 2.5rem;
		font-weight: 300;
	}
	.fecha-grupo {
		color: var(--color-texto-secundario);
		border-bottom: 1px solid var(--color-borde);
		padding-bottom: 0.5rem;
		margin: 2.5rem 0 1.5rem 0;
	}
	.mensaje-carga,
	.mensaje-error,
	.mensaje-vacio {
		text-align: center;
		padding: 3rem 1rem;
		background-color: var(--color-superficie);
		border-radius: 8px;
	}
	.mensaje-error {
		color: var(--estado-cancelada);
	}
	.grid-citas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	.card-cita {
		background: var(--color-superficie);
		border: 1px solid var(--color-borde);
		border-left: 5px solid var(--color-texto-secundario);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		box-shadow: var(--sombra-card);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}
	.card-cita:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
	}
	.card-cita.estado-pendiente {
		border-left-color: var(--estado-pendiente);
	}
	.card-cita.estado-confirmada {
		border-left-color: var(--estado-confirmada);
	}
	.card-header,
	.card-body,
	.card-footer {
		padding: 1rem 1.25rem;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-borde);
	}
	.hora-cita {
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-primario);
	}
	.estado-cita {
		font-size: 0.8rem;
		font-weight: bold;
		padding: 0.3rem 0.6rem;
		border-radius: 12px;
		text-transform: uppercase;
		color: #111;
		background-color: var(--color-texto-secundario);
	}
	.estado-pendiente .estado-cita {
		background-color: var(--estado-pendiente);
	}
	.estado-confirmada .estado-cita {
		background-color: var(--estado-confirmada);
	}
	.card-body {
		flex-grow: 1;
	}
	.nombre-cliente {
		font-size: 1.2rem;
		font-weight: 500;
		margin: 0 0 0.75rem 0;
	}
	.info-servicios {
		font-size: 0.95rem;
		color: var(--color-texto-secundario);
		line-height: 1.4;
	}
	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--color-borde);
		padding: 0.75rem 1.25rem;
	}
	.duracion-total {
		font-size: 0.9rem;
		color: var(--color-primario);
		font-weight: 500;
	}
	.acciones-cita {
		display: flex;
		gap: 0.5rem;
	}
	.btn-accion {
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0.5rem;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
	}
	.btn-accion:hover {
		transform: scale(1.1);
	}
	.btn-completar:hover {
		background-color: rgba(40, 167, 69, 0.2);
	}
	.btn-eliminar:hover {
		background-color: rgba(220, 53, 69, 0.2);
	}
</style>
