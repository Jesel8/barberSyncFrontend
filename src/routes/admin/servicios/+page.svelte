<!-- src/routes/servicios/+page.svelte -->

<script>
	import { onMount } from 'svelte';
	import {
		getServicios,
		createServicio,
		updateServicio,
		deleteServicio
	} from '$lib/api/servicioApi';

	// --- ESTADO DEL COMPONENTE ---
	let servicios = [];
	let formServicio = {
		id: null,
		nombre: '',
		descripcion: '',
		precio: null, // Usar null para que el input numérico aparezca vacío
		duracionMinuto: 30
	};
	
	// Banderas para controlar la UI
	let isLoading = true;
	let isEditing = false;
	let showModal = false; // NUEVO: Controla la visibilidad del modal
	let error = null;

	// --- LÓGICA ---
	onMount(async () => {
		await cargarServicios();
	});

	async function cargarServicios() {
		try {
			error = null;
			isLoading = true;
			servicios = await getServicios();
		} catch (e) {
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	// Abre el modal para crear un nuevo servicio
	function openCreateModal() {
		resetForm();
		isEditing = false;
		showModal = true;
	}

	// Abre el modal para editar un servicio existente
	function openEditModal(servicio) {
		formServicio = { ...servicio };
		isEditing = true;
		error = null;
		showModal = true;
	}
	
	// Cierra el modal y resetea el formulario
	function closeModal() {
		showModal = false;
		resetForm();
	}

	async function handleSubmit() {
		try {
			error = null;
			// Prepara los datos para enviar (asegurándose de que los números sean números)
			const payload = {
				...formServicio,
				precio: parseFloat(formServicio.precio),
				duracionMinuto: parseInt(formServicio.duracionMinuto)
			};

			if (isEditing) {
				const servicioActualizado = await updateServicio(payload.id, payload);
				const index = servicios.findIndex(s => s.id === payload.id);
				servicios[index] = servicioActualizado;
			} else {
				const nuevoServicio = await createServicio(payload);
				servicios = [...servicios, nuevoServicio];
			}
			closeModal(); // Cierra el modal al tener éxito
		} catch (e) {
			error = e.message;
		}
	}

	async function handleEliminar(id, nombre) {
		if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${nombre}"?`)) {
			try {
				error = null;
				await deleteServicio(id);
				servicios = servicios.filter(s => s.id !== id);
			} catch (e) {
				// Mostramos el error directamente en la página, ya que el modal no está abierto
				alert(e.message);
			}
		}
	}

	function resetForm() {
		formServicio = { id: null, nombre: '', descripcion: '', precio: null, duracionMinuto: 30 };
		error = null;
	}
</script>

<!-- --- ESTRUCTURA HTML --- -->
<main>
	<h1>Gestión de Servicios</h1>

	<div class="acciones-globales">
		<button class="boton-agregar" on:click={openCreateModal}>
			+ Agregar Servicio
		</button>
	</div>
	
	{#if isLoading}
		<p>Cargando servicios...</p>
	{:else if servicios.length === 0 && !error}
		<p>No hay servicios registrados. ¡Agrega el primero!</p>
	{:else if error && servicios.length === 0}
		<p class="error-message">{error}</p>
	{:else}
		<table class="tabla-servicios">
			<thead>
				<tr>
					<th>Nombre</th>
					<th>Descripción</th>
					<th>Precio</th>
					<th>Duración</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each servicios as servicio (servicio.id)}
					<tr>
						<td>{servicio.nombre}</td>
						<td>{servicio.descripcion || '-'}</td>
						<td>{servicio.precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
						<td>{servicio.duracionMinuto} min</td>
						<td class="acciones-celda">
							<button class="btn-accion btn-edit" on:click={() => openEditModal(servicio)}>Editar</button>
							<button class="btn-accion btn-delete" on:click={() => handleEliminar(servicio.id, servicio.nombre)}>Eliminar</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

</main>

<!-- --- MODAL PARA CREAR/EDITAR --- -->
{#if showModal}
	<div class="modal" on:click|self={closeModal}>
		<div class="modal-content">
			<h2>{isEditing ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h2>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="nombre">Nombre del Servicio</label>
					<input id="nombre" type="text" bind:value={formServicio.nombre} required />
				</div>
				
				<div class="form-group">
					<label for="descripcion">Descripción (Opcional)</label>
					<textarea id="descripcion" bind:value={formServicio.descripcion} rows="3"></textarea>
				</div>

				<div class="form-group">
					<label for="precio">Precio ($)</label>
					<input id="precio" type="number" step="0.01" min="1" bind:value={formServicio.precio} required />
				</div>

				<div class="form-group">
					<label for="duracion">Duración (minutos)</label>
					<input id="duracion" type="number" min="5" step="5" bind:value={formServicio.duracionMinuto} required />
				</div>

				{#if error}
					<p class="error-message">{error}</p>
				{/if}

				<div class="modal-actions">
					<button type="button" class="boton-gestionar" on:click={closeModal}>Cancelar</button>
					<button type="submit" class="boton-agregar">
						{isEditing ? 'Actualizar' : 'Guardar'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- --- ESTILOS --- -->
<style>
	:global(body) {
		background-color: #1a1a1a;
		color: #f0f0f0;
		font-family: sans-serif;
	}

	main {
		max-width: 960px;
		margin: 2rem auto;
		padding: 1rem;
	}

	h1 {
		color: #c0a080;
		text-align: center;
		margin-bottom: 2rem;
		border-bottom: 2px solid #c0a080;
		padding-bottom: 1rem;
	}

	.acciones-globales {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1.5rem;
	}

	.boton-agregar {
		background-color: #c0a080;
		color: black;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
		transition: transform 0.2s;
	}
	.boton-agregar:hover {
		transform: scale(1.05);
	}
	
	.boton-gestionar {
		background-color: #4a4a4a;
		color: white;
		padding: 0.75rem 1.5rem;
		border: 1px solid #c0a080;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
		transition: background-color 0.2s;
	}
	.boton-gestionar:hover {
		background-color: #5a5a5a;
	}

	.tabla-servicios {
		width: 100%;
		border-collapse: collapse;
		background-color: #252525;
		border-radius: 8px;
		overflow: hidden;
	}
	.tabla-servicios th,
	.tabla-servicios td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #444;
		color: white;
	}
	.tabla-servicios th {
		background-color: #1f1f1f;
		color: #c0a080;
		font-size: 1.1rem;
	}
	.tabla-servicios tbody tr:hover {
		background-color: #333;
	}
	.acciones-celda {
		display: flex;
		gap: 0.75rem;
	}

	.btn-accion {
		background: none;
		border: 1px solid;
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.2s;
	}
	.btn-edit {
		color: #c0a080;
		border-color: #c0a080;
	}
	.btn-edit:hover {
		background-color: #c0a080;
		color: black;
	}
	.btn-delete {
		color: #ff6b6b;
		border-color: #ff6b6b;
	}
	.btn-delete:hover {
		background-color: #ff6b6b;
		color: black;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}
	.modal-content {
		background: #2f2f2f;
		padding: 2rem;
		border-radius: 12px;
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		border: 1px solid #c0a080;
	}
	.modal-content h2 {
		margin-top: 0;
		color: #c0a080;
		text-align: center;
	}
	
	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: #ccc;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem;
		border-radius: 6px;
		border: 1px solid #555;
		background: #444;
		color: white;
		font-size: 1rem;
	}
	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #c0a080;
	}
	
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}
	
	.error-message {
		color: #ff6b6b;
		background-color: rgba(255, 107, 107, 0.1);
		border: 1px solid #ff6b6b;
		padding: 1rem;
		border-radius: 6px;
		margin-top: 1rem;
		text-align: center;
	}
</style>