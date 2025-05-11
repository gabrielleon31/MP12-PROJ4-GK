// client/src/components/Conversation/Conversation.js - ACTUALIZADO

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Opcional si no la usas
import { getUser } from '../../api/UserRequest';
import './Conversation.css'; // Asegúrate de que este CSS existe

// Este componente recibe el objeto de conversación y el usuario logueado
// Ya NO recibe onSelectChat
const Conversation = ({ data, currentUser, selectedChatId }) => { // Recibe SOLO data, currentUser, selectedChatId
    const dispatch = useDispatch(); // Opcional si no la usas
    const [otherUserData, setOtherUserData] = useState(null);
    // La URL base para las imágenes
    const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
    const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';

    // --- useEffect para OBTENER los datos del otro usuario en la conversación ---
    // Se ejecuta cuando cambian los datos de la conversación (data) o el usuario logueado (currentUser).
    useEffect(() => {
        // Identificar al otro usuario: es el miembro de la conversación que NO es el usuario logueado
        const otherUserId = data?.members?.find((memberId) => memberId !== currentUser?._id); // Usar ?. para seguridad

        const fetchOtherUser = async () => {
             if (!otherUserId) {
                  console.log("Conversation useEffect: No other user ID found in conversation members.");
                  setOtherUserData(null);
                  return;
             }
            try {
                // Llama a la función API para obtener la información completa del otro usuario
                const { data } = await getUser(otherUserId); // Asegúrate de que getUser funciona
                console.log("Conversation: Other user data fetched:", data); // Log para verificar
                setOtherUserData(data); // Actualiza el estado con los datos del otro usuario
            } catch (error) {
                console.error("Conversation: Error fetching other user data:", error);
                setOtherUserData(null); // Limpiar estado en caso de error
            }
        };

         console.log("Conversation useEffect: Checking for other user data fetch. Conversation data:", data, "CurrentUser:", currentUser);
        if (data && currentUser) { // Solo intentar si hay datos de conversación y usuario logueado
             fetchOtherUser(); // Llama a la función de fetch
        } else {
             console.log("Conversation useEffect: Data or CurrentUser not available, not fetching other user.");
             setOtherUserData(null);
        }
    }, [data, currentUser]); // Dependencias: data (la conversación) y currentUser

    // Opcional: useEffect para verificar si esta conversación es la activa (si pasas selectedChatId)
    // useEffect(() => {
    //      const isActive = data?._id === selectedChatId;
    //      console.log(`Conversation ${data?._id}: Is active? ${isActive}`);
    //      // Puedes usar 'isActive' para aplicar estilos condicionalmente en el JSX
    // }, [data, selectedChatId]);


    // *** REVISA CUIDADOSAMENTE ESTA SECCIÓN Y EL RESTO DEL COMPONENTE ***
    // *** ASEGÚRATE DE QUE NO HAY NINGUNA LLAMADA A onSelectChat() AQUÍ ***
    // Si había un onClick en un elemento dentro de este componente que llamaba a onSelectChat,
    // esa lógica ahora debe estar en el div padre en ConversationSide.js.


    return (
        // El div principal de Conversation. Aquí no se maneja el click de selección.
        // El click se maneja en el div que envuelve a Conversation en ConversationSide.js.
        <div className={`Conversation ${data?._id === selectedChatId ? 'selected' : ''}`}> {/* Añadir clase 'selected' si selectedChatId coincide */}
            {/* Mostrar info del otro usuario si los datos han cargado */}
            {otherUserData ? (
                <>
                    {/* Sección de imagen de perfil y estado */}
                    <div className="follower-image"> {/* Usa la clase CSS de Follower */}
                         <img
                             src={
                                 // Usar otherUserData.profilePicture si existe, si no, la imagen por defecto del frontend public folder
                                otherUserData.profilePicture
                                     ? SERVER_PUBLIC_FOLDER + otherUserData.profilePicture
                                     : FRONTEND_STATIC_FOLDER + "defaultProfile.png"
                             }
                             alt="Other User Profile"
                             className="followerImg" // Reutiliza la clase CSS de FollowersCard
                             style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                         />
                         {/* Opcional: Indicador de estado en línea (lo implementaremos más adelante con Socket.IO) */}
                         {/* Necesitas la lista de activeUsers en Redux y pasarla o obtenerla aquí */}
                         {/* {isOnline && <div className="online-dot"></div>} */}
                    </div>

                    {/* Sección de nombre y estado (si aplica) */}
                    <div className="name" style={{ fontSize: '0.8rem' }}>
                        {/* Nombre completo del otro usuario */}
                        <span>{otherUserData.firstname} {otherUserData.lastname}</span>
                        {/* Opcional: Mostrar el estado en línea/offline aquí */}
                         {/* <span style={{color: isOnline ? "#51e200" : "red"}}>
                              {isOnline ? "Online" : "Offline"}
                          </span> */}
                        {/* Opcional: Mostrar el último mensaje (requeriría obtener el último mensaje de alguna forma) */}
                        {/* <span>Último mensaje...</span> */}
                    </div>
                </>
            ) : (
                 // Mostrar un placeholder mientras se cargan los datos del otro usuario
                 <span>Loading user info...</span>
            )}

             {/* Separador entre conversaciones, si lo deseas */}
             <hr style={{ width: '85%', border: '0.1px solid #ececec' }}/> {/* Reutiliza estilos si tienes una clase para esto */}

        </div>
    );
};

export default Conversation;