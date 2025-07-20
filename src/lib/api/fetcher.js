// src/lib/api/fetcher.js

export async function apiFetch(url, options = {}) {
	const token = localStorage.getItem('authToken');

	// Copiamos las cabeceras de las opciones originales para no modificarlas directamente
	const headers = { ...options.headers };

	// Siempre intentamos añadir el Content-Type por defecto si no viene uno
	if (!headers['Content-Type']) {
		headers['Content-Type'] = 'application/json';
	}

	// Si hay un token, lo añadimos a las cabeceras
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Creamos el objeto final de configuración para fetch
	const config = {
		...options, // Esto incluye method (GET, POST), body, etc.
		headers // Sobrescribimos los headers con nuestra versión actualizada
	};

	const response = await fetch(url, config);

	// El código para manejar la respuesta ya era correcto, lo mantenemos.
	if (response.status === 204) {
		// No Content
		return; // Éxito sin contenido, como en un DELETE
	}

	const text = await response.text();
	let data;

	if (text) {
		try {
			data = JSON.parse(text);
		} catch (e) {
			// La respuesta exitosa no era JSON, pero podría ser texto plano.
			// Si la respuesta no fue 'ok', el error se lanzará más abajo.
			// Si fue 'ok', devolvemos el texto plano.
			if (response.ok) return text;

			// Si no fue 'ok' y no es JSON, lanzamos el error de parseo.
			throw new Error(`Error ${response.status}: El servidor no respondió con un JSON válido.`);
		}
	}

	if (!response.ok) {
		// Si hay 'data' y tiene un mensaje, lo usamos. Si no, usamos el status.
		const errorMessage = data?.message || data?.mensaje || `Error ${response.status}`;
		throw new Error(errorMessage);
	}

	return data; // Puede ser un objeto JSON o undefined si la respuesta estaba vacía
}
