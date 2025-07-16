<!-- /routes/barbero/resenas/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { obtenerResenasDeBarbero } from '$lib/api/resenas.js';

	let resenas = [];
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
			resenas = await obtenerResenasDeBarbero(idBarbero);
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	});

	function renderEstrellas(calificacion) {
		return '⭐'.repeat(calificacion) + '☆'.repeat(5 - calificacion);
	}
</script>

<h1>Mis Reseñas</h1>
<p>Lo que tus clientes opinan de tu trabajo.</p>

{#if isLoading}
	<p>Cargando reseñas...</p>
{:else if error}
	<p class="error-message">{error}</p>
{:else if resenas.length === 0}
	<p>Aún no has recibido ninguna reseña.</p>
{:else}
	<div class="lista-resenas">
		{#each resenas as resena (resena.id)}
			<div class="resena-card">
				<div class="resena-header">
					<span class="cliente-nombre">{resena.nombreCliente}</span>
					<span class="estrellas">{renderEstrellas(resena.calificacion)}</span>
				</div>
				<p class="comentario">"{resena.comentario || 'Sin comentario.'}"</p>
				<span class="fecha">{new Date(resena.fecha).toLocaleDateString()}</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.lista-resenas {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.resena-card {
		background: #2f2f2f;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 5px solid #c0a080;
	}
	.resena-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.cliente-nombre {
		font-weight: bold;
		font-size: 1.2rem;
	}
	.estrellas {
		font-size: 1.2rem;
	}
	.comentario {
		font-style: italic;
		color: #ddd;
		margin-bottom: 1rem;
	}
	.fecha {
		display: block;
		text-align: right;
		font-size: 0.8rem;
		color: #999;
	}
</style>
