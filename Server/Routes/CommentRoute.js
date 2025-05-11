// Este es el archivo server/Routes/CommentRoute.js
import express from 'express';
import { addComment, getComments } from '../Controllers/CommentController.js';
// --- Importar el middleware de autenticación ---
import authMiddleWare from '../Middleware/authMiddleWare.js'; // <-- Asegúrate de importar authMiddleWare
// --- Fin Importación ---


const router = express.Router();
console.log("CommentRoute.js loaded and router created"); // Log de depuración

// --- RUTAS DE COMENTARIOS ---

// POST   /comment/:postId - PARA AÑADIR UN COMENTARIO (Requiere autenticación)
// Aplicamos authMiddleWare antes del controlador addComment
router.post('/:postId', authMiddleWare, addComment); // <-- ¡CAMBIO CLAVE: Añadir authMiddleWare!

// GET    /comment/:postId - PARA OBTENER COMENTARIOS (No requiere autenticación)
router.get('/:postId', getComments); // No se aplica authMiddleWare aquí

// --- FIN RUTAS DE COMENTARIOS ---


export default router;