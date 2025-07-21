<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore.js';
	import { get } from 'svelte/store';
	import ResenaModal from '$lib/components/ResenaModal.svelte';
	import '$lib/Styles/Global.css';
	import '$lib/Styles/nav.css';

	let citasPendientes = [];
	let citasPasadas = [];
	let cargando = true;
	let error = null;

	let citaParaResenar = null;
	let mostrarModal = false;

	const usuario = get(authStore).usuario;

	onMount(async () => {
		if (!usuario?.idUsuario || !usuario.token) {
			alert('No se ha iniciado sesión. Redirigiendo...');
			window.location.href = '/';
			return;
		}

		try {
			const response = await fetch(`http://localhost:8080/api/citas/cliente/${usuario.idUsuario}`, {
				headers: {
					Authorization: `Bearer ${usuario.token}`
				}
			});

			if (!response.ok) throw new Error('Fallo al obtener citas del cliente');
			const data = await response.json();

			citasPendientes = data.filter(
				(cita) => cita.estado === 'Pendiente' || cita.estado === 'Confirmada'
			);

			citasPasadas = data.filter(
				(cita) => cita.estado === 'Realizada' || cita.estado === 'Cancelada'
			);
		} catch (e) {
			console.error('❌ Error al cargar citas:', e);
			error = 'No se pudo cargar tu historial de citas.';
		} finally {
			cargando = false;
		}
	});

	function abrirModalResena(idCita) {
		citaParaResenar = idCita;
		mostrarModal = true;
	}

	function cerrarModal() {
		mostrarModal = false;
		citaParaResenar = null;
	}

	function handleResenaEnviada(event) {
		const idCitaEnviada = event.detail.idCita;
		citasPasadas = citasPasadas.map((cita) => {
			if (cita.id === idCitaEnviada) {
				return { ...cita, tieneResena: true };
			}
			return cita;
		});
		cerrarModal();
	}

	function formatearFecha(fecha) {
		const f = new Date(fecha + 'T00:00:00');
		return f.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
	}

	function formatearHora(hora) {
		return hora.substring(0, 5);
	}
</script>

<nav class="top">
	<!-- Tu navegación -->
</nav>

<h1 class="titulo-panel">Historial de Citas</h1>

{#if cargando}
	<p>Cargando tus citas...</p>
{:else if error}
	<p>{error}</p>
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
					<!-- Bloque de depuración para inspeccionar cada cita -->
					<div style="background: #111; padding: 5px; margin-bottom: 5px; border: 1px solid red;">
						<p>Debug Cita #{cita.id}</p>
						<p>Estado desde API: "{cita.estado}"</p>
						<p>¿Condición se cumple?: {cita.estado === 'Realizada' && !cita.tieneResena}</p>
					</div>

					<div class="card-cita {cita.estado.toLowerCase()}">
						<!-- ... el resto del contenido de tu card ... -->
						<h3>Cita #{cita.id}</h3>
						<p><strong>Barbero:</strong> {cita.nombreBarbero}</p>
						<p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
						<p><strong>Hora:</strong> {formatearHora(cita.hora)}</p>
						<p>
							<strong>Estado:</strong>
							<span class="estado {cita.estado.toLowerCase()}">{cita.estado}</span>
						</p>

						{#if cita.estado === 'Realizada' && !cita.tieneResena}
							<button class="btn-resena" on:click={() => abrirModalResena(cita.id)}>
								Dejar Reseña
							</button>
						{:else if cita.tieneResena}
							<p class="resena-enviada">¡Gracias por tu reseña!</p>
						{/if}
					</div>
				{/each}
			{:else}
				<p>No tienes citas en tu historial.</p>
			{/if}
		</div>
	</section>
{/if}

{#if mostrarModal}
	<ResenaModal
		idCita={citaParaResenar}
		on:close={cerrarModal}
		on:resenaEnviada={handleResenaEnviada}
	/>
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
	.estado.realizada {
		color: #28a745;
	}
	.estado.cancelada {
		color: #dc3545;
	}
	.btn-resena {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 10px;
		transition: background-color 0.3s;
	}
	.btn-resena:hover {
		background-color: #0056b3;
	}
	.resena-enviada {
		margin-top: 10px;
		font-style: italic;
		color: #28a745;
	}
</style>
