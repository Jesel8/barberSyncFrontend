// src/lib/api/login.js
export async function loginUsuario(email, contrasena) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, contrasena })
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

  // Guardar datos comunes
  localStorage.setItem('idUsuario', data.idUsuario);
  localStorage.setItem('rol', data.rol);
  localStorage.setItem('nombre', data.nombreCompleto);

  // Guardar ID específico según el rol
  if (data.rol === 'barbero') {
    localStorage.setItem('barberoId', data.idUsuario);
  } else if (data.rol === 'cliente') {
    localStorage.setItem('clienteId', data.idUsuario);
  } else if (data.rol === 'admin') {
    localStorage.setItem('adminId', data.idUsuario);
  }

  return data;
}
