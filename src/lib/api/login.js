// src/lib/api/login.js

export async function loginUsuario(email, contrasena) {
	// ... (la petición fetch es la misma)
	const response = await fetch('http://localhost:8080/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: email, password: contrasena })
	});

	// ... (el manejo de errores es el mismo)
	let data;
	try {
		data = await response.json();
	} catch (e) {
		throw new Error('Respuesta del servidor no es un JSON válido');
	}
	if (!response.ok) {
		throw new Error(data.mensaje || 'Error al iniciar sesión');
	}

	// --- ¡LÓGICA SIMPLIFICADA! ---
	// Esta función ya no necesita manipular localStorage.
	// Su única responsabilidad es hacer la petición y devolver los datos.
	// El 'authStore.login()' se encargará de todo lo demás.

	return data; // Devuelve el objeto completo: { id, rol, nombreCompleto, token, ... }
}
