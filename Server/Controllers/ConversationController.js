// server/Controllers/ConversationController.js - CON LOG EXTRA TEMPRANO EN findOrCreateChat y getUserChats

import ConversationModel from '../Models/ConversationModel.js';

export const findOrCreateChat = async (req, res) => {
    // *** AÑADE ESTE LOG JUSTO AQUÍ ***
    console.log("Backend: findOrCreateChat - >>> Start of Function Execution <<<");
    console.log(`Backend: Attempting to find or create chat between ${req.body.senderId} and ${req.body.receiverId}`); // Este log ya estaba
    const { senderId, receiverId } = req.body;

    try {
        // 1. Intentar encontrar una conversación existente
        console.log("Backend: findOrCreateChat - Attempting to find existing chat..."); // Log antes de la llamada a Mongoose
        const existingChat = await ConversationModel.findOne({
            members: { $all: [senderId, receiverId] }
        });
         console.log("Backend: findOrCreateChat - Finished findOne call."); // Log después de la llamada a Mongoose


        if (existingChat) {
            console.log(`Backend: Chat found between ${senderId} and ${receiverId}. Returning existing chat.`);
            res.status(200).json(existingChat);
        }
        else {
            console.log(`Backend: Chat not found between ${senderId} and ${receiverId}. Creating new chat.`);
             console.log("Backend: findOrCreateChat - Creating new ConversationModel instance..."); // Log antes de crear instancia
            const newChat = new ConversationModel({
                members: [senderId, receiverId],
            });
             console.log("Backend: findOrCreateChat - Attempting to save new chat..."); // Log antes de save

            const savedChat = await newChat.save();
            console.log(`Backend: New chat created with ID: ${savedChat._id}. Returning new chat.`);

            res.status(200).json(savedChat); // O 201
        }

    } catch (error) {
        console.error("Backend: Error in findOrCreateChat catch block:", error); // Log de error en el proceso
        res.status(500).json({ message: error.message });
    }
};

// Añadir un log similar al principio de getUserChats
export const getUserChats = async (req, res) => {
    console.log("Backend: getUserChats - >>> Start of Function Execution <<<"); // Log al principio de la función
    const userId = req.params.userId;
    console.log(`Backend: Attempting to fetch chats for userId: ${userId}`); // Log de inicio (ya estaba)

    try {
        console.log("Backend: getUserChats - Attempting to find chats in DB..."); // Log antes de la llamada a Mongoose
        const chats = await ConversationModel.find({
            members: { $in: [userId] }
        });
         console.log("Backend: getUserChats - Finished find call."); // Log después de la llamada a Mongoose

        console.log(`Backend: Chats found for user ${userId}:`, chats.length);
        res.status(200).json(chats);

    } catch (error) {
        console.error(`Backend: Error fetching chats for user ${userId} catch block:`, error); // Log de error
        res.status(500).json({ message: error.message });
    }
};

// Si tienes otras funciones en este controlador, añade logs similares al principio.
// export const findChat = async (req, res) => { /* ... */ };