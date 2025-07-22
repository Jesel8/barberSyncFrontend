<script>
	import '$lib/styles/Global.css';
	// Mantenemos la importación, aunque muchos estilos los definiremos aquí para mayor claridad.
	import '$lib/styles/Forms.css';
	import { loginUsuario } from '$lib/api/login';
	import { authStore } from '$lib/stores/authStore.js';
	import { goto } from '$app/navigation';

	let correo = '';
	let contrasena = '';
	// --- CAMBIO CLAVE ---
	// Inicializamos el mensaje de error como vacío para que no aparezca al inicio.
	let errorMensaje = '';
	let cargando = false;

	// --- TU LÓGICA DE LOGIN PERMANECE 100% INTACTA ---
	async function handleLogin() {
		if (cargando) return;
		cargando = true;
		errorMensaje = ''; // Limpiamos errores previos al intentar de nuevo

		if (!correo || !contrasena) {
			errorMensaje = 'Por favor ingresa correo y contraseña.';
			cargando = false;
			return;
		}

		try {
			const datosUsuario = await loginUsuario(correo, contrasena);
			authStore.login(datosUsuario);
			let targetUrl = '';
			switch (datosUsuario.rol.toLowerCase()) {
				case 'cliente':
					targetUrl = '/cliente/1-panel';
					break;
				case 'barbero':
					targetUrl = '/barbero/dashboard';
					break;
				case 'admin':
					targetUrl = '/admin/1-paneladmin';
					break;
				default:
					errorMensaje = 'Rol de usuario desconocido.';
					cargando = false;
					return;
			}
			await goto(targetUrl, { replaceState: true });
		} catch (error) {
			console.error('Error en login:', error);
			errorMensaje = error.message || 'Correo o contraseña incorrectos.';
		} finally {
			// Se asegura de que 'cargando' se ponga en false al final de todo
			cargando = false;
		}
	}
</script>

<!-- Contenedor principal que centra todo vertical y horizontalmente -->
<div class="form-container">
	<div class="form-card">
		<div class="form-header">
			<img
				src="/src/static/assets/images/logo blanco.png"
				alt="Logo BarberSync"
				class="logo-form"
			/>
			<h2>Iniciar Sesión</h2>
		</div>

		<form on:submit|preventDefault={handleLogin}>
			<!-- Grupo de Correo -->
			<div class="input-group">
				<label for="correo">Correo Electrónico</label>
				<img src="/src/static/assets/icons/mail.svg" alt="" class="icon" />
				<input
					type="email"
					id="correo"
					placeholder="ejemplo@correo.com"
					bind:value={correo}
					required
				/>
			</div>

			<!-- Grupo de Contraseña -->
			<div class="input-group">
				<label for="contrasena">Contraseña</label>
				<img src="/src/static/assets/icons/lock.svg" alt="" class="icon" />
				<input
					type="password"
					id="contrasena"
					placeholder="••••••••"
					bind:value={contrasena}
					required
				/>
			</div>

			<!-- Bloque de Error Condicional -->
			{#if errorMensaje}
				<div class="error-container">
					<p class="error-mensaje">{errorMensaje}</p>
				</div>
			{/if}

			<!-- Botón de Envío -->
			<button type="submit" class="entrar" disabled={cargando}>
				{cargando ? 'Ingresando...' : 'Ingresar'}
			</button>

			<!-- Enlace para Registrarse -->
			<div class="link-registro">
				<span>¿No tienes una cuenta?</span>
				<a href="/login/Registrarse">Créala aquí</a>
			</div>
		</form>
	</div>
</div>

<style>
	/* ----- ESTILOS COMPLETAMENTE RENOVADOS ----- */
	:root {
		--brand-color: #c0a080;
		--error-color: #ff6b6b;
		--dark-bg: #1a1a1a;
		--card-bg: #252525;
		--input-bg: #333;
		--text-color: #f0f0f0;
		--text-muted: #888;
	}

	.form-container {
		display: grid;
		place-items: center; /* Centra el contenido en ambos ejes */
		min-height: 100vh;
		background: var(--dark-bg);
		padding: 1rem;
		font-family: 'Poppins', sans-serif;
	}

	.form-card {
		width: 100%;
		max-width: 420px;
		background: var(--card-bg);
		padding: 2.5rem 3rem;
		border-radius: 16px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	}

	.form-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo-form {
		width: 150px;
		margin-bottom: 1rem;
	}

	.form-header h2 {
		color: var(--text-color);
		font-weight: 600;
		font-size: 1.8rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.input-group {
		position: relative;
	}

	.input-group label {
		display: block;
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.input-group .icon {
		position: absolute;
		top: 55%;
		left: 12px;
		width: 20px;
		height: 20px;
		opacity: 0.4;
	}

	input[type='email'],
	input[type='password'] {
		width: 100%;
		padding: 0.9rem 0.9rem 0.9rem 2.5rem; /* Padding izquierdo para el icono */
		background: var(--input-bg);
		border: 1px solid #444;
		border-radius: 8px;
		color: var(--text-color);
		font-size: 1rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	input[type='email']:focus,
	input[type='password']:focus {
		outline: none;
		border-color: var(--brand-color);
		box-shadow: 0 0 0 3px rgba(192, 160, 128, 0.2);
	}

	.error-container {
		padding: 0.8rem;
		text-align: center;
		background-color: rgba(255, 107, 107, 0.1);
		border: 1px solid var(--error-color);
		border-radius: 8px;
	}

	.error-mensaje {
		color: var(--error-color);
		font-size: 0.9rem;
		margin: 0;
	}

	.entrar {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		background: var(--brand-color);
		color: #1a1a1a;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: filter 0.2s;
		margin-top: 1rem;
	}
	.entrar:hover:not(:disabled) {
		filter: brightness(1.1);
	}
	.entrar:disabled {
		background-color: #555;
		color: #999;
		cursor: not-allowed;
		opacity: 0.7;
	}

	.link-registro {
		text-align: center;
		margin-top: 1rem;
		font-size: 0.9rem;
		color: var(--text-muted);
	}
	.link-registro a {
		color: var(--brand-color);
		text-decoration: none;
		font-weight: 600;
		transition: text-decoration 0.2s;
	}
	.link-registro a:hover {
		text-decoration: underline;
	}
</style>
