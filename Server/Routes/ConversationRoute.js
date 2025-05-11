// server/Routes/ConversationRoute.js - CON LOG AL ENTRAR EN EL ROUTER

import express from 'express';
import { findOrCreateChat, getUserChats } from '../Controllers/ConversationController.js'; // Asegúrate de importar ambos
import authMiddleWare from '../Middleware/authMiddleWare.js';

const router = express.Router();

console.log("ConversationRoute.js loaded.");

// *** AÑADE ESTE MIDDLEWARE PARA VER SI LA PETICIÓN LLEGA A ESTE ROUTER ***
router.use((req, res, next) => {
    console.log(`Backend: Entering ConversationRoute - ${req.method} ${req.url}`);
    next(); // Continúa al siguiente middleware o ruta DENTRO de este router
});
// --- Fin Log Middleware Router ---


// POST /conversation/
router.post('/', authMiddleWare, findOrCreateChat);

// GET /conversation/:userId (Asegúrate de que esta línea NO está comentada)
router.get('/:userId', authMiddleWare, getUserChats);

// ... (otras rutas) ...

export default router;