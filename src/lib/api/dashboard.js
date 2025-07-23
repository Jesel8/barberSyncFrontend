// $lib/api/dashboard.js

// Función para obtener el token desde localStorage
function getToken() {
    if (typeof window === 'undefined') {
        return null;
    }
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
        return null;
    }
    const usuario = JSON.parse(usuarioString);
    // Asumo que el token está guardado dentro del objeto de usuario
    return usuario.token; 
}


export async function obtenerResumenDashboard() {
    const token = getToken();

    // Si no hay token, no podemos hacer la petición
    if (!token) {
        console.error('No se encontró token de autenticación.');
        // Devolvemos los valores por defecto para que no se rompa la UI
        return { totalBarberos: 0, totalServicios: 0, totalCitas: 0, totalResenas: 0 };
    }

    try {
        // Hacemos todas las peticiones en paralelo para más eficiencia
        const [resUsuarios, resServicios, resCitas, resResenas] = await Promise.all([
            fetch('http://54.197.147.238:8080/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://54.197.147.238:8080/api/servicios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://54.197.147.238:8080/api/citas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            fetch('http://54.197.147.238:8080/api/resenas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        ]);

        // Verificamos si alguna petición falló (p. ej. por token inválido)
        if (!resUsuarios.ok || !resServicios.ok || !resCitas.ok || !resResenas.ok) {
            console.error('Una o más peticiones al dashboard fallaron.');
            // Aquí podrías manejar el error, por ejemplo, deslogueando al usuario
            // authStore.logout(); 
            return { totalBarberos: 0, totalServicios: 0, totalCitas: 0, totalResenas: 0 };
        }

        const dataUsuarios = await resUsuarios.json();
        const dataServicios = await resServicios.json();
        const dataCitas = await resCitas.json();
        const dataResenas = await resResenas.json();

        // Asumo que la API devuelve un array y queremos su longitud
        return {
            totalBarberos: dataUsuarios.length,
            totalServicios: dataServicios.length,
            totalCitas: dataCitas.length,
            totalResenas: dataResenas.length
        };

    } catch (error) {
        console.error('Error al obtener el resumen del dashboard:', error);
        return { totalBarberos: 0, totalServicios: 0, totalCitas: 0, totalResenas: 0 };
    }
}