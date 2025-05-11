// server/Controllers/ChatController.js
import { ConversationModel, MessageModel } from '../Models/chatModel.js'; // Importamos los modelos de chat

// Crear una nueva conversación
// Espera en el body: { senderId: usuario que inicia el chat, receiverId: usuario con el que quiere chatear }
// Nota: En un chat 1 a 1, members será un array con el ID del sender y el ID del receiver.
export const createChat = async (req, res) => {
    // Asumiendo que el frontend envía el ID del receiver en el body
    // Y el senderId lo obtenemos del req.userId del middleware de autenticación
    const senderId = req.userId; // Usuario logueado que inicia/crea la conversación
    const { receiverId } = req.body; // El otro usuario en la conversación

    if (!receiverId) {
         return res.status(400).json({ message: "Receiver ID is required to create a chat." });
    }

    // Opcional: Validar que senderId y receiverId no son el mismo si no quieres chat contigo mismo
    if (senderId === receiverId) {
         return res.status(400).json({ message: "You cannot create a chat with yourself." });
    }


    try {
        // *** Lógica para encontrar si ya existe una conversación entre estos dos usuarios ***
        // Buscamos una conversación donde el array 'members' contenga AMBOS IDs.
        // $all asegura que ambos elementos estén presentes en el array.
        const existingChat = await ConversationModel.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (existingChat) {
            // Si ya existe, devolvemos la conversación existente
            console.log("Existing chat found:", existingChat);
            return res.status(200).json(existingChat);
        }

        // *** Si no existe, creamos una nueva conversación ***
        const newChat = new ConversationModel({
            members: [senderId, receiverId], // Creamos el array con los IDs de los dos participantes
        });

        const result = await newChat.save(); // Guardamos la nueva conversación

        console.log("New chat created:", result);
        res.status(200).json(result); // Devolvemos la nueva conversación creada

    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json(error);
    }
};

// Obtener las conversaciones de un usuario específico
// La ruta espera el ID del usuario como parámetro: /chat/:userId
// Validamos que el userId en la URL coincide con el usuario logueado (req.userId) por seguridad
export const findUserChats = async (req, res) => {
    const userId = req.params.userId; // ID del usuario del parámetro de la URL
    const loggedInUserId = req.userId; // ID del usuario logueado (desde el middleware)

    // *** Validación de seguridad: Asegurarse de que el usuario logueado solo puede ver sus propias conversaciones ***
    if (userId !== loggedInUserId) {
        return res.status(403).json({ message: "Action forbidden: You can only view your own chats." });
    }

    try {
        // Buscar conversaciones donde el array 'members' contenga el ID del usuario logueado
        const chat = await ConversationModel.find({
            members: { $in: [userId] }, // $in busca si el ID del usuario está en el array members
        });

        console.log(`Chats found for user ${userId}:`, chat);
        res.status(200).json(chat); // Devolver la lista de conversaciones encontradas

    } catch (error) {
        console.error(`Error finding chats for user ${userId}:`, error);
        res.status(500).json(error);
    }
};

// Encontrar una conversación entre dos usuarios específicos
// La ruta espera los IDs de los dos usuarios como parámetros: /chat/find/:firstId/:secondId
// Validamos que al menos uno de los IDs coincide con el usuario logueado por seguridad
export const findChat = async (req, res) => {
    const { firstId, secondId } = req.params; // IDs de los dos usuarios de los parámetros de la URL
    const loggedInUserId = req.userId; // ID del usuario logueado (desde el middleware)

    // *** Validación de seguridad: Asegurarse de que el usuario logueado es uno de los participantes de la conversación ***
    if (loggedInUserId !== firstId && loggedInUserId !== secondId) {
         return res.status(403).json({ message: "Action forbidden: You can only view chats you are a part of." });
    }


    try {
        // Buscar una conversación donde el array 'members' contenga AMBOS IDs
        const chat = await ConversationModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (chat) {
            console.log(`Chat found between ${firstId} and ${secondId}:`, chat);
            res.status(200).json(chat); // Devolver la conversación encontrada
        } else {
             // Si no se encuentra, devolver null o un mensaje indicando que no existe
             console.log(`Chat not found between ${firstId} and ${secondId}.`);
             res.status(200).json(null); // O res.status(404).json({ message: "Chat not found" }); si prefieres
        }


    } catch (error) {
        console.error(`Error finding chat between ${firstId} and ${secondId}:`, error);
        res.status(500).json(error);
    }
};


// *** Controladores para Mensajes (POST para enviar, GET para obtener) ***
// Estos controladores irían en un archivo de controladores diferente si quieres separar responsabilidades,
// por ejemplo, MessageController.js. Pero por simplicidad, podemos añadirlos aquí por ahora,
// o crear un archivo MessageController.js y su MessageRoute.js.
// Por ahora, vamos a crear un nuevo archivo de ruta para mensajes y su controlador.

// --- CREAREMOS MessageRoute.js y MessageController.js en el siguiente paso ---