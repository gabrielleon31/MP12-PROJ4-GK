// client/src/api/UserRequest.js - ¡CORREGIDO Y EXPORTANDO LA INSTANCIA API!

import axios from "axios";

// *** EXPORTA la instancia API para que otros archivos puedan usarla ***
export const API = axios.create({ // <<< ¡SE AÑADIÓ 'export' AQUÍ!
  baseURL: process.env.REACT_APP_API_URL, // Asegúrate de que REACT_APP_API_URL está configurado correctamente en tu .env
});

console.log("Axios Base URL:", process.env.REACT_APP_API_URL);

// Interceptor para añadir el token de autenticación
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("profile");
  if (profile) {
    try {
       const userProfile = JSON.parse(profile);
       if (userProfile.token) {
           req.headers.Authorization = `Bearer ${userProfile.token}`;
       }
    } catch (e) {
        console.error("Failed to parse profile from localStorage in UserRequest interceptor:", e);
    }
  }
  return req;
}, error => {
    console.error("UserRequest Request interceptor error:", error);
    return Promise.reject(error);
});

// Interceptor para manejar respuestas (opcional)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("UserRequest Response interceptor error:", error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);


// --- Peticiones API de Usuario (ya existentes) ---
export const getUser = (userId) => API.get(`/user/${userId}`);
export const updateUser = (id, formData) => API.put(`/user/${id}`, formData);
export const getAllUsers = () => API.get("/user");
export const followUser = (id, data) => API.put(`/user/${id}/follow`, data);
export const unFollowUser = (id, data) => API.put(`/user/${id}/unfollow`, data);
export const searchUsers = (q) => API.get(`/user/search?q=${encodeURIComponent(q)}`);


// --- PETICIONES API PARA CHAT Y MENSAJES (URLs CORREGIDAS) ---

// Petición para obtener las conversaciones de un usuario logueado
// Endpoint Backend ESPERADO: GET /conversation/:userId
export const getUserChats = (userId) => API.get(`/conversation/${userId}`); // <-- CORREGIDO: /conversation/:userId

// Petición para ENCONTRAR O CREAR una conversación entre dos usuarios
// Endpoint Backend ESPERADO: POST /conversation/
export const findOrCreateConversation = (senderId, receiverId) => API.post('/conversation/', { senderId, receiverId }); // <-- Esta URL ya estaba bien

// Petición para añadir un nuevo mensaje a una conversación
// Endpoint Backend ESPERADO: POST /message/
export const addMessage = (messageData) => API.post('/message/', messageData); // <-- Esta URL ya estaba bien

// Petición para obtener los mensajes de una conversación específica
// Endpoint Backend ESPERADO: GET /message/:chatId
export const getMessages = (chatId) => API.get(`/message/${chatId}`); // <-- Esta URL ya estaba bien


// --- FIN PETICIONES CHAT Y MENSAJES ---


// Ya no necesitas exportar la instancia API al final si ya la exportaste al principio.
// export { API }; // Elimina o comenta esta línea si estaba presente