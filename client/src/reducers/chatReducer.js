// client/src/reducers/chatReducer.js - ACTUALIZADO

const initialState = {
    chats: [],
    loadingChats: false,
    errorChats: false,

    messages: [],
    loadingMessages: false,
    errorMessages: false,

    activeChat: null, // Almacena la conversación que el usuario tiene actualmente abierta

    // Opcional: activeUsers si lo usas para estado en línea
    activeUsers: [], // Array de { userId, socketId }
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        // --- Casos para lista de conversaciones ---
        case "FETCH_CHATS_START":
            console.log("chatReducer: FETCH_CHATS_START");
            return { ...state, loadingChats: true, errorChats: false };
        case "FETCH_CHATS_SUCCESS":
             console.log("chatReducer: FETCH_CHATS_SUCCESS", action.data);
            // Asegúrate de que action.data es un array antes de asignarlo
            return { ...state, chats: Array.isArray(action.data) ? action.data : [], loadingChats: false, errorChats: false };
        case "FETCH_CHATS_FAIL":
             console.log("chatReducer: FETCH_CHATS_FAIL");
            return { ...state, loadingChats: false, errorChats: true };

        // --- Caso para establecer la conversación activa ---
        case "SET_ACTIVE_CHAT":
            console.log("chatReducer: SET_ACTIVE_CHAT", action.data);
             // Cuando se establece un nuevo chat activo, limpiamos los mensajes anteriores
             // y guardamos el objeto de la conversación en activeChat.
            return { ...state, activeChat: action.data, messages: [], loadingMessages: false, errorMessages: false };


        // --- Casos para mensajes ---
        case "FETCH_MESSAGES_START":
             console.log("chatReducer: FETCH_MESSAGES_START");
            return { ...state, loadingMessages: true, errorMessages: false, messages: [] }; // Limpiar mensajes anteriores al cargar nuevos
        case "FETCH_MESSAGES_SUCCESS":
             console.log("chatReducer: FETCH_MESSAGES_SUCCESS", action.data);
             // Asegúrate de que action.data es un array
            return { ...state, messages: Array.isArray(action.data) ? action.data : [], loadingMessages: false, errorMessages: false };
        case "FETCH_MESSAGES_FAIL":
             console.log("chatReducer: FETCH_MESSAGES_FAIL");
            return { ...state, loadingMessages: false, errorMessages: true };


        // --- Caso para añadir un mensaje recibido via Socket.IO o guardado via API ---
        // Usamos RECEIVE_MESSAGE como el tipo principal para mensajes que llegan y deben actualizar la UI
        case "RECEIVE_MESSAGE":
            console.log("chatReducer: RECEIVE_MESSAGE - Received action:", action); // Log 7: ¿Llega la acción aquí?
            console.log("chatReducer: RECEIVE_MESSAGE - action.data:", action.data); // <-- Log para inspeccionar el objeto mensaje que llega al reducer
        
            // *** IMPORTANTE: Verificar la condición para añadir el mensaje ***
            console.log("chatReducer: RECEIVE_MESSAGE - Checking active chat condition:", {
                 activeChatExists: !!state.activeChat, // ¿Hay chat activo?
                 messageDataExists: !!action.data,    // ¿Hay datos en la acción?
                 messageChatId: action.data?.chatId || action.data?.conversationId, // ¿Cuál es el ID del chat en el mensaje? (Usar OR por si llega de formas diferentes)
                 activeChatId: state.activeChat?._id  // ¿Cuál es el ID del chat activo en el estado?
            }); // Log 8: ¿Cómo se evalúa la condición?
        
            // La condición es: hay chat activo EN EL ESTADO Y hay data EN LA ACCIÓN Y el ID del chat en la data coincide con el ID del chat activo
            // Ajustamos para verificar chatId O conversationId por si el nombre del campo varía entre diferentes fuentes del mensaje
            if (state.activeChat && action.data && (action.data.chatId === state.activeChat._id || action.data.conversationId === state.activeChat._id)) {
                console.log("chatReducer: RECEIVE_MESSAGE - Condition met. Adding message to active chat:", action.data); // Log 9: ¿La condición fue verdadera?
                 // Añadir el nuevo mensaje al final del array de mensajes
                return { ...state, messages: [...state.messages, action.data] };
            }
             // Si el mensaje no es para la conversación activa, o no hay chat activo, o la data es inválida
             console.log("chatReducer: RECEIVE_MESSAGE - Condition not met. Message not for active chat or invalid, ignoring."); // Log 10: ¿La condición fue falsa?
            return state; // Retornar el estado actual sin modificarlo

        // Opcional: Si quieres que ADD_MESSAGE_SUCCESS también añada el mensaje a la UI (duplicando la lógica de RECEIVE_MESSAGE)
        // case "ADD_MESSAGE_SUCCESS":
        //     console.log("chatReducer: ADD_MESSAGE_SUCCESS - Received message:", action.data);
        //     if (state.activeChat && action.data && action.data.chatId === state.activeChat._id) {
        //          console.log("chatReducer: ADD_MESSAGE_SUCCESS - Adding message to active chat:", action.data);
        //         return { ...state, messages: [...state.messages, action.data] };
        //     }
        //     console.log("chatReducer: ADD_MESSAGE_SUCCESS - Message not for active chat, ignoring:", action.data);
        //     return state;


        // --- Caso para añadir una nueva conversación a la lista (si se crea) ---
        case "ADD_NEW_CHAT_TO_LIST":
             console.log("chatReducer: ADD_NEW_CHAT_TO_LIST", action.data);
             // Añadir la nueva conversación al principio de la lista SOLO si no está ya
             if (action.data && state.chats && !state.chats.some(chat => chat._id === action.data._id)) {
                  return { ...state, chats: [action.data, ...state.chats] };
             }
             return state; // No añadir si ya existe o action.data es inválido


         // --- Casos para actualizar la lista de usuarios activos (si la implementas) ---
         case "UPDATE_ACTIVE_USERS":
              console.log("chatReducer: UPDATE_ACTIVE_USERS", action.data);
              // Asegúrate de que action.data es un array
             return { ...state, activeUsers: Array.isArray(action.data) ? action.data : [] };


        case "LOG_OUT":
            console.log("chatReducer: LOG_OUT - Resetting chat state.");
            // Reiniciar el estado del chat al cerrar sesión
            return initialState;


        default:
            return state;
    }
};

export default chatReducer;