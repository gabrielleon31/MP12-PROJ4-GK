// client/src/components/ChatBox/ChatBox.js - ACTUALIZADO COMPLETO CON AJUSTE DE SCROLL Y LOGS

import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import { useDispatch, useSelector } from 'react-redux';
// Asegúrate de importar todas las acciones necesarias, incluyendo receiveMessage
import { getChatMessages, addChatMessage, receiveMessage } from '../../actions/ChatAction';
import Message from '../Message/Message'; // Importa el componente Message
import { getUser } from '../../api/UserRequest'; // Necesario para obtener info del otro usuario

// Este componente recibe la conversación activa, la referencia de socket y el usuario logueado como props
const ChatBox = ({ chat, socket, currentUser }) => { // Asegúrate de recibir chat, socket, currentUser
    const dispatch = useDispatch();
    // Obtiene el usuario logueado de Redux (ajusta si lo obtienes solo via prop currentUser)
    const { user } = useSelector((state) => state.authReducer.authData) || {};

    // *** Obtener messages, loadingMessages, errorMessages y activeChat del estado de Redux (chatReducer) ***
    // activeChat es útil para la condición en el reducer, y podrías querer usarlo en la UI también.
    const { messages, loadingMessages, errorMessages, activeChat } = useSelector((state) => state.chatReducer);


    // Estado local para los datos del otro usuario en este chat
    const [otherUserData, setOtherUserData] = useState(null);

    // Estado local para el input del nuevo mensaje y el estado de envío/error
    const [newMessage, setNewMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [errorSendingMessage, setErrorSendingMessage] = useState(false);

    // Referencia para hacer scroll al final de los mensajes
    const scrollRef = useRef();


    // --- LOG: AL PRINCIPIO DEL CICLO DE RENDERIZADO DEL COMPONENTE ---
    console.log("--- ChatBox Component Render Cycle Started ---");
    console.log("  Props received:", { chat, socketExists: !!socket?.current, currentUser });


    // --- LOG: Después de obtener el estado de Redux ---
    console.log("ChatBox Render Check (After Redux State):");
    console.log("  messages from Redux state:", messages); // Valor del array messages
    console.log("  messages.length:", messages ? messages.length : 'N/A'); // Longitud del array
    console.log("  loadingMessages:", loadingMessages); // Estado de carga de mensajes históricos
    console.log("  errorMessages:", errorMessages);   // Estado de error al obtener mensajes históricos
    console.log("  activeChat from Redux:", activeChat); // Valor del chat activo en Redux


    // --- useEffect para configurar Socket.IO listeners (RECEIVE MESSAGE) ---
    // Se ejecuta al montar el componente y cuando la referencia de socket o dispatch cambian.
    useEffect(() => {
        console.log("ChatBox useEffect (Socket Listener): Setting up Socket.IO listeners.");
        const currentSocket = socket.current; // Usar una variable para la referencia actual

        if (currentSocket) {
            console.log("ChatBox: Socket instance available, adding 'receive-message' listener.");

            // Listener para el evento 'receive-message' del backend Socket.IO
            // Este evento trae el mensaje completo (debería estar poblado)
            currentSocket.on("receive-message", (data) => {
                console.log("ChatBox: Received message via Socket.IO 'receive-message' event:", data);
                // *** Despachar una acción para añadir el mensaje recibido al estado de Redux ***
                dispatch(receiveMessage(data)); // Llama a la acción que despacha RECEIVE_MESSAGE
                console.log("ChatBox: Dispatched receiveMessage action from Socket.IO listener."); // Log de despacho
            });

            // Limpieza: remover listener cuando el componente se desmonta o la instancia de socket cambia
            return () => {
                 console.log("ChatBox useEffect (Socket Listener Cleanup): Removing 'receive-message' listener.");
                currentSocket.off("receive-message"); // Usa .off() para remover el listener específico
            };
        } else {
            console.warn("ChatBox useEffect (Socket Listener): Socket.IO not available, listeners not set up.");
        }
    }, [socket, dispatch]); // Dependencias: la referencia de socket y dispatch


    // --- useEffect para UNIRSE a la sala de Socket.IO de la conversación activa ---
    // Se ejecuta cuando el chat activo (prop) cambia.
     useEffect(() => {
         const currentSocket = socket.current;
         if (currentSocket && chat && chat._id) {
              console.log(`ChatBox useEffect (Socket Join Room): Attempting to join chat room: ${chat._id}`);
              currentSocket.emit("join-chat", chat._id); // Emitir evento para unirse a la sala del chat
              console.log(`ChatBox useEffect (Socket Join Room): Emitted 'join-chat' for room ${chat._id}`);

             // Opcional: Listener para confirmar que te uniste (si tu backend emite confirmación)
             // currentSocket.on("room-joined", (roomId) => { console.log(`ChatBox: Successfully joined room: ${roomId}`); });

              // Limpieza: Opcional, emitir evento para salir de la sala anterior si el chat cambia (o al desmontar)
              // return () => {
              //      if (chat && chat._id) {
              //           console.log(`ChatBox useEffect (Socket Leave Room): Attempting to leave chat room: ${chat._id}`);
              //           currentSocket.emit("leave-chat", chat._id);
              //      }
              // };

         } else {
              console.log("ChatBox useEffect (Socket Join Room): No chat available to join room.");
         }
     }, [chat, socket]); // Dependencias: chat (prop) y la referencia de socket


    // --- useEffect para OBTENER los datos del OTRO usuario ---
    // Se ejecuta cuando el chat activo (prop) o el usuario logueado (prop o redux) cambian.
     useEffect(() => {
        // Solo intentar obtener si hay un chat y un usuario logueado definidos
        const loggedInUserId = currentUser?._id || user?._id; // Usar el ID del usuario logueado (de prop o redux)

        if (chat && chat._id && loggedInUserId) {
             // Encontrar el ID del otro usuario en el array de miembros del chat
             const otherUserId = chat.members.find((memberId) => memberId !== loggedInUserId);

             const fetchOtherUser = async () => {
                  if (!otherUserId) {
                       console.log("ChatBox useEffect (Other User): No other user ID found in chat members for chat", chat);
                       setOtherUserData(null); // Asegurarse de que el estado está limpio si no hay otro usuario
                       return;
                  }
                 try {
                     // Llama a la función API para obtener la información completa del otro usuario
                     const { data } = await getUser(otherUserId); // Asegúrate de que getUser funciona y devuelve datos de usuario
                     console.log("ChatBox: Other user data fetched:", data); // Log para verificar los datos obtenidos
                     setOtherUserData(data); // Actualiza el estado local con los datos del otro usuario
                 } catch (error) {
                     console.error("ChatBox: Error fetching other user data:", error);
                     setOtherUserData(null); // Limpiar estado en caso de error en la petición
                 }
             };

             console.log("ChatBox useEffect (Other User): Checking for other user data fetch. Other User ID:", otherUserId);
             fetchOtherUser(); // Llama a la función de fetch

        } else {
             console.log("ChatBox useEffect (Other User): No chat or currentUser/user available, not fetching other user data.");
             setOtherUserData(null); // Limpiar el estado si no hay chat o usuario logueado
        }
     }, [chat, currentUser, user]); // Dependencias: chat, y las props/estado de usuario logueado


    // --- useEffect para OBTENER los mensajes históricos del chat activo ---
    // Se ejecuta cuando el chat activo (prop) cambia.
     useEffect(() => {
         if (chat && chat._id) {
             console.log(`ChatBox useEffect: Fetching messages for chat ${chat._id}`);
             // Despacha la acción para obtener los mensajes.
             // El reducer guardará estos mensajes en el estado 'messages'.
             dispatch(getChatMessages(chat._id));
             setNewMessage(""); // Limpiar el input de mensaje al cambiar de chat
         } else {
             console.log("ChatBox useEffect: No chat available, not fetching messages.");
             // Opcional: Limpiar mensajes en el estado de Redux si no hay chat activo.
             // Si SET_ACTIVE_CHAT ya limpia messages, esta línea no es estrictamente necesaria aquí.
             // dispatch(setActiveChat(null)); // Si tienes una acción para limpiar mensajes al no tener chat activo
         }
     }, [chat, dispatch]); // Dependencias: chat (prop) y dispatch


    // --- useEffect para SCROLL al final de los mensajes (AJUSTADO) ---
    // Se ejecuta cada vez que la lista de mensajes cambia (ej: se carga histórico o llega un nuevo mensaje).
    useEffect(() => {
       console.log("ChatBox useEffect (Scroll): Checking for scroll update. messages length:", messages ? messages.length : 'N/A'); // Log de inicio
       // Asegúrate de que scrollRef tiene un valor actual y que messages es un array no vacío
       // También podemos verificar si hay nuevos mensajes en comparación con antes del render (aunque useEffect ya depende de messages)
       if (scrollRef.current && messages && Array.isArray(messages) && messages.length > 0) {
            console.log("ChatBox useEffect (Scroll): Scroll condition met. Attempting to scroll."); // Log si la condición de scroll se cumple

            // *** AJUSTE AQUÍ: Intentar hacer scroll al ÚLTIMO elemento renderizado ***
            // El lastElementChild del contenedor de scroll (scrollRef.current) debería ser el div del último mensaje.
            const lastMessageElement = scrollRef.current.lastElementChild;

            if (lastMessageElement) {
                 console.log("ChatBox useEffect (Scroll): Scrolling to last message element.");
                 // scrollIntoView con opciones para una animación suave y asegurar que el final esté visible.
                 lastMessageElement.scrollIntoView({ behavior: "smooth", block: "end" });
            } else {
                 // Si por alguna razón no podemos obtener el último elemento hijo (ej: es el primer mensaje),
                 // hacer scroll al final del contenedor mismo.
                 console.log("ChatBox useEffect (Scroll): Last message element not found, scrolling to container end.");
                 scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }

       } else {
            console.log("ChatBox useEffect (Scroll): Scroll condition not met or scrollRef not ready."); // Log si la condición NO se cumple
       }
    }, [messages]); // Dependencia: el array de mensajes. Este efecto se dispara cuando el array messages cambia (se añaden nuevos mensajes).


    // --- Función para manejar el cambio en el input de mensaje ---
     const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
         // Opcional: Emitir evento "escribiendo..." aquí via Socket.IO (si tu backend lo maneja)
         // const loggedInUserId = currentUser?._id || user?._id;
         // if (socket.current && chat && chat._id && loggedInUserId) {
         //    socket.current.emit("typing", { chatId: chat._id, senderId: loggedInUserId });
         // }
    };


    // --- Función para manejar el envío del mensaje ---
    const handleSend = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Validaciones antes de enviar
        const loggedInUserId = currentUser?._id || user?._id;
        if (newMessage.trim().length === 0 || !chat || !chat._id || !loggedInUserId) {
            console.log("Cannot send message: Input is empty, no active chat, or no logged in user.");
            return; // No hacer nada si no hay mensaje, chat o usuario logueado
        }

        // Crear el objeto mensaje con los datos necesarios para el backend API REST
        const messageData = {
            chatId: chat._id,             // El ID de la conversación activa
            senderId: loggedInUserId,     // El ID del usuario logueado
            text: newMessage.trim(),      // El contenido del mensaje, limpiando espacios
            // Opcional: receiverId si tu backend Socket.IO o lógica de notificación lo necesita.
             // Puedes encontrar el receiverId si es necesario:
             // receiverId: chat.members.find((memberId) => memberId !== loggedInUserId),
        };

        console.log("ChatBox handleSend: Attempting to send message (API call):", messageData);

        setSendingMessage(true); // Indicar que el envío está en curso
        setErrorSendingMessage(false); // Limpiar errores anteriores

        try {
            // *** 1. GUARDAR el mensaje en la base de datos via API REST ***
            // La acción addChatMessage llama a la API POST /message/ y DEBE devolver el mensaje GUARDADO Y POPULADO del backend.
            const savedMessage = await dispatch(addChatMessage(messageData)); // Esperar a que la acción asíncrona se complete
            console.log("ChatBox handleSend: Message saved to DB successfully:", savedMessage); // Log para ver el objeto guardado y poblado

            // *** 2. Emitir el mensaje GUARDADO Y POPULADO via Socket.IO al backend ***
            // Esto notificará a todos los sockets unidos a la sala de esta conversación (incluyéndote a ti, si el backend hace loopback).
            if (socket.current) {
                 socket.current.emit("send-message", savedMessage); // Emitir el mensaje completo y poblado
                 console.log("ChatBox handleSend: Message emitted via Socket.IO:", savedMessage);
            } else {
                 console.warn("ChatBox handleSend: Socket.IO not connected, message not emitted in real-time.");
                 // Opcional: Manejar el caso donde Socket no está disponible.
            }

            // *** 3. HABILITAR Visualización INSTANTÁNEA ("Optimista") ***
            // Esta línea es CLAVE para que el mensaje aparezca en TU propia UI inmediatamente.
            // Despacha la misma acción 'receiveMessage' que usaría el listener de Socket.IO.
             console.log("ChatBox handleSend: Attempting to dispatch receiveMessage optimistically with:", savedMessage);
             dispatch(receiveMessage(savedMessage)); // <-- ¡ESTA LÍNEA DEBE ESTAR DESCOMENTADA Y RECIBIR EL MENSAJE GUARDADO Y POPULADO!
             console.log("ChatBox handleSend: receiveMessage dispatched (optimistic update).");


            // Limpiar el input después de enviar (si el envío fue exitoso)
            setNewMessage("");
            setSendingMessage(false); // Finalizar estado de envío
            // errorSendingMessage ya está false

            // La actualización REAL de la lista de mensajes en el estado de Redux (para todos los clientes)
            // ocurre cuando el Socket.IO listener (`useEffect` de Socket.IO) recibe el mensaje re-emitido por el backend
            // y despacha `receiveMessage(data)`. La línea optimista solo acelera la visualización en TU cliente.


        } catch (error) {
            console.error("ChatBox handleSend: Error sending message:", error);
            setSendingMessage(false); // Finalizar estado de envío
            setErrorSendingMessage(true); // Mostrar error de envío al usuario
            // Opcional: Mostrar un mensaje de error más amigable al usuario.
        }
    };


    // --- Sección de Renderizado (JSX) ---
     // URLs base para imágenes
     const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER; // Asegúrate de tener esta variable de entorno configurada
     const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';


     return (
         <div className="ChatBox">
             {/* Mostrar 'Tap on a chat...' si la prop chat es null o undefined */}
             {!chat ? ( // Si chat (prop) es null, mostrar mensaje de bienvenida
                 <div className="ChatBox empty-chat">
                     Tap on a chat to start conversation...
                 </div>
             ) : ( // Si chat (prop) NO es null, mostrar la caja de chat
                 <>
                     {/* --- Encabezado del Chat (Foto y Nombre del Otro Usuario) --- */}
                     {/* Mostrar el encabezado SOLO si tenemos los datos del otro usuario */}
                     {/* Asegúrate de que otherUserData se obtiene correctamente en el useEffect correspondiente */}
                     {otherUserData ? (
                         <>
                             {/* ... (Tu código de encabezado usando otherUserData) ... */}
                             <div className="chat-header">
                                 <div className="other-user-info">
                                     <img
                                         src={ otherUserData.profilePicture ? SERVER_PUBLIC_FOLDER + otherUserData.profilePicture : FRONTEND_STATIC_FOLDER + "defaultProfile.png" }
                                         alt="Other User Profile"
                                         className='followerImg' // Clase CSS
                                         style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem' }}
                                     />
                                     <div className="name">
                                         <span>{otherUserData.firstname} {otherUserData.lastname}</span>
                                     </div>
                                 </div>
                             </div>
                             <hr style={{ width: '95%', border: '0.1px solid #ececec', marginTop: '0.5rem' }} />
                         </>
                     ) : (
                           // Opcional: Placeholder o spinner mientras se carga la info del otro usuario
                           <div className="chat-header">Loading contact info...</div>
                     )}


                     {/* --- Cuerpo del Chat (Mensajes) --- */}
                     {/* Este div es el que tendrá el scroll */}
                     <div ref={scrollRef} className="chat-body">
                         {/* *** MANTÉN O AÑADE ESTOS LOGS DENTRO DEL JSX DEL chat-body *** */}
                         {/* Estos logs se dispararán DURANTE el renderizado de esta sección */}
                         {console.log("--- Inside ChatBox chat-body JSX Render ---")}
                         {console.log("  messages value here:", messages)} 
                         {console.log("  messages.length value here:", messages ? messages.length : 'N/A')}
                         {console.log("  Is messages array here?", Array.isArray(messages))} 
                         {console.log("  Condition `messages && Array.isArray(messages) && messages.length > 0` here:", messages && Array.isArray(messages) && messages.length > 0)}


                        {/* Lógica para mostrar loading, error, lista de mensajes o mensaje vacío */}
                        {loadingMessages ? (
                            <span>Loading Messages...</span>
                        ) : errorMessages ? (
                            <span>Error loading messages.</span>
                        ) : ( // Si no hay carga ni error
                            // *** Condición para mapear y mostrar los mensajes si el array no está vacío ***
                            messages && Array.isArray(messages) && messages.length > 0 ? ( // <-- Esta es la condición CLAVE para mostrar la lista de componentes Message
                                messages.map((message, index) => (
                                     // Renderiza el componente Message para cada mensaje en el array 'messages'
                                     <Message
                                         key={message._id || index} // Usa el _id del mensaje como key (DEBE SER ÚNICA Y ESTABLE)
                                         message={message} // Pasar el objeto del mensaje completo (DEBE incluir senderId y text, idealmente poblado)
                                         currentUser={currentUser || user} // Pasar el objeto del usuario logueado
                                         otherUser={otherUserData} // Pasar info del otro usuario (si Message la necesita)
                                     />
                                ))
                             ) : (
                                  // Si la lista de mensajes está vacía (después de cargar o si nunca hubo mensajes)
                                  <span style={{ textAlign: 'center', alignSelf: 'center' }}>Start the conversation!</span>
                             )
                         )}
                     </div>

                     {/* --- Footer del Chat (Input y Botón de Enviar) --- */}
                     {/* ... (Mantener tu código del footer con el input y botón) ... */}
                     <div className="chat-footer">
                         <form onSubmit={handleSend} className="message-input-form">
                             <input
                                 type="text"
                                 placeholder="Enter Message..."
                                 value={newMessage}
                                 onChange={handleMessageChange}
                                 disabled={sendingMessage || !chat} // Deshabilitar input si se envía o no hay chat activo
                             />
                             {/* Deshabilitar botón si se está enviando, no hay chat activo o el input está vacío/solo espacios */}
                             <button type="submit" className="button" disabled={sendingMessage || !chat || newMessage.trim().length === 0}>
                                 {sendingMessage ? 'Sending...' : 'Send'}
                             </button>
                         </form>
                         {errorSendingMessage && (
                             <span className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>Error sending message.</span>
                         )}
                     </div>
                 </>
             )}
         </div>
     );
};

export default ChatBox;