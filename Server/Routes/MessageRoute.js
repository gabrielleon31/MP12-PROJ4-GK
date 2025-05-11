// server/Routes/MessageRoute.js
import express from 'express';
import { addMessage, getMessages } from '../Controllers/MessageController.js'; // Importaremos los controladores más adelante
import authMiddleWare from '../Middleware/authMiddleWare.js'; // Importamos el middleware de autenticación

const router = express.Router();

// Todas las rutas de mensajes deben estar protegidas
router.post('/', authMiddleWare, addMessage);       // Añadir un nuevo mensaje
router.get('/:chatId', authMiddleWare, getMessages); // Obtener los mensajes de una conversación por su ID

export default router;