<script>
	import '$lib/styles/Global.css';
	import '$lib/styles/top.css';
	import '$lib/styles/landing.css';
</script>

<!-- NAVBAR (NO SE TOCA) -->
<nav class="top">
	<div class="logo">
		<img src="\src\static\assets\images\logo blanco.png" alt="Logo BarberSync" />
	</div>
	<div class="links">
		<a href="\login" class="sesion">Iniciar Sesión</a>
		<a href="/login/Registrarse" class="registrarse">Registrarse</a>
	</div>
</nav>

<!-- HERO MEJORADO -->
<section class="hero-mejorado">
	<div class="overlay"></div>
	<div class="hero-content">
		<div class="hero-logo">
			<img src="\src\static\assets\images\barber.png" alt="Logo" />
		</div>
		<h1 class="hero-titulo">Constantino's Barbershop</h1>
		<p class="hero-subtitulo">Autenticidad, precisión y estilo en cada corte</p>
		<a href="/Login" class="btn-hero">Agenda tu cita</a>
	</div>
</section>

<!-- SERVICIOS EN CARRUSEL -->
<section class="servicios-profesionales py-5" id="servicios">
	<div class="container text-center">
		<h2 class="servicios-titulo mb-3">Nuestros Servicios</h2>
		<p class="servicios-descripcion mb-4">
			Calidad y detalle en cada atención. Conoce los servicios que nos distinguen.
		</p>

		<div id="carruselServicios" class="carousel slide" data-bs-ride="carousel">
			<div class="carousel-inner">
				<div class="carousel-item active">
					<div class="d-flex justify-content-center flex-wrap gap-4">
						<div class="card servicio-card">
							<img
								src="\src\static\assets\images\corte.png"
								class="card-img-top"
								alt="Corte Clásico"
							/>
							<div class="card-body text-center">
								<h5 class="card-title">Corte de Cabello</h5>
								<p class="card-text">Estilo limpio y tradicional. $100 MXN</p>
							</div>
						</div>

						<div class="card servicio-card">
							<img
								src="\src\static\assets\images\barba.png"
								class="card-img-top"
								alt="Afeitado Tradicional"
							/>
							<div class="card-body text-center">
								<h5 class="card-title">Corte de Barba</h5>
								<p class="card-text">Navaja caliente, espuma especial. $120 MXN</p>
							</div>
						</div>

						<div class="card servicio-card">
							<img
								src="\src\static\assets\images\cabar.png"
								class="card-img-top"
								alt="Diseño de Barba"
							/>
							<div class="card-body text-center">
								<h5 class="card-title">Arreglo de Cabello y Barba</h5>
								<p class="card-text">
									Corte impecable con perfilado con simetría y estilo. $180 MXN
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="carousel-item">
					<div class="d-flex justify-content-center flex-wrap gap-4">
						<div class="card servicio-card">
							<img
								src="\src\static\assets\images\navaja.png"
								class="card-img-top"
								alt="Fade Americano"
							/>
							<div class="card-body text-center">
								<h5 class="card-title">Afeitado de Barba</h5>
								<p class="card-text">Degradado moderno. $100 MXN</p>
							</div>
						</div>

						<div class="card servicio-card">
							<img
								src="\src\static\assets\images\grecas.png"
								class="card-img-top"
								alt="Limpieza Facial"
							/>
							<div class="card-body text-center">
								<h5 class="card-title">Grecas/Dibujos</h5>
								<p class="card-text">Simetria y modernedidad. $120 MXN</p>
							</div>
						</div>

						<div class="card servicio-card">
							<img
								src="\src\static\assets\images\cejas.png"
								class="card-img-top"
								alt="Corte para Niño"
							/>
							<div class="card-body text-center">
								<h5 class="card-title">Arreglo de Cejas</h5>
								<p class="card-text">Paciencia y estilo. $50 MXN</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<button
				class="carousel-control-prev"
				type="button"
				data-bs-target="#carruselServicios"
				data-bs-slide="prev"
			>
				<span class="carousel-control-prev-icon"></span>
			</button>
			<button
				class="carousel-control-next"
				type="button"
				data-bs-target="#carruselServicios"
				data-bs-slide="next"
			>
				<span class="carousel-control-next-icon"></span>
			</button>
		</div>
	</div>
</section>

<!-- UBICACIÓN -->
<section class="ubicacion" id="ubicacion">
	<div class="ubicacion-content">
		<div class="mapa">
			<iframe
				src="https://www.google.com/maps/embed?pb=!4v1751675662230!6m8!1m7!1slD_fPZ1FyLr7NHzzBPBPRg!2m2!1d16.7376832914536!2d-93.11903463741271!3f97.633896!4f0!5f0.7820865974627469"
				width="600"
				height="450"
				style="border:0;"
				allowfullscreen=""
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			>
			</iframe>
		</div>
		<div class="info">
			<h3><i class="fas fa-map-marker-alt"></i> ¿Dónde estamos?</h3>
			<p>
				<strong><i class="fas fa-location-dot"></i> Dirección:</strong> Calle Central-Sur entre 21a y
				20a sur, San Francisco, Tuxtla Gutiérrez, México Chiapas.
			</p>
			<p>
				<strong><i class="fas fa-clock"></i> Horario:</strong> Lunes a Sábado, 9:00 am – 8:00 pm
			</p>
		</div>
	</div>
</section>

<!-- FOOTER OSCURO -->
<footer class="footer">
	<div class="footer-left">
		<p><strong>Barbería El Clásico</strong></p>
		<p>Tu corte, tu estilo, tu momento.</p>
		<p>© 2025 Todos los derechos reservados</p>
	</div>
	<div class="footer-right">
		<p class="powered">Con tecnología de</p>
		<img src="/images/logo blanco.png" alt="BarberSync" />
		<p><a href="https://barbersync" target="_blank">www.barbersync.mx</a></p>
	</div>
</footer>
