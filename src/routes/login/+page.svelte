<script>
  import '$lib/Styles/Global.css';
  import '$lib/Styles/Forms.css';
  import { loginUsuario } from '$lib/api/login';
  import { authStore } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation'; // <-- ¡IMPORTAMOS GOTO!

  let correo = '';
  let contrasena = '';
  let errorMensaje = '';
  let cargando = false;

  async function handleLogin() {
    if (cargando) return;
    cargando = true;
    errorMensaje = '';

    if (!correo || !contrasena) {
      errorMensaje = "Por favor ingresa correo y contraseña.";
      cargando = false;
      return;
    }

    try {
      const datosUsuario = await loginUsuario(correo, contrasena);
      
      // La función loginUsuario ya guarda el token en localStorage.
      // Ahora, guardamos los datos del usuario en el store para que la UI reaccione.
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
          errorMensaje = "Rol de usuario desconocido.";
          cargando = false;
          return;
      }
      
      // --- ¡CAMBIO CLAVE! ---
      // Usamos goto para una navegación rápida de SPA. Ya no necesitamos
      // forzar una recarga completa porque no dependemos de cookies.
      await goto(targetUrl, { replaceState: true });

    } catch (error) {
      console.error('Error en login:', error);
      errorMensaje = error.message || 'Correo o contraseña incorrectos.';
      cargando = false;
    }
  }
</script>

<div class="formcard-container">
  <div class="formcard">
    <h1>Iniciar Sesión</h1>
    <form on:submit|preventDefault={handleLogin}>
      <label for="correo">
        <img src="/icons/mail.svg" alt="icono correo" class="icon" />
        Correo Electrónico
      </label>
      <input type="email" id="correo" name="correo" bind:value={correo} required />

      <label for="contrasena">
        <img src="/icons/lock.svg" alt="icono contraseña" class="icon" />
        Contraseña
      </label>
      <input type="password" id="contrasena" name="contrasena" bind:value={contrasena} required />
      
      {#if errorMensaje}
        <p class="error-mensaje">{errorMensaje}</p>
      {/if}

      <button type="submit" class="entrar" disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar'}
      </button>

      <a href="/Login/Registrarse" class="crear">Crear cuenta</a>
    </form>
  </div>
</div>

<style>
  /* Tus estilos están bien */
  .error-mensaje {
    color: #ff6b6b;
    background-color: rgba(255, 107, 107, 0.1);
    border: 1px solid #ff6b6b;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.9em;
    text-align: center;
    margin-top: 10px;
  }
  
  button:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>