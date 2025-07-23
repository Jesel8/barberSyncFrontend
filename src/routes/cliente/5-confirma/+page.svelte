<script>
	import '$lib/styles/Global.css';
	import '$lib/styles/nav.css';
	import '$lib/styles/pasos.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { citaStore } from '$lib/stores/citaStore.js';
	import { authStore } from '$lib/stores/authStore.js';
	import { crearCita } from '$lib/api/citas.js';
	import { get } from 'svelte/store';

	let reserva = get(citaStore);
	let usuarioLogueado = get(authStore).usuario;

	let precioTotal = 0;
	let error = null;
	let isSubmitting = false;

	onMount(() => {
		console.log('📦 Datos reserva:', reserva);
		console.log('👤 Usuario logueado:', usuarioLogueado);

		if (
			!reserva.barberoSeleccionado ||
			!reserva.serviciosSeleccionados?.length ||
			!reserva.fechaSeleccionada ||
			!reserva.horaSeleccionada ||
			!usuarioLogueado?.idUsuario // ✅ CAMBIO CLAVE
		) {
			alert('Faltan datos para la cita o no se ha iniciado sesión. Serás redirigido.');
			goto('/cliente/2-SelectBarbero');
			return;
		}

		precioTotal = reserva.serviciosSeleccionados.reduce((sum, s) => sum + s.precio, 0);
	});

	async function handleConfirmarCita() {
		isSubmitting = true;
		error = null;
		try {
			const payload = {
				idCliente: usuarioLogueado.idUsuario, // ✅ CAMBIO CLAVE
				idBarbero: reserva.barberoSeleccionado.id,
				estadoCitaId: 1,
				fecha: reserva.fechaSeleccionada,
				hora: reserva.horaSeleccionada,
				idServicios: reserva.serviciosSeleccionados.map((s) => s.id)
			};

			console.log('📤 Enviando payload:', payload);

			const citaCreada = await crearCita(payload);
			alert(`¡Tu cita ha sido confirmada con éxito! ID de Cita: ${citaCreada.id}`);
			citaStore.reset();
			goto('/cliente/Historial');
		} catch (e) {
			error = e.message || 'Ocurrió un error inesperado al confirmar la cita.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<main class="contenedor-principal">
				<nav class="top">
		<div class="logo">
			<a href="/cliente/panel">
				<!-- Hacemos el logo un enlace al panel -->
				<img src="/assets/images/logo blanco.png" alt="Logo BarberSync" />
			</a>
		</div>
	</nav>
	<h1 class="titulo-panel">Confirma tu Cita</h1>
		<div class="barra-progreso-container">
		<div class="barra-etiquetas">
			<span>Barberos</span>
			<span>Servicios</span>
			<span >Fecha y Hora</span>
			<span class="activo">Completado</span>
		</div>
		<div class="barra-fondo">
			<div class="barra-avance paso-4"></div>
		</div>
	</div>

	{#if reserva.barberoSeleccionado}
		<div class="contenedor-resumen">
			<div class="caja">
				<h2>👨‍🔧 Profesional</h2>
				<p><strong>{reserva.barberoSeleccionado.nombreCompleto}</strong></p>
			</div>
			<div class="caja">
				<h2>💈 Servicios</h2>
				<ul>
					{#each reserva.serviciosSeleccionados as servicio}
						<li>
							<span>{servicio.nombre}</span>
							<span>
								{servicio.precio.toLocaleString('es-MX', {
									style: 'currency',
									currency: 'MXN'
								})}
							</span>
						</li>
					{/each}
				</ul>
				<div class="total">
					<span>Precio Total:</span>
					<strong>
						{precioTotal.toLocaleString('es-MX', {
							style: 'currency',
							currency: 'MXN'
						})}
					</strong>
				</div>
			</div>
			<div class="caja">
				<h2>📅 Fecha y Hora</h2>
				<p>
					<strong>{reserva.fechaSeleccionada}</strong> a las
					<strong>{reserva.horaSeleccionada?.substring(0, 5)}</strong>
				</p>
			</div>

			{#if error}
				<p class="error-message">{error}</p>
			{/if}

			<div class="boton-confirmar">
				<button on:click={handleConfirmarCita} disabled={isSubmitting}>
					{isSubmitting ? 'Confirmando...' : 'Confirmar Cita'}
				</button>
			</div>
		</div>
	{:else}
		<p style="text-align: center; color: #ccc;">Cargando resumen de la cita...</p>
	{/if}
</main>

<style>
		.titulo-panel {
		text-align: center;
		font-size: 2.5rem;
		margin-top: 4rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	h1 {
		text-align: center;
		color: #cfa980;
		font-size: 3rem;
		margin-bottom: 2rem;
	}
	.paso-indicador {
		color: #cfa980;
		font-weight: bold;
		margin-bottom: 1rem;
	}
	.contenedor-resumen {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.caja {
		background-color: #1f1f1f;
		border-radius: 8px;
		padding: 1rem 1.5rem;
	}
	.caja h2 {
		color: #cfa980;
		margin-bottom: 0.5rem;
	}
	.caja ul {
		list-style: none;
		padding: 0;
	}
	.caja li {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}
	.total {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
		font-weight: bold;
	}
	.boton-confirmar {
		text-align: center;
	}
	.boton-confirmar button {
		background-color: #cfa980;
		color: black;
		padding: 1rem 2rem;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-size: 1.2rem;
		font-weight: bold;
		width: 100%;
	}
	.boton-confirmar button:disabled {
		background-color: #666;
		cursor: not-allowed;
	}
	.error-message {
		color: #ff6b6b;
		font-weight: bold;
		text-align: center;
	}
</style>
