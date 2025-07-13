<script>
    import '$lib/Styles/nav.css'
    import '$lib/Styles/Global.css'
</script>

<nav class="top">
  <div class="logo">
    <img src="/images/logo blanco.png" alt="Logo BarberSync" />
  </div>
</nav>
<style>
  .titulo-panel {
  text-align: center;
  font-size: 2.5rem;
  margin-top: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
  .panel-usuario {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 4rem 2rem;
  flex-wrap: wrap;
  background-color: #252525;
}

.card-opcion {
  text-decoration: none;
  background-color: #333;
  border-radius: 20px;
  width: 280px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  cursor: pointer;
}

.card-opcion:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 20px rgba(0,0,0,0.2);
}

.card-opcion img {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.card-opcion h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #C0A080;
}

.card-opcion p {
  font-size: 0.95rem;
  color: #fffdfd;
}
</style>
<h1 class="titulo-panel"><span style="color: white;">Panel de</span> Usuario</h1>
<section class="panel-usuario">
  <a href="/cliente/2-SelectBarbero" class="card-opcion">
    <img src="/icons/calendartwo.svg" alt="Servicios" />
    <h3>Agendar Cita</h3>
    <p>Explora y agenda cortes, barba y más.</p>
  </a>

  <a href="/cliente/Historial" class="card-opcion">
    <img src="/icons/calendarone.svg" alt="Horarios" />
    <h3>Ver Citas</h3>
    <p>Consulta disponibilidad y reserva tu cita.</p>
  </a>

  <a href="/" class="card-opcion">
    <img src="/icons/Salir.svg" alt="Salir" />
    <h3>Salir</h3>
    <p>Contáctanos o ubícanos fácilmente.</p>
  </a>
</section>
 