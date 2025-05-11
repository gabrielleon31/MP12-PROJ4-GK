// Este es el archivo server/Controllers/CommentController.js
import Comment from '../Models/Comment.js';
import PostModel from '../Models/postModel.js'; // Necesario para obtener el autor del post para notificaciones
import NotificationModel from '../Models/Notification/Notification.js'; // Asegúrate de que esté importado
import mongoose from 'mongoose'; // Necesario si usas mongoose.Types.ObjectId.isValid


// Agregar un comentario
export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId; // Obtener postId de params

    // *** CAMBIO CLAVE: Obtener userId del middleware de autenticación (authMiddleWare) ***
    // req.userId contiene el ID del usuario logueado si la ruta está protegida
    const userId = req.userId; // <--- OBTENER userId DESDE req.userId (middleware)
    // *** FIN CAMBIO CLAVE ***

    const { text } = req.body; // Obtener solo el texto del body (NO userId)

    // Validación básica del texto del comentario
    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    // Opcional: Validar que el postId es un ID válido de Mongoose si cambiaste postId a ObjectId en Comment.js
    // if (!mongoose.Types.ObjectId.isValid(postId)) {
    //    return res.status(400).json({ message: "Invalid Post ID format" });
    // }


    const newComment = new Comment({
      postId: postId,
      userId: userId, // <--- Usar el userId del usuario autenticado (string ID)
      text:   text.trim() // Limpiar espacios en blanco
    });

    // Guardar el nuevo comentario
    const savedComment = await newComment.save();

    // --- LÓGICA PARA CREAR NOTIFICACIÓN DE COMENTARIO ---
    // Obtener el post para saber quién es el autor (dueño del post)
    // Asumimos que postModel usa ObjectId para userId y _id
    const post = await PostModel.findById(postId);

    // Solo crear notificación si el usuario que comenta NO es el autor del post
    // post.userId es un ObjectId, userId es una string del token desde authMiddleWare
    if (post && post.userId && post.userId.toString() !== userId.toString()) { // Comparar IDs como strings
         const newNotification = new NotificationModel({
             type: 'comment',
             senderId: userId,         // Quien comentó (string ID del middleware)
             receiverId: post.userId,   // Dueño del post (ObjectId)
             postId: postId,            // Post comentado (String ID)
             commentId: savedComment._id, // Comentario creado (ObjectId)
             text: text.trim().substring(0, 50) + (text.trim().length > 50 ? '...' : ''), // Fragmento del comentario
         });
         await newNotification.save();
         console.log(`Notification created: Comment on post ${postId} by user ${userId}`);
    } else if (!post) {
        console.warn(`Notification: Could not find post ${postId} to create comment notification.`);
    }
    // --- FIN LÓGICA NOTIFICACIÓN ---

    // *** CAMBIO CLAVE: Popular el comentario recién creado antes de devolverlo ***
    // Usar el ID del comentario guardado para obtenerlo de la DB y popular el autor
    // Asumimos que CommentModel usa ObjectId para userId y ref: 'Users'
    const populatedComment = await Comment.findById(savedComment._id).populate('userId', 'firstname lastname profilePicture');
    // *** FIN CAMBIO CLAVE ***

    // Devolver el comentario guardado y POPULADO al frontend
    res.status(201).json(populatedComment);

  } catch (err) {
    console.error("Error adding comment:", err); // Log detallado del error
    // Podemos añadir manejo específico para errores de validación (ej: userId missing)
     if (err.name === 'ValidationError') {
         console.error("Comment Validation Error:", err.errors);
         // Si falta el userId (lo que pasaría sin authMiddleWare en la ruta), devolvemos 401 más específico
         if (err.errors.userId) {
              return res.status(401).json({ message: "Unauthorized: User ID is missing or invalid." });
         }
         return res.status(400).json({ message: err.message }); // Otros errores de validación
     }
    res.status(500).json({ message: err.message });
  }
};


// Obtener comentarios para un post específico
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId; // Obtener postId de params

    // Opcional: Validar que postId es un ID válido de Mongoose si cambiaste postId a ObjectId en Comment.js
    // if (!mongoose.Types.ObjectId.isValid(postId)) {
    //    return res.status(400).json({ message: "Invalid Post ID format" });
    // }

    // *** CAMBIO CLAVE: Popular el campo userId al obtener los comentarios ***
    // Buscar comentarios por postId, ordenar por fecha de creación (más recientes primero)
    // y POPULAR el campo userId para incluir la información del autor
    const comments = await Comment.find({ postId: postId })
      .sort({ createdAt: -1 }) // Opcional: ordenar por más recientes
      .populate('userId', 'firstname lastname profilePicture'); // <-- ¡ESTE ES EL CAMBIO CLAVE! Popular userId
    // *** FIN CAMBIO CLAVE ***

    res.status(200).json(comments); // Devolver la lista de comentarios POPULADOS

  } catch (err) {
    console.error(`Error getting comments for post ${req.params.postId}:`, err); // Log más específico
    res.status(500).json({ message: err.message });
  }
};