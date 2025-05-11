// client/src/actions/ChatAction.js - Acciones de Redux para Chat y Mensajes - ACTUALIZADO

import * as ChatApi from '../api/UserRequest.js';

// --- ACCIONES PARA GESTIONAR LA LISTA DE CONVERSACIONES ---
export const getUserChats = (id) => async (dispatch) => {
    dispatch({ type: "FETCH_CHATS_START" });
    try {
        const { data } = await ChatApi.getUserChats(id);
        console.log("ChatAction: User Chats fetched successfully:", data);
        dispatch({ type: "FETCH_CHATS_SUCCESS", data: data });
    } catch (error) {
        console.error("ChatAction: Error fetching user chats:", error);
        dispatch({ type: "FETCH_CHATS_FAIL" });
    }
};

// --- ACCIÓN PARA ENCONTRAR O CREAR UNA CONVERSACIÓN ---
export const createNewChat = (senderId, receiverId) => async (dispatch) => {
    console.log(`ChatAction: createNewChat called with senderId: ${senderId}, receiverId: ${receiverId}`);
    try {
        const { data } = await ChatApi.findOrCreateConversation(senderId, receiverId);
        console.log("ChatAction: Chat found or created successfully:", data);

        // Opcional: Despachar para añadir la nueva conversación a la lista si no existe
        // (Esto puede ser útil si no haces un re-fetch completo de la lista inmediatamente después de crear un chat)
        // dispatch({ type: "ADD_NEW_CHAT_TO_LIST", data: data });

        return data; // Devolver la conversación encontrada/creada
    } catch (error) {
        console.error("ChatAction: Error creating/finding chat:", error);
        throw error;
    }
};

// *** NUEVA ACCIÓN: Para establecer la conversación activa en el estado de Redux ***
export const setActiveChat = (chatData) => (dispatch) => {
    console.log("ChatAction: setActiveChat called with:", chatData);
    dispatch({ type: "SET_ACTIVE_CHAT", data: chatData });
};


// --- ACCIONES PARA GESTIONAR MENSAJES DENTRO DE UN CHAT ESPECÍFICO ---

// Acción para obtener todos los mensajes históricos de una conversación
export const getChatMessages = (chatId) => async (dispatch) => {
    dispatch({ type: "FETCH_MESSAGES_START" });
    try {
        const { data } = await ChatApi.getMessages(chatId);
        console.log(`ChatAction: Messages for chat ${chatId} fetched successfully:`, data);
        dispatch({ type: "FETCH_MESSAGES_SUCCESS", data: data }); // Reducer debe guardar esto en messages[]
    } catch (error) {
        console.error(`ChatAction: Error fetching messages for chat ${chatId}:`, error);
        dispatch({ type: "FETCH_MESSAGES_FAIL" });
    }
};

// Acción para añadir un nuevo mensaje (guarda en DB via API)
export const addChatMessage = (messageData) => async (dispatch) => {
    console.log("ChatAction: addChatMessage called with:", messageData);
    try {
        const { data } = await ChatApi.addMessage(messageData);
        console.log("ChatAction: Message saved to DB successfully:", data);

        // *** IMPORTANTE: Devolver el mensaje guardado para que el componente lo emita via Socket.IO ***
        return data;

        // Opcional: Si NO usas Socket.IO para actualizar la UI, podrías despachar aquí para añadir el mensaje al estado:
        // dispatch({ type: "ADD_MESSAGE_SUCCESS", data: data });

    } catch (error) {
        console.error("ChatAction: Error adding message:", error);
        throw error;
    }
};


// --- ACCIONES RELACIONADAS CON SOCKET.IO (DISPATCHED DESDE LISTENERS) ---

// Acción para añadir un mensaje recibido via Socket.IO al estado de mensajes
export const receiveMessage = (messageData) => (dispatch) => {
    console.log("ChatAction: receiveMessage action creator called with:", messageData);
     // El reducer (chatReducer) necesita manejar este tipo
    dispatch({ type: "RECEIVE_MESSAGE", data: messageData });
    console.log("ChatAction: Dispatched RECEIVE_MESSAGE type.");
};

// Opcional: Acciones para usuarios activos o nuevas conversaciones via Socket.IO
// export const updateActiveUsers = (activeUsers) => ({ type: "UPDATE_ACTIVE_USERS", data: activeUsers });
// export const addNewChatViaSocket = (chatData) => ({ type: "ADD_NEW_CHAT_TO_LIST", data: chatData });