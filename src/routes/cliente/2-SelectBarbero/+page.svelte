<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// Asumimos que esta función ya existe y funciona (hace GET a /api/usuarios?rol=BARBERO)
	import { obtenerBarberos } from '$lib/api/barberos.js';
	import { citaStore } from '$lib/stores/citaStore.js';

	// --- ESTADO ---
	let barberos = [];
	let isLoading = true;
	let error = null;

	onMount(async () => {
		try {
			// Reiniciamos el estado de la cita por si el usuario vuelve a esta página
			citaStore.reset();
			barberos = await obtenerBarberos();
		} catch (e) {
			console.error('Error al cargar barberos:', e);
			error = 'No se pudieron cargar los barberos. Inténtalo de nuevo más tarde.';
		} finally {
			isLoading = false;
		}
	});

	function handleSeleccionarBarbero(barbero) {
		// Guardamos la información relevante del barbero en nuestra tienda
		citaStore.seleccionarBarbero({
			id: barbero.id,
			nombreCompleto: `${barbero.primerNombre} ${barbero.primerApellido}`
		});

		// Redirigimos al usuario al siguiente paso del flujo
		goto('/cliente/3-selectservice');
	}
</script>

<main class="contenedor-principal">
<nav class="top">
  <div class="logo">
    <img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
  </div>
</nav>

	<div class="paso-indicador">Paso 1 de 4</div>
	<h1>Selecciona tu Barbero</h1>
	<p class="subtitulo">Elige al profesional que prefieras para tu servicio.</p>

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
					<!-- Podríamos añadir especialidades aquí en el futuro -->
				</button>
			{/each}
		</div>
	{/if}
</main>

<style>
	.contenedor-principal {
		max-width: 900px;
		margin: 2rem auto;
		padding: 2rem;
		text-align: center;
	}
	.paso-indicador {
		color: #c0a080;
		font-weight: bold;
		margin-bottom: 0.5rem;
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
	}
	.nombre-barbero {
		font-size: 1.1rem;
		font-weight: 600;
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
</style>
