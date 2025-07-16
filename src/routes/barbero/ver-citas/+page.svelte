<!-- /routes/barbero/citas/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { obtenerCitasDeBarbero } from '$lib/api/citas.js'; // Usamos la nueva función limpia

	let citas = [];
	let isLoading = true;
	let error = null;

	onMount(async () => {
		const idBarbero = $authStore.usuario?.id;
		if (!idBarbero) {
			error = 'No se pudo identificar al barbero.';
			isLoading = false;
			return;
		}

		try {
			citas = await obtenerCitasDeBarbero(idBarbero);
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	});
</script>

<h1>Mis Próximas Citas</h1>

{#if isLoading}
	<p>Cargando citas...</p>
{:else if error}
	<p class="error-message">{error}</p>
{:else if citas.length === 0}
	<p>No tienes citas agendadas.</p>
{:else}
	<!-- Reutilizamos la tabla o grid de tu componente de admin, pero mostrando solo la info relevante para el barbero -->
	<div class="grid-citas">
		{#each citas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)) as cita (cita.id)}
			<div class={`card-cita estado-${cita.estado.toLowerCase()}`}>
				<div class="card-header">
					<span class="hora-cita"
						>{new Date(cita.fechaHora).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}</span
					>
					<span class="estado-cita">{cita.estado}</span>
				</div>
				<div class="card-body">
					<p class="nombre-cliente"><strong>Cliente:</strong> {cita.clienteNombre}</p>
					<p class="info-servicios">
						<strong>Servicios:</strong>
						{cita.servicios.map((s) => s.nombre).join(', ')}
					</p>
					<p class="info-adicional">Duración: {cita.duracionTotalMinutos} min</p>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	/* Copia los estilos del grid de citas de la página de admin */
	.grid-citas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}
	/* ...etc... */
	/* Tus estilos se mantienen igual, están perfectos */
	.contenedor-citas {
		padding: 2rem;
		background-color: #1c1c1c;
		color: white;
	}
	.filtros {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	.tabla-citas {
		width: 100%;
		border-collapse: collapse;
		background: #2a2a2a;
		color: white;
		border-radius: 10px;
		overflow: hidden;
	}
	.tabla-citas th,
	.tabla-citas td {
		padding: 1rem;
		border-bottom: 1px solid #444;
		text-align: center;
	}
	.tabla-citas th {
		background-color: #c0a080;
		color: #000;
	}
	.boton-limpiar {
		padding: 0.5rem 1rem;
		background-color: #c0a080;
		border: none;
		border-radius: 8px;
		color: black;
		cursor: pointer;
	}
</style>
