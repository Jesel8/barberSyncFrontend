<script>
	import { registrarCliente } from '$lib/api/register.js';
	import { goto } from '$app/navigation';

	// Variables para vincular con los inputs del formulario
	let datosFormulario = {
		primerNombre: '',
		segundoNombre: '',
		primerApellido: '',
		segundoApellido: '',
		email: '',
		contrasena: ''
	};

	let error = ''; // Para mostrar mensajes de error al usuario
	let isLoading = false; // Para mostrar un indicador de carga
	let exito = false; // Para mostrar un mensaje de éxito

	async function handleSubmit() {
		isLoading = true;
		error = '';
		exito = false;

		// Validaciones básicas en el frontend
		if (
			!datosFormulario.primerNombre ||
			!datosFormulario.primerApellido ||
			!datosFormulario.email ||
			!datosFormulario.contrasena
		) {
			error = 'Por favor, completa todos los campos obligatorios.';
			isLoading = false;
			return;
		}

		try {
			// Llamamos a nuestra nueva función de la API
			await registrarCliente(datosFormulario);

			// Si el registro es exitoso
			exito = true;
			// Redirigir al usuario a la página de login después de unos segundos
			setTimeout(() => {
				goto('/login');
			}, 3000);
		} catch (e) {
			// Si la función 'registrarCliente' lanza un error, lo capturamos aquí
			error = e.message;
			console.error('Error en el registro:', e);
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- NAVBAR DE RETORNO (Sin cambios) -->
<nav class="top-nav-simple">
	<div class="logo">
		<a href="/">
			<img src="/assets/images/logo blanco.png" alt="Logo BarberSync" />
		</a>
	</div>
	<div class="return-action">
		<a href="/" title="Volver al inicio">
			<img src="/assets/icons/return.svg" alt="Volver" />
			<span>Volver al Inicio</span>
		</a>
	</div>
</nav>

<!-- CONTENEDOR PRINCIPAL (Sin cambios en HTML) -->
<div class="register-container">
	<div class="register-box">
		<h2>Crear una Cuenta</h2>
		<p class="subtitle">Regístrate para poder agendar tus citas fácil y rápido.</p>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-grid">
				<div class="form-group">
					<label for="primerNombre">Primer Nombre</label>
					<input
						type="text"
						id="primerNombre"
						bind:value={datosFormulario.primerNombre}
						required
						autocomplete="given-name"
					/>
				</div>
				<div class="form-group">
					<label for="segundoNombre">Segundo Nombre</label>
					<input
						type="text"
						id="segundoNombre"
						bind:value={datosFormulario.segundoNombre}
						autocomplete="additional-name"
					/>
				</div>
				<div class="form-group">
					<label for="primerApellido">Primer Apellido</label>
					<input
						type="text"
						id="primerApellido"
						bind:value={datosFormulario.primerApellido}
						required
						autocomplete="family-name"
					/>
				</div>
				<div class="form-group">
					<label for="segundoApellido">Segundo Apellido</label>
					<input type="text" id="segundoApellido" bind:value={datosFormulario.segundoApellido} />
				</div>
			</div>
			<div class="form-group">
				<label for="email">Correo Electrónico</label>
				<input
					type="email"
					id="email"
					bind:value={datosFormulario.email}
					required
					autocomplete="email"
				/>
			</div>
			<div class="form-group">
				<label for="contrasena">Contraseña</label>
				<input
					type="password"
					id="contrasena"
					bind:value={datosFormulario.contrasena}
					minlength="8"
					required
					autocomplete="new-password"
				/>
			</div>

			{#if error}
				<p class="error-message">{error}</p>
			{/if}

			{#if exito}
				<p class="success-message">¡Registro exitoso! Serás redirigido para iniciar sesión...</p>
			{/if}

			<button type="submit" class="cta-button" disabled={isLoading}>
				{#if isLoading}
					Registrando...
				{:else}
					Crear Cuenta
				{/if}
			</button>
		</form>

		<p class="login-link">
			¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
		</p>
	</div>
</div>

<style>
	/* === ESTILOS PARA LA NAVBAR Y EL TEMA OSCURO === */
	:root {
		--color-primario: #c0a080;
		--color-fondo: #121212;
		--color-superficie: #1e1e1e;
		--color-borde: #444;
		--color-texto-principal: #e0e0e0;
		--color-texto-secundario: #a0a0a0;
	}

	.top-nav-simple {	
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background-color: var(--color-superficie);
		border-bottom: 1px solid var(--color-borde);
	}

	.top-nav-simple .logo img {
		height: 50px;
		vertical-align: middle;
	}

	.return-action a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: var(--color-texto-principal);
		font-weight: bold;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-borde);
		border-radius: 8px;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.return-action a:hover {
		background-color: #333;
		border-color: var(--color-primario);
	}

	.return-action img {
		height: 20px;
		filter: invert(90%);
	}

	/* === ESTILOS MEJORADOS PARA EL CONTENEDOR Y FORMULARIO === */
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 80px);
		padding: 2rem;
		background-color: var(--color-fondo);
	}

	.register-box form {
		margin-left: 60px;
		width: 100%;
		max-width: 600px;
		padding: 2.5rem;
		background-color: var(--color-superficie);
		border: 1px solid var(--color-borde);
		border-radius: 12px;
		color: var(--color-texto-principal);
		box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
		/* Esto asegura que el contenido interno se alinee correctamente */
	}

	h2 {
		text-align: center;
		color: var(--color-primario);
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		text-align: center;
		color: var(--color-texto-secundario);
		margin-bottom: 2rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #ccc;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		box-sizing: border-box;
		background-color: #2c2c2c;
		border: 1px solid var(--color-borde);
		border-radius: 6px;
		color: var(--color-texto-principal);
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primario);
	}

	.cta-button {
		width: 100%;
		padding: 0.85rem;
		margin-top: 1rem;
		background-color: var(--color-primario);
		color: #111;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.cta-button:hover:not(:disabled) {
		background-color: #d4b090;
	}

	.cta-button:disabled {
		background-color: #555;
		color: #888;
		cursor: not-allowed;
	}

	.error-message {
		color: #ff6b6b;
		background-color: rgba(255, 107, 107, 0.1);
		border: 1px solid #ff6b6b;
		padding: 0.75rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		text-align: center;
	}

	.success-message {
		color: #50fa7b;
		background-color: rgba(80, 250, 123, 0.1);
		border: 1px solid #50fa7b;
		padding: 0.75rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		text-align: center;
	}

	.login-link {
		text-align: center;
		margin-top: 1.5rem;
		color: var(--color-texto-secundario);
	}

	.login-link a {
		color: var(--color-primario);
		font-weight: bold;
		text-decoration: none;
	}
	.login-link a:hover {
		text-decoration: underline;
	}
</style>
