<script>
	import '$lib/styles/Global.css';
	import '$lib/styles/nav.css';
	import '$lib/styles/pasos.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { citaStore } from '$lib/stores/citaStore.js';
	// Ya NO importamos 'obtenerDisponibilidad' porque lo haremos aquí mismo

	let horariosDisponibles = [];
	let fechaInput = new Date().toISOString().split('T')[0];
	let isLoading = true;
	let error = null;

	$: datosCita = $citaStore;

	onMount(async () => {
		if (!datosCita.barberoSeleccionado || !datosCita.serviciosSeleccionados?.length) {
			alert('No has seleccionado un barbero o servicios. Serás redirigido.');
			goto('/cliente/2-SelectBarbero');
			return;
		}
		await buscarHorarios();
	});

	// ========================================================================
	// 👇 AQUÍ ESTÁ LA SOLUCIÓN DIRECTA Y SIN INTERMEDIARIOS 👇
	// ========================================================================
	async function buscarHorarios() {
		isLoading = true;
		error = null;
		horariosDisponibles = [];

		try {
			// 1. Preparamos los datos
			const idBarbero = datosCita.barberoSeleccionado.id;
			const idsDeServicios = datosCita.serviciosSeleccionados.map((s) => s.id);

			// Formateamos la fecha para la URL
			const [year, month, day] = fechaInput.split('-').map(Number);
			const fechaParaAPI = new Date(year, month - 1, day);
			const fechaFormateada = `${fechaParaAPI.getFullYear()}-${String(fechaParaAPI.getMonth() + 1).padStart(2, '0')}-${String(fechaParaAPI.getDate()).padStart(2, '0')}`;

			// 2. Construimos la URL con los parámetros, como funcionaba antes
			const BASE_URL = 'http://localhost:8080/api';
			const params = new URLSearchParams({ fecha: fechaFormateada });
			idsDeServicios.forEach((id) => params.append('idServicios', id));
			const url = `${BASE_URL}/disponibilidad/barbero/${idBarbero}?${params.toString()}`;

			console.log('Realizando petición a:', url); // Para depurar y ver la URL exacta

			// 3. Hacemos la llamada con FETCH NATIVO (sin apiFetch/fetcher)
			const token = localStorage.getItem('authToken'); // Obtenemos el token
			const response = await fetch(url, {
				method: 'GET', // Petición GET, la que funcionaba
				headers: {
					// Añadimos la cabecera de autorización si existe
					...(token && { Authorization: `Bearer ${token}` })
				}
			});

			// 4. Verificamos la respuesta
			if (!response.ok) {
				// Si hay un error, lo lanzamos para que lo capture el 'catch'
				const errorData = await response.text(); // Leemos el error como texto
				throw new Error(`Error ${response.status}: ${errorData}`);
			}

			// 5. Convertimos la respuesta a JSON y la asignamos
			const data = await response.json();

			// Si tu API devuelve un array de objetos {hora: "HH:MM", disponible: true/false}
			// Esto lo transformará a un array de strings ['HH:MM', ...]
			if (data && data.length > 0 && typeof data[0] === 'object') {
				horariosDisponibles = data.filter((slot) => slot.disponible).map((slot) => slot.hora);
			} else {
				// Si tu API devuelve directamente un array de strings ['09:00', '10:30']
				horariosDisponibles = data;
			}
		} catch (e) {
			console.error('Error buscando horarios (fetch nativo):', e);
			error = 'No se pudo cargar la disponibilidad para esta fecha. Revisa la consola (F12).';
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
	<nav class="top">
		<div class="logo">
			<a href="/cliente/panel">
				<!-- Hacemos el logo un enlace al panel -->
				<img src="/assets/images/logo blanco.png" alt="Logo BarberSync" />
			</a>
		</div>
	</nav>
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

	<h1 class="titulo-panel">Elige Fecha y Hora</h1>
	<div class="barra-progreso-container">
		<div class="barra-etiquetas">
			<span>Barberos</span>
			<span>Servicios</span>
			<span class="activo">Fecha y Hora</span>
			<span>Completado</span>
		</div>
		<div class="barra-fondo">
			<div class="barra-avance paso-3"></div>
		</div>
	</div>
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
	.titulo-panel {
		text-align: center;
		font-size: 2.5rem;
		margin-top: 4rem;
		margin-bottom: 1rem;
		font-weight: bold;
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
