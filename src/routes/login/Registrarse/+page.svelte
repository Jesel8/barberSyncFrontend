<script>
  import '$lib/Styles/Global.css'
  import'$lib/Styles/Forms.css';
</script>
  <div class="formcard-container">
    <div class="formcard">
      <h1>Crear cuenta</h1>
      <form>
        <label for="nombre">
        <img src="/src/static/assets/icons/user.svg" alt="icono usuario" class="icon" />Nombre
        </label>
        <input type="text" id="nombre" name="nombre" required>

        <label for="correo">
        <img src="/src/static/assets/icons/mail.svg" alt="icono correo" class="icon" />Correo Electrónico
        </label>
        <input type="email" id="correo" name="correo" required>

        <label for="telefono">
         <img src="/src/static/assets/icons/phone-call.svg" alt="icono contraseña" class="icon" />Teléfono
        </label>
        <input type="text" id="telefono" name="telefono" required>

        <label for="contrasena">
        <img src="/src/static/assets/icons/lock.svg" alt="icono contraseña" class="icon" />Contraseña
        </label>
        <input type="password" id="contrasena" name="contrasena" required>

        <button class="entrar" type="submit">Comenzar</button>
      </form>
    </div>
  </div>