// Este es el archivo server/Controllers/PostController.js
import PostModel from '../Models/postModel.js';
import UserModel from '../Models/userModel.js'; // Asegúrate de importar UserModel
import NotificationModel from '../Models/Notification/Notification.js'; // Asegúrate de que esté importado
import mongoose from 'mongoose';


// Crear un post
export const createPost = async (req, res) => {
  try {
    const newPost = new PostModel({ ...req.body, userId: req.userId }); // Usar req.userId del middleware
    const saved = await newPost.save();
    // Popular el autor en la respuesta
    const populatedPost = await saved.populate('userId', 'firstname lastname profilePicture');
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener un post por ID
export const getPost = async (req, res) => {
  try {
    // Popular el autor al obtener un post individual
    const post = await PostModel.findById(req.params.id).populate('userId', 'firstname lastname profilePicture');
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).json("Post not found");
    }
  } catch (err) {
     console.error("Error getting post:", err);
    res.status(500).json({ message: err.message });
  }
};

// Editar un post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  // Usamos req.userId del middleware de autenticación para verificar la autoría
  // No confíes en el userId que viene en req.body para la verificación
  const loggedInUserId = req.userId;

  try {
    const post = await PostModel.findById(postId);

    // Verificar si el usuario logueado es el autor del post
    // post.userId es un ObjectId, loggedInUserId es una string del token
    if (!post) {
        return res.status(404).json("Post not found");
    }
    if (post.userId.toString() !== loggedInUserId) {
      return res.status(403).json("Action forbidden - You are not the author of this post"); // Acción prohibida si no es el autor
    }

    // Si el usuario es el autor, actualizamos el post
    // $set actualiza solo los campos presentes en req.body (desc, image)
    // Asegúrate de que req.body SOLO contenga los campos que se pueden actualizar (desc, image)
    // y NO el userId o _id del post. El frontend en EditPostModal ya debería hacer esto.
    await post.updateOne({ $set: req.body });

    // Opcional: Si la actualización incluye eliminar la imagen, puedes eliminar el archivo físico aquí
    // if (req.body.image === null && post.image) {
    //   // Lógica para eliminar el archivo físico post.image del sistema de archivos del servidor
    //   // Esto requiere importar 'fs' y 'path' y construir la ruta completa del archivo
    // }


    // Después de actualizar, obtener el post actualizado y POPULAR el autor
    const updatedPost = await PostModel.findById(postId).populate('userId', 'firstname lastname profilePicture');

    // Devolver el post actualizado y populado al frontend
    res.status(200).json(updatedPost); // <-- ¡Este es el cambio clave en la respuesta!

  } catch (err) {
    console.error(`Error updating post ${postId}:`, err); // Log más específico
    res.status(500).json({ message: err.message });
  }
};

// Borrar un post
export const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (post && post.userId && post.userId.toString() === req.userId) { // Usar req.userId y comparar con toString()
      await post.deleteOne();
      res.status(200).json('Post deleted');
    } else if (!post) {
       res.status(404).json('Post not found');
    } else {
        res.status(403).json('Action forbidden: You can only delete your own posts');
    }
  } catch (err) {
     console.error("Error deleting post:", err);
    res.status(500).json({ message: err.message });
  }
};

// Dar like / unlike
export const like_dislike_Post = async (req, res) => {
  const id = req.params.id; // Post ID
  // req.userId viene del middleware de autenticación (authMiddleWare)
  const loggedInUserId = req.userId;

  try {
    const post = await PostModel.findById(id);

    if (!post) {
        return res.status(404).json("Post not found");
    }

    // Verificar si el usuario ya ha dado like a este post
    if (post.likes.includes(loggedInUserId)) {
      // Si ya dio like, quitamos el like ($pull)
      await post.updateOne({ $pull: { likes: loggedInUserId } });

      // Opcional: Eliminar la notificación de like si existe (complicado si puede haber varios likes)
      // await NotificationModel.deleteOne({ type: 'like', senderId: loggedInUserId, postId: id });

      // Después de quitar el like, obtener el post actualizado de la DB
      // y popular el autor para asegurarnos de que la respuesta es consistente
      const updatedPost = await PostModel.findById(id).populate('userId', 'firstname lastname profilePicture');

      // Devolver el post actualizado al frontend
      res.status(200).json(updatedPost); // <-- ¡Devolver el post actualizado!

    } else {
      // Si no ha dado like, añadir el like ($push)
      await post.updateOne({ $push: { likes: loggedInUserId } });

       // --- Crear Notificación de Like ---
       // Solo crear si el usuario que dio like no es el autor del post
       if (post.userId.toString() !== loggedInUserId) {
           const newNotification = new NotificationModel({
               type: 'like',
               senderId: loggedInUserId,    // Quien dio like
               receiverId: post.userId,     // Dueño del post
               postId: id,                // Post likado
               // commentId: null, // No aplica
               // text: null,      // No aplica
           });
           await newNotification.save();
           console.log(`Notification created: Like on post ${id} by user ${loggedInUserId}`);
       }
      // --- Fin Notificación ---

      // Después de dar like, obtener el post actualizado de la DB
      // y popular el autor para asegurarnos de que la respuesta es consistente
      const updatedPost = await PostModel.findById(id).populate('userId', 'firstname lastname profilePicture');


      // Devolver el post actualizado al frontend
      res.status(200).json(updatedPost); // <-- ¡Devolver el post actualizado!

    }
  } catch (err) {
    console.error(`Error liking/disliking post ${id}:`, err); // Log más específico
    res.status(500).json({ message: err.message });
  }
};

// Obtener posts de un usuario específico (para su página de perfil)
export const timeline = async (req, res) => {
  const profileUserId = req.params.id;

  try {
    // Obtener solo los posts de este usuario, ordenados por fecha descendente
    // Y popular el campo userId
    const userPosts = await PostModel.find({ userId: profileUserId })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstname lastname profilePicture'); // <-- AÑADIDO POPULATE

    res.status(200).json(userPosts);
  } catch (err) {
    console.error(`Error getting user's timeline posts for user ${profileUserId}:`, err);
    res.status(500).json({ message: err.message });
  }
};

// Búsqueda de posts (por descripción, case-insensitive)
export const searchPosts = async (req, res) => {
  const q = req.query.q || '';

  try {
    // Buscar posts por descripción y popular el autor
    const posts = await PostModel.find({
      desc: { $regex: q, $options: 'i' }
    })
    .populate('userId', 'firstname lastname profilePicture'); // <-- AÑADIDO POPULATE

    res.status(200).json(posts);
  } catch (err) {
     console.error("Error searching posts:", err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener todos los posts (para el feed principal/homepage)
export const getAllPosts = async (req, res) => {
  try {
    // Obtener todos los posts, ordenar, popular y filtrar los propios
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'firstname lastname profilePicture'); // <-- AÑADIDO POPULATE

    // Según tu lógica, quieres ver solo posts de *otros*. Filtramos aquí.
    const postsOfOthers = posts.filter(post => post.userId && post.userId._id && post.userId._id.toString() !== req.userId); // Usar req.userId y comparar ID populado

    res.status(200).json(postsOfOthers);
  } catch (err) {
    console.error("Error getting all posts:", err);
    res.status(500).json({ message: err.message });
  }
};