// server/Routes/ChatRoute.js
import express from 'express';
import { createChat, findUserChats, findChat } from '../Controllers/ChatController.js'; // Importaremos los controladores más adelante
import authMiddleWare from '../Middleware/authMiddleWare.js'; // Importamos el middleware de autenticación

const router = express.Router();

// Todas las rutas de chat deben estar protegidas ya que son entre usuarios logueados
router.post('/', authMiddleWare, createChat);           // Crear una nueva conversación (si no existe)
router.get('/:userId', authMiddleWare, findUserChats); // Obtener las conversaciones de un usuario
router.get('/find/:firstId/:secondId', authMiddleWare, findChat); // Encontrar una conversación entre dos IDs de usuario

export default router;