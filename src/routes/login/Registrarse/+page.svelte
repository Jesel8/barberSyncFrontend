<!-- src/routes/register/+page.svelte -->
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

		// Validaciones básicas en el frontend (puedes añadir más)
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
			// Opcional: Redirigir al usuario a la página de login después de unos segundos
			setTimeout(() => {
				goto('/login'); // Redirige a la página de inicio de sesión
			}, 3000); // 3 segundos
		} catch (e) {
			// Si la función 'registrarCliente' lanza un error, lo capturamos aquí
			error = e.message;
			console.error('Error en el registro:', e);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="register-container">
	<h2>Crear una Cuenta</h2>
	<p>Regístrate para poder agendar tus citas fácil y rápido.</p>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="primerNombre">Primer Nombre</label>
			<input type="text" id="primerNombre" bind:value={datosFormulario.primerNombre} required />
		</div>
		<div class="form-group">
			<label for="segundoNombre">Segundo Nombre (Opcional)</label>
			<input type="text" id="segundoNombre" bind:value={datosFormulario.segundoNombre} />
		</div>
		<div class="form-group">
			<label for="primerApellido">Primer Apellido</label>
			<input type="text" id="primerApellido" bind:value={datosFormulario.primerApellido} required />
		</div>
		<div class="form-group">
			<label for="segundoApellido">Segundo Apellido (Opcional)</label>
			<input type="text" id="segundoApellido" bind:value={datosFormulario.segundoApellido} />
		</div>
		<div class="form-group">
			<label for="email">Correo Electrónico</label>
			<input type="email" id="email" bind:value={datosFormulario.email} required />
		</div>
		<div class="form-group">
			<label for="contrasena">Contraseña</label>
			<input
				type="password"
				id="contrasena"
				bind:value={datosFormulario.contrasena}
				minlength="8"
				required
			/>
		</div>

		{#if error}
			<p class="error-message">{error}</p>
		{/if}

		{#if exito}
			<p class="success-message">
				¡Registro exitoso! Serás redirigido a la página de inicio de sesión...
			</p>
		{/if}

		<button type="submit" disabled={isLoading}>
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

<style>
	.register-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
	.form-group {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.5rem;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
	}
	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	button:disabled {
		background-color: #aaa;
	}
	.error-message {
		color: red;
		margin-bottom: 1rem;
	}
	.success-message {
		color: green;
		margin-bottom: 1rem;
	}
	.login-link {
		text-align: center;
		margin-top: 1rem;
	}
</style>
