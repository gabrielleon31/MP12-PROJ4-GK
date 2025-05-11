// client/src/components/Message/Message.js - Ajuste de estructura para nombre ENCIMA

import React from 'react';
import './Message.css';
import { format } from 'timeago.js'; // Asegúrate de tener timeago.js instalado o elimina si no usas

// Este componente recibe el objeto del mensaje (populado) y el usuario logueado
const Message = ({ message, currentUser }) => { // Asegúrate de recibir message y currentUser

    // Determinar si el mensaje fue enviado por el usuario logueado
    const isMyMessage = message.senderId?._id === currentUser?._id;

    // Obtener la información del remitente del campo message.senderId
    const senderInfo = message.senderId;

    // Determinar el nombre a mostrar
    let displayName = 'Usuario Desconocido';

    if (isMyMessage && currentUser) {
         displayName = `${currentUser.firstname} ${currentUser.lastname}`;
    } else if (senderInfo && senderInfo.firstname) {
         displayName = `${senderInfo.firstname} ${senderInfo.lastname}`;
    }

    // ... (URL base para imágenes si las usas) ...


    return (
        // El div principal ahora puede representar el CONTENEDOR completo del mensaje (nombre + globo)
        // Añadir una clase para alinear todo el contenedor a la derecha o izquierda
        <div className={`message-container ${isMyMessage ? 'my-message-container' : 'other-message-container'}`}>

             {/* *** POSICIÓN DEL NOMBRE: ¡FUERA DEL GLOBO, PERO DENTRO DEL CONTENEDOR! *** */}
             {/* Mostrar el nombre solo si hay info del remitente populada */}
             {/* Puedes ajustar la condición si quieres mostrar "Usuario Desconocido" */}
             {senderInfo && (
                 <span className="sender-name">{displayName}</span> 
             )}

             {/* Opcional: Foto de perfil (fuera del globo pero dentro del contenedor) */}
              {/* {senderInfo?.profilePicture && (
                   <img
                       src={...}
                       alt={`${displayName}'s Profile`}
                       className="message-avatar" // Necesitas esta clase CSS
                   />
              )} */}


            {/* *** EL GLOBO DEL MENSAJE (contenido) *** */}
            {/* Este div es el que tendrá el fondo de color y la forma del globo */}
            <div className={`message-bubble ${isMyMessage ? 'my-bubble' : 'other-bubble'}`}>
                 {/* Contenido del texto del mensaje */}
                 <div className="message-text">{message.text}</div> {/* Usar un div para el texto */}

                 {/* Timestamp del mensaje */}
                 {message.createdAt && (
                     <span className="message-time">{format(message.createdAt)}</span>
                 )}
            </div>

        </div>
    );
};

export default Message;