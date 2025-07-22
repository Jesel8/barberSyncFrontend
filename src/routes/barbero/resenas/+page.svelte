<!-- /routes/barbero/resenas/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { obtenerResenasDeBarbero } from '$lib/api/resenas.js';

	let resenas = [];
	let isLoading = true;
	let error = null;

	onMount(async () => {
		const idBarbero = $authStore.usuario?.idUsuario; // Corregido

		if (!idBarbero) {
			error = 'No se pudo identificar al barbero. Por favor, inicia sesión de nuevo.';
			isLoading = false;
			return;
		}

		try {
			const resenasObtenidas = await obtenerResenasDeBarbero(idBarbero);
			// 👇 LA CORRECCIÓN CLAVE PARA ORDENAR 👇
			resenas = resenasObtenidas.sort((a, b) => new Date(b.fechaResena) - new Date(a.fechaResena));
		} catch (e) {
			error = `Error al cargar las reseñas: ${e.message}`;
		} finally {
			isLoading = false;
		}
	});

	function renderEstrellas(calificacion) {
		if (typeof calificacion !== 'number' || calificacion < 0) return 'Sin calificación';
		return '⭐'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
	}
</script>

<div class="contenedor-resenas">
	<div class="header-vista">
		<h1>Mis Reseñas</h1>
		<p>Lo que tus clientes opinan de tu increíble trabajo.</p>
	</div>

	{#if isLoading}
		<p class="mensaje-estado">Cargando reseñas...</p>
	{:else if error}
		<p class="mensaje-estado error">{error}</p>
	{:else if resenas.length === 0}
		<p class="mensaje-estado">¡Sigue así! Pronto recibirás tu primera reseña.</p>
	{:else}
		<div class="grid-resenas">
			{#each resenas as resena (resena.id)}
				<article class="resena-card">
					<header class="resena-header">
						<div class="info-cliente">
							<div class="avatar">{resena.nombreCliente?.charAt(0) || '?'}</div>
							<span class="cliente-nombre">{resena.nombreCliente || 'Cliente'}</span>
						</div>
						<div class="estrellas" title="{resena.calificacion} de 5 estrellas">
							{renderEstrellas(resena.calificacion)}
						</div>
					</header>
					<blockquote class="comentario">
						{resena.comentario || 'El cliente no dejó un comentario.'}
					</blockquote>
					<footer class="resena-footer">
						<!-- 👇 LA CORRECCIÓN CLAVE PARA MOSTRAR LA FECHA 👇 -->
						<span>
							{new Date(resena.fechaResena).toLocaleDateString('es-MX', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</span>
					</footer>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* ... Pega aquí todos los estilos que te pasé en la respuesta anterior ... */
	.contenedor-resenas {
		max-width: 900px;
		margin: 2rem auto;
		padding: 0 1rem;
	}
	.header-vista {
		text-align: center;
		margin-bottom: 3rem;
	}
	h1 {
		color: #e0e0e0;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}
	.header-vista p {
		font-size: 1.1rem;
		color: #a0a0a0;
	}
	.mensaje-estado {
		text-align: center;
		padding: 3rem;
		background-color: #2a2a2a;
		border-radius: 8px;
		color: #ccc;
	}
	.mensaje-estado.error {
		color: #ff8a8a;
	}
	.grid-resenas {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	.resena-card {
		background: #1e1e1e;
		border: 1px solid #2c2c2c;
		border-top: 4px solid #c0a080;
		border-radius: 8px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	}
	.resena-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}
	.info-cliente {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #c0a080;
		color: #121212;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 1.2rem;
		text-transform: uppercase;
	}
	.cliente-nombre {
		font-weight: 600;
		font-size: 1.1rem;
		color: #e0e0e0;
	}
	.estrellas {
		font-size: 1rem;
		letter-spacing: 2px;
	}
	.comentario {
		font-size: 1rem;
		line-height: 1.6;
		color: #b0b0b0;
		margin: 0 0 1.5rem 0;
		padding-left: 1rem;
		border-left: 3px solid #3a3a3a;
		font-style: italic;
		flex-grow: 1;
	}
	.resena-footer {
		text-align: right;
		font-size: 0.8rem;
		color: #777;
	}
	@media (min-width: 768px) {
		.grid-resenas {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
