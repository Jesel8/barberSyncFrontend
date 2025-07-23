<script>
	import { onMount } from 'svelte';
	// 👇 CAMBIO CLAVE: Importamos desde el nuevo archivo de API corregido
	import {
		getServicios,
		createServicio,
		updateServicio,
		deleteServicio
	} from '$lib/api/servicios.js'; // Asegúrate de que el nombre del archivo coincida

	// --- ESTADO DEL COMPONENTE ---
	let servicios = [];
	let formServicio = {
		id: null,
		nombre: '',
		descripcion: '',
		precio: null,
		duracionMinuto: 30
	};

	let isLoading = true;
	let isEditing = false;
	let showModal = false;
	let error = null;

	// --- ESTADO PARA LA NAVBAR (AÑADIDO) ---
	let isAuthorized = true; // Asumimos que el usuario está autorizado
	let usuario = { nombre: 'Admin' }; // Objeto de usuario de ejemplo

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
			console.error('Error al cargar servicios:', e);
			error = e.message;
		} finally {
			isLoading = false;
		}
	}

	function openCreateModal() {
		resetForm();
		isEditing = false;
		showModal = true;
	}

	function openEditModal(servicio) {
		formServicio = { ...servicio };
		isEditing = true;
		error = null;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		resetForm();
	}

	async function handleSubmit() {
		try {
			error = null;
			const payload = {
				...formServicio,
				precio: parseFloat(formServicio.precio),
				duracionMinuto: parseInt(formServicio.duracionMinuto)
			};

			if (isEditing) {
				const servicioActualizado = await updateServicio(payload.id, payload);
				servicios = servicios.map((s) => (s.id === payload.id ? servicioActualizado : s));
			} else {
				const nuevoServicio = await createServicio(payload);
				servicios = [...servicios, nuevoServicio];
			}
			closeModal();
		} catch (e) {
			console.error('Error en el formulario:', e);
			error = e.message;
		}
	}

	async function handleEliminar(id, nombre) {
		if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${nombre}"?`)) {
			try {
				await deleteServicio(id);
				servicios = servicios.filter((s) => s.id !== id);
			} catch (e) {
				console.error('Error al eliminar:', e);
				alert(`No se pudo eliminar el servicio: ${e.message}`);
			}
		}
	}

	function resetForm() {
		formServicio = { id: null, nombre: '', descripcion: '', precio: null, duracionMinuto: 30 };
		error = null;
	}

	// --- FUNCIÓN PARA NAVBAR (AÑADIDO) ---
	function cerrarSesion() {
		// Aquí iría tu lógica real para cerrar sesión
		isAuthorized = false;
		console.log('Cerrando sesión...');
		// Por ejemplo: window.location.href = '/login';
	}
</script>

<!-- --- ESTRUCTURA HTML --- -->

<!-- === NAVBAR AÑADIDA === -->
<nav class="top">
	<!-- Este label es para un posible menú lateral que se activa con un checkbox -->
	<label for="menu-toggle" class="menu-icon">
		<img src="/src/static/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>

	<div class="logo">
		<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
	</div>

	<div class="salir">
		<!-- Este enlace redirige al usuario, cerrando su sesión de forma efectiva -->
		<a href="/admin/1-paneladmin" title="Cerrar Sesión">
			<img src="/src/static/assets/icons/Salir.svg" alt="Cerrar Sesión" />
		</a>
	</div>
</nav>
```

<main>
	<h1>Gestión de Servicios</h1>

	<div class="acciones-globales">
		<button class="boton-agregar" on:click={openCreateModal}> + Agregar Servicio </button>
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
						<td
							>{servicio.precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td
						>
						<td>{servicio.duracionMinuto} min</td>
						<td class="acciones-celda">
							<button class="btn-accion btn-edit" on:click={() => openEditModal(servicio)}
								>Editar</button
							>
							<button
								class="btn-accion btn-delete"
								on:click={() => handleEliminar(servicio.id, servicio.nombre)}>Eliminar</button
							>
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
					<input
						id="precio"
						type="number"
						step="0.01"
						min="1"
						bind:value={formServicio.precio}
						required
					/>
				</div>

				<div class="form-group">
					<label for="duracion">Duración (minutos)</label>
					<input
						id="duracion"
						type="number"
						min="5"
						step="5"
						bind:value={formServicio.duracionMinuto}
						required
					/>
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
{/if}```

<!-- --- ESTILOS --- -->
<style>
	:global(body) {
		background-color: #1a1a1a;
		color: #f0f0f0;
		font-family: sans-serif;
	}

	/* --- ESTILOS DE NAVBAR AÑADIDOS --- */
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
	}

	.logo img {
		height: 50px;
		vertical-align: middle; /* Para alinear mejor la imagen */
	}

	.menu-icon,
	.salir {
		display: flex;
		align-items: center;
	}

	.menu-icon img,
	.salir img {
		height: 24px; /* O el tamaño que prefieras para los iconos */
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.menu-icon:hover img,
	.salir a:hover img {
		opacity: 0.8;
	}

	/* Opcional: Escondemos el menú-icon en pantallas grandes si solo es para móvil */
	@media (min-width: 768px) {
		.menu-icon {
			display: none;
		}
	}
	.usuario-nombre {
		color: #ccc;
		font-weight: bold;
	}

	.boton-logout {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: transparent;
		color: #ff6b6b;
		border: 1px solid #ff6b6b;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.2s ease;
	}
	.boton-logout:hover {
		background-color: #ff6b6b;
		color: black;
	}
	.boton-logout img {
		height: 18px;
		filter: invert(50%) sepia(13%) saturate(3207%) hue-rotate(315deg) brightness(95%) contrast(80%); /* Para colorear el SVG si es necesario */
	}
	.boton-logout:hover img {
		filter: invert(0);
	}
	/* --- FIN DE ESTILOS DE NAVBAR --- */

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
		flex-direction: row;
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.boton-agregar {
		width: 200px;
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
		transform: scale(1.15);
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
