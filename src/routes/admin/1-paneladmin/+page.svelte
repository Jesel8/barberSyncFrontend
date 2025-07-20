<script>
	import '$lib/Styles/Global.css';
	import '$lib/Styles/nav.css';
	import '$lib/Styles/aside.css';
	import { onMount } from 'svelte';
	import { obtenerResumenDashboard } from '$lib/api/dashboard.js';
	import { authStore } from '$lib/stores/authStore.js';

	let usuario = null;
	let totalBarberos = 0;
	let totalServicios = 0;
	let totalCitas = 0;
	let totalResenas = 0;
	let cargando = true; // Añadimos un estado de carga

	onMount(async () => {
		// 1. Inicializa el store y suscríbete
		authStore.init();
		const unsubscribe = authStore.subscribe((value) => {
			usuario = value.usuario;
		});

		// 2. Si hay un usuario, busca los datos del dashboard
		// El token se obtendrá dentro de la función obtenerResumenDashboard
		try {
			const resumen = await obtenerResumenDashboard();
			totalBarberos = resumen.totalBarberos;
			totalServicios = resumen.totalServicios;
			totalCitas = resumen.totalCitas;
			totalResenas = resumen.totalResenas;
		} catch (error) {
			console.error('Fallo al cargar datos del dashboard:', error);
			// Podrías mostrar un mensaje de error en la UI
		} finally {
			cargando = false; // Termina la carga, haya éxito o error
		}

		// 3. Limpieza al desmontar el componente
		return () => unsubscribe();
	});
</script>

<input type="checkbox" id="menu-toggle" class="menu-toggle" />

<!-- NAVBAR SUPERIOR -->
<nav class="top">
	<label for="menu-toggle" class="menu-icon">
		<img src="/src/static/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>
	<div class="logo">
		<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
	</div>
	<div class="salir">
		<a href="/">
			<img src="/src/static/assets/icons/Salir.svg" alt="Cerrar Sesión" />
		</a>
	</div>
</nav>

<!-- MENÚ LATERAL -->
<div class="menu">
	<div class="fotoadmin">
		<img src="/src/static/assets/icons/userfoto.svg" alt="Foto admin" />
		<p class="nombre-usuario">
			{#if usuario}
				{usuario.nombreCompleto}
			{:else}
				Cargando...
			{/if}
		</p>
	</div>
	<ul>
		<li><a href="/">🏠 Inicio</a></li>
		<li><a href="/admin/barberos">✂️ Barberos</a></li>
		<li><a href="/admin/agendas">📅 Agendas</a></li>
		<li><a href="/admin/servicios">💈 Servicios</a></li>
		<li><a href="/admin/resenas">⭐ Opiniones</a></li>
	</ul>
</div>

<!-- CONTENIDO PRINCIPAL -->
<main class="contenido-admin">
	<h1 class="titulo-principal">Dashboard de Administrador</h1>

	<!-- 
        Iniciamos un bloque condicional.
        Svelte evaluará la variable 'cargando'.
    -->
	{#if cargando}
		<!-- 
            Mientras 'cargando' sea 'true', se mostrará este párrafo.
            Le damos un estilo para que se vea bien.
        -->
		<p class="mensaje-carga">Cargando datos del dashboard...</p>
	{:else}
		<!-- 
            Una vez que la carga termina y 'cargando' se vuelve 'false',
            Svelte mostrará este bloque, que contiene tus tarjetas con los datos ya actualizados.
        -->
		<div class="grid-cards">
			<div class="card">
				<img src="https://cdn-icons-png.flaticon.com/128/3039/3039407.png" alt="Barberos" />
				<div>
					<h3>Barberos registrados</h3>
					<p>{totalBarberos}</p>
				</div>
			</div>
			<div class="card">
				<img src="https://cdn-icons-png.flaticon.com/128/2942/2942911.png" alt="Servicios" />
				<div>
					<h3>Servicios activos</h3>
					<p>{totalServicios}</p>
				</div>
			</div>
			<div class="card">
				<img src="https://cdn-icons-png.flaticon.com/128/10736/10736087.png" alt="Citas" />
				<div>
					<h3>Citas agendadas</h3>
					<p>{totalCitas}</p>
				</div>
			</div>
			<div class="card">
				<img src="https://cdn-icons-png.flaticon.com/128/2462/2462719.png" alt="Opiniones" />
				<div>
					<h3>Opiniones recibidas</h3>
					<p>{totalResenas}</p>
				</div>
			</div>
		</div>
	{/if}
	<!-- Fin del bloque condicional -->
</main>

<style>
	/* CENTRADO GENERAL Y MEJORAS DE ESTILO */
	.contenido-admin {
		margin-left: 260px;
		margin-top: 60px;
		padding: 2rem;
		color: white;
		min-height: calc(100vh - 60px);
		max-width: 1100px;
		margin-inline: auto;
	}

	/* TITULO PRINCIPAL CENTRADO */
	.titulo-principal {
		margin-bottom: 2rem;
		text-align: center;
		font-size: 2rem;
		color: #c0a080;
	}

	/* GRID RESPONSIVO PARA LAS CARDS */
	.grid-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 2rem;
	}

	/* ESTILO DE CADA CARD */
	.card {
		background-color: #2f2f2f;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		gap: 1.2rem;
		transition: transform 0.2s ease;
	}

	.card:hover {
		transform: scale(1.03);
	}

	/* ICONO DE LA CARD */
	.card img {
		width: 60px;
		height: 60px;
		object-fit: contain;
	}

	/* TEXTO DE LA CARD */
	.card h3 {
		margin: 0;
		font-size: 1.1rem;
		color: #c0a080;
	}

	.card p {
		margin: 0;
		font-size: 1.6rem;
		font-weight: bold;
		color: white;
	}
</style>
