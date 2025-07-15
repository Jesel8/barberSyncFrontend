<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { citaStore } from '$lib/stores/citaStore.js';
	import { obtenerDisponibilidad } from '$lib/api/citas.js';

	let horariosDisponibles = [];
	let fechaInput = new Date().toISOString().split('T')[0];
	let isLoading = true;
	let error = null;

	// REACTIVIDAD CORRECTA
	$: datosCita = $citaStore;

	onMount(async () => {
		if (!datosCita.barberoSeleccionado || !datosCita.serviciosSeleccionados?.length) {
			alert('No has seleccionado un barbero o servicios. Serás redirigido.');
			goto('/cliente/2-SelectBarbero');
			return;
		}
		await buscarHorarios();
	});

	async function buscarHorarios() {
		isLoading = true;
		error = null;
		horariosDisponibles = [];

		try {
			const [year, month, day] = fechaInput.split('-').map(Number);
			const fechaParaAPI = new Date(year, month - 1, day);
			const idsDeServicios = datosCita.serviciosSeleccionados.map((s) => s.id);

			horariosDisponibles = await obtenerDisponibilidad(
				datosCita.barberoSeleccionado.id,
				fechaParaAPI,
				idsDeServicios
			);
		} catch (e) {
			console.error(e);
			error = 'No se pudo cargar la disponibilidad para esta fecha.';
		} finally {
			isLoading = false;
		}
	}

	function seleccionarHorario(hora) {
		citaStore.seleccionarFechaHora(fechaInput, hora);
		goto('/cliente/5-confirma');
	}
</script>

<main class="contenedor-principal">
	<div class="info-reserva">
		<!-- Mostramos los datos directamente del store reactivo -->
		Reservando con <strong>{$citaStore.barberoSeleccionado?.nombreCompleto}</strong>
		<span>
			Duración total:
			<strong>
				<!-- Calculamos la duración total directamente en el HTML. El '|| 0' evita errores si el array está vacío. -->
				{$citaStore.serviciosSeleccionados?.reduce((sum, s) => sum + s.duracionMinuto, 0) || 0} min
			</strong>
		</span>
	</div>
	<div class="paso-indicador">Paso 3 de 4</div>
	<h1>Elige Fecha y Hora</h1>

	<div class="selector-fecha">
		<label for="fecha">Selecciona una fecha:</label>
		<input
			type="date"
			id="fecha"
			bind:value={fechaInput}
			on:change={buscarHorarios}
			min={new Date().toISOString().split('T')[0]}
		/>
	</div>

	<!-- CÓDIGO CORRECTO -->
	<div class="area-horarios">
		{#if isLoading}
			<!-- <-- ¡EL CAMBIO! -->
			<div class="spinner"></div>
		{:else if error}
			<p class="error-message">{error}</p>
		{:else if horariosDisponibles.length > 0}
			<div class="grid-horarios">
				{#each horariosDisponibles as hora (hora)}
					<button class="boton-hora" on:click={() => seleccionarHorario(hora)}>
						{hora.substring(0, 5)}
					</button>
				{/each}
			</div>
		{:else}
			<p class="mensaje-vacio">No hay horarios disponibles para esta fecha.</p>
		{/if}
	</div>
</main>

<!-- El bloque <style> se mantiene exactamente igual que el que ya tienes. Cópialo y pégalo aquí. -->
<style>
	.contenedor-principal {
		max-width: 700px;
		margin: 2rem auto;
		padding: 2rem;
	}
	.info-reserva {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background-color: #252525;
		border-radius: 8px;
		color: #ccc;
	}
	.paso-indicador,
	h1 {
		text-align: center;
	}
	.paso-indicador {
		color: #c0a080;
		font-weight: bold;
	}
	h1 {
		color: #f0f0f0;
		margin-bottom: 2rem;
	}
	.selector-fecha {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}
	.selector-fecha label {
		font-weight: bold;
		color: #ccc;
	}
	input[type='date'] {
		background-color: #2f2f2f;
		color: white;
		border: 1px solid #c0a080;
		padding: 0.75rem;
		border-radius: 8px;
		font-size: 1.1rem;
		width: 220px;
		text-align: center;
	}
	.area-horarios {
		min-height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1f1f1f;
		padding: 2rem;
		border-radius: 8px;
	}
	.grid-horarios {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1rem;
		width: 100%;
	}
	.boton-hora {
		background-color: #333;
		color: #c0a080;
		border: 1px solid #c0a080;
		padding: 0.75rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1.1rem;
		transition: all 0.2s;
	}
	.boton-hora:hover {
		background-color: #c0a080;
		color: black;
		transform: scale(1.05);
	}
	.mensaje-vacio {
		text-align: center;
		color: #aaa;
	}
	.error-message {
		color: #ff6b6b;
		font-weight: bold;
	}
	.spinner {
		margin: 0 auto;
		width: 40px;
		height: 40px;
		border: 4px solid #444;
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
