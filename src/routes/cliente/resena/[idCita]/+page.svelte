<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore.js';
	import { get } from 'svelte/store';
	import '$lib/Styles/Global.css'; // Estilos globales que puedas necesitar

	// --- Datos del componente ---
	const idCita = $page.params.idCita; // Obtenemos el ID de la cita desde la URL
	const usuario = get(authStore).usuario;

	// --- Estado del formulario ---
	let comentario = '';
	let calificacion = 5;
	let error = null;
	let cargando = false;

	// --- Datos de la cita (Opcional pero recomendado para dar contexto) ---
	let citaInfo = null;
	let cargandoCita = true;

	onMount(async () => {
		// Opcional: Cargar los datos de la cita para mostrarlos en la página
		try {
			const response = await fetch(`http://54.197.147.238:8080/api/citas/${idCita}`, {
				headers: { Authorization: `Bearer ${usuario.token}` }
			});
			if (!response.ok) throw new Error('No se pudo cargar la información de la cita.');
			citaInfo = await response.json();
		} catch (e) {
			error = e.message;
		} finally {
			cargandoCita = false;
		}
	});

	async function enviarResena() {
		if (!comentario.trim() || calificacion < 1) {
			error = 'Por favor escribe un comentario y selecciona una calificación.';
			return;
		}
		cargando = true;
		error = null;

		try {
			const bodyPayload = {
				idCita: Number(idCita), // El ID viene como string de la URL
				idCliente: usuario.idUsuario,
				calificacion,
				comentario
			};

			const response = await fetch('http://54.197.147.238:8080/api/resenas', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${usuario.token}`
				},
				body: JSON.stringify(bodyPayload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'No se pudo enviar la reseña');
			}

			alert('¡Gracias por tu reseña!');
			goto('/cliente/Historial'); // Redirigir de vuelta al historial
		} catch (e) {
			console.error('❌ Error enviando reseña:', e);
			error = e.message;
		} finally {
			cargando = false;
		}
	}
</script>

<main class="contenedor-resena">
	<h1>Deja tu Reseña</h1>

	{#if cargandoCita}
		<p>Cargando información de la cita...</p>
	{:else if citaInfo}
		<div class="info-cita">
			<p>
				Estás dejando una reseña para tu cita del <strong>{citaInfo.fecha}</strong> a las
				<strong>{citaInfo.hora.substring(0, 5)}</strong>
				con el barbero <strong>{citaInfo.nombreBarbero}</strong>.
			</p>
		</div>
	{/if}

	<div class="formulario-resena">
		<label for="calificacion">Calificación:</label>
		<select bind:value={calificacion} id="calificacion" disabled={cargando}>
			<option value="5">⭐⭐⭐⭐⭐</option>
			<option value="4">⭐⭐⭐⭐</option>
			<option value="3">⭐⭐⭐</option>
			<option value="2">⭐⭐</option>
			<option value="1">⭐</option>
		</select>

		<label for="comentario">Comentario:</label>
		<textarea
			id="comentario"
			bind:value={comentario}
			rows="4"
			placeholder="¿Qué te pareció el servicio?"
			disabled={cargando}
		></textarea>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<div class="acciones">
			<button on:click={() => goto('/cliente/Historial')} class="btn cancelar" disabled={cargando}>
				Cancelar
			</button>
			<button on:click={enviarResena} class="btn enviar" disabled={cargando}>
				{#if cargando}
					Enviando...
				{:else}
					Enviar Reseña
				{/if}
			</button>
		</div>
	</div>
</main>

<style>
	.contenedor-resena {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #1e1e1e;
		border-radius: 10px;
		color: white;
	}
	.info-cita {
		background-color: #2f2f2f;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border-left: 4px solid #c0a080;
	}
	h1 {
		color: #c0a080;
		text-align: center;
		margin-bottom: 2rem;
	}
	label {
		display: block;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	select,
	textarea {
		width: 100%;
		padding: 0.8rem;
		border-radius: 6px;
		border: none;
		background-color: #333;
		color: white;
		font-size: 1rem;
	}
	.acciones {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}
	.btn {
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
	}
	.btn.cancelar {
		background-color: #555;
		color: white;
	}
	.btn.enviar {
		background-color: #007bff;
		color: white;
	}
	.btn:disabled {
		background-color: #444;
		cursor: not-allowed;
	}
	.error {
		color: #f44336;
		margin-top: 1rem;
		text-align: center;
	}
</style>
