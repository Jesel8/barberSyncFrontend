// src/lib/api/register.js

/**
 * Registra un nuevo usuario con el rol de CLIENTE.
 * Utiliza el endpoint seguro que no permite especificar un rol.
 *
 * @param {object} datosCliente - Un objeto con los datos del cliente.
 * @param {string} datosCliente.primerNombre
 * @param {string} [datosCliente.segundoNombre] - Opcional
 * @param {string} datosCliente.primerApellido
 * @param {string} [datosCliente.segundoApellido] - Opcional
 * @param {string} datosCliente.email
 * @param {string} datosCliente.contrasena
 * @returns {Promise<object>} La respuesta del servidor si el registro es exitoso.
 * @throws {Error} Si la petición falla o el servidor devuelve un error.
 */
export async function registrarCliente(datosCliente) {
	// Nota: No estamos usando el 'apiFetch' aquí porque el registro
	// es una acción pública y no requiere un token de autorización.
	const response = await fetch('http://localhost:8080/api/auth/register/client', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(datosCliente)
	});

	let data;
	try {
		// Intentamos parsear la respuesta como JSON, incluso si es un error,
		// porque nuestro backend envía los mensajes de error en formato JSON.
		data = await response.json();
	} catch (e) {
		// Si falla el parseo, es un error de red o una respuesta inesperada.
		throw new Error('Error de conexión o respuesta no válida del servidor.');
	}

	// Si la respuesta no fue exitosa (status no es 2xx), lanzamos un error.
	if (!response.ok) {
		// Usamos el mensaje del backend si está disponible, si no, un mensaje genérico.
		throw new Error(data.message || data.mensaje || 'Ocurrió un error durante el registro.');
	}

	// Si todo fue bien, devolvemos los datos (ej. un mensaje de éxito)
	console.log('✅ Registro de cliente exitoso:', data);
	return data;
}
