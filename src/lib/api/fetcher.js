// src/lib/api/fetcher.js

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescribir o añadir headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ya no se necesita 'credentials: include'
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) { // No Content
      return;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
      // Si la respuesta no es JSON, podría ser un error de texto plano
      throw new Error(`Error ${response.status}: El servidor no respondió con un JSON válido.`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.mensaje || `Error ${response.status}`);
  }

  return data;
}