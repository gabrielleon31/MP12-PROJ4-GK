// client/src/api/UploadRequest.js - CORREGIDO (USA LA INSTANCIA API EXPORTADA Y EXPORTA uploadImage Y uploadPost)

import axios from "axios"; // Mantén esta línea si usas otras funciones de axios directamente.

// *** Importa la instancia API configurada con el interceptor desde UserRequest.js ***
import { API } from './UserRequest.js'; // <<< ¡SOLO SE IMPORTA AQUÍ!
// --- Fin Importación ---

// *** ELIMINAR ESTAS LÍNEAS (si existen en tu archivo): ***
// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL }); // <<< ¡ELIMINAR O COMENTAR!
// API.interceptors.request.use(req => { /* ... tu interceptor ... */ }); // <<< ¡ELIMINAR O COMENTAR TODO ESTE BLOQUE!
// *** FIN ELIMINAR ***


// Peticiones para subir archivos (imágenes para posts, perfil, etc.)
export const uploadImage = (formData) =>
  API.post("/upload", formData, { // <<< Usa la instancia API importada
    headers: { "Content-Type": "multipart/form-data" },
  });

// Petición para subir un post completo (texto + imagen si la hay)
// Esta función usa la API para ENVIAR el post al backend.
// El backend probablemente espera { userId, desc, image (nombre del archivo si se subió) }
// Asegúrate de que esta función esté bien definida para cómo la usas en PostShare.js o UploadAction.js
export const uploadPost = (postData) => // <<< ¡Exporta esta función!
  API.post("/post", postData); // <<< Usa la instancia API importada. El token lo añade el interceptor.


// *** ELIMINAR ESTA LÍNEA (no debería estar aquí, pertenece a AdminRequest.js): ***
// export const getAllUsersAdmin = () => API.get('/admin/users'); // <<< ¡ELIMINAR O COMENTAR!
// *** FIN ELIMINAR ***