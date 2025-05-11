// Este es el archivo server/Models/Notification/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        // Tipo de notificación: 'like', 'comment', 'follow', 'message' (para futuros mensajes)
        type: {
            type: String,
            required: true,
            enum: ['like', 'comment', 'follow', 'message'] // Asegúrate que estos tipos coincidan con los que usas en los controladores
        },
        // Usuario que generó la notificación (ej: quien dio like, quien comentó, quien siguió)
        senderId: {
            type: mongoose.Schema.Types.ObjectId, // Usamos ObjectId para referenciar al usuario
            ref: 'Users', // Referencia a la colección de Usuarios (asegúrate que tu userModel.js usa 'Users')
            required: true
        },
        // Usuario que recibe la notificación (el dueño del post, el seguido, etc.)
        receiverId: {
            type: mongoose.Schema.Types.ObjectId, // Usamos ObjectId
            ref: 'Users', // Referencia a la colección de Usuarios
            required: true
        },
        // Si la notificación está relacionada con un post
        postId: {
            type: mongoose.Schema.Types.ObjectId, // Usamos ObjectId
            ref: 'Posts', // Referencia a la colección de Posts (asegúrate que tu postModel.js usa 'Posts')
            // Requerido solo para tipos de notificación que aplican a posts (like, comment)
            required: function() { return this.type === 'like' || this.type === 'comment'; }
        },
        // Si la notificación está relacionada con un comentario específico
        commentId: {
            type: mongoose.Schema.Types.ObjectId, // Usamos ObjectId
            ref: 'Comments', // Referencia a la colección de Comments (asegúrate que tu commentModel.js usa 'Comment' o 'Comments')
            required: false // Opcional, útil si quieres enlazar directamente al comentario
        },
         // Texto adicional para la notificación (ej: parte del comentario, o un mensaje corto)
         text: {
              type: String,
              // Requerido solo para tipos que tienen texto (comment, message)
              required: function() { return this.type === 'comment' || this.type === 'message'; }
         },
        // Indica si la notificación ha sido leída
        isRead: {
            type: Boolean,
            default: false
        },
        // Fecha de creación (Mongoose timestamps ya lo gestiona, pero puedes tener un campo explícito si quieres)
        // createdAt: {
        //     type: Date,
        //     default: Date.now
        // }
    },
    { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

// Índice para búsquedas eficientes por receptor y estado de lectura
notificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema); // Asegúrate que el nombre del modelo es 'Notification'

export default NotificationModel;