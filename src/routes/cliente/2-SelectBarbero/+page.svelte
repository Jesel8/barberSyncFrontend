<script>
  import '$lib/Styles/pasos.css';
  import '$lib/Styles/Barber.css';
  import '$lib/Styles/Global.css';
  import '$lib/Styles/nav.css';

  let barberoSeleccionado = null;

  const barberos = [
    { id: 1, nombre: 'Carlos', especialidad: 'Cortes clásicos', imagen: '' },
    { id: 2, nombre: 'Jesel', especialidad: 'Diseños modernos', imagen: '' },
    { id: 3, nombre: 'Jorge', especialidad: 'Corte urbano y barba', imagen: '' }
  ];

  function obtenerImagen(barbero) {
    return barbero.imagen && barbero.imagen.trim() !== ''
      ? barbero.imagen
      : '/icons/userfoto.svg';
  }

  function continuar() {
    if (barberoSeleccionado) {
      const barberoElegido = barberos.find(b => b.id === barberoSeleccionado);

      let cita = {};
      const almacenado = localStorage.getItem('citaParcial');
      if (almacenado) {
        cita = JSON.parse(almacenado);
      }

      cita.barbero = {
        id: barberoElegido.id,
        nombre: barberoElegido.nombre,
        especialidad: barberoElegido.especialidad
      };

      localStorage.setItem('citaParcial', JSON.stringify(cita));

      window.location.href = '/cliente/3-selectservice';
    }
  }
</script>

<!-- NAVBAR -->
<nav class="top">
  <div class="logo">
    <img src="/images/logo blanco.png" alt="Logo BarberSync" />
  </div>
</nav>

<!-- TÍTULO -->
<h1 class="titulo-panel"><span style="color: white;">Selecciona tu</span> Barbero</h1>

<!-- BARRA DE PROGRESO -->
<div class="barra-progreso-container">
  <div class="barra-etiquetas">
    <span class="activo">Barberos</span>
    <span>Servicios</span>
    <span>Fecha y Hora</span>
    <span>Completado</span>
  </div>
  <div class="barra-fondo">
    <div class="barra-avance paso-1"></div>
  </div>
</div>

<!-- SELECCIÓN DE BARBEROS -->
<section class="seleccion-barbero">
  <div class="grid-barberos">
    {#each barberos as barbero}
      <div
        class="card-barbero"
        class:seleccionado={barberoSeleccionado === barbero.id}
        on:click={() => barberoSeleccionado = barbero.id}
      >
        <img
          src={obtenerImagen(barbero)}
          alt={"Barbero " + barbero.nombre}
        />
        <h3>{barbero.nombre}</h3>
        <p>{barbero.especialidad}</p>
      </div>
    {/each}
  </div>

  <div class="boton-continuar">
    <button on:click={continuar} disabled={!barberoSeleccionado}>
      Continuar
    </button>
  </div>
</section>
