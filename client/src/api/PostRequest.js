// client/src/api/PostRequest.js - CORREGIDO (USA LA INSTANCIA API EXPORTADA)

import axios from 'axios'; // Mantén esta línea si usas otras funciones de axios directamente.

// *** Importa la instancia API configurada con el interceptor desde UserRequest.js ***
import { API } from './UserRequest.js'; // <<< ¡SOLO SE IMPORTA AQUÍ!
// --- Fin Importación ---

// *** ELIMINAR ESTAS LÍNEAS (si existen en tu archivo): ***
// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
// API.interceptors.request.use(req => { /* ... tu interceptor ... */ });
// ... cualquier otro interceptor local ...
// *** FIN ELIMINAR ***


// --- Peticiones para posts ---
// Nota: El orden importa. Las rutas más específicas deben ir antes que las más generales.

// Petición para obtener la timeline de un usuario específico (solo sus posts)
export const getTimelinePosts = id =>
  API.get(`/post/${id}/timeline`); // <<< Usa la instancia API importada

// Petición para obtener todos los posts (excluyendo los del usuario logueado en backend)
export const getAllPosts = () =>
  API.get('/post/all'); // <<< Usa la instancia API importada

// Petición para dar like / unlike a un post (backend usa req.userId del middleware)
export const likePost = (id) => // Ya no necesita pasar userId en el cuerpo si el backend lo saca del token
  API.put(`/post/${id}/like_dislike`); // <<< Usa la instancia API importada

// Petición para buscar posts (asegurarse de que el parámetro de query es 'q')
export const searchPosts = query =>
  API.get(`/post/search?q=${encodeURIComponent(query)}`); // Cambiado 'query' a 'q' si el backend espera 'q' <<< Usa la instancia API importada

// Petición para subir un post (crear)
export const uploadPost = data =>
  API.post('/post', data); // <<< Usa la instancia API importada

// Petición para obtener un post por ID (para SinglePostPage)
export const getPost = id =>
  API.get(`/post/${id}`); // <-- AÑADIDO <<< Usa la instancia API importada

// Petición para actualizar un post
export const updatePost = (id, data) => // Asumiendo que data es el cuerpo de la actualización
  API.put(`/post/${id}`, data); // <<< Usa la instancia API importada

// Petición para eliminar un post
export const deletePost = (id) => // El userId ya debería estar en el middleware del backend
  API.delete(`/post/${id}`); // <<< Usa la instancia API importada

// --- FIN PETICIONES POSTS ---