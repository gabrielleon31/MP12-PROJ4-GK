import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser,
  searchUsers, // Asegúrate de que searchUsers está importado
} from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/authMiddleWare.js"; // Asegúrate de que está importado

const router = express.Router();

// --- RUTAS DE USUARIOS ---
// Nota: El orden importa. Las rutas más específicas deben ir antes que las más generales.

// Búsqueda de usuarios (más específica que /:id)
router.get("/search", searchUsers); // GET /user/search

// Listar todos los usuarios (público) (más específica que /:id)
router.get("/", getAllUsers); // GET /user

// Obtener un usuario por ID (más general que las anteriores)
router.get("/:id", getUser); // GET /user/:id

// Actualizar perfil (requiere token)
router.put("/:id", authMiddleWare, updateUser); // PUT /user/:id

// Eliminar usuario (requiere token)
router.delete("/:id", authMiddleWare, deleteUser); // DELETE /user/:id

// Seguir usuario
router.put("/:id/follow", authMiddleWare, followUser); // PUT /user/:id/follow

// Dejar de seguir usuario
router.put("/:id/unfollow", authMiddleWare, unFollowUser); // PUT /user/:id/unfollow

// --- FIN RUTAS DE USUARIOS ---

export default router;