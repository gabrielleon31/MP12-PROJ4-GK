// server/Controllers/MessageController.js - ACTUALIZADO COMPLETO CON POPULATE

import mongoose from 'mongoose';
import MessageModel from '../Models/MessageModel.js';
import ConversationModel from '../Models/ConversationModel.js'; // Importado para posible validación
import UserModel from '../Models/userModel.js'; // *** ¡Asegúrate de que UserModel está importado y la ruta es correcta! ***

// --- Función para añadir un nuevo mensaje (addMessage - Con Populate después de guardar) ---
export const addMessage = async (req, res) => {
    const loggedInUserId = req.userId; // Asumimos que authMiddleWare adjunta el ID del usuario logueado
    const { chatId, senderId, text } = req.body; // Recibe chatId (ID de la conversación), senderId, y text del frontend

    // *** Validación de seguridad: Asegurarse de que el emisor del mensaje es el usuario logueado ***
     if (!loggedInUserId || senderId !== loggedInUserId) {
          console.warn(`Backend: addMessage - Action forbidden. loggedInUserId: ${loggedInUserId}, senderId from body: ${senderId}`);
          return res.status(403).json({ message: "Action forbidden: You can only send messages as yourself." });
     }

    // Validación básica de campos requeridos
    if (!chatId || !senderId || !text || text.trim().length === 0) {
        console.warn("Backend: addMessage - Missing required fields:", { chatId, senderId, text });
        return res.status(400).json({ message: "Chat ID, sender ID, and non-empty text are required to send a message." });
    }

     // Opcional: Validar que chatId y senderId son IDs válidos de Mongoose si usaste ObjectId en el modelo
     // if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(senderId)) {
     //    console.warn("Backend: addMessage - Invalid ID format:", { chatId, senderId });
     //    return res.status(400).json({ message: "Invalid ID format for chat or sender" });
     // }

    try {
        // Crear una nueva instancia del modelo Message
        const newMessage = new MessageModel({
            // *** Usar 'conversationId' que es lo que espera tu MessageModel ***
            conversationId: chatId, // Asigna el valor de 'chatId' recibido del body al campo 'conversationId' del modelo
            senderId: senderId,     // Asignar el valor de 'senderId' del body al campo 'senderId' del modelo
            text: text.trim(),      // Asignar el valor de 'text' del body al campo 'text' del modelo
        });

        // Guardar el nuevo mensaje en la base de datos
        const savedMessage = await newMessage.save();
        console.log("Backend: addMessage - New message saved:", savedMessage);

        // *** ¡NUEVO PASO: POPULAR el remitente en el mensaje recién guardado! ***
        // Esto asegura que el objeto que enviamos de vuelta al frontend y emitimos por Socket.IO ya tiene la info del remitente.
        const populatedMessage = await MessageModel.findById(savedMessage._id)
            .populate('senderId', 'firstname lastname username profilePicture'); // Selecciona los campos que necesitas del usuario

        console.log("Backend: addMessage - Message saved and populated:", populatedMessage);

        // Devolver el mensaje GUARDADO Y POPULADO en la respuesta
        // El frontend (ChatBox) que llamó a esta acción recibirá este objeto.
        res.status(200).json(populatedMessage); // Usa 200 OK si es exitoso, 201 Created también es válido

    } catch (error) {
        console.error("Backend: addMessage - Error adding message:", error);
        // Incluir detalles del error de validación si existen
        res.status(500).json({ message: error.message, errorDetails: error.errors });
    }
};


// --- Función para obtener mensajes de una conversación específica (getMessages - Con Populate) ---
export const getMessages = async (req, res) => {
    const chatId = req.params.chatId; // ID de la conversación del parámetro de la URL
    // const loggedInUserId = req.userId; // Opcional para validación de membresía

    // Opcional: Validar que el chatId es un ID válido de Mongoose
    // if (!mongoose.Types.ObjectId.isValid(chatId)) {
    //    console.warn(`Backend: getMessages - Invalid chat ID format: ${chatId}`);
    //    return res.status(400).json({ message: "Invalid chat ID format." });
    // }

    try {
        // Buscar mensajes por el ID de la conversación
        // *** ¡CORRECCIÓN/AJUSTE AQUÍ! Buscar por 'conversationId' en lugar de 'chatId' (si tu modelo usa 'conversationId') ***
        // *** ¡Y AÑADE .populate() AQUÍ para incluir la info del remitente! ***
        const messages = await MessageModel.find({ conversationId: chatId }) // <-- ¡USA 'conversationId' AQUÍ!
            .sort({ createdAt: 1 }) // Ordenar por fecha ascendente (los más nuevos al final)
            .populate('senderId', 'firstname lastname username profilePicture'); // <-- ¡AÑADE ESTO! Popula el campo senderId


        console.log(`Backend: getMessages - Messages found for chat ${chatId}:`, messages.length);
         if (messages.length > 0) {
             console.log("Backend: getMessages - Sample populated message:", messages[0]); // Log para verificar si la población funciona
             // Deberías ver un objeto 'senderId' (si usas ref: 'Users' en MessageModel) o 'sender' si populaste así.
             // Si usaste 'senderId' con ref, el campo original se reemplaza por el objeto.
             // Si usaste un campo 'sender' y populaste 'sender', aparecerá un campo 'sender'.
             // ¡Basado en tu modelo, debería ser 'senderId' ahora conteniendo el objeto usuario!
         } else {
             console.log(`Backend: getMessages - No messages found for chat ${chatId}.`); // Log si no se encuentran mensajes
         }

        res.status(200).json(messages); // Devolver la lista de mensajes (ahora poblados)

    } catch (error) {
        console.error(`Backend: getMessages - Error getting messages for chat ${chatId}:`, error);
        res.status(500).json({ message: error.message });
    }
};

// ... (otras funciones si las tienes) ...