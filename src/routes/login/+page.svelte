<script>
  import '$lib/Styles/Global.css';
  import '$lib/Styles/Forms.css';
  import { loginUsuario } from '$lib/api/login';
  
  // 1. IMPORTAR EL STORE DE AUTENTICACIÓN
  import { authStore } from '$lib/stores/authStore.js';

  let correo = '';
  let contrasena = '';
  let errorMensaje = ''; // Para mostrar errores de forma más limpia

  async function handleLogin(event) {
    event.preventDefault();
    errorMensaje = ''; // Limpiar errores previos

    if (!correo || !contrasena) {
      errorMensaje = "Por favor ingresa correo y contraseña.";
      return;
    }

    try {
      const datosUsuario = await loginUsuario(correo, contrasena);

      // 2. ¡EL PASO CLAVE! GUARDAR LOS DATOS EN EL STORE
      // Asumo que tu API de login devuelve un objeto con 'id', 'nombre', 'rol', etc.
      // Por ejemplo: { id: 1, nombre: 'Jesel', rol: 'barbero' }
      authStore.login(datosUsuario);

      // 3. Redirigir según el rol (el resto del código es el mismo)
      // La API debería devolver el rol en un formato consistente (ej: 'CLIENTE', 'BARBERO')
      switch (datosUsuario.rol.toLowerCase()) {
        case 'cliente':
          window.location.href = '/cliente/dashboard';
          break;
        case 'barbero':
          window.location.href = '/barbero/dashboard';
          break;
        case 'admin':
          window.location.href = '/admin/1-paneladmin';
          break;
        default:
          errorMensaje = "Rol de usuario desconocido.";
      }
    } catch (error) {
      console.error('Error en login:', error);
      errorMensaje = error.message || 'Correo o contraseña incorrectos.';
    }
  }
</script>

<div class="formcard-container">
  <div class="formcard">
    <h1>Iniciar Sesión</h1>
    <form on:submit={handleLogin}>
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
      
      <!-- Mostrar el mensaje de error si existe -->
      {#if errorMensaje}
        <p class="error-mensaje">{errorMensaje}</p>
      {/if}

      <button type="submit" class="entrar">Ingresar</button>
      <a href="/Login/Registrarse" class="crear">Crear cuenta</a>
    </form>
  </div>
</div>

<style>
  .error-mensaje {
    color: red;
    font-size: 0.9em;
    text-align: center;
    margin-top: 10px;
  }
</style>