<script>
	import '$lib/Styles/nav.css';
	import '$lib/Styles/Global.css';
</script>

<!-- 
    NAV MEJORADO
    - Se mantiene el logo a la izquierda.
    - Se añade un nuevo contenedor a la derecha para las acciones del usuario.
    - Aquí movemos la opción de "Salir".
-->
<nav class="top">
	<div class="logo">
		<a href="/cliente/panel">
			<!-- Hacemos el logo un enlace al panel -->
			<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
		</a>
	</div>
	<div class="nav-actions">
		<a href="/" class="logout-button" title="Cerrar Sesión">
			<img src="/src/static/assets/icons/Salir.svg" alt="Salir" />
			<span>Salir</span>
		</a>
	</div>
</nav>

<!-- 
    CONTENIDO PRINCIPAL
    - Envolvemos todo en un <main> para aplicar los márgenes simétricos
      y mantener una buena estructura semántica.
-->
<main class="contenido-cliente">
	<header>
		<h1 class="titulo-panel">
			Panel de <span>Usuario</span>
		</h1>
	</header>

	<section class="panel-usuario">
		<a href="/cliente/2-SelectBarbero" class="card-opcion">
			<div class="card-icon-background">
				<img src="/src/static/assets/icons/calendartwo.svg" alt="Agendar" />
			</div>
			<h3>Agendar Cita</h3>
			<p>Explora servicios y reserva tu próximo corte.</p>
		</a>

		<a href="/cliente/Historial" class="card-opcion">
			<div class="card-icon-background">
				<img src="/src/static/assets/icons/calendarone.svg" alt="Historial" />
			</div>
			<h3>Mis Citas</h3>
			<p>Consulta el historial y los detalles de tus citas.</p>
		</a>

		<!-- 
            NUEVA TARJETA RECOMENDADA 
            Esta opción es muy útil y reemplaza a "Salir".
        -->
		<a href="/info/contacto" class="card-opcion">
			<div class="card-icon-background">
				<!-- Se recomienda un icono de mapa o teléfono -->
			<img src="/src/static/assets/icons/phone-call.svg" alt="ayuda" />
			</div>
			<h3>Ubicación y Contacto</h3>
			<p>Encuentra nuestras sucursales y contáctanos.</p>
		</a>
	</section>
</main>

<style>
	/* Importamos la fuente Poppins de Google Fonts para un look más moderno */
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

	:root {
		--brand-color: #c0a080;
		--background-dark: #1f1f1f;
		--card-background: #2a2a2a;
		--text-light: #f0f0f0;
		--text-muted: #a0a0a0;
	}

	/* ESTILOS DEL CONTENEDOR PRINCIPAL CON MÁRGENES SIMÉTRICOS */
	.contenido-cliente {
		/* ¡AQUÍ ESTÁ LA CLAVE! Tu petición de márgenes simétricos aplicada */
		margin: 60px 180px 0 180px; /* Margen superior para el nav y laterales iguales */
		padding: 2rem;
		color: var(--text-light);
		min-height: calc(100vh - 60px);
		font-family: 'Poppins', sans-serif;
	}

	/* Título del panel */
			.titulo-panel {
		text-align: center;
		font-size: 2.5rem;
		margin-top: 3rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}
	.titulo-panel span {
		font-weight: 700;
		color: var(--brand-color); /* Usamos el color de marca */
	}

	/* Cuadrícula para las tarjetas de opciones */
	.panel-usuario {
		display: grid;
		/* Usamos CSS Grid para un layout responsivo y robusto */
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2.5rem; /* Más espacio entre tarjetas */
	}

	/* Estilo de cada tarjeta */
	.card-opcion {
		text-decoration: none;
		background: var(--card-background);
		border: 1px solid #3c3c3c;
		border-radius: 16px;
		padding: 2rem;
		text-align: center;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}
	.card-opcion:hover {
		transform: translateY(-10px);
		box-shadow: 0 10px 25px rgba(192, 160, 128, 0.15);
	}

	/* Fondo para el icono para hacerlo resaltar */
	.card-icon-background {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: #333;
		display: grid;
		place-items: center;
		margin-bottom: 1.5rem;
	}
	.card-opcion img {
		width: 45px;
		height: 45px;
		object-fit: contain;
	}

	.card-opcion h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--brand-color);
	}

	.card-opcion p {
		font-size: 0.95rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	/* ---- ESTILOS PARA LA BARRA DE NAVEGACIÓN ---- */
	/* 
     Estos estilos deberían estar idealmente en tu 'nav.css',
     pero los incluyo aquí para que veas el resultado completo.
    */
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* El resto de estilos de tu nav.css aplicarían aquí */
	}
	.logo a {
		display: inline-block; /* Asegura que el área del enlace funcione bien */
	}

	.nav-actions {
		display: flex;
		align-items: center;
	}
	.logout-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: var(--text-muted);
		background-color: #333;
		padding: 0.6rem 1.2rem;
		border-radius: 12px;
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	.logout-button:hover {
		background-color: var(--brand-color);
		color: #fff;
	}
	.logout-button img {
		width: 24px;
		height: 24px;
	}

	/* ---- RESPONSIVIDAD ---- */
	@media (max-width: 900px) {
		.contenido-cliente {
			/* En pantallas pequeñas, eliminamos los márgenes laterales */
			margin-left: 0;
			margin-right: 0;
			padding: 1.5rem;
		}
	}
</style>
