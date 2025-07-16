<!-- +page.svelte (Refactorizado) -->
<script>
	import '$lib/styles/nav.css';
	import '$lib/styles/Global.css';
	import '$lib/styles/aside.css';
	import { onMount } from 'svelte';
	// Los imports se mantienen igual, ¡están perfectos!
	import {
		obtenerBarberos,
		crearBarbero,
		eliminarBarbero,
		obtenerEspecialidades,
		actualizarEspecialidades
	} from '$lib/api/barberos';

	import {
		obtenerEspecialidadesDisponibles,
		crearEspecialidad,
		eliminarEspecialidad
	} from '$lib/api/especialidades';

	// --- ESTADO GENERAL ---
	let usuario = null;
	let barberos = [];
	let cargando = true;
	let especialidadesDisponibles = []; // La movemos aquí para que sea accesible por ambos modales

	// --- ESTADO MODAL: CREAR BARBERO ---
	let mostrarModalCrearBarbero = false;
	let nuevoBarbero = {
		primerNombre: '',
		segundoNombre: '',
		primerApellido: '',
		segundoApellido: '',
		correo: '',
		contrasena: ''
	};

	// --- ESTADO MODAL: ASIGNAR ESPECIALIDADES (para un barbero específico) ---
	let mostrarModalAsignar = false; // Nombre más claro
	let especialidadesSeleccionadas = [];
	let barberoActual = null;

	// --- ESTADO MODAL: GESTIONAR ESPECIALIDADES GENERALES ---
	let mostrarModalGestionEspecialidades = false; // Nuevo estado para el nuevo modal
	let nuevaEspecialidad = { especialidad: '', descripcion: '' };

	// --- ESTADO MODAL: VER ESPECIALIDADES (NUEVO) ---
	let mostrarModalVer = false;
	let especialidadesDelBarbero = []; // Guardará las especialidades del barbero seleccionado

	// --- FUNCIONES ---

	async function cargarDatosIniciales() {
		try {
			cargando = true;
			// Cargamos barberos y especialidades al inicio
			[barberos, especialidadesDisponibles] = await Promise.all([
				obtenerBarberos(),
				obtenerEspecialidadesDisponibles()
			]);
		} catch (error) {
			console.error('❌ Error al cargar datos iniciales:', error);
			alert('No se pudieron cargar los datos. Revisa la consola.');
		} finally {
			cargando = false;
		}
	}

	async function crearNuevoBarbero() {
		try {
			await crearBarbero(nuevoBarbero);
			mostrarModalCrearBarbero = false;
			nuevoBarbero = {
				primerNombre: '',
				segundoNombre: '',
				primerApellido: '',
				segundoApellido: '',
				correo: '',
				contrasena: ''
			}; // Limpiar formulario
			await cargarDatosIniciales(); // Recargar todo
		} catch (error) {
			alert('Error al crear barbero');
		}
	}

	async function eliminar(id) {
		if (confirm('¿Estás seguro de eliminar este barbero?')) {
			await eliminarBarbero(id);
			await cargarDatosIniciales(); // Recargar todo
		}
	}

	// ---- LÓGICA DEL MODAL DE ASIGNACIÓN ----
	async function abrirModalAsignar(barbero) {
		barberoActual = barbero;
		mostrarModalAsignar = true;

		try {
			// Las especialidades disponibles ya las tenemos, solo buscamos las del barbero
			const actuales = await obtenerEspecialidades(barbero.id);
			const nombresActuales = actuales.especialidades.map((e) => e.especialidad); // Asumiendo que `especialidades` es un array de objetos

			// Marcamos los checkboxes correspondientes
			especialidadesSeleccionadas = especialidadesDisponibles
				.filter((e) => nombresActuales.includes(e.especialidad))
				.map((e) => e.id);
		} catch (error) {
			console.error('Error obteniendo especialidades del barbero:', error);
			especialidadesSeleccionadas = [];
		}
	}

	function toggleEspecialidad(id) {
		if (especialidadesSeleccionadas.includes(id)) {
			especialidadesSeleccionadas = especialidadesSeleccionadas.filter((e) => e !== id);
		} else {
			especialidadesSeleccionadas = [...especialidadesSeleccionadas, id];
		}
	}

	async function guardarAsignacionEspecialidades() {
		try {
			await actualizarEspecialidades(barberoActual.id, especialidadesSeleccionadas);
			mostrarModalAsignar = false;
			// Opcional: podrías recargar solo la info de ese barbero para optimizar
		} catch (error) {
			console.error('Error al guardar especialidades:', error);
			alert('Error al guardar especialidades');
		}
	}
	// ---- LÓGICA DEL NUEVO MODAL DE VISUALIZACIÓN (CON DEPURACIÓN) ----
	async function abrirModalVer(barbero) {
		barberoActual = barbero;
		mostrarModalVer = true;
		especialidadesDelBarbero = []; // Limpiamos por si acaso

		// 1. Verificamos el objeto 'barbero' que recibimos
		console.log('1. Abriendo modal para el barbero:', barbero);

		try {
			// Llamamos a la API
			const data = await obtenerEspecialidades(barbero.id);

			// 2. Imprimimos la respuesta CRUDA que nos da la API
			console.log('2. Respuesta COMPLETA de la API (data):', data);

			// Esta es la línea que sospechamos que puede estar mal
			especialidadesDelBarbero = data.especialidades;

			// 3. Verificamos qué se asignó finalmente a nuestra variable
			console.log('3. Datos asignados a especialidadesDelBarbero:', especialidadesDelBarbero);
		} catch (error) {
			console.error('Error al cargar especialidades para ver:', error);
			alert('No se pudieron cargar las especialidades de este barbero.');
		}
	}
	// ---- LÓGICA DEL NUEVO MODAL DE GESTIÓN ----
	async function abrirModalGestion() {
		// Nos aseguramos que la lista esté fresca
		especialidadesDisponibles = await obtenerEspecialidadesDisponibles();
		mostrarModalGestionEspecialidades = true;
	}

	async function guardarNuevaEspecialidad() {
		if (!nuevaEspecialidad.especialidad.trim()) {
			alert('El nombre de la especialidad no puede estar vacío.');
			return;
		}
		try {
			await crearEspecialidad(nuevaEspecialidad);
			nuevaEspecialidad = { especialidad: '', descripcion: '' }; // Limpiar form
			// Recargar la lista de especialidades para ver la nueva inmediatamente
			especialidadesDisponibles = await obtenerEspecialidadesDisponibles();
		} catch (error) {
			alert('Error al crear especialidad');
		}
	}

	async function eliminarEspecialidadConfirmada(id) {
		if (
			confirm(
				'¿Eliminar esta especialidad del catálogo general? Esto podría afectar a los barberos que la tengan.'
			)
		) {
			await eliminarEspecialidad(id);
			// Recargar la lista para que desaparezca
			especialidadesDisponibles = await obtenerEspecialidadesDisponibles();
		}
	}

	onMount(() => {
		cargarDatosIniciales();
	});
