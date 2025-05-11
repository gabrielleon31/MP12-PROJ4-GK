// server/Models/ConversationModel.js
import mongoose from 'mongoose';

// Define el esquema para una conversación
const ConversationSchema = mongoose.Schema(
    {
        // 'members' será un array de IDs de los usuarios que participan en esta conversación
        members: {
            type: Array, // Almacenaremos los IDs de usuario como elementos de un array
            required: true, // Una conversación debe tener miembros
        },
        // Puedes añadir otros campos si planeas tener chats grupales, nombres de chat, etc.
        // type: { type: String, enum: ['private', 'group'], default: 'private' },
        // name: { type: String }, // Para chats grupales
        // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // Si quieres saber quién creó el chat
    },
    {
        timestamps: true, // Mongoose añadirá automáticamente los campos createdAt y updatedAt
    }
);

// Crea el modelo de Mongoose para la colección 'conversations' en la base de datos
// El nombre del modelo es 'Conversation'. Mongoose automáticamente creará una colección llamada 'conversations' (en plural)
const ConversationModel = mongoose.model('Conversation', ConversationSchema);

export default ConversationModel;