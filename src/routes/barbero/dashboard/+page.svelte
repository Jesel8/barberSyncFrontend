<script>
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let isAuthorized = false;
	let usuario = null;

	const unsubscribe = authStore.subscribe((value) => {
		usuario = value.usuario;
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
	<div class="panel-layout">
		<!-- === NAVBAR MEJORADA === -->
		<nav class="navbar">
			<div class="navbar-logo">
				<img src="\src\static\assets\images\logo blanco.png" alt="Logo BarberSync" />
			</div>
			<div class="navbar-usuario">
				<span class="usuario-nombre">Bienvenido, {usuario.nombre}</span>
				<button class="boton-logout" on:click={cerrarSesion}>
					<img src="/assets/icons/Salir.svg" alt="Salir" />
					Cerrar Sesión
				</button>
			</div>
		</nav>

		<!-- === PANEL DE OPCIONES DEL USUARIO === -->
		<section class="opciones-grid">
			<a href="/barbero/ver-citas" class="card-opcion">
				<div class="card-icono">
					<img src="/assets/icons/calendarone.svg" alt="Citas" />
				</div>
				<h3>Ver Citas</h3>
				<p>Consulta tus citas agendadas con clientes.</p>
			</a>

			<a href="/barbero/resenas" class="card-opcion">
				<div class="card-icono">
					<img src="/assets/icons/review.svg" alt="Reseñas" />
				</div>
				<h3>Ver Reseñas</h3>
				<p>Revisa las opiniones que han dejado los clientes.</p>
			</a>

			<!-- === TARJETA MODIFICADA: EDITAR PERFIL === -->
			<a href="/barbero/perfil" class="card-opcion">
				<div class="card-icono">
					<img src="/assets/icons/user.svg" alt="Editar Perfil" />
				</div>
				<h3>Editar Perfil</h3>
				<p>Actualiza tu información personal y contraseña.</p>
			</a>
		</section>

		<!-- === CONTENIDO DE LAS SUBRUTAS === -->
		<main class="contenido-slot">
			<slot />
		</main>
	</div>
{:else}
	<div class="estado-verificacion">
		<p>Verificando autorización...</p>
	</div>
{/if}```

<style>
	/* --- VARIABLES DE DISEÑO (Sin cambios) --- */
	:root {
		--color-primario: #c0a080;
		--color-fondo: #1e1e1e;
		--color-superficie: #2a2a2a;
		--color-superficie-clara: #333;
		--color-borde: #444;
		--color-texto-principal: #e0e0e0;
		--color-texto-secundario: #a0a0a0;
		--sombra-profunda: 0 10px 25px rgba(0, 0, 0, 0.5);
		--sombra-suave: 0 4px 12px rgba(0, 0, 0, 0.3);
		--radio-borde: 12px;
	}

	/* --- LAYOUT PRINCIPAL DEL PANEL (Sin cambios) --- */
	.panel-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--color-fondo);
		color: var(--color-texto-principal);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	/* --- NAVBAR (Sin cambios) --- */
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background-color: var(--color-superficie);
		border-bottom: 1px solid var(--color-borde);
		box-shadow: var(--sombra-suave);
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.navbar-logo img {
		height: 50px;
	}
	.navbar-usuario {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.usuario-nombre {
		font-weight: 500;
		color: var(--color-texto-secundario);
	}
	.boton-logout {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: 1px solid var(--color-borde);
		color: var(--color-texto-secundario);
		padding: 0.6rem 1.2rem;
		border-radius: var(--radio-borde);
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s ease;
	}
	.boton-logout img {
		width: 18px;
		filter: invert(70%);
		transition: filter 0.2s ease;
	}
	.boton-logout:hover {
		background-color: var(--color-primario);
		color: var(--color-fondo);
		border-color: var(--color-primario);
	}
	.boton-logout:hover img {
		filter: invert(0%);
	}

	/* --- GRID DE OPCIONES (CAMBIO PRINCIPAL) --- */
	.opciones-grid {
		/* SE ELIMINÓ margin-bottom: 200px; */
		display: flex;
		justify-content: center;
		gap: 2.5rem;
		padding: 3rem 2rem; /* Se puede reducir un poco el padding si se desea */
		flex-wrap: wrap;
		background-color: #222;
	}

	/* --- TARJETAS DE OPCIÓN (Sin cambios) --- */
	.card-opcion {
		text-decoration: none;
		background-color: var(--color-superficie);
		border-radius: var(--radio-borde);
		width: 300px;
		padding: 2rem;
		text-align: center;
		border: 1px solid var(--color-borde);
		box-shadow: var(--sombra-suave);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			border-color 0.3s ease;
	}
	.card-opcion:hover {
		transform: translateY(-8px);
		box-shadow: var(--sombra-profunda);
		border-color: var(--color-primario);
	}
	.card-icono {
		background-color: var(--color-superficie-clara);
		border-radius: 50%;
		width: 80px;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 1rem;
		transition: background-color 0.3s ease;
	}
	.card-opcion:hover .card-icono {
		background-color: var(--color-primario);
	}
	.card-opcion img {
		width: 40px;
		height: 40px;
		filter: invert(90%);
		transition: filter 0.3s ease;
	}
	.card-opcion:hover img {
		filter: invert(10%);
	}
	.card-opcion h3 {
		font-size: 1.5rem;
		margin: 0.5rem 0;
		color: var(--color-primario);
		font-weight: 600;
	}
	.card-opcion p {
		font-size: 0.95rem;
		color: var(--color-texto-secundario);
		line-height: 1.5;
		margin: 0;
	}

	/* --- CONTENEDOR DEL SLOT (CAMBIO IMPORTANTE) --- */
	.contenido-slot {
		padding: 2rem;
		flex: 1; /* <-- ¡ESTA LÍNEA HACE LA MAGIA! */
		/* Hace que este elemento crezca para ocupar el espacio disponible */
	}

	/* --- NUEVO FOOTER --- */
	.panel-footer {
		padding: 1.5rem 2rem;
		background-color: var(--color-superficie);
		text-align: center;
		border-top: 1px solid var(--color-borde);
		color: var(--color-texto-secundario);
		font-size: 0.9rem;
	}

	/* --- ESTADO DE VERIFICACIÓN (Sin cambios) --- */
	.estado-verificacion {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		font-size: 1.5rem;
		color: var(--color-texto-secundario);
	}
</style>
