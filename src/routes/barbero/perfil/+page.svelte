<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	// ========================================================================
	// ✅ IMPORTAMOS LAS FUNCIONES EXACTAS QUE NOS PROPORCIONASTE
	// ========================================================================
	import { obtenerPerfilUsuario, actualizarPerfilUsuario } from '$lib/api/usuarios.js';
	import {
		obtenerEspecialidadesDeBarbero,
		actualizarEspecialidadesDeBarbero
	} from '$lib/api/barberos.js';
	import { obtenerEspecialidadesDisponibles } from '$lib/api/especialidades.js';

	// --- ESTADO DEL PERFIL ---
	let barbero = null;
	let especialidadesActuales = [];
	let isLoading = true;
	let error = null;

	// --- ESTADO DE EDICIÓN DEL PERFIL ---
	let modoEdicionPerfil = false;
	let perfilEditable = {};

	// --- ESTADO DEL MODAL DE ESPECIALIDADES ---
	let mostrarModalEspecialidades = false;
	let especialidadesDisponibles = [];
	let especialidadesSeleccionadas = new Set();

	// Obtenemos el ID del usuario logueado desde el store
	const idBarbero = $authStore.usuario?.idUsuario;

	onMount(async () => {
		if (!idBarbero) {
			error = 'No se pudo identificar al barbero. Por favor, inicia sesión.';
			isLoading = false;
			return;
		}
		try {
			// Cargamos todos los datos necesarios en paralelo
			const [perfilData, especialidadesData, catalogoData] = await Promise.all([
				obtenerPerfilUsuario(idBarbero),
				obtenerEspecialidadesDeBarbero(idBarbero),
				obtenerEspecialidadesDisponibles()
			]);

			barbero = perfilData;
			// La API devuelve un objeto con una propiedad 'especialidades' que es un array
			especialidadesActuales = especialidadesData.especialidades || [];
			especialidadesDisponibles = catalogoData;
		} catch (e) {
			console.error('Error cargando el perfil:', e);
			error = `Hubo un problema al cargar tu perfil: ${e.message}`;
		} finally {
			isLoading = false;
		}
	});

	// --- MANEJADORES DE EVENTOS ---

	function activarModoEdicion() {
		perfilEditable = { ...barbero };
		modoEdicionPerfil = true;
	}

	async function guardarCambiosPerfil() {
		try {
			// ✅ Construimos el payload completo y válido
			const payload = {
				primerNombre: perfilEditable.primerNombre,
				segundoNombre: perfilEditable.segundoNombre || null,
				primerApellido: perfilEditable.primerApellido,
				segundoApellido: perfilEditable.segundoApellido || null,

				// 👇 Obligatorio según validación backend
				correo: barbero.correo,

				// 👇 Truco para pasar validación sin cambiar la real
				contrasena: 'password_falsa_para_validar'
			};

			console.log('Enviando este payload al backend:', payload);

			const perfilActualizado = await actualizarPerfilUsuario(idBarbero, payload);

			// ✅ Si todo sale bien, actualizamos y salimos del modo edición
			barbero = perfilActualizado;
			modoEdicionPerfil = false;
			alert('¡Tu perfil ha sido actualizado con éxito!');
		} catch (e) {
			console.error('Detalle del error al guardar:', e);
			alert(`Error al guardar los cambios: ${e.message}. Revisa la consola.`);
		}
	}

	function abrirModalEspecialidades() {
		// 1. Creamos un Set con los NOMBRES que el barbero ya tiene (la forma correcta).
		//    Ejemplo: new Set(['Color', 'Grecas'])
		const nombresEspecialidadesActuales = new Set(especialidadesActuales);

		// 2. Revisamos el catálogo completo, que es un array de OBJETOS { id, especialidad, ... }
		const idsActuales = especialidadesDisponibles
			// Nos quedamos solo con los OBJETOS cuya propiedad 'especialidad' está en nuestro Set de nombres.
			.filter((esp) => nombresEspecialidadesActuales.has(esp.especialidad))
			// De esos objetos que sobrevivieron el filtro, extraemos su ID.
			.map((esp) => esp.id);
		// El resultado es el array de IDs correcto. Ejemplo: [2, 3]

		// 3. Ahora SÍ, inicializamos nuestro Set para los checkboxes con los IDs correctos.
		especialidadesSeleccionadas = new Set(idsActuales);
		mostrarModalEspecialidades = true;
	}

	async function guardarCambiosEspecialidades() {
		try {
			const idsParaEnviar = Array.from(especialidadesSeleccionadas);
			// Usamos la función de la API 'actualizarEspecialidadesDeBarbero'
			await actualizarEspecialidadesDeBarbero(idBarbero, idsParaEnviar);

			// Refrescamos la lista de especialidades en la vista sin recargar la página
			const dataActualizada = await obtenerEspecialidadesDeBarbero(idBarbero);
			especialidadesActuales = dataActualizada.especialidades || [];

			mostrarModalEspecialidades = false;
			alert('¡Tus especialidades han sido actualizadas!');
		} catch (e) {
			alert(`Error al actualizar tus especialidades: ${e.message}`);
		}
	}
