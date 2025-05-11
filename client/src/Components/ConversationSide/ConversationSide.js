// client/src/components/ConversationSide/ConversationSide.js - ACTUALIZADO

import React, { useEffect } from 'react';
import './ConversationSide.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserChats } from '../../actions/ChatAction';
import Conversation from '../Conversation/Conversation';


// Este componente RECIBE la función de selección y el ID del chat activo como PROPS desde ChatPage
// Obtiene la lista de chats directamente de Redux.
const ConversationSide = ({ onSelectChat, selectedChatId }) => { // Recibe SOLO onSelectChat y selectedChatId
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData) || {};

  // Obtener la lista de chats DEL ESTADO DE REDUX
  const {
    chats: userConversations, // <-- Usamos userConversations para el array de chats de Redux
    loadingChats,
    errorChats
  } = useSelector((state) => state.chatReducer);


  // --- useEffect para obtener la lista de conversaciones del usuario logueado ---\
  useEffect(() => {
    console.log("ConversationSide useEffect: Fetching user chats...");
    if (user && user._id) {
      dispatch(getUserChats(user._id));
    }
  }, [dispatch, user]);


  // --- La función de selección se llama desde el onClick, usa la prop onSelectChat ---\
  // El onClick está en el div padre alrededor del componente Conversation.
  // La función onSelectChat se pasa como prop desde ChatPage.
  
  return (
    <div className="ConversationSide">
      <h3>Your Chats</h3>
      {loadingChats ? (
        <span>Loading Chats...</span>
      ) : errorChats ? (
        <span>Error loading chats.</span>
      ) : (userConversations && Array.isArray(userConversations) && userConversations.length > 0) ? (
        <div className="ChatList">
          {userConversations.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={
                chat._id === selectedChatId
                  ? 'conversation-item selected'
                  : 'conversation-item'
              }
            >
              <Conversation
                data={chat}
                currentUser={user}
              />
            </div>
          ))}
        </div>
      ) : (
        <span>No chats started yet.</span>
      )}
    </div>
  );
  
};

// ConversationSide obtiene los chats de Redux, ChatPage solo necesita pasar onSelectChat, selectedChatId y currentUser.
export default ConversationSide;