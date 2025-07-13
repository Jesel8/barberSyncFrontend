<script>
  import '$lib/Styles/Global.css';
  import '$lib/Styles/Forms.css';
  import { loginUsuario } from '$lib/api/login'; // 👈 Importas la función

  let correo = '';
  let contrasena = '';

  async function handleLogin(event) {
    event.preventDefault();

    if (!correo || !contrasena) {
      alert("Por favor ingresa correo y contraseña.");
      return;
    }

    try {
      const data = await loginUsuario(correo, contrasena); // 👈 Llamas a la función

      // Redirigir según el rol
      if (data.rol === 'cliente') {
        window.location.href = '/cliente/dashboard';
      } else if (data.rol === 'barbero') {
        window.location.href = '/barbero/dashboard';
      } else if (data.rol === 'admin') {
        window.location.href = '/admin/dashboard';
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert(error.message || 'Ocurrió un error al iniciar sesión.');
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

      <button type="submit" class="entrar">Ingresar</button>
      <a href="/Login/Registrarse" class="crear">Crear cuenta</a>
    </form>
  </div>
</div>
