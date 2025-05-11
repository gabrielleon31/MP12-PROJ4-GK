// client/src/components/UsersToChatDropdown/UsersToChatDropdown.js
import React from 'react';
import './UsersToChatDropdown.css'; // Crearemos este CSS después
import { useDispatch, useSelector } from 'react-redux'; // Necesitas useDispatch y useSelector
import { useNavigate } from 'react-router-dom'; // Necesitas useNavigate para navegar
// Importa la acción para encontrar/crear conversación
import { createNewChat } from '../../actions/ChatAction'; // Asegúrate de importar esta acción


// Este componente recibe la lista de usuarios, estado de carga/error, y el usuario logueado
// Lo renderizamos dentro del dropdown en RightSide
const UsersToChatDropdown = ({ users, loading, error, currentUser, onCloseDropdown }) => { // <-- Añadimos onCloseDropdown prop
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Inicializa useNavigate

    // La URL base para las imágenes de perfil (usa la variable de entorno)
    const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
    // La URL base para imágenes estáticas por defecto
    const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';

    // --- Función para manejar el click en un usuario ---
    const handleUserClick = async (otherUser) => {
        console.log("User selected from dropdown:", otherUser);

        // Cerrar el dropdown al seleccionar un usuario
        if (onCloseDropdown) {
            onCloseDropdown(); // Llama a la función pasada desde el padre (RightSide) para cerrar el dropdown
        }

        // Llamar a la acción para encontrar o crear la conversación con este usuario
        // createNewChat espera senderId y receiverId. currentUser es el sender, otherUser es el receiver.
        try {
            // createNewChat ya llama al backend para encontrar o crear la conversación
            const conversationData = await dispatch(createNewChat(currentUser._id, otherUser._id));
            console.log("Conversation found/created:", conversationData);

            // *** Navegar a la página de chat (/chat), pasando el ID del otro usuario ***
            // Usamos navigate con un objeto de estado para pasar datos sin que aparezcan en la URL
            // En ChatPage.js, leeremos otherUserId del state
            navigate('/chat', { state: { otherUserId: otherUser._id } });

        } catch (error) {
            console.error("Error finding or creating chat with user:", otherUser, error);
            // Opcional: Mostrar un mensaje de error al usuario (podrías añadir un estado de error local aquí)
        }
    };


    // --- Renderizado del Dropdown ---
    return (
        <div className="UsersToChatDropdown">
            <h4>Start a new chat</h4> {/* Título del dropdown */}

            {loading ? ( // Mostrar estado de carga
                <span style={{ textAlign: 'center' }}>Loading Users...</span>
            ) : error ? ( // Mostrar estado de error
                <span style={{ textAlign: 'center', color: 'red' }}>Error loading users.</span>
            ) : users && users.length > 0 ? ( // Si hay usuarios, mapearlos
                 <div className="user-list-container"> {/* Contenedor para la lista de usuarios */}
                    {users.map((person) => (
                        // Renderizar cada usuario, haciéndolo clickeable
                        // Usamos la clase user-item para estilizar cada fila de usuario
                        <div className="user-item" key={person._id} onClick={() => handleUserClick(person)}>
                            {/* Mostrar foto de perfil */}
                            <img
                                src={
                                    person.profilePicture
                                        ? SERVER_PUBLIC_FOLDER + person.profilePicture
                                        : FRONTEND_STATIC_FOLDER + "defaultProfile.png"
                                }
                                alt="Profile"
                                className='user-img' // Clase CSS para la imagen
                            />
                            {/* Mostrar nombre y apellido */}
                            <div className="name"> {/* Reutiliza la clase name si es apropiado */}
                                <span>{person.firstname} {person.lastname}</span>
                                {/* Opcional: @username si lo tienes y quieres mostrarlo */}
                                {/* <span>@{person.username || person.firstname}</span> */}
                            </div>
                            {/* Opcional: Podrías añadir un icono de "Chat" al lado del nombre */}
                            {/* <ChatBubbleOutlineOutlinedIcon style={{ fontSize: '1.2rem', marginLeft: 'auto' }} /> */}
                        </div>
                    ))}
                 </div>
            ) : ( // Si no hay usuarios después de cargar (lista vacía)
                <span style={{ textAlign: 'center' }}>No other users found.</span>
            )}

        </div>
    );
};

export default UsersToChatDropdown;