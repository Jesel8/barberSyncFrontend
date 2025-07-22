<script>
	import { createEventDispatcher, onMount } from 'svelte';
	console.log('📦 Modal cargado correctamente'); // 👈 Prueba
	import { authStore } from '$lib/stores/authStore.js'; // ✅ 1. Importar el store
	import { get } from 'svelte/store'; // ✅ 2. Importar 'get' para leer el store

	const dispatch = createEventDispatcher();

	export let idCita;

	// --- Obtenemos los datos del usuario logueado ---
	const usuario = get(authStore).usuario; // ✅ 3. Leer los datos del usuario

	let comentario = '';
	let calificacion = 5; // Renombrado de 'estrellas' para consistencia con el backend
	let error = null;
	let cargando = false;

	async function enviarResena() {
		if (!comentario.trim() || calificacion < 1) {
			error = 'Por favor escribe un comentario y selecciona una calificación.';
			return;
		}

		cargando = true;
		error = null;

		try {
			// Asumiendo que tu endpoint de reseñas necesita saber quién la envía
			const bodyPayload = {
				idCita,
				idCliente: usuario.idUsuario, // Es buena práctica enviar el ID del cliente
				calificacion, // Usamos la variable renombrada
				comentario
			};

			const response = await fetch('http://localhost:8080/api/resenas', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// ✅ 4. AÑADIR EL HEADER DE AUTORIZACIÓN
					Authorization: `Bearer ${usuario.token}`
				},
				body: JSON.stringify(bodyPayload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					message: 'Error al enviar la reseña. El servidor no respondió correctamente.'
				}));
				throw new Error(errorData.message || 'No se pudo enviar la reseña');
			}

			dispatch('resenaEnviada', { idCita });
		} catch (e) {
			console.error('❌ Error enviando reseña:', e);
			error = e.message;
		} finally {
			cargando = false;
		}
	}

	function cerrar() {
		dispatch('close');
	}

	// Opcional: Cerrar con la tecla Escape
	onMount(() => {
		const handleKeydown = (e) => e.key === 'Escape' && cerrar();
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
	console.log('📦 ResenaModal montado con ID:', idCita);
</script>

<!-- Tu HTML puede permanecer casi igual, solo cambia 'estrellas' por 'calificacion' -->
<div class="modal" on:click|self={cerrar}>
	<div class="modal">
		<h2>Deja tu Reseña</h2>

		<label for="calificacion">Calificación:</label>
		<select bind:value={calificacion} id="calificacion">
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
		></textarea>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<div class="acciones">
			<button on:click={cerrar} class="btn cancelar" disabled={cargando}>Cancelar</button>
			<button on:click={enviarResena} class="btn enviar" disabled={cargando}>
				{#if cargando}
					Enviando...
				{:else}
					Enviar Reseña
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	/*
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
	*/
	.modal {
		background-color: #1e1e1e;
		padding: 2rem;
		border-radius: 10px;
		width: 90%;
		max-width: 500px;
		color: white;
	}

	h2 {
		margin-top: 0;
		color: #c0a080;
	}

	label {
		display: block;
		margin-top: 1rem;
		margin-bottom: 0.3rem;
	}

	select,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border-radius: 6px;
		border: none;
		background-color: #333;
		color: white;
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
	}

	.btn.cancelar {
		background-color: #555;
	}

	.btn.enviar {
		background-color: #007bff;
		color: white;
	}

	.btn.enviar:disabled {
		background-color: #444;
		cursor: wait;
	}

	.error {
		color: #f44336;
		margin-top: 0.5rem;
	}
</style>
