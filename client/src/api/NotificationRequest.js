// client/src/api/NotificationRequest.js - CORREGIDO (USA LA INSTANCIA API EXPORTADA)

import axios from 'axios'; // Mantén esta línea si usas otras funciones de axios directamente.

// *** Importa la instancia API configurada con el interceptor desde UserRequest.js ***
import { API } from './UserRequest.js'; // <<< ¡SOLO SE IMPORTA AQUÍ!
// --- Fin Importación ---

// *** ELIMINAR ESTAS LÍNEAS (si existen en tu archivo): ***
// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
// API.interceptors.request.use(req => { /* ... tu interceptor ... */ });
// ... cualquier otro interceptor local ...
// *** FIN ELIMINAR ***


// Peticiones para notificaciones
// GET /notification/
export const getNotifications = () => API.get('/notification/'); // <<< Usa la instancia API importada

// PUT /notification/read
export const markAllAsRead = () => API.put('/notification/read'); // <<< Usa la instancia API importada

// Opcional: Eliminar una notificación específica
// export const deleteNotification = (notificationId) => API.delete(`/notification/${notificationId}`); // <<< Usa la instancia API importada

// export const getAllUsersAdmin = () => API.get('/admin/users'); // <<< Esta línea no debería estar aquí, pertenece a AdminRequest.js. ¡ELIMÍNALA! si estaba causando conflicto.