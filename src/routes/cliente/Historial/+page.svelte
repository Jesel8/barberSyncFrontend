<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore.js';
	import { get } from 'svelte/store';
	import '$lib/Styles/Global.css';
	import '$lib/Styles/nav.css';

	let citasPendientes = [];
	let citasPasadas = []; // Cambiamos el nombre para incluir Realizadas y Canceladas
	let cargando = true;
	let error = null;

	const usuario = get(authStore).usuario;

	onMount(async () => {
		if (!usuario?.idUsuario || !usuario.token) {
			alert('No se ha iniciado sesión. Redirigiendo...');
			window.location.href = '/';
			return;
		}

		try {
			// El fetch sigue siendo el mismo, obtenemos todas las citas del cliente
			const response = await fetch(`http://localhost:8080/api/citas/cliente/${usuario.idUsuario}`, {
				headers: {
					Authorization: `Bearer ${usuario.token}`
				}
			});

			if (!response.ok) throw new Error('Fallo al obtener citas del cliente');

			const data = await response.json();

			// --- ✅ LÓGICA CORREGIDA ---
			// Ahora filtramos usando el estado que nos manda el backend.
			// Esta es la única fuente de la verdad.
			citasPendientes = data.filter(
				(cita) => cita.estado === 'Pendiente' || cita.estado === 'Confirmada'
			);

			// Las citas "pasadas" son las que ya terminaron su ciclo de vida.
			citasPasadas = data.filter(
				(cita) => cita.estado === 'Realizada' || cita.estado === 'Cancelada'
			);
			//-----------------------------
		} catch (e) {
			console.error('❌ Error al cargar citas:', e);
			error = 'No se pudo cargar tu historial de citas.';
		} finally {
			cargando = false;
		}
	});

	function formatearFecha(fecha) {
		const f = new Date(fecha + 'T00:00:00'); // Aseguramos que la fecha se interprete correctamente
		return f.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
	}

	function formatearHora(hora) {
		return hora.substring(0, 5);
	}
</script>

<!-- El HTML de abajo (nav, h1, etc.) puede permanecer casi igual -->
<!-- Solo cambia "citasRealizadas" por "citasPasadas" -->

<nav class="top">
	<!-- ... tu nav ... -->
</nav>

<h1 class="titulo-panel">
	<!-- ... tu título ... -->
</h1>

{#if cargando}
	<!-- ... tu loading ... -->
{:else if error}
	<!-- ... tu error ... -->
{:else}
	<section class="contenedor-historial">
		<div class="bloque-citas">
			<h2 class="titulo-seccion">📅 Pendientes</h2>
			{#if citasPendientes.length}
				{#each citasPendientes as cita}
					<div class="card-cita">
						<h3>Cita #{cita.id}</h3>
						<p><strong>Barbero:</strong> {cita.nombreBarbero}</p>
						<p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
						<p><strong>Hora:</strong> {formatearHora(cita.hora)}</p>
						<p>
							<strong>Estado:</strong>
							<span class="estado {cita.estado.toLowerCase()}">{cita.estado}</span>
						</p>
					</div>
				{/each}
			{:else}
				<p>No tienes citas pendientes.</p>
			{/if}
		</div>

		<div class="bloque-citas">
			<h2 class="titulo-seccion">✅ Historial (Realizadas / Canceladas)</h2>
			{#if citasPasadas.length}
				{#each citasPasadas as cita}
					<div class="card-cita {cita.estado.toLowerCase()}">
						<h3>Cita #{cita.id}</h3>
						<p><strong>Barbero:</strong> {cita.nombreBarbero}</p>
						<p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
						<p><strong>Hora:</strong> {formatearHora(cita.hora)}</p>
						<p>
							<strong>Estado:</strong>
							<span class="estado {cita.estado.toLowerCase()}">{cita.estado}</span>
						</p>
					</div>
				{/each}
			{:else}
				<p>No tienes citas en tu historial.</p>
			{/if}
		</div>
	</section>
{/if}

<style>
	.contenedor-historial {
		max-width: 900px;
		margin: auto;
		padding: 2rem;
		color: white;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
	.bloque-citas {
		background-color: #2f2f2f;
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
	}
	.titulo-seccion {
		margin-bottom: 1rem;
		color: #c0a080;
	}
	.card-cita {
		background-color: #3a3a3a;
		border-left: 6px solid #c0a080;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 10px;
	}
	.card-cita.realizada {
		border-left: 6px solid #888;
		opacity: 0.8;
	}
	.card-cita h3 {
		margin: 0 0 0.5rem;
		color: #c0a080;
	}
</style>
