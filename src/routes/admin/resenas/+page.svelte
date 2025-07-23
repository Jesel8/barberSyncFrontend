<script>
	import { onMount } from 'svelte';
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
			console.log('Reseñas recibidas del backend:', resenas);
		} catch (e) {
			console.error('Error al cargar las reseñas:', e);
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	async function handleEliminar(id, cliente) {
		if (confirm(`¿Estás seguro de que quieres eliminar la reseña de "${cliente}"?`)) {
			try {
				await eliminarResena(id);
				resenas = resenas.filter((r) => r.id !== id);
			} catch (e) {
				console.error('Error al eliminar la reseña:', e);
				alert(`No se pudo eliminar la reseña: ${e.message}`);
			}
		}
	}

	function renderEstrellas(calificacion) {
		return '⭐'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
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
				{#each resenas.sort((a, b) => new Date(b.fechaResena) - new Date(a.fechaResena)) as resena (resena.id)}
					<tr>
						<td>{resena.nombreCliente}</td>
						<td>{resena.nombreBarbero}</td>
						<td class="estrellas">{renderEstrellas(resena.calificacion)}</td>
						<td class="comentario-celda">{resena.comentario || '-'}</td>
						<td>
							{new Date(resena.fechaResena).toLocaleDateString('es-MX', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</td>
						<td class="acciones-celda">
							<button
								class="btn-accion btn-delete"
								on:click={() => handleEliminar(resena.id, resena.nombreCliente)}
							>
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
	.col-comentario {
		width: 40%;
	}
	.col-calificacion {
		text-align: center;
	}
	.estrellas {
		font-size: 1.2rem;
		text-align: center;
		letter-spacing: 2px;
	}
	.comentario-celda {
		font-style: italic;
		color: #ccc;
		line-height: 1.4;
	}
	.acciones-celda {
		text-align: center;
	}
	.btn-accion {
		background: none;
		border: 1px solid;
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.2s;
	}
	.btn-delete {
		color: #ff6b6b;
		border-color: #ff6b6b;
	}
	.btn-delete:hover {
		background-color: #ff6b6b;
		color: black;
	}
	.error-message {
		color: #ff6b6b;
		background-color: rgba(255, 107, 107, 0.1);
		border: 1px solid #ff6b6b;
		padding: 1rem;
		border-radius: 6px;
		text-align: center;
	}
</style>