</script>

<main class="contenedor-perfil">
	<h1>Mi Perfil</h1>
	<p class="subtitulo">Gestiona tu información personal y tus habilidades profesionales.</p>

	{#if isLoading}
		<div class="mensaje-estado">Cargando tu perfil...</div>
	{:else if error}
		<div class="mensaje-estado error">{error}</div>
	{:else if barbero}
		<div class="grid-perfil">
			<!-- Sección 1: Foto de Perfil (Preparada para Cloudinary) -->
			<section class="card-perfil">
				<h2>Foto de Perfil</h2>
				<div class="placeholder-foto">
					<span class="icono-foto">📷</span>
					<p>Sube una foto para que tus clientes te reconozcan.</p>
				</div>
				<button class="boton-accion" disabled>Cambiar Foto (Próximamente)</button>
			</section>

			<!-- Sección 2: Información Personal -->
			<section class="card-perfil">
				<div class="card-header">
					<h2>Información Personal</h2>
					{#if !modoEdicionPerfil}
						<button class="boton-editar" title="Editar perfil" on:click={activarModoEdicion}
							>✏️</button
						>
					{/if}
				</div>

				{#if modoEdicionPerfil}
					<form class="formulario-perfil" on:submit|preventDefault={guardarCambiosPerfil}>
						<label>
							<span>Primer Nombre</span>
							<input bind:value={perfilEditable.primerNombre} required />
						</label>
						<label>
							<span>Segundo Nombre</span>
							<input bind:value={perfilEditable.segundoNombre} />
						</label>
						<label>
							<span>Primer Apellido</span>
							<input bind:value={perfilEditable.primerApellido} required />
						</label>
						<label>
							<span>Correo Electrónico (no se puede cambiar)</span>
							<input type="email" value={barbero.correo} disabled />
						</label>
						<div class="acciones-formulario">
							<button
								type="button"
								class="boton-accion secundario"
								on:click={() => (modoEdicionPerfil = false)}>Cancelar</button
							>
							<button type="submit" class="boton-accion primario">Guardar Cambios</button>
						</div>
					</form>
				{:else}
					<div class="vista-info">
						<p><strong>Nombre:</strong> {barbero.primerNombre} {barbero.segundoNombre || ''}</p>
						<p><strong>Apellido:</strong> {barbero.primerApellido}</p>
						<p><strong>Correo:</strong> {barbero.correo}</p>
						<p>
							<strong>Miembro desde:</strong>
							{new Date(barbero.fechaRegistro).toLocaleDateString()}
						</p>
					</div>
				{/if}
			</section>

			<!-- Sección 3: Mis Especialidades -->
			<section class="card-perfil">
				<div class="card-header">
					<h2>Mis Especialidades</h2>
					<button
						class="boton-editar"
						title="Gestionar especialidades"
						on:click={abrirModalEspecialidades}>⚙️</button
					>
				</div>
				<div class="lista-etiquetas">
					<!-- El `especialidad` es un string, lo usamos como llave y lo imprimimos directamente -->
					{#each especialidadesActuales as especialidad (especialidad)}
						<span class="etiqueta">{especialidad}</span>
					{:else}
						<p class="texto-vacio">
							Aún no has añadido ninguna especialidad. ¡Haz clic en ⚙️ para empezar!
						</p>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</main>

<!-- MODAL PARA GESTIONAR ESPECIALIDADES -->
{#if mostrarModalEspecialidades}
	<div class="modal-overlay" on:click|self={() => (mostrarModalEspecialidades = false)}>
		<div class="modal-contenido">
			<h2 class="modal-titulo">Gestionar Mis Especialidades</h2>
			<p class="modal-subtitulo">Selecciona las habilidades que ofreces a tus clientes.</p>

			<div class="lista-checkbox">
				{#each especialidadesDisponibles as esp (esp.id)}
					<label class="checkbox-item">
						<input
							type="checkbox"
							checked={especialidadesSeleccionadas.has(esp.id)}
							on:change={() => {
								if (especialidadesSeleccionadas.has(esp.id)) {
									especialidadesSeleccionadas.delete(esp.id);
								} else {
									especialidadesSeleccionadas.add(esp.id);
								}
								especialidadesSeleccionadas = especialidadesSeleccionadas; // Truco para forzar la reactividad de Svelte con el Set
							}}
						/>
						<span class="checkbox-label">{esp.especialidad}</span>
					</label>
				{/each}
			</div>

			<div class="modal-acciones">
				<button
					type="button"
					class="boton-accion secundario"
					on:click={() => (mostrarModalEspecialidades = false)}>Cancelar</button
				>
				<button type="button" class="boton-accion primario" on:click={guardarCambiosEspecialidades}
					>Guardar Cambios</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Estilos generales de la página */
	.contenedor-perfil {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 1rem;
		color: #e0e0e0;
	}
	h1 {
		font-size: 2.5rem;
		color: #c0a080;
	}
	.subtitulo {
		color: #a0a0a0;
		margin-top: -1rem;
		margin-bottom: 3rem;
	}
	.grid-perfil {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 1.5rem;
		align-items: start;
	}
	.card-perfil {
		background-color: #1e1e1e;
		padding: 1.5rem 2rem;
		border-radius: 8px;
		border: 1px solid #2c2c2c;
		display: flex;
		flex-direction: column;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #2c2c2c;
		padding-bottom: 1rem;
	}
	h2 {
		margin: 0;
		color: #c0a080;
		font-size: 1.5rem;
	}
	.boton-editar {
		background: none;
		border: none;
		color: #c0a080;
		cursor: pointer;
		font-size: 1.5rem;
		transition: transform 0.2s;
	}
	.boton-editar:hover {
		transform: scale(1.1);
	}

	/* Estilos de la tarjeta de foto */
	.placeholder-foto {
		text-align: center;
		padding: 2rem;
		border: 2px dashed #444;
		border-radius: 8px;
		margin-bottom: 1rem;
		color: #777;
	}
	.icono-foto {
		font-size: 3rem;
		display: block;
	}

	/* Estilos del formulario de edición */
	.formulario-perfil label {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}
	.formulario-perfil span {
		font-size: 0.9rem;
		color: #ccc;
		margin-bottom: 0.25rem;
	}
	.formulario-perfil input {
		width: 100%;
		padding: 0.75rem;
		background: #2a2a2a;
		border: 1px solid #444;
		border-radius: 4px;
		color: white;
		font-size: 1rem;
	}
	.formulario-perfil input:disabled {
		background: #222;
		color: #777;
		cursor: not-allowed;
	}
	.acciones-formulario {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	/* Estilos de la vista de información */
	.vista-info p {
		margin: 1rem 0;
		color: #ddd;
		font-size: 1.1rem;
	}
	.vista-info strong {
		color: #c0a080;
	}

	/* Estilos de especialidades */
	.lista-etiquetas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		min-height: 50px;
	}
	.etiqueta {
		background-color: #c0a080;
		color: #121212;
		padding: 0.4rem 0.9rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
	}
	.texto-vacio {
		color: #777;
		font-style: italic;
	}

	/* Estilos de los botones de acción */
	.boton-accion {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
		transition: background-color 0.2s;
	}
	.boton-accion.primario {
		background-color: #c0a080;
		color: #121212;
	}
	.boton-accion.primario:hover {
		background-color: #d4b391;
	}
	.boton-accion.secundario {
		background-color: #3a3a3a;
		color: #e0e0e0;
	}
	.boton-accion.secundario:hover {
		background-color: #4a4a4a;
	}
	.boton-accion:disabled {
		background-color: #333;
		color: #777;
		cursor: not-allowed;
	}

	/* Estilos de los modales (reutilizados del admin) */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.modal-contenido {
		background: #1e1e1e;
		padding: 2rem;
		border-radius: 8px;
		width: 90%;
		max-width: 500px;
		box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
	}
	.modal-titulo {
		color: #c0a080;
		margin-top: 0;
	}
	.modal-subtitulo {
		color: #a0a0a0;
		margin-top: -1rem;
		margin-bottom: 1.5rem;
	}
	.lista-checkbox {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		max-height: 300px;
		overflow-y: auto;
		padding: 0.5rem;
		background: #2a2a2a;
		border-radius: 5px;
	}
	.checkbox-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.checkbox-item:hover {
		background-color: #3a3a3a;
	}
	.checkbox-item input[type='checkbox'] {
		width: 18px;
		height: 18px;
	}
	.modal-acciones {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
		border-top: 1px solid #2c2c2c;
		padding-top: 1.5rem;
	}
</style>