</script>

<input type="checkbox" id="menu-toggle" class="menu-toggle" />

<div class="menu">
	<div class="fotoadmin">
		<img src="/src/static/assets/icons/userfoto.svg" alt="Foto admin" />
		<p class="nombre-usuario">
			{#if usuario}
				{usuario.nombreCompleto}
			{:else}
				Cargando...
			{/if}
		</p>
	</div>
	<ul>
		<li><a href="/Admin/1-paneladmin">🏠 Inicio</a></li>
		<li><a href="/Admin/barberos">✂️ Barberos</a></li>
		<li><a href="/Admin/agendas">📅 Agendas</a></li>
		<li><a href="/Admin/servicios">💈 Servicios</a></li>
		<li><a href="/Admin/resenas">⭐ Opiniones</a></li>
	</ul>
</div>

<main class="contenido-admin">
	<!-- NAVBAR SUPERIOR -->
	<nav class="top">
		<label for="menu-toggle" class="menu-icon">
			<img src="/src/static/assets/icons/Menu.svg" alt="Menu Icon" />
		</label>
		<div class="logo">
			<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
		</div>
		<div class="salir">
			<a href="/">
				<img src="/src/static/assets/icons/Salir.svg" alt="Cerrar Sesión" />
			</a>
		</div>
	</nav>
	<h1 class="titulo-panel">Gestión de Barberos y Especialidades</h1>

	<!-- 👇 NUEVA SECCIÓN DE BOTONES GLOBALES -->
	<div class="acciones-globales">
		<button class="boton-agregar" on:click={() => (mostrarModalCrearBarbero = true)}>
			➕ Agregar Barbero
		</button>
		<button class="boton-gestionar" on:click={abrirModalGestion}>
			🧠 Gestionar Especialidades
		</button>
	</div>

	{#if cargando}
		<p>Cargando datos...</p>
	{:else}
		<table class="tabla-barberos">
			<thead>
				<tr>
					<th>Nombre</th>
					<th>Correo</th>
					<th>Fecha Registro</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each barberos as b}
					<tr>
						<td>{b.primerNombre} {b.segundoNombre} {b.primerApellido} {b.segundoApellido}</td>
						<td>{b.correo}</td>
						<td>{new Date(b.fechaRegistro).toLocaleDateString()}</td>
						<!-- Mejor formato de fecha -->
						<td>
							<!-- Este botón ahora abre el modal de ASIGNACIÓN -->
							<button on:click={() => abrirModalAsignar(b)}>✏️ Asignar</button>

							<!-- 👇 ESTA ES LA LÍNEA QUE DEBES AÑADIR 👇 -->
							<button on:click={() => abrirModalVer(b)}>👁️ Ver</button>

							<button on:click={() => eliminar(b.id)}>🗑️ Eliminar</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<!-- ============================================== -->
	<!-- === MODAL 1: CREAR NUEVO BARBERO (Sin cambios) === -->
	<!-- ============================================== -->
	{#if mostrarModalCrearBarbero}
		<div class="modal" on:click|self={() => (mostrarModalCrearBarbero = false)}>
			<div class="modal-content">
				<h2>Nuevo Barbero</h2>
				<input bind:value={nuevoBarbero.primerNombre} placeholder="Primer Nombre" />
				<input bind:value={nuevoBarbero.segundoNombre} placeholder="Segundo Nombre" />
				<input bind:value={nuevoBarbero.primerApellido} placeholder="Primer Apellido" />
				<input bind:value={nuevoBarbero.segundoApellido} placeholder="Segundo Apellido" />
				<input bind:value={nuevoBarbero.correo} placeholder="Correo" type="email" />
				<input bind:value={nuevoBarbero.contrasena} placeholder="Contraseña" type="password" />
				<div class="modal-actions">
					<button on:click={crearNuevoBarbero}>Guardar</button>
					<button on:click={() => (mostrarModalCrearBarbero = false)}>Cancelar</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- ============================================================== -->
	<!-- === MODAL 2: ASIGNAR ESPECIALIDADES A UN BARBERO (Refactorizado) === -->
	<!-- ============================================================== -->
	{#if mostrarModalAsignar}
		<div class="modal" on:click|self={() => (mostrarModalAsignar = false)}>
			<div class="modal-content">
				<h2>Especialidades de {barberoActual.primerNombre}</h2>
				<p>Selecciona las especialidades que domina este barbero.</p>

				<div class="lista-especialidades-asignar">
					{#each especialidadesDisponibles as esp (esp.especialidad)}
						<label>
							<input
								type="checkbox"
								checked={especialidadesSeleccionadas.includes(esp.id)}
								on:change={() => toggleEspecialidad(esp.id)}
							/>
							{esp.especialidad}
						</label>
					{/each}
				</div>

				<div class="modal-actions">
					<button on:click={guardarAsignacionEspecialidades}>Guardar Cambios</button>
					<button on:click={() => (mostrarModalAsignar = false)}>Cancelar</button>
				</div>
			</div>
		</div>
	{/if}
	<!-- ======================================================== -->
	<!-- === MODAL 4: VER ESPECIALIDADES DEL BARBERO (NUEVO) === -->
	<!-- ======================================================== -->
	{#if mostrarModalVer && barberoActual}
		<div class="modal" on:click|self={() => (mostrarModalVer = false)}>
			<div class="modal-content">
				<h2>Especialidades de {barberoActual.primerNombre}</h2>

				{#if especialidadesDelBarbero.length > 0}
					<ul class="lista-ver-especialidades">
						{#each especialidadesDelBarbero as especialidad (especialidad)}
							<li>
								<strong>{especialidad}</strong>
								<!-- No podemos mostrar descripción porque la API no la envía aquí -->
							</li>
						{/each}
					</ul>
				{:else}
					<p>Este barbero aún no tiene especialidades asignadas.</p>
				{/if}

				<div class="modal-actions">
					<button on:click={() => (mostrarModalVer = false)}>Cerrar</button>
				</div>
			</div>
		</div>
	{/if}
	<!-- ============================================================== -->
	<!-- === MODAL 3: GESTIONAR ESPECIALIDADES GLOBALES (NUEVO) === -->
	<!-- ============================================================== -->
	{#if mostrarModalGestionEspecialidades}
		<div class="modal" on:click|self={() => (mostrarModalGestionEspecialidades = false)}>
			<div class="modal-content">
				<h2>Gestionar Catálogo de Especialidades</h2>

				<div class="seccion-modal">
					<h3>Crear Nueva Especialidad</h3>
					<input
						bind:value={nuevaEspecialidad.especialidad}
						placeholder="Nombre (ej: Corte Clásico)"
					/>
					<input bind:value={nuevaEspecialidad.descripcion} placeholder="Descripción (opcional)" />
					<button on:click={guardarNuevaEspecialidad}>➕ Agregar al Catálogo</button>
				</div>

				<hr />

				<div class="seccion-modal">
					<h3>Especialidades Existentes</h3>
					<div class="lista-especialidades">
						{#each especialidadesDisponibles as esp (esp.id)}
							<div class="especialidad-item">
								<span>{esp.especialidad}</span>
								<button
									class="boton-eliminar-esp"
									on:click={() => eliminarEspecialidadConfirmada(esp.id)}>🗑️</button
								>
							</div>
						{:else}
							<p>No hay especialidades creadas.</p>
						{/each}
					</div>
				</div>

				<div class="modal-actions">
					<button on:click={() => (mostrarModalGestionEspecialidades = false)}>Cerrar</button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	/* ... Tus estilos existentes son geniales ... */
	/* Añadimos algunos estilos para los nuevos elementos */
	.acciones-globales {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	.boton-agregar {
		background-color: #c0a080;
		color: black;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
	}
	.boton-gestionar {
		background-color: #4a4a4a;
		color: white;
		padding: 0.5rem 1rem;
		border: 1px solid #c0a080;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
	}
	.tabla-barberos {
		width: 100%;
		border-collapse: collapse;
	}
	.tabla-barberos th,
	.tabla-barberos td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid #555;
		color: white;
	}
	.tabla-barberos th {
		background-color: #252525;
		color: #c0a080;
	}
	.tabla-barberos button {
		margin-right: 0.5rem;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
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
		gap: 1rem;
	}
	.modal-content h2 {
		margin-top: 0;
		color: #c0a080;
	}
	.modal-content input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem;
		border-radius: 6px;
		border: none;
		background: #555;
		color: white;
	}
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
	}
	.seccion-modal {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.lista-especialidades-asignar label {
		display: block;
		background: #444;
		padding: 0.75rem;
		border-radius: 6px;
		cursor: pointer;
	}
	.lista-especialidades-asignar label:hover {
		background: #555;
	}

	.especialidad-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #1f1f1f;
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}
	.especialidad-item span {
		color: white;
	}
	.boton-eliminar-esp {
		background: transparent;
		border: none;
		color: #ff6b6b;
		font-size: 1.2rem;
		cursor: pointer;
	}
</style>
