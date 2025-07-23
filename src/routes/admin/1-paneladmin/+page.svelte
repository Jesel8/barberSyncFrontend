<script>
	// --- SIN CAMBIOS EN LA LÓGICA ---
	// Tu código JavaScript permanece intacto ya que funciona perfectamente.
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
	let cargando = true;

	onMount(async () => {
		authStore.init();
		const unsubscribe = authStore.subscribe((value) => {
			usuario = value.usuario;
		});

		try {
			const resumen = await obtenerResumenDashboard();
			totalBarberos = resumen.totalBarberos;
			totalServicios = resumen.totalServicios;
			totalCitas = resumen.totalCitas;
			totalResenas = resumen.totalResenas;
		} catch (error) {
			console.error('Fallo al cargar datos del dashboard:', error);
		} finally {
			cargando = false;
		}

		return () => unsubscribe();
	});
</script>

<!-- LA ESTRUCTURA HTML PARA LA NAVEGACIÓN ES CORRECTA Y NO REQUIERE CAMBIOS -->
<input type="checkbox" id="menu-toggle" class="menu-toggle" />

<nav class="top">
	<label for="menu-toggle" class="menu-icon">
		<img src="/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>
	<div class="logo">
		<img src="/assets/images/logo blanco.png" alt="Logo BarberSync" />
	</div>
	<div class="salir">
		<a href="/" title="Cerrar Sesión">
			<img src="/assets/icons/Salir.svg" alt="Cerrar Sesión" />
		</a>
	</div>
</nav>

