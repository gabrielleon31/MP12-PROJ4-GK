// client/src/api/CommentRequest.js - CORREGIDO (USA LA INSTANCIA API EXPORTADA)

import axios from 'axios'; // Mantén esta línea si usas otras funciones de axios directamente.

// *** Importa la instancia API configurada con el interceptor desde UserRequest.js ***
import { API } from './UserRequest.js'; // <<< ¡SOLO SE IMPORTA AQUÍ!
// --- Fin Importación ---


// *** ELIMINAR ESTAS LÍNEAS (si existen en tu archivo): ***
// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL }); // <<< ¡ELIMINAR O COMENTAR!
// API.interceptors.request.use(req => { /* ... tu interceptor ... */ }); // <<< ¡ELIMINAR O COMENTAR TODO ESTE BLOQUE!
// *** FIN ELIMINAR ***


// Peticiones para comentarios
export const addComment    = (postId, data) => API.post(`/comment/${postId}`, data); // <<< Usa la instancia API importada
export const getComments   = (postId)         => API.get(`/comment/${postId}`);    // <<< Usa la instancia API importada

// export const getAllUsersAdmin = () => API.get('/admin/users'); // <<< Esta línea no debería estar aquí, pertenece a AdminRequest.js. ¡ELIMÍNALA! si estaba causando conflicto.