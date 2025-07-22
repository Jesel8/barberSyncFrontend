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

			// 2. ¡La clave está aquí! Esperamos un "tick" del renderizado.
			await tick();

			// 3. Ahora que el #if se ha procesado y los canvas existen, los creamos.
			console.log('REPORTE-PAGE: DOM actualizado, creando gráficos...');
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
		if (!ctx || !data || data.length === 0) {
			console.warn(
				'REPORTE-PAGE: No se pudo crear el gráfico de servicios (sin datos o sin canvas).'
			);
			return;
		}

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
					legend: {
						position: 'top',
						labels: { color: '#FFFFFF' }
					}
				}
			}
		});
	}

	function crearGraficoDias(data) {
		const ctx = document.getElementById('diasChart');
		if (!ctx || !data || data.length === 0) {
			console.warn('REPORTE-PAGE: No se pudo crear el gráfico de días (sin datos o sin canvas).');
			return;
		}

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
