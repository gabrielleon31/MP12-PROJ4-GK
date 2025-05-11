// server/Models/MessageModel.js
import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
    {
        // Referencia a la conversación a la que pertenece este mensaje
        conversationId: {
            type: mongoose.Schema.Types.ObjectId, // Usa ObjectId para referenciar la conversación
            ref: 'Conversation', // El nombre del modelo de Conversación (verifica tu ConversationModel.js)
            required: true,
        },
        // ID del usuario que envió el mensaje
        senderId: {
            type: mongoose.Schema.Types.ObjectId, // Usa ObjectId para referenciar al usuario
            ref: 'Users', // El nombre del modelo de Usuario (verifica tu userModel.js, usualmente es 'User' o 'Users')
            required: true,
        },
        // El contenido del mensaje (texto)
        text: {
            type: String,
            required: true,
        },
        // Puedes añadir otros campos si es necesario (ej: imageUrl, fileUrl)
    },
    {
        timestamps: true, // Añade campos createdAt y updatedAt automáticamente por Mongoose
    }
);

// Crea el modelo de Mongoose para los mensajes
const MessageModel = mongoose.model('Message', MessageSchema); // El nombre del modelo es 'Message'

export default MessageModel;