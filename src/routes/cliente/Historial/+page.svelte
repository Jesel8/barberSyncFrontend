<script>
	import '$lib/styles/Global.css';
	import '$lib/styles/nav.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation'; // ✅ Navegación a página de reseña
	import { authStore } from '$lib/stores/authStore.js';
	// Nota: Has importado Global.css y nav.css dos veces, Svelte lo manejará, pero puedes borrar las duplicadas.
	// import '$lib/Styles/Global.css';
	// import '$lib/Styles/nav.css';

	let citasPendientes = [];
	let citasPasadas = [];
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

	function irAResena(idCita) {
		goto(`/cliente/resena/${idCita}`);
	}

	function formatearFecha(fecha) {
		const f = new Date(fecha + 'T00:00:00');
		return f.toLocaleDateString('es-MX', {
			weekday: 'long',
			day: 'numeric',
			month: 'short'
		});
	}

	function formatearHora(hora) {
		return hora.substring(0, 5);
	}
</script>

<!-- === NAVBAR ESTÁNDAR PARA USUARIO LOGUEADO (CORREGIDA) === -->
<nav class="top">
	<label for="menu-toggle" class="menu-icon">
		<!-- ✅ CORREGIDO: Ruta de icono estándar -->
		<img src="/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>
	<div class="logo">
		<!-- ✅ CORREGIDO: Ruta de imagen estándar y enlace al panel -->
		<a href="/cliente/1-panel">
			<img src="\src\static\assets\images\logo blanco.png" alt="Logo BarberSync" />
		</a>
	</div>
	<div class="salir">
		<!-- ✅ AÑADIDO: Botón para cerrar sesión -->
		<a href="/cliente/1-panel" title="Cerrar Sesión">
			<img src="/assets/icons/return.svg" alt="Cerrar Sesión" />
		</a>
	</div>
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
					<div class="card-cita {cita.estado.toLowerCase()}">
						<h3>Cita #{cita.id}</h3>
						<p><strong>Barbero:</strong> {cita.nombreBarbero}</p>
						<p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
						<p><strong>Hora:</strong> {formatearHora(cita.hora)}</p>
						<p>
							<strong>Estado:</strong>
							<span class="estado {cita.estado.toLowerCase()}">{cita.estado}</span>
						</p>

						{#if cita.estado === 'Realizada' && !cita.tieneResena}
							<button class="btn-resena" on:click={() => irAResena(cita.id)}> Dejar Reseña </button>
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

<style>
	/* --- ESTILOS DE NAVBAR (Añadidos para consistencia) --- */
	/* NOTA: Estos estilos ya deberían estar en tu archivo nav.css,
	   pero los incluyo aquí para asegurar que se vean correctamente. */
	nav.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background-color: #1f1f1f;
		border-bottom: 1px solid #444;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		position: sticky;
		top: 0;
		z-index: 10;
		color: white; /* Añadido para herencia */
	}

	.logo img {
		height: 50px;
		vertical-align: middle;
	}

	.menu-icon,
	.salir {
		display: flex;
		align-items: center;
	}

	.menu-icon img,
	.salir img {
		height: 24px;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.menu-icon:hover img,
	.salir a:hover img {
		opacity: 0.8;
	}

	/* Ocultar el icono de menú en pantallas grandes si es solo para móvil */
	@media (min-width: 768px) {
		.menu-icon {
			display: none;
		}
	}
	/* --- FIN DE ESTILOS DE NAVBAR --- */

	.titulo-panel {
		text-align: center;
		font-size: 2.5rem;
		margin-top: 2rem; /* Reducido para mejor espacio con la navbar */
		margin-bottom: 2rem;
		font-weight: bold;
		color: #e0e0e0;
	}
	.contenedor-historial {
		max-width: 900px;
		margin: auto;
		padding: 0 2rem 2rem 2rem; /* Ajustado el padding superior */
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
		margin-top: 0; /* Asegurar que no haya margen extra */
		margin-bottom: 1.5rem;
		color: #c0a080;
		border-bottom: 1px solid #444;
		padding-bottom: 0.75rem;
	}
	.card-cita {
		background-color: #3a3a3a;
		border-left: 6px solid #c0a080;
		padding: 1.25rem;
		margin-bottom: 1rem;
		border-radius: 10px;
	}
	.card-cita.realizada {
		border-left-color: #888;
		opacity: 0.8;
	}
	.card-cita.cancelada {
		border-left-color: #dc3545;
		opacity: 0.7;
	}
	.card-cita h3 {
		margin: 0 0 0.5rem;
		color: #c0a080;
	}
	.card-cita p {
		margin: 0.5rem 0;
	}
	.estado {
		font-weight: bold;
	}
	.estado.confirmada {
		color: #28a745;
	}
	.estado.pendiente {
		color: #ffc107;
	}
	.estado.realizada {
		color: #6c757d;
	}
	.estado.cancelada {
		color: #dc3545;
	}

	.btn-resena {
		background-color: #c0a080;
		color: #111;
		font-weight: bold;
		border: none;
		padding: 8px 12px;
		border-radius: 5px;
		cursor: pointer;
		margin-top: 10px;
		transition: background-color 0.3s;
	}
	.btn-resena:hover {
		background-color: #d4b090;
	}
	.resena-enviada {
		margin-top: 10px;
		font-style: italic;
		color: #28a745;
		font-weight: bold;
	}
</style>
