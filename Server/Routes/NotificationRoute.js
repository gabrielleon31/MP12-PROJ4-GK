// Este es el archivo server/Routes/NotificationRoute.js
import express from 'express';
import { getNotifications, markAllAsRead /*, deleteNotification */ } from '../Controllers/NotificationController.js';
import authMiddleWare from '../Middleware/authMiddleWare.js'; // Importamos el middleware

const router = express.Router();
console.log("NotificationRoute.js loaded and router created"); // Log de depuración

// --- RUTAS DE NOTIFICACIONES ---
// Todas las rutas de notificaciones deben estar protegidas ya que son para un usuario específico.

// GET /notification/ - Obtener todas las notificaciones del usuario logueado
router.get('/', authMiddleWare, getNotifications);

// PUT /notification/read - Marcar todas las notificaciones del usuario logueado como leídas
router.put('/read', authMiddleWare, markAllAsRead);

// DELETE /notification/:id - Eliminar una notificación específica (opcional)
// router.delete('/:id', authMiddleWare, deleteNotification);

// --- FIN RUTAS DE NOTIFICACIONES ---

export default router;