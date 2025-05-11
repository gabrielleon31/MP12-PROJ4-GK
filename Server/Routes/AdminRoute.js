// server/Routes/AdminRoute.js - REVERTIDO (Rutas PUT comentadas)

import express from 'express';
const router = express.Router();

// --- Importar los middlewares ---
import authMiddleWare from '../Middleware/authMiddleWare.js'; // Para verificar que el usuario está logueado
import isAdminMiddleWare from '../Middleware/isAdminMiddleWare.js'; // Para verificar que el usuario es administrador
// --- Fin Importación Middlewares ---

// --- Importar los controladores de administración ---
// Ya no necesitamos importar los controladores de actualización aquí si las rutas PUT están comentadas
import {
    getAllUsersAdmin,
    deleteUserAdmin,
    getAllPostsAdmin,
    deletePostAdmin,
    // Ya NO importamos los controladores de actualización aquí
    // updateUserAdmin,
    // updatePostAdmin,
    // ... otros controladores
} from '../Controllers/AdminController.js'; // Asegúrate de que AdminController.js tiene las funciones que SÍ usas (get/delete)
// --- Fin Importación Controladores ---


console.log("AdminRoute.js loaded and router created.");

// Middleware para verificar autenticación Y permisos de administrador para *todas* las rutas en este router
router.use(authMiddleWare);
router.use(isAdminMiddleWare);

console.log("AdminRoute.js - Applied authMiddleWare and isAdminMiddleWare to all routes.");


// --- RUTAS DE ADMINISTRACIÓN ---
// Todas estas rutas ahora requieren que el usuario esté autenticado Y sea administrador

// GET /admin/users - Obtener la lista completa de todos los usuarios
router.get('/users', getAllUsersAdmin);

// DELETE /admin/users/:id - Eliminar un usuario específico por su ID
router.delete('/users/:id', deleteUserAdmin);

// GET /admin/posts - Obtener la lista completa de todos los posts
router.get('/posts', getAllPostsAdmin);

// DELETE /admin/posts/:id - Eliminar un post específico por su ID
router.delete('/posts/:id', deletePostAdmin);


// --- RUTAS DE ACTUALIZACIÓN (COMENTADAS DE NUEVO) ---
// Si no vas a usar la edición, puedes dejar estas rutas comentadas o eliminarlas
// router.put('/users/:id', updateUserAdmin); // <<< COMENTADA DE NUEVO
// router.put('/posts/:id', updatePostAdmin); // <<< COMENTADA DE NUEVO

// --- Puedes añadir más rutas de administración aquí si las necesitas ---
// router.get('/stats', getAdminDashboardStats);
// router.delete('/comments/:id', deleteCommentAdmin);

// --- FIN RUTAS DE ADMINISTRACIÓN ---


export default router;