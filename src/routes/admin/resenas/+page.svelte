<script>
	import { onMount } from 'svelte';
	// 👇 Importamos las nuevas funciones
	import { obtenerTodasLasResenas, eliminarResena } from '$lib/api/resenas.js';

	// --- ESTADO DEL COMPONENTE ---
	let resenas = [];
	let isLoading = true;
	let error = null;

	// --- LÓGICA ---
	onMount(() => {
		cargarResenas();
	});

	async function cargarResenas() {
		try {
			isLoading = true;
			error = null;
			resenas = await obtenerTodasLasResenas();
		} catch (e) {
			console.error("Error al cargar las reseñas:", e);
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	async function handleEliminar(id, cliente) {
		if (confirm(`¿Estás seguro de que quieres eliminar la reseña de "${cliente}"?`)) {
			try {
				await eliminarResena(id);
				// Actualizamos la UI al instante sin recargar
				resenas = resenas.filter(r => r.id !== id);
			} catch (e) {
				console.error("Error al eliminar la reseña:", e);
				alert(`No se pudo eliminar la reseña: ${e.message}`);
			}
		}
	}

	// Función para renderizar estrellas
	function renderEstrellas(calificacion) {
		return '⭐'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
	}
</script>

<main>
	<h1>Gestión de Opiniones y Reseñas</h1>
	
	{#if isLoading}
		<p>Cargando reseñas...</p>
	{:else if error}
		<p class="error-message">{error}</p>
	{:else if resenas.length === 0}
		<p>Aún no se han registrado reseñas en el sistema.</p>
	{:else}
		<table class="tabla-resenas">
			<thead>
				<tr>
					<th>Cliente</th>
					<th>Barbero</th>
					<th class="col-calificacion">Calificación</th>
					<th class="col-comentario">Comentario</th>
					<th>Fecha</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<!-- Ordenamos por las más recientes primero -->
				{#each resenas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) as resena (resena.id)}
					<tr>
						<td>{resena.nombreCliente}</td>
						<td>{resena.nombreBarbero}</td>
						<td class="estrellas">{renderEstrellas(resena.calificacion)}</td>
						<td class="comentario-celda">{resena.comentario || '-'}</td>
						<td>{new Date(resena.fecha).toLocaleDateString()}</td>
						<td class="acciones-celda">
							<button class="btn-accion btn-delete" on:click={() => handleEliminar(resena.id, resena.nombreCliente)}>
								Eliminar
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</main>

<style>
	/* Usaremos estilos muy similares a los de la tabla de servicios para mantener la consistencia */
	main {
		max-width: 1100px;
		margin: 2rem auto;
		padding: 1rem;
	}
	h1 {
		color: #c0a080;
		text-align: center;
		margin-bottom: 2rem;
		border-bottom: 2px solid #c0a080;
		padding-bottom: 1rem;
	}
	.tabla-resenas {
		width: 100%;
		border-collapse: collapse;
		background-color: #252525;
		border-radius: 8px;
		overflow: hidden;
	}
	.tabla-resenas th,
	.tabla-resenas td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #444;
		color: white;
		vertical-align: middle;
	}
	.tabla-resenas th {
		background-color: #1f1f1f;
		color: #c0a080;
	}
	.tabla-resenas tbody tr:hover {
		background-color: #333;
	}
	.col-comentario { width: 40%; }
	.col-calificacion { text-align: center; }
	.estrellas { font-size: 1.2rem; text-align: center; letter-spacing: 2px; }
	.comentario-celda {
		font-style: italic;
		color: #ccc;
		line-height: 1.4;
	}
	.acciones-celda { text-align: center; }
	.btn-accion {
		background: none; border: 1px solid; padding: 0.4rem 0.8rem;
		border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s;
	}
	.btn-delete { color: #ff6b6b; border-color: #ff6b6b; }
	.btn-delete:hover { background-color: #ff6b6b; color: black; }
	.error-message {
		color: #ff6b6b; background-color: rgba(255, 107, 107, 0.1);
		border: 1px solid #ff6b6b; padding: 1rem; border-radius: 6px; text-align: center;
	}
</style>