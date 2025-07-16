<script>
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let isAuthorized = false;
	let usuario = null;

	const unsubscribe = authStore.subscribe(value => {
		usuario = value.usuario; // Ahora usamos directamente los campos del store mejorado
		if (usuario && (usuario.rol === 'barbero' || usuario.rol === 'admin')) {
			isAuthorized = true;
		} else {
			isAuthorized = false;
		}
	});

	onMount(() => {
		if (browser && !isAuthorized) {
			goto('/login');
		}
	});

	onDestroy(unsubscribe);

	function cerrarSesion() {
		authStore.logout();
		goto('/');
	}
</script>

{#if isAuthorized && usuario}
	<!-- ESTRUCTURA DEL PANEL -->
	<nav class="top">
		<div class="logo">
			<img src="/images/logo-blanco.png" alt="Logo BarberSync" />
		</div>
	</nav>

	<h1 class="titulo-panel"><span style="color: white;">Panel del</span> {usuario.nombre}</h1>

	<section class="panel-usuario">
		<a href="/barbero/ver-citas" class="card-opcion">
			<img src="/icons/calendarone.svg" alt="Citas" />
			<h3>Ver Citas</h3>
			<p>Consulta tus citas agendadas con clientes.</p>
		</a>

		<a href="/barbero/resenas" class="card-opcion">
			<img src="/icons/review.svg" alt="Reseñas" />
			<h3>Ver Reseñas</h3>
			<p>Revisa las opiniones que han dejado los clientes.</p>
		</a>

		<div class="card-opcion" on:click={cerrarSesion}>
			<img src="/icons/Salir.svg" alt="Salir" />
			<h3>Cerrar Sesión</h3>
			<p>Finaliza tu sesión de manera segura.</p>
		</div>
	</section>

	<!-- CONTENIDO DE LAS SUBRUTAS -->
	<main class="content">
		<slot />
	</main>
{:else}
	<p>Verificando autorización...</p>
{/if}

<style>
	.titulo-panel {
		text-align: center;
		font-size: 2.5rem;
		margin-top: 3rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	.panel-usuario {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		padding: 4rem 2rem;
		flex-wrap: wrap;
		background-color: #252525;
	}

	.card-opcion {
		text-decoration: none;
		background-color: #333;
		border-radius: 20px;
		width: 280px;
		padding: 2rem;
		text-align: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
		cursor: pointer;
	}

	.card-opcion:hover {
		transform: scale(1.05);
		box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
	}

	.card-opcion img {
		width: 60px;
		height: 60px;
		margin-bottom: 1rem;
	}

	.card-opcion h3 {
		font-size: 1.4rem;
		margin-bottom: 0.5rem;
		color: #C0A080;
	}

	.card-opcion p {
		font-size: 0.95rem;
		color: #fffdfd;
	}

	.logo img {
		height: 60px;
		padding: 1rem;
	}
</style>
