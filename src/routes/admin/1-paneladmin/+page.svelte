<script>
  import '$lib/Styles/Global.css';
  import '$lib/Styles/nav.css';
  import '$lib/Styles/aside.css';
</script>

<input type="checkbox" id="menu-toggle" class="menu-toggle" />
<nav class="top">
  <label for="menu-toggle" class="menu-icon">
    <img src="/icons/Menu.svg" alt="Menu Icon" />
  </label>
  <div class="logo">
    <img src="/images/logo blanco.png" alt="Logo BarberSync" />
  </div>
  <div class="salir">
    <a href="/">
      <img src="/icons/Salir.svg" alt="Cerrar Sesión" />
    </a>
  </div>
</nav>

<div class="menu">
  <div class="fotoadmin">
    <img src="/icons/userfoto.svg" alt="" />
    <p class="nombre-usuario">Admin #1</p>
  </div>
  <ul>
    <li><a href="/">🏠 Inicio</a></li>
    <li><a href="/">✂️ Barberos</a></li>
    <li><a href="/">📅 Agendas</a></li>
    <li><a href="/">💈 Servicios</a></li>
    <li><a href="/">⭐ Opiniones</a></li>
  </ul>
</div>

<main class="contenido-admin">
  <h1 class="titulo-principal">Dashboard de Administrador</h1>
  <div class="grid-cards">
    <div class="card">
      <img src="https://cdn-icons-png.flaticon.com/128/3039/3039407.png" />
      <div>
        <h3>Barberos registrados</h3>
        <p>6</p>
      </div>
    </div>
    <div class="card">
      <img src="https://cdn-icons-png.flaticon.com/128/2942/2942911.png" />
      <div>
        <h3>Servicios activos</h3>
        <p>9</p>
      </div>
    </div>
    <div class="card">
      <img src="https://cdn-icons-png.flaticon.com/128/10736/10736087.png" />
      <div>
        <h3>Citas agendadas</h3>
        <p>12</p>
      </div>
    </div>
    <div class="card">
      <img src="https://cdn-icons-png.flaticon.com/128/2462/2462719.png" />
      <div>
        <h3>Opiniones recibidas</h3>
        <p>4</p>
      </div>
    </div>
  </div>
</main>

<style>
.contenido-admin {
  margin-left: 260px;
  margin-top: 60px;   
  padding: 2rem;
  color: white;
  min-height: calc(100vh - 60px);
}



.titulo-principal {
  margin-bottom: 2rem;
  text-align: center;
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  background-color: #2f2f2f;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
}

.card img {
  width: 60px;
  height: 60px;
}

.card h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #C0A080;
}

.card p {
  margin: 0;
  font-size: 1.6rem;
  font-weight: bold;
  color: white;
}

</style>