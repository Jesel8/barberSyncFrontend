// src/lib/api/login.js

export async function loginUsuario(email, contrasena) {
  // La petición se mantiene igual, pero ahora apunta al endpoint de login de Spring Security
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // El filtro de Spring espera las claves 'username' y 'password'.
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

  // --- ¡LÓGICA JWT! ---
  // Guardamos los datos del usuario Y el token JWT en localStorage.
  localStorage.setItem('idUsuario', data.idUsuario);
  localStorage.setItem('rol', data.rol);
  localStorage.setItem('nombre', data.nombreCompleto);
  localStorage.setItem('authToken', data.token); // <-- ¡LA LÍNEA MÁS IMPORTANTE!

  return data;
}