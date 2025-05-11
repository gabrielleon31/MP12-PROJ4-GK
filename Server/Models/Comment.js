// Este es el archivo server/Models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  // postId:    { type: String, required: true }, // Considera cambiar a ObjectId y ref: 'Posts'
  // Mantengo postId como String asumiendo que es como está en otras partes de tu base de datos.
  postId: {
      type: String, // O mongoose.Schema.Types.ObjectId si tu postModel referencia comentarios por ObjectId
      required: true
  },
  userId:    {
      type: mongoose.Schema.Types.ObjectId, // <-- CAMBIO CLAVE: Usar ObjectId
      ref: 'Users', // <-- Referencia al modelo de usuarios (asegúrate que tu userModel.js usa 'Users')
      required: true // Es requerido porque necesitas saber quién comentó
  },
  text:      { type: String, required: true },
  createdAt: { type: Date,   default: Date.now } // Fecha de creación automática
});

// Opcional: Añadir índices para búsquedas eficientes
commentSchema.index({ postId: 1, createdAt: -1 }); // Índice por post y fecha (más recientes primero)


const CommentModel = mongoose.model('Comment', commentSchema); // Asegúrate que el nombre del modelo es 'Comment'

export default CommentModel;