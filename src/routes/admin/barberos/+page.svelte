<script>
	import { onMount } from 'svelte';

	// Importamos TODO lo relacionado con el recurso BARBERO desde un solo lugar.
	import {
		obtenerBarberos,
		crearBarbero,
		eliminarBarbero,
		obtenerEspecialidadesDeBarbero,
		actualizarEspecialidadesDeBarbero
	} from '$lib/api/barberos.js';

	// Importamos TODO lo relacionado con el CATÁLOGO GENERAL de especialidades
	// desde su propio archivo dedicado.
	import {
		obtenerEspecialidadesDisponibles,
		crearEspecialidad,
		eliminarEspecialidad
	} from '$lib/api/especialidades.js';
	// --- ESTADO GENERAL ---
	let barberos = [];
	let cargando = true;
	let especialidadesDisponibles = [];

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

	// --- ESTADO MODAL: ASIGNAR ESPECIALIDADES ---
	let mostrarModalAsignar = false;
	let especialidadesSeleccionadas = [];
	let barberoActual = null;

	// --- ESTADO MODAL: GESTIONAR ESPECIALIDADES ---
	let mostrarModalGestionEspecialidades = false;
	let nuevaEspecialidad = { especialidad: '', descripcion: '' };

	// --- ESTADO MODAL: VER ESPECIALIDADES ---
	let mostrarModalVer = false;
	let especialidadesDelBarbero = [];

	// --- FUNCIONES ---

	async function cargarDatosIniciales() {
		try {
			cargando = true;
			const resultados = await Promise.all([obtenerBarberos(), obtenerEspecialidadesDisponibles()]);

			console.log('Barberos recibidos desde la API:', resultados[0]);

			barberos = resultados[0];
			especialidadesDisponibles = resultados[1];
		} catch (error) {
			console.error('❌ Error al cargar datos iniciales:', error);
			alert('No se pudieron cargar los datos. Revisa la consola.');
		} finally {
			cargando = false;
		}
	}

	async function crearNuevoBarbero() {
		try {
			await crearBarbero(nuevoBarbero, 1);
			mostrarModalCrearBarbero = false;
			nuevoBarbero = {
				primerNombre: '',
				segundoNombre: '',
				primerApellido: '',
				segundoApellido: '',
				correo: '',
				contrasena: ''
			};
			await cargarDatosIniciales();
		} catch (error) {
			console.error('Error creando barbero:', error);
			alert('Error al crear barbero. Revisa la consola para más detalles.');
		}
	}

	async function eliminar(id) {
		if (confirm('¿Estás seguro de eliminar este barbero?')) {
			await eliminarBarbero(id);
			await cargarDatosIniciales();
		}
	}

	// ---- LÓGICA DEL MODAL DE ASIGNACIÓN ----
	async function abrirModalAsignar(barbero) {
		barberoActual = barbero;
		mostrarModalAsignar = true;

		try {
			const actuales = await obtenerEspecialidadesDeBarbero(barbero.id);
			const idsActuales = actuales.map((e) => e.id);
			especialidadesSeleccionadas = idsActuales;
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
			await actualizarEspecialidadesDeBarbero(barberoActual.id, especialidadesSeleccionadas);
			mostrarModalAsignar = false;
		} catch (error) {
			console.error('Error al guardar especialidades:', error);
			alert('Error al guardar especialidades');
		}
	}

	// ---- LÓGICA DEL NUEVO MODAL DE VISUALIZACIÓN ----
	async function abrirModalVer(barbero) {
		barberoActual = barbero;
		mostrarModalVer = true;
		especialidadesDelBarbero = [];

		try {
			const data = await obtenerEspecialidadesDeBarbero(barbero.id);
			especialidadesDelBarbero = data;
		} catch (error) {
			console.error('Error al cargar especialidades para ver:', error);
			alert('No se pudieron cargar las especialidades de este barbero.');
		}
	}

	// ---- LÓGICA DEL NUEVO MODAL DE GESTIÓN ----
	async function abrirModalGestion() {
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
			nuevaEspecialidad = { especialidad: '', descripcion: '' };
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
			try {
				await eliminarEspecialidad(id);
				especialidadesDisponibles = await obtenerEspecialidadesDisponibles();
				alert('¡La especialidad ha sido eliminada correctamente!');
			} catch (error) {
				console.error(error);
				alert(error.message);
			}
		}
	}
	onMount(() => {
		cargarDatosIniciales();
	});
</script>

<!-- === NAVBAR AÑADIDA === -->
<nav class="top">
	<label for="menu-toggle" class="menu-icon">
		<img src="/src/static/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>
	<div class="logo">
		<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
	</div>
	<div class="salir">
		<a href="/admin/1-paneladmin" title="Cerrar Sesión">
			<img src="/src/static/assets/icons/Salir.svg" alt="Cerrar Sesión" />
		</a>
	</div>
</nav>

<main class="contenido-admin">
	<div class="header-principal">
		<h1 class="titulo-principal">Gestión de Barberos</h1>
		<div class="acciones-globales">
			<button class="boton-accion primario" on:click={() => (mostrarModalCrearBarbero = true)}>
				➕ Agregar Barbero
			</button>
			<button class="boton-accion secundario" on:click={abrirModalGestion}>
				⚙️ Gestionar Especialidades
			</button>
		</div>
	</div>

	{#if cargando}
		<div class="estado-carga">Cargando datos...</div>
	{:else}
		<div class="contenedor-tabla">
			<table class="tabla-gestion">
				<thead>
					<tr>
						<th>Nombre Completo</th>
						<th>Correo</th>
						<th>Fecha de Registro</th>
						<th class="columna-acciones">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{#each barberos as b (b.id)}
						<tr>
							<td>{b.primerNombre} {b.segundoNombre} {b.primerApellido} {b.segundoApellido}</td>
							<td>{b.correo}</td>
							<td>{new Date(b.fechaRegistro).toLocaleDateString()}</td>
							<td class="columna-acciones">
								<div class="grupo-botones-tabla">
									<button
										class="boton-tabla ver"
										on:click={() => abrirModalVer(b)}
										title="Ver Especialidades">👁️</button
									>
									<button
										class="boton-tabla editar"
										on:click={() => abrirModalAsignar(b)}
										title="Asignar Especialidades">✏️</button
									>
									<button
										class="boton-tabla eliminar"
										on:click={() => eliminar(b.id)}
										title="Eliminar Barbero">🗑️</button
									>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- MODALES (sin cambios) -->
	{#if mostrarModalCrearBarbero}
		<div class="modal-overlay" on:click|self={() => (mostrarModalCrearBarbero = false)}>
			<div class="modal-contenido">
				<h2 class="modal-titulo">Nuevo Barbero</h2>
				<form class="modal-formulario" on:submit|preventDefault={crearNuevoBarbero}>
					<input bind:value={nuevoBarbero.primerNombre} placeholder="Primer Nombre" required />
					<input bind:value={nuevoBarbero.segundoNombre} placeholder="Segundo Nombre" />
					<input bind:value={nuevoBarbero.primerApellido} placeholder="Primer Apellido" required />
					<input bind:value={nuevoBarbero.segundoApellido} placeholder="Segundo Apellido" />
					<input
						bind:value={nuevoBarbero.correo}
						placeholder="Correo Electrónico"
						type="email"
						required
					/>
					<input
						bind:value={nuevoBarbero.contrasena}
						placeholder="Contraseña"
						type="password"
						required
					/>
					<div class="modal-acciones">
						<button
							type="button"
							class="boton-accion secundario"
							on:click={() => (mostrarModalCrearBarbero = false)}>Cancelar</button
						>
						<button type="submit" class="boton-accion primario">Guardar</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if mostrarModalAsignar}
		<div class="modal-overlay" on:click|self={() => (mostrarModalAsignar = false)}>
			<div class="modal-contenido">
				<h2 class="modal-titulo">Asignar Especialidades a {barberoActual.primerNombre}</h2>
				<p class="modal-subtitulo">Selecciona las especialidades que domina este barbero.</p>

				<div class="lista-checkbox">
					{#each especialidadesDisponibles as esp (esp.id)}
						<label class="checkbox-item">
							<input
								type="checkbox"
								checked={especialidadesSeleccionadas.includes(esp.id)}
								on:change={() => toggleEspecialidad(esp.id)}
							/>
							<span class="checkbox-label">{esp.especialidad}</span>
						</label>
					{/each}
				</div>

				<div class="modal-acciones">
					<button class="boton-accion secundario" on:click={() => (mostrarModalAsignar = false)}
						>Cancelar</button
					>
					<button class="boton-accion primario" on:click={guardarAsignacionEspecialidades}
						>Guardar Cambios</button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if mostrarModalVer && barberoActual}
		<div class="modal-overlay" on:click|self={() => (mostrarModalVer = false)}>
			<div class="modal-contenido">
				<h2 class="modal-titulo">Especialidades de {barberoActual.primerNombre}</h2>
				{#if especialidadesDelBarbero.especialidades && especialidadesDelBarbero.especialidades.length > 0}
					<ul class="lista-simple">
						{#each especialidadesDelBarbero.especialidades as especialidad (especialidad)}
							<li class="lista-simple-item">{especialidad}</li>
						{/each}
					</ul>
				{:else}
					<p class="mensaje-vacio">Este barbero aún no tiene especialidades asignadas.</p>
				{/if}
				<div class="modal-acciones">
					<button class="boton-accion primario" on:click={() => (mostrarModalVer = false)}
						>Cerrar</button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if mostrarModalGestionEspecialidades}
		<div class="modal-overlay" on:click|self={() => (mostrarModalGestionEspecialidades = false)}>
			<div class="modal-contenido" style="max-width: 600px;">
				<h2 class="modal-titulo">Catálogo de Especialidades</h2>

				<div class="seccion-modal">
					<h3 class="seccion-titulo">Crear Nueva Especialidad</h3>
					<form class="formulario-en-linea" on:submit|preventDefault={guardarNuevaEspecialidad}>
						<input
							bind:value={nuevaEspecialidad.especialidad}
							placeholder="Nombre (ej: Corte Clásico)"
							required
						/>
						<input
							bind:value={nuevaEspecialidad.descripcion}
							placeholder="Descripción (opcional)"
						/>
						<button type="submit" class="boton-accion primario mini">➕ Agregar</button>
					</form>
				</div>

				<hr class="modal-separador" />

				<div class="seccion-modal">
					<h3 class="seccion-titulo">Especialidades Existentes</h3>
					<div class="lista-gestion">
						{#each especialidadesDisponibles as esp (esp.id)}
							<div class="item-gestion">
								<span class="item-gestion-texto">{esp.especialidad}</span>
								<button
									class="boton-tabla eliminar"
									title="Eliminar del catálogo"
									on:click={() => eliminarEspecialidadConfirmada(esp.id)}>🗑️</button
								>
							</div>
						{:else}
							<p class="mensaje-vacio">No hay especialidades creadas en el catálogo.</p>
						{/each}
					</div>
				</div>

				<div class="modal-acciones">
					<button
						class="boton-accion secundario"
						on:click={() => (mostrarModalGestionEspecialidades = false)}>Cerrar</button
					>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	/* --- ESTILOS DE NAVBAR AÑADIDOS --- */
	nav.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background-color: var(--color-fondo);
		border-bottom: 1px solid var(--color-borde);
		box-shadow: var(--sombra-suave);
		position: sticky;
		top: 0;
		z-index: 10;
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

	@media (min-width: 768px) {
		.menu-icon {
			display: none;
		}
	}
	/* --- FIN DE ESTILOS DE NAVBAR --- */

	/* --- VARIABLES Y ESTILOS GLOBALES --- */
	:root {
		--color-primario: #c0a080;
		--color-fondo: #1e1e1e;
		--color-superficie: #2a2a2a;
		--color-borde: #444;
		--color-texto-principal: #e0e0e0;
		--color-texto-secundario: #a0a0a0;
		--color-peligro: #f44336;
		--color-exito: #4caf50;
		--color-editar: #2196f3;
		--sombra-suave: 0 4px 12px rgba(0, 0, 0, 0.4);
		--radio-borde: 8px;
	}

	.contenido-admin {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 2rem;
		color: var(--color-texto-principal);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	/* --- ENCABEZADO PRINCIPAL --- */
	.header-principal {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.titulo-principal {
		color: var(--color-primario);
		margin: 0;
		font-size: 2.5rem;
		font-weight: 600;
	}

	.acciones-globales {
		display: flex;
		gap: 1rem;
	}

	.estado-carga,
	.mensaje-vacio {
		text-align: center;
		font-size: 1.2rem;
		padding: 3rem 1rem;
		color: var(--color-texto-secundario);
	}

	/* --- BOTONES DE ACCIÓN --- */
	.boton-accion {
		padding: 0.75rem 1.5rem;
		border-radius: var(--radio-borde);
		border: 2px solid transparent;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.boton-accion.primario {
		background-color: var(--color-primario);
		color: #111;
		border-color: var(--color-primario);
	}
	.boton-accion.primario:hover {
		background-color: #d4b090;
		border-color: #d4b090;
		transform: translateY(-2px);
	}

	.boton-accion.secundario {
		background-color: transparent;
		color: var(--color-primario);
		border-color: var(--color-primario);
	}
	.boton-accion.secundario:hover {
		background-color: var(--color-primario);
		color: #111;
	}

	.boton-accion.mini {
		padding: 0.5rem 1rem;
		font-size: 0.8rem;
	}

	/* --- TABLA DE GESTIÓN --- */
	.contenedor-tabla {
		overflow-x: auto;
		background-color: var(--color-superficie);
		border-radius: var(--radio-borde);
		box-shadow: var(--sombra-suave);
	}
	.tabla-gestion {
		width: 100%;
		border-collapse: collapse;
		white-space: nowrap;
	}
	.tabla-gestion th,
	.tabla-gestion td {
		padding: 1rem 1.25rem;
		text-align: left;
		border-bottom: 1px solid var(--color-borde);
	}
	.tabla-gestion th {
		background-color: #333;
		color: var(--color-primario);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.tabla-gestion tbody tr {
		transition: background-color 0.2s ease;
	}
	.tabla-gestion tbody tr:hover {
		background-color: #383838;
	}
	.tabla-gestion tbody tr:last-child td {
		border-bottom: none;
	}
	.columna-acciones {
		text-align: right;
	}

	.grupo-botones-tabla {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.boton-tabla {
		background: transparent;
		border: none;
		font-size: 1.25rem;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			color 0.2s ease;
		padding: 0.25rem;
	}
	.boton-tabla:hover {
		transform: scale(1.2);
	}
	.boton-tabla.ver {
		color: var(--color-texto-secundario);
	}
	.boton-tabla.ver:hover {
		color: white;
	}
	.boton-tabla.editar {
		color: var(--color-editar);
	}
	.boton-tabla.eliminar {
		color: var(--color-peligro);
	}

	/* --- MODALES --- */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.modal-contenido {
		background: var(--color-superficie);
		padding: 2rem 2.5rem;
		border-radius: 12px;
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: var(--sombra-suave);
		border-top: 4px solid var(--color-primario);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.modal-titulo {
		margin: 0;
		color: var(--color-texto-principal);
		font-size: 1.75rem;
	}

	.modal-subtitulo {
		margin: -1rem 0 0 0;
		color: var(--color-texto-secundario);
	}

	.modal-acciones {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-borde);
	}

	/* --- FORMULARIOS DENTRO DE MODAL --- */
	.modal-formulario {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.modal-contenido input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.8rem 1rem;
		border-radius: var(--radio-borde);
		border: 1px solid var(--color-borde);
		background: #3c3c3c;
		color: var(--color-texto-principal);
		font-size: 1rem;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}
	.modal-contenido input:focus {
		outline: none;
		border-color: var(--color-primario);
		background-color: #444;
	}

	.formulario-en-linea {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 1rem;
		align-items: center;
	}

	/* --- LISTAS DENTRO DE MODAL --- */
	.seccion-modal {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.seccion-titulo {
		margin: 0;
		font-size: 1.1rem;
		color: var(--color-texto-secundario);
		border-bottom: 1px solid var(--color-borde);
		padding-bottom: 0.5rem;
	}
	.modal-separador {
		border: none;
		border-top: 1px solid var(--color-borde);
		margin: 1rem 0;
	}

	.lista-checkbox {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.checkbox-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background-color: #3a3a3a;
		padding: 0.75rem 1rem;
		border-radius: var(--radio-borde);
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.checkbox-item:hover {
		background-color: #4a4a4a;
	}
	.checkbox-item input[type='checkbox'] {
		width: 1.2em;
		height: 1.2em;
		accent-color: var(--color-primario);
	}

	.lista-simple {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.lista-simple-item {
		background-color: #3a3a3a;
		padding: 0.75rem 1.25rem;
		border-radius: var(--radio-borde);
		border-left: 3px solid var(--color-primario);
	}

	.lista-gestion {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.item-gestion {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #3a3a3a;
		padding: 0.5rem 0.5rem 0.5rem 1.25rem;
		border-radius: var(--radio-borde);
	}
</style>
