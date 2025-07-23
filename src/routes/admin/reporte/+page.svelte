<script>
	import { onMount, onDestroy, tick } from 'svelte';
	// Importamos las funciones de la API que ya creamos
	import { obtenerServiciosMasAgendados, obtenerDiasMasOcupados } from '$lib/api/reportes.js';
	// Importamos Chart.js que ya instalamos
	import { Chart, registerables } from 'chart.js';

	// Estado local de la página
	let cargandoGraficos = true;
	let errorGraficos = null;
	let serviciosChartInstance = null;
	let diasChartInstance = null;

	onMount(async () => {
		Chart.register(...registerables);

		try {
			// Hacemos las dos llamadas a la API en paralelo para más eficiencia
			const [dataServicios, dataDias] = await Promise.all([
				obtenerServiciosMasAgendados(),
				obtenerDiasMasOcupados('2025-06-22', '2025-07-22') // Usa fechas reales
			]);

			cargandoGraficos = false;
			await tick(); // Esperamos que Svelte actualice el DOM

			// Ahora que los <canvas> existen, creamos los gráficos
			crearGraficoServicios(dataServicios);
			crearGraficoDias(dataDias);
		} catch (error) {
			console.error('REPORTE-PAGE: Fallo al cargar los datos:', error);
			errorGraficos = 'No se pudieron cargar los reportes. Revisa la consola.';
			cargandoGraficos = false;
		}
	});

	function crearGraficoServicios(data) {
		const ctx = document.getElementById('serviciosChart');
		if (!ctx || !data || data.length === 0) return;

		serviciosChartInstance = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: data.map((item) => item.nombreServicio),
				datasets: [
					{
						label: 'Total Agendado',
						data: data.map((item) => item.totalAgendado),
						backgroundColor: ['#c0a080', '#A0A0A0', '#4B4B4B', '#FFFFFF', '#7A6B5D'],
						borderColor: '#252525',
						hoverOffset: 4
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top', labels: { color: '#FFFFFF' } }
				}
			}
		});
	}

	function crearGraficoDias(data) {
		const ctx = document.getElementById('diasChart');
		if (!ctx || !data || data.length === 0) return;

		diasChartInstance = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: data.map((item) => item.diaSemana),
				datasets: [
					{
						label: 'Total de Citas',
						data: data.map((item) => item.totalCitas),
						backgroundColor: '#c0a080',
						borderColor: '#A0A0A0',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#404040' } },
					x: { ticks: { color: '#A0A0A0' }, grid: { color: '#404040' } }
				},
				plugins: {
					legend: { display: false }
				}
			}
		});
	}

	// Buena práctica: Destruir los gráficos al salir de la página para liberar memoria
	onDestroy(() => {
		if (serviciosChartInstance) serviciosChartInstance.destroy();
		if (diasChartInstance) diasChartInstance.destroy();
		console.log('REPORTE-PAGE: Gráficos destruidos.');
	});
</script>

<!-- === NAVBAR AÑADIDA === -->
<nav class="top">
	<label for="menu-toggle" class="menu-icon">
		<img src="/src/static/assets/icons/Menu.svg" alt="Menu Icon" />
	</label>
	<div class="logo">
		<img src="/src/static/assets/images/logo blanco.png" alt="Logo BarberSync" />
	</div>
	<div class="salir">
		<a href="/admin/1-paneladmin" title="Cerrar Sesión">
			<img src="/src/static/assets/icons/Salir.svg" alt="Cerrar Sesión" />
		</a>
	</div>
</nav>

<main class="contenido-reportes">
	<header class="reportes-header">
		<h1 class="titulo-principal">Reportes Gráficos</h1>
		<p class="subtitulo">Análisis visual de la actividad en BarberSync.</p>
	</header>

	{#if cargandoGraficos}
		<div class="contenedor-carga">
			<p class="mensaje-carga">Cargando reportes...</p>
		</div>
	{:else if errorGraficos}
		<div class="contenedor-error">
			<p>{errorGraficos}</p>
		</div>
	{:else}
		<section class="grid-graficos">
			<div class="grafico-card">
				<h3>Servicios Más Populares (Histórico)</h3>
				<canvas id="serviciosChart"></canvas>
			</div>
			<div class="grafico-card">
				<h3>Días de Mayor Actividad (Últimos 30 días)</h3>
				<canvas id="diasChart"></canvas>
			</div>
		</section>
	{/if}
</main>

<style>
	/* --- ESTILOS DE NAVBAR AÑADIDOS --- */
	nav.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 2rem;
		background-color: #1f1f1f;
		border-bottom: 1px solid #444;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.logo img {
		height: 50px;
		vertical-align: middle;
	}

	.menu-icon,
	.salir {
		display: flex;
		align-items: center;
	}

	.menu-icon img,
	.salir img {
		height: 24px;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.menu-icon:hover img,
	.salir a:hover img {
		opacity: 0.8;
	}

	@media (min-width: 768px) {
		.menu-icon {
			display: none;
		}
	}
	/* --- FIN DE ESTILOS DE NAVBAR --- */

	.contenido-reportes {
		padding: 2rem 3rem;
		color: white;
		min-height: 100vh;
	}

	.reportes-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.titulo-principal {
		font-size: 2.5rem;
		font-weight: 700;
		color: #c0a080;
		margin-bottom: 0.5rem;
	}

	.subtitulo {
		font-size: 1.1rem;
		color: #a0a0a0;
		margin-top: 0;
	}

	.grid-graficos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
	}

	.grafico-card {
		background: linear-gradient(145deg, #2e2e2e, #252525);
		border-radius: 12px;
		padding: 1.5rem 2rem;
		border: 1px solid #404040;
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
	}

	.grafico-card h3 {
		text-align: center;
		color: #c0a080;
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.contenedor-carga,
	.contenedor-error {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 50vh;
		grid-column: 1 / -1;
	}

	.mensaje-carga {
		font-size: 1.5rem;
		color: #c0a080;
	}

	.contenedor-error {
		padding: 2rem;
		background-color: rgba(255, 99, 132, 0.1);
		border: 1px solid rgba(255, 99, 132, 0.5);
		border-radius: 8px;
		color: #ffcdd2;
	}
</style>
