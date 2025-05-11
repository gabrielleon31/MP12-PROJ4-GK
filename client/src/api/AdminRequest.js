// client/src/api/AdminRequest.js - REVERTIDO (Sin funciones de actualización)

import axios from 'axios';
import { API } from './UserRequest.js'; // Importa la instancia API configurada

// Importa la instancia API configurada con el interceptor de autenticación
// Es CRUCIAL que uses una instancia de axios que ya tenga el interceptor
// que lee el token JWT del localStorage y lo añade a la cabecera Authorization.
// Si ya tienes una instancia API configurada en UserRequest.js o similar, úsala.

// --- Usa la instancia API ya configurada importada desde UserRequest.js ---
// Asegúrate de que UserRequest.js EXPORTA `const API`.
// NO debes crear una nueva instancia de axios aquí ni copiar el interceptor.

// --- PETICIONES API PARA ADMINISTRACIÓN ---

// GET /admin/users
export const getAllUsersAdmin = () => API.get('/admin/users');

// DELETE /admin/users/:id
export const deleteUserAdmin = (userId) => API.delete(`/admin/users/${userId}`);

// GET /admin/posts
export const getAllPostsAdmin = () => API.get('/admin/posts');

// DELETE /admin/posts/:id
export const deletePostAdmin = (postId) => API.delete(`/admin/posts/${postId}`);

// *** YA NO NECESITAMOS FUNCIONES DE ACTUALIZACIÓN AQUÍ ***
// export const updateUserAdmin = (userId, data) => API.put(`/admin/users/${userId}`, data);
// export const updatePostAdmin = (postId, data) => API.put(`/admin/posts/${postId}`, data);
// *** FIN NO NECESITAMOS FUNCIONES ***


// --- Puedes añadir más funciones API aquí para otras acciones de administración si las implementas ---
// export const getAdminStats = () => API.get('/admin/stats');
// export const deleteCommentAdmin = (commentId) => API.delete('/admin/comments/${commentId}');