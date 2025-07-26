// src/lib/api/login.js

export async function loginUsuario(email, contrasena) {
	const response = await fetch('http://54.197.147.238:8080/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: email, password: contrasena })
	});

	let data;
	try {
		data = await response.json();
	} catch (e) {
		throw new Error('Respuesta del servidor no es un JSON válido');
	}
	if (!response.ok) {
		throw new Error(data.mensaje || 'Error al iniciar sesión');
	}


	return data; // Devuelve el objeto completo: { id, rol, nombreCompleto, token, ... }
}
