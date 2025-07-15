// src/lib/api/barberos.js

const BASE_URL = 'http://localhost:8080/api';

// --- FUNCIÓN HELPER PARA OBTENER EL TOKEN ---
// La añadimos aquí para que todas las funciones de este archivo puedan usarla.
function getToken() {
    // Esta función solo se ejecuta en el navegador, por lo que 'window' existe.
    if (typeof window === 'undefined') return null;
    
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
        console.error('No se encontró el objeto de usuario en localStorage.');
        return null;
    }
    
    const usuario = JSON.parse(usuarioString);
    // Asegúrate de que tu objeto de usuario en localStorage tenga una propiedad 'token'.
    return usuario ? usuario.token : null;
}

// Obtener todos los usuarios con rol barbero
export async function obtenerBarberos() {
  const token = getToken(); // <-- CAMBIO CLAVE: Obtenemos el token
  if (!token) throw new Error('Usuario no autenticado. No se puede obtener barberos.');

  const res = await fetch(`${BASE_URL}/usuarios?rol=BARBERO`, {
    headers: {
      'Authorization': `Bearer ${token}` // <-- CAMBIO CLAVE: Enviamos el token
    }
  });
  if (!res.ok) throw new Error('Error al obtener barberos');
  return await res.json();
}

// Crear un nuevo barbero (acción de admin)
export async function crearBarbero(data) {
  const token = getToken(); // <-- CAMBIO CLAVE
  if (!token) throw new Error('Usuario no autenticado. No se puede crear barbero.');

  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // <-- CAMBIO CLAVE
    },
    body: JSON.stringify({ ...data, rolId: 1 }) // rolId para barbero es 1
  });
  if (!res.ok) throw new Error('Error al crear barbero');
  return await res.json();
}

// Eliminar un barbero (acción de admin)
export async function eliminarBarbero(id) {
  const token = getToken(); // <-- CAMBIO CLAVE
  if (!token) throw new Error('Usuario no autenticado. No se puede eliminar barbero.');

  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}` // <-- CAMBIO CLAVE
    }
  });
  if (!res.ok) throw new Error('Error al eliminar barbero');
}

// Obtener especialidades del barbero
export async function obtenerEspecialidades(idUsuario) {
  const token = getToken(); // <-- CAMBIO CLAVE
  if (!token) throw new Error('Usuario no autenticado. No se pueden obtener especialidades.');

  const res = await fetch(`${BASE_URL}/barberos/especialidades/${idUsuario}`, {
    headers: {
      'Authorization': `Bearer ${token}` // <-- CAMBIO CLAVE
    }
  });
  if (!res.ok) throw new Error('Error al obtener especialidades del barbero');
  return await res.json();
}

// Actualizar especialidades del barbero
export async function actualizarEspecialidades(idUsuario, especialidadesIds) {
  const token = getToken(); // <-- CAMBIO CLAVE
  if (!token) throw new Error('Usuario no autenticado. No se pueden actualizar especialidades.');

  const res = await fetch(`${BASE_URL}/barberos/especialidades/${idUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // <-- CAMBIO CLAVE
    },
    body: JSON.stringify({ idUsuario, idEspecialidades: especialidadesIds })
  });
  if (!res.ok) throw new Error('Error al actualizar especialidades');
}

// Eliminar todas las especialidades (si la usas, también necesita el token)
export async function eliminarEspecialidades(idUsuario) {
  const token = getToken(); // <-- CAMBIO CLAVE
  if (!token) throw new Error('Usuario no autenticado. No se pueden eliminar especialidades.');

  const res = await fetch(`${BASE_URL}/barberos/especialidades/${idUsuario}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}` // <-- CAMBIO CLAVE
    }
  });
  if (!res.ok) throw new Error('Error al eliminar especialidades');
}