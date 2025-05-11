// Este es el archivo server/Routes/PostRoute.js
import express from 'express';
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  like_dislike_Post,
  timeline,
  searchPosts,
  getAllPosts
} from '../Controllers/PostController.js';
import authMiddleWare from '../Middleware/authMiddleWare.js';


const router = express.Router();

// --- RUTAS DE POSTS ---
// Nota: El orden importa. Las rutas más específicas deben ir antes que las más generales.
// Todas estas rutas deberían estar protegidas por authMiddleWare.

// Búsqueda de posts
router.get('/search', authMiddleWare, searchPosts);

// Obtener todos los posts (para homepage, filtra los propios en controller)
router.get('/all', authMiddleWare, getAllPosts); // <-- RUTA /all

// Obtener timeline de un usuario (solo sus posts, para su perfil)
router.get('/:id/timeline', authMiddleWare, timeline); // <-- RUTA /:id/timeline

// Crear un post
router.post('/', authMiddleWare, createPost);

// Obtener un post por ID (para página de post individual)
router.get('/:id', authMiddleWare, getPost);

// Editar un post
router.put('/:id', authMiddleWare, updatePost);

// Eliminar un post
router.delete('/:id', authMiddleWare, deletePost);

// Dar like / unlike
router.put('/:id/like_dislike', authMiddleWare, like_dislike_Post); // Usa req.userId en el controller

// --- FIN RUTAS DE POSTS ---

export default router;