<script>
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import { onMount } from 'svelte';
	import { obtenerCitasPorBarbero, obtenerCitasPorBarberoYFecha } from '$lib/api/citas';

	let citas = [];
	let fechaFiltro = '';
	let barberoId = null; // Se mantiene como null inicialmente
	let cargando = true; // ✅ Añadimos un estado de carga para mejor UX

	// La función no cambia, pero ahora será llamada con un barberoId numérico
	async function cargarCitas() {
		if (!barberoId) return;
		cargando = true;
		try {
			const resultado = await obtenerCitasPorBarbero(barberoId);
			citas = resultado ?? [];
		} catch (e) {
			console.error('❌ Error al obtener citas:', e);
			citas = []; // En caso de error, dejamos la lista vacía
		} finally {
			cargando = false; // Dejamos de cargar, con o sin éxito
		}
	}

	// La función no cambia, pero ahora será llamada con un barberoId numérico
	async function filtrarPorFecha() {
		// Si no hay fecha, volvemos a cargar todas las citas del barbero
		if (!fechaFiltro) {
			await cargarCitas();
			return;
		}

		if (!barberoId) return; // Seguridad extra
		cargando = true;
		try {
			const resultado = await obtenerCitasPorBarberoYFecha(barberoId, fechaFiltro);
			citas = resultado ?? [];
		} catch (e) {
			console.error('❌ Error al filtrar por fecha:', e);
			citas = [];
		} finally {
			cargando = false;
		}
	}

	function limpiarFiltro() {
		fechaFiltro = '';
		// Es mejor usar la instancia de flatpickr para limpiar, si es posible
		const fp = document.querySelector('#fecha')._flatpickr;
		if (fp) {
			fp.clear();
		}
		cargarCitas();
	}

	onMount(() => {
		// ✅ CORRECCIÓN PRINCIPAL: Obtener y convertir el ID a número
		const idDesdeStorage = localStorage.getItem('barberoId');
		if (idDesdeStorage) {
			// La línea clave para solucionar el problema:
			barberoId = parseInt(idDesdeStorage, 10);

			// Ahora puedes llamar a tus funciones de la API con confianza
			cargarCitas();
		} else {
			console.error('No se encontró el barberoId en localStorage.');
			// ...
		}

		// Inicializar flatpickr
		flatpickr('#fecha', {
			dateFormat: 'Y-m-d',
			onChange: (selectedDates, dateStr) => {
				fechaFiltro = dateStr;
				filtrarPorFecha(); // La llamada se mantiene igual
			}
		});

		// Se eliminó la llamada a cargarCitas() de aquí para que solo se ejecute
		// si se encuentra un barberoId válido.
	});
</script>

<div class="contenedor-citas">
	<h2>Mis citas agendadas</h2>

	<div class="filtros">
		<input type="text" id="fecha" placeholder="Filtrar por fecha" />
		<button class="boton-limpiar" on:click={limpiarFiltro}>Limpiar filtros</button>
	</div>

	<!-- ✅ Mejoramos la retroalimentación al usuario -->
	{#if cargando}
		<p>Cargando citas...</p>
	{:else if citas.length === 0}
		<p>No tienes citas agendadas para la fecha seleccionada o no hay citas registradas.</p>
	{:else}
		<table class="tabla-citas">
			<thead>
				<tr>
					<th>Cliente</th>
					<th>Fecha</th>
					<th>Hora</th>
					<th>Estado</th>
					<th>Duración</th>
				</tr>
			</thead>
			<tbody>
				{#each citas as cita}
					<tr>
						<td>{cita.nombreCliente ?? 'Sin nombre'}</td>
						<td>{cita.fecha ?? '-'}</td>
						<td>{cita.hora ?? '-'}</td>
						<td>{cita.estado ?? '-'}</td>
						<td>{cita.duracionTotalMinutos ?? 0} min</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
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