<div class="menu">
	<div class="fotoadmin">
		<img src="/assets/icons/userfoto.svg" alt="Foto admin" />
		<p class="nombre-usuario">
			{#if usuario}
				{usuario.nombreCompleto}
			{:else}
				Cargando...
			{/if}
		</p>
	</div>
	<ul>
		<li><a href="/admin/1-paneladmin">🏠 Inicio</a></li>
		<li><a href="/admin/barberos">✂️ Barberos</a></li>
		<li><a href="/admin/agendas">📅 Agendas</a></li>
		<li><a href="/admin/servicios">💈 Servicios</a></li>
		<li><a href="/admin/resenas">⭐ Opiniones</a></li>
		<!--Linea para reporte-->
		<li><a href="/admin/reporte">📊 Reportes</a></li>
	</ul>
</div>

<!-- EL CONTENIDO PRINCIPAL NO REQUIERE CAMBIOS EN SU ESTRUCTURA -->
<main class="contenido-admin">
	<!-- ... -->
	<header class="dashboard-header">
		<h1 class="titulo-principal">Resumen del Sistema</h1>
		<p class="subtitulo">Una vista rápida de la actividad en BarberSync.</p>
	</header>
	{#if cargando}
		<div class="contenedor-carga">
			<p class="mensaje-carga">Cargando datos...</p>
		</div>
	{:else}
		<section class="grid-cards">
			<div class="card">
				<img
					src="/assets/icons/Barbers.svg"
					alt="Icono de Barberos"
				/>
				<div class="card-content">
					<h3>Barberos Registrados</h3>
					<p>{totalBarberos}</p>
				</div>
			</div>
			<div class="card">
				<img
					src="/assets/icons/Services.svg"
					alt="Icono de Servicios"
				/>
				<div class="card-content">
					<h3>Servicios Activos</h3>
					<p>{totalServicios}</p>
				</div>
			</div>
			<div class="card">
				<img src="/assets/icons/Citas.svg" alt="Icono de Citas" />
				<div class="card-content">
					<h3>Citas Totales</h3>
					<p>{totalCitas}</p>
				</div>
			</div>
			<div class="card">
				<img
					src="/assets/icons/Opinion.svg"
					alt="Icono de Opiniones"
				/>
				<div class="card-content">
					<h3>Opiniones Recibidas</h3>
					<p>{totalResenas}</p>
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	/* ----- INICIO DE LOS ESTILOS CORREGIDOS ----- */

	/* Base de navegación */
	.menu-toggle {
		display: none;
	}

	.top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 60px;
		background-color: #252525;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
		z-index: 1000;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	}
	.logo img {
		height: 40px;
	}
	.salir img {
		height: 28px;
	}

	/* --- CAMBIO 1: El icono del menú ahora SIEMPRE está visible --- */
	.menu-icon {
		cursor: pointer;
		/* Aseguramos que siempre sea un bloque para poder hacer clic */
		display: block;
		padding-right: 15px; /* Un poco de espacio */
	}

	/* --- CAMBIO 2: El menú está OCULTO por defecto --- */
	.menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		height: 100vh;
		background-color: #252525;
		padding-top: 1rem;
		z-index: 999;
		/* Lo movemos fuera de la pantalla hacia la izquierda */
		transform: translateX(-100%);
		transition: transform 0.3s ease-in-out;
	}

	/* --- CAMBIO 3: Cuando se hace clic, el menú aparece --- */
	.menu-toggle:checked ~ .menu {
		transform: translateX(0);
	}

	.fotoadmin {
		text-align: center;
		margin-bottom: 2rem;
		margin-top: 60px;
	}
	.fotoadmin img {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 2px solid #c0a080;
	}
	.nombre-usuario {
		color: white;
		margin-top: 0.5rem;
		font-weight: bold;
	}

	.menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.menu ul li a {
		display: block;
		padding: 1rem 1.5rem;
		color: #a0a0a0;
		text-decoration: none;
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	.menu ul li a:hover {
		background-color: #c0a080;
		color: white;
	}

	/* --- CAMBIO 4: El contenido principal se adapta al estado del menú --- */
	.contenido-admin {
		/* Por defecto, no tiene margen izquierdo */
		margin-left: 0;
		margin-top: 60px;
		padding: 2rem 3rem;
		color: white;
		min-height: calc(100vh - 60px);
		transition: margin-left 0.3s ease-in-out; /* Animación suave */
	}

	/* --- CAMBIO 5: ¡LA MAGIA! Al abrir el menú, se empuja el contenido --- */
	.menu-toggle:checked ~ .contenido-admin {
		margin-left: 250px; /* Ancho del menú */
	}

	/* ---- Estilos del Contenido y Tarjetas (se mantienen) ---- */
	.dashboard-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	.titulo-principal {
		font-size: 2.5rem;
		font-weight: 700;
		color: #c0a080;
		margin-bottom: 0.5rem;
	}
	.subtitulo {
		font-size: 1.1rem;
		color: #a0a0a0;
		margin-top: 0;
	}

	.grid-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.card {
		background: linear-gradient(145deg, #2e2e2e, #252525);
		border-radius: 12px;
		padding: 2rem 1.5rem;
		border: 1px solid #404040;
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.card:hover {
		transform: translateY(-8px);
		box-shadow: 0 10px 20px rgba(192, 160, 128, 0.2);
	}

	.card img {
		width: 60px;
		height: 60px;
		object-fit: contain;
		margin-bottom: 1.5rem;
	}
	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.card h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		color: #b0b0b0;
	}
	.card p {
		margin: 0.2rem 0 0;
		font-size: 2.8rem;
		font-weight: bold;
		color: #ffffff;
		line-height: 1.2;
	}

	.contenedor-carga {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 50vh;
	}
	.mensaje-carga {
		font-size: 1.5rem;
		color: #c0a080;
		animation: pulse 1.8s infinite ease-in-out;
	}
	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}

	/* --- CAMBIO 6: Media Query se simplifica. Define el comportamiento en móviles si queremos que sea diferente --- */
	/* Por ejemplo, en pantallas muy pequeñas, podríamos querer que el menú se superponga en vez de empujar */
	@media (max-width: 600px) {
		.contenido-admin {
			padding: 2rem 1.5rem; /* Menos padding en pantallas pequeñas */
		}
		/* Si quisiéramos que se superponga: */
		/* .menu-toggle:checked ~ .contenido-admin { margin-left: 0; } */
	}
</style>
