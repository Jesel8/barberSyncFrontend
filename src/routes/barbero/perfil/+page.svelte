<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	// ========================================================================
	// ✅ 1. IMPORTAMOS LA NUEVA FUNCIÓN PARA SUBIR LA IMAGEN
	// ========================================================================
	import {
		obtenerPerfilUsuario,
		actualizarPerfilUsuario,
		subirImagenPerfil // <-- Nueva función importada
	} from '$lib/api/usuarios.js';
	import {
		obtenerEspecialidadesDeBarbero,
		actualizarEspecialidadesDeBarbero
	} from '$lib/api/barberos.js';
	import { obtenerEspecialidadesDisponibles } from '$lib/api/especialidades.js';

	// --- ESTADO DEL PERFIL (Sin cambios) ---
	let barbero = null;
	let especialidadesActuales = [];
	let isLoading = true;
	let error = null;

	// --- ESTADO DE EDICIÓN DEL PERFIL (Sin cambios) ---
	let modoEdicionPerfil = false;
	let perfilEditable = {};

	// --- ESTADO DEL MODAL DE ESPECIALIDADES (Sin cambios) ---
	let mostrarModalEspecialidades = false;
	let especialidadesDisponibles = [];
	let especialidadesSeleccionadas = new Set();

	// ✅ 2. AÑADIMOS NUEVO ESTADO PARA LA SUBIDA DE LA FOTO
	let archivoSeleccionado = null; // Guardará el objeto File que el usuario elija
	let isUploading = false; // Controla el estado de carga para deshabilitar botones
	let inputArchivoFoto; // Referencia al <input type="file"> oculto

	// --- Obtenemos el ID del usuario (Sin cambios) ---
	const idBarbero = $authStore.usuario?.idUsuario;

	// --- onMount (Sin cambios) ---
	onMount(async () => {
		if (!idBarbero) {
			error = 'No se pudo identificar al barbero. Por favor, inicia sesión.';
			isLoading = false;
			return;
		}
		try {
			const [perfilData, especialidadesData, catalogoData] = await Promise.all([
				obtenerPerfilUsuario(idBarbero),
				obtenerEspecialidadesDeBarbero(idBarbero),
				obtenerEspecialidadesDisponibles()
			]);
			barbero = perfilData;
			especialidadesActuales = especialidadesData.especialidades || [];
			especialidadesDisponibles = catalogoData;
		} catch (e) {
			console.error('Error cargando el perfil:', e);
			error = `Hubo un problema al cargar tu perfil: ${e.message}`;
		} finally {
			isLoading = false;
		}
	});

	// --- MANEJADORES DE EVENTOS (Funciones existentes sin cambios) ---

	function activarModoEdicion() {
		perfilEditable = { ...barbero };
		modoEdicionPerfil = true;
	}

	async function guardarCambiosPerfil() {
		try {
			const payload = {
				primerNombre: perfilEditable.primerNombre,
				segundoNombre: perfilEditable.segundoNombre || null,
				primerApellido: perfilEditable.primerApellido,
				segundoApellido: perfilEditable.segundoApellido || null,
				correo: barbero.correo,
				contrasena: 'password_falsa_para_validar'
			};
			const perfilActualizado = await actualizarPerfilUsuario(idBarbero, payload);
			barbero = perfilActualizado;
			modoEdicionPerfil = false;
			alert('¡Tu perfil ha sido actualizado con éxito!');
		} catch (e) {
			console.error('Detalle del error al guardar:', e);
			alert(`Error al guardar los cambios: ${e.message}. Revisa la consola.`);
		}
	}

	function abrirModalEspecialidades() {
		const nombresEspecialidadesActuales = new Set(especialidadesActuales);
		const idsActuales = especialidadesDisponibles
			.filter((esp) => nombresEspecialidadesActuales.has(esp.especialidad))
			.map((esp) => esp.id);
		especialidadesSeleccionadas = new Set(idsActuales);
		mostrarModalEspecialidades = true;
	}

	async function guardarCambiosEspecialidades() {
		try {
			const idsParaEnviar = Array.from(especialidadesSeleccionadas);
			await actualizarEspecialidadesDeBarbero(idBarbero, idsParaEnviar);
			const dataActualizada = await obtenerEspecialidadesDeBarbero(idBarbero);
			especialidadesActuales = dataActualizada.especialidades || [];
			mostrarModalEspecialidades = false;
			alert('¡Tus especialidades han sido actualizadas!');
		} catch (e) {
			alert(`Error al actualizar tus especialidades: ${e.message}`);
		}
	}

	// ========================================================================
	// ✅ 3. AÑADIMOS LAS NUEVAS FUNCIONES PARA MANEJAR LA FOTO DE PERFIL
	// ========================================================================

	/**
	 * Se dispara cuando el input de archivo oculto cambia (cuando el usuario elige un archivo).
	 */
	function manejarSeleccionDeArchivo(e) {
		const file = e.target.files[0];
		if (file) {
			archivoSeleccionado = file; // Guardamos el archivo en nuestro estado
		}
	}

	/**
	 * Sube el archivo seleccionado al servidor.
	 */
	async function subirNuevaFoto() {
		if (!archivoSeleccionado) {
			alert('Por favor, selecciona un archivo primero.');
			return;
		}

		isUploading = true; // Inicia el estado de carga

		try {
			// Llama a la función de la API que creamos
			const perfilActualizado = await subirImagenPerfil(idBarbero, archivoSeleccionado);

			// Si todo sale bien, el backend devuelve el usuario con la nueva `urlImagen`.
			// Actualizamos nuestro estado local para que Svelte refresque la UI.
			barbero = perfilActualizado;

			alert('¡Tu foto de perfil ha sido actualizada!');
			archivoSeleccionado = null; // Limpiamos la selección para ocultar el botón de "Guardar"
		} catch (e) {
			console.error('Error al subir la foto:', e);
			alert(`Error al subir la foto: ${e.message}`);
		} finally {
			isUploading = false; // Finaliza el estado de carga (en éxito o error)
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
			<!-- ✅ COPIA Y PEGA TODO ESTE BLOQUE PARA REEMPLAZAR LA SECCIÓN 1 ANTIGUA -->
			<section class="card-perfil">
				<h2>Foto de Perfil</h2>

				<!-- Input de archivo oculto. Lo activaremos con un botón. -->
				<input
					type="file"
					bind:this={inputArchivoFoto}
					on:change={manejarSeleccionDeArchivo}
					accept="image/png, image/jpeg"
					style="display: none;"
				/>

				<!-- Contenedor de la imagen. Muestra la imagen actual o un placeholder. -->
				<div class="contenedor-imagen-perfil">
					{#if barbero.urlImagen}
						<!-- Si el usuario tiene una imagen, la mostramos -->
						<img
							src={barbero.urlImagen}
							alt="Foto de perfil de {barbero.primerNombre}"
							class="imagen-perfil"
						/>
					{:else}
						<!-- Si no, mostramos el placeholder -->
						<div class="placeholder-foto">
							<span class="icono-foto">📷</span>
							<p>¡Añade una foto!</p>
						</div>
					{/if}
				</div>

				<!-- Mostramos un preview de la imagen seleccionada ANTES de subirla -->
				{#if archivoSeleccionado}
					<div class="preview-info">
						<p>Nuevo archivo: <span>{archivoSeleccionado.name}</span></p>
					</div>
				{/if}

				<!-- Acciones para cambiar y guardar la foto -->
				<div class="acciones-foto">
					<!-- Este botón abre el selector de archivos -->
					<button
						class="boton-accion secundario"
						on:click={() => inputArchivoFoto.click()}
						disabled={isUploading}
					>
						Cambiar Foto
					</button>

					<!-- Este botón solo aparece si hay un archivo seleccionado y lo sube -->
					{#if archivoSeleccionado}
						<button class="boton-accion primario" on:click={subirNuevaFoto} disabled={isUploading}>
							{#if isUploading}
								Subiendo...
							{:else}
								Guardar Foto
							{/if}
						</button>
					{/if}
				</div>
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

<!-- MODAL PARA GESTIONAR ESPECIALIDADES (Sin cambios) -->
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
								especialidadesSeleccionadas = especialidadesSeleccionadas;
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
	/* Estilos generales de la página (Sin cambios) */
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

	/* Estilos del formulario de edición (Sin cambios) */
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

	/* Estilos de la vista de información (Sin cambios) */
	.vista-info p {
		margin: 1rem 0;
		color: #ddd;
		font-size: 1.1rem;
	}
	.vista-info strong {
		color: #c0a080;
	}

	/* Estilos de especialidades (Sin cambios) */
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

	/* Estilos de los botones de acción (Sin cambios) */
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

	/* Estilos de los modales (Sin cambios) */
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

	/* ========================================================== */
	/* === ✅✅✅ NUEVOS ESTILOS PARA LA FOTO DE PERFIL ✅✅✅ === */
	/* ========================================================== */

	.contenedor-imagen-perfil {
		width: 180px;
		height: 180px;
		margin: 0 auto 1.5rem auto;
		border-radius: 50%;
		overflow: hidden;
		border: 4px solid #c0a080;
		background-color: #2a2a2a;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.imagen-perfil {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.placeholder-foto {
		text-align: center;
		color: #777;
		/* Ajustes para que se vea bien en el círculo */
		padding: 1rem;
		border: none;
		margin: 0;
		background: none;
	}
	.icono-foto {
		font-size: 3rem;
		display: block;
	}
	.preview-info {
		text-align: center;
		color: #ccc;
		font-style: italic;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}
	.preview-info span {
		font-weight: bold;
		color: #e0e0e0;
	}
	.acciones-foto {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
</style>
