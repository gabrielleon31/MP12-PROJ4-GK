// client/src/pages/ChatPage/ChatPage.js - NUEVA ESTRUCTURA HTML

import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import ConversationSide from '../../Components/ConversationSide/ConversationSide';
import ChatBox from '../../Components/ChatBox/ChatBox';

import { createNewChat, getUserChats, setActiveChat } from '../../actions/ChatAction';


const ChatPage = () => {
  const dispatch = useDispatch();
  const { chats, loadingChats, errorChats, activeChat: activeChatFromRedux } = useSelector((state) => state.chatReducer);
  const { user } = useSelector((state) => state.authReducer.authData) || {};

  const location = useLocation();
  const navigate = useNavigate();

  const [currentChat, setCurrentChat] = useState(null);
  const socket = useRef();


  // --- Socket.IO connect y new-user-add (mantener) ---
  useEffect(() => { /* ... */ }, [user]);


   // --- useEffect para cargar la lista de chats (mantener) ---
   useEffect(() => { /* ... */ }, [dispatch, user]);


   // --- useEffect para manejar la navegación a un chat específico (mantener) ---
   useEffect(() => { /* ... */ }, [user, dispatch, navigate, location.state]);


  // --- Función para manejar la selección de chat (mantener) ---
  const handleChatSelect = (chatData) => {
    console.log("ChatPage: Conversation selected in sidebar:", chatData);
    setCurrentChat(chatData);
    dispatch(setActiveChat(chatData));
  };

    // --- Función para navegar a la página principal ---
    const handleGoHome = () => {
        console.log("ChatPage: Navigating to home page.");
        navigate('/'); // Navega a la ruta '/'
    };


  return (
    <div className="ChatPage">
       {/* *** CONTENEDOR PRINCIPAL DE 2 COLUMNAS (Flexbox) *** */}
       {/* Este contenedor ahora envuelve toda el área de chat, incluyendo el header y la lista */}
       {/* Eliminamos el ChatPage-center si ChatPage va a manejar el layout de 2 columnas directamente */}

        {/* *** OPCIÓN 1: ChatPage como contenedor de 2 columnas (SI NO HAY OTROS ELEMENTOS COMO FOOTER DE PÁGINA) *** */}
        {/* Si ChatPage solo contiene el área de chat principal */}
        <div className="ChatPage-container"> {/* Nuevo nombre de clase para mayor claridad */}
            {/* *** COLUMNA IZQUIERDA: Header y Lista de Chats Apilados *** */}
            <div className="ChatPage-left-panel"> {/* Nuevo div para agrupar */}
                {/* *** HEADER DE LA PÁGINA DE CHAT CON TÍTULO Y BOTÓN *** */}
                {/* Lo movemos DENTRO de la columna izquierda */}
               <div className="chat-page-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Chat Page</h2>
                    <button className="button go-home-button" onClick={handleGoHome}>
                        Go to Home
                    </button>
               </div>

                {/* *** LISTA DE CONVERSACIONES (ConversationSide) *** */}
                {/* También dentro de la columna izquierda */}
                <ConversationSide
                    chats={chats}
                    currentUser={user}
                    onSelectChat={handleChatSelect}
                    selectedChatId={currentChat ? currentChat._id : null}
                />
            </div>

            {/* *** COLUMNA DERECHA: Caja de Chat Activa (ChatBox) *** */}
            <div className="ChatPage-right-panel"> {/* Nuevo div para la columna derecha */}
                <ChatBox
                    chat={currentChat}
                    currentUser={user}
                    socket={socket}
                />
            </div>
        </div>


        {/* *** OPCIÓN 2: Mantener ChatPage como columna y ChatPage-center como 2 columnas (SI HAY FOOTER DE PÁGINA) *** */}
        {/* Si ChatPage tiene un footer u otros elementos que se apilan verticalmente */}
        {/* <div className="ChatPage-header-page"> HEADER DE LA PÁGINA COMPLETA</div> */}
        {/* <div className="ChatPage-center"> */}
            {/* *** COLUMNA IZQUIERDA: Header y Lista de Chats Apilados *** */}
            {/* <div className="ChatPage-left-panel"> */}
                {/* HEADER DE LA PÁGINA DE CHAT */}
               {/* <div className="chat-page-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
                    {/* <h2>Chat Page</h2> */}
                    {/* <button className="button go-home-button" onClick={handleGoHome}>Go to Home</button> */}
               {/* </div> */}

                {/* LISTA DE CONVERSACIONES */}
                {/* <ConversationSide ... /> */}
            {/* </div> */}

            {/* *** COLUMNA DERECHA: Caja de Chat Activa (ChatBox) *** */}
            {/* <div className="ChatPage-right-panel"> */}
                {/* <ChatBox ... /> */}
            {/* </div> */}
        {/* </div> */}
        {/* <div className="ChatPage-footer-page"> FOOTER DE LA PÁGINA COMPLETA</div> */}

    </div>
  );
};

export default ChatPage;