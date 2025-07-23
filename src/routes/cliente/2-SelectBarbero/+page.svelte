<script>
	import '$lib/styles/Global.css';
	import '$lib/styles/nav.css';
	import '$lib/styles/pasos.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// ✅ Importamos AMBAS funciones: para obtener la lista y para obtener las especialidades de CADA uno
	import { obtenerBarberos, obtenerEspecialidadesDeBarbero } from '$lib/api/barberos.js';
	import { citaStore } from '$lib/stores/citaStore.js';

	// --- ESTADO ---
	let barberos = [];
	let isLoading = true;
	let error = null;

	onMount(async () => {
		try {
			// Reiniciamos el estado de la cita
			citaStore.reset();

			// --- LÓGICA DE CARGA MEJORADA ---

			// 1. Obtenemos la lista base de barberos
			const barberosBase = await obtenerBarberos();

			// 2. Creamos una promesa para buscar las especialidades de CADA barbero
			const promesasDeEspecialidades = barberosBase.map((barbero) =>
				obtenerEspecialidadesDeBarbero(barbero.id)
			);

			// 3. Ejecutamos todas las peticiones en paralelo para máxima eficiencia
			const resultadosEspecialidades = await Promise.all(promesasDeEspecialidades);

			// 4. Unimos los datos: a cada barbero le añadimos su lista de especialidades
			barberos = barberosBase.map((barbero, index) => {
				return {
					...barbero,
					// Nos aseguramos de que sea un array, incluso si no tiene especialidades
					especialidades: resultadosEspecialidades[index]?.especialidades || []
				};
			});
			// --- FIN DE LA LÓGICA DE CARGA ---
		} catch (e) {
			console.error('Error al cargar barberos:', e);
			error = 'No se pudieron cargar los barberos. Inténtalo de nuevo más tarde.';
		} finally {
			isLoading = false;
		}
	});

	function handleSeleccionarBarbero(barbero) {
		citaStore.seleccionarBarbero({
			id: barbero.id,
			nombreCompleto: `${barbero.primerNombre} ${barbero.primerApellido}`
		});
		goto('/cliente/3-selectservice');
	}
</script>

<main class="contenedor-principal">
	<nav class="top">
		<div class="logo">
			<a href="/cliente/panel">
				<!-- Hacemos el logo un enlace al panel -->
				<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
			</a>
		</div>
	</nav>

	<h1 class="titulo-panel">Selecciona tu Barbero</h1>
	<div class="barra-progreso-container">
		<div class="barra-etiquetas">
			<span class="activo">Barberos</span>
			<span>Servicios</span>
			<span>Fecha y Hora</span>
			<span>Completado</span>
		</div>
		<div class="barra-fondo">
			<div class="barra-avance paso-1"></div>
		</div>
	</div>

	{#if isLoading}
		<div class="spinner"></div>
	{:else if error}
		<p class="error-message">{error}</p>
	{:else}
		<div class="grid-barberos">
			{#each barberos as barbero (barbero.id)}
				<button class="card-barbero" on:click={() => handleSeleccionarBarbero(barbero)}>
					<img
						src="/icons/userfoto.svg"
						alt="Foto de {barbero.primerNombre}"
						class="foto-barbero"
					/>
					<span class="nombre-barbero">{barbero.primerNombre} {barbero.primerApellido}</span>

					<!-- ✅ AQUÍ MOSTRAMOS LAS ESPECIALIDADES -->
					<div class="especialidades-container">
						{#if barbero.especialidades && barbero.especialidades.length > 0}
							{#each barbero.especialidades as especialidad (especialidad)}
								<span class="especialidad-tag">{especialidad}</span>
							{/each}
						{:else}
							<!-- Opcional: mostrar un texto si no tiene especialidades -->
							<span class="sin-especialidades">Generalista</span>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</main>

<style>
	/* ... Tus estilos existentes ... */
	.titulo-panel {
		text-align: center;
		font-size: 2.5rem;
		margin-top: 4rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}
	h1 {
		color: #f0f0f0;
		margin-bottom: 0.5rem;
	}
	.subtitulo {
		color: #aaa;
		margin-bottom: 3rem;
		font-size: 1.1rem;
	}
	.grid-barberos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 2rem;
	}
	.card-barbero {
		background-color: #252525;
		border: 1px solid #444;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		color: white;
		text-align: center;
		/* ✅ Hacemos que la tarjeta crezca si tiene más contenido */
		min-height: 280px;
	}
	.card-barbero:hover {
		transform: translateY(-8px);
		border-color: #c0a080;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
	}
	.foto-barbero {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #4a4a4a;
		border: 3px solid #c0a080;
		/* ✅ Aseguramos que no se encoja */
		flex-shrink: 0;
	}
	.nombre-barbero {
		font-size: 1.1rem;
		font-weight: 600;
		/* ✅ Espacio para que respire el texto */
		margin-bottom: 0.5rem;
	}
	.error-message {
		color: #ff6b6b;
	}
	.spinner {
		margin: 4rem auto;
		width: 50px;
		height: 50px;
		border: 5px solid #444;
		border-top-color: #c0a080;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ✅ --- NUEVOS ESTILOS PARA LAS ETIQUETAS DE ESPECIALIDAD --- */

	.especialidades-container {
		display: flex;
		flex-wrap: wrap; /* Para que las etiquetas pasen a la siguiente línea si no caben */
		justify-content: center;
		gap: 0.5rem; /* Espacio entre etiquetas */
		width: 100%;
		margin-top: auto; /* Empuja las especialidades a la parte inferior de la tarjeta */
	}

	.especialidad-tag {
		background-color: #4a3f30; /* Un color de fondo sutil */
		color: #e0c0a0; /* Color de texto que resalta */
		padding: 0.25rem 0.6rem;
		border-radius: 999px; /* Para que sea siempre una píldora */
		font-size: 0.8rem;
		font-weight: 500;
		border: 1px solid #7c6853;
	}

	.sin-especialidades {
		color: #888;
		font-style: italic;
		font-size: 0.9rem;
	}
</style>
