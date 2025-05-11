// client/src/Components/RightSide/RightSide.js - CAMBIANDO ORDEN DE ICONOS EN navIcons

import React, { useState, useEffect } from 'react';
import './RightSide.css';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TrendCard from '../TrendCard/TrendCard';
import ShareModal from '../ShareModal/ShareModal';
import { Link } from 'react-router-dom';
import NotificationsList from '../NotificationsList/NotificationsList';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers } from '../../api/UserRequest';
import UsersToChatDropdown from '../UsersToChatDropdown/UsersToChatDropdown';
import { fetchNotifications } from '../../actions/NotificationAction';
import { logOut } from '../../actions/AuthAction';


const RightSide = () => {
  const dispatch = useDispatch();
  const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';

  const [modalOpened, setModalOpened] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showLogoutButton, setShowLogoutButton] = useState(false); // Estado para el botón de Deslogueo


  const [chatUsers, setChatUsers] = useState([]);
  const [loadingChatUsers, setLoadingChatUsers] = useState(false);
  const [errorChatUsers, setErrorChatUsers] = useState(false);

  const notificationState = useSelector((state) => state.notificationReducer) || { notifications: [], loading: false, error: false };
  const unreadCount = notificationState.notifications && Array.isArray(notificationState.notifications) ? notificationState.notifications.filter(n => !n.isRead).length : 0;

  const { user } = useSelector((state) => state.authReducer.authData) || {};


  useEffect(() => {
       console.log("RightSide useEffect (Fetch Notifications): User or showNotifications changed.");
       if (user && user._id && showNotifications) {
           console.log("RightSide useEffect (Fetch Notifications): Fetching notifications...");
           dispatch(fetchNotifications());
       }
  }, [user, showNotifications, dispatch]);


  useEffect(() => {
     console.log("RightSide useEffect (Fetch Chat Users): User or showChatDropdown changed.");
    if (user && user._id && showChatDropdown && (chatUsers.length === 0 || errorChatUsers)) {
        console.log("RightSide useEffect (Fetch Chat Users): Chat dropdown opened, fetching users...");
        setLoadingChatUsers(true);
        setErrorChatUsers(false);
        const fetchUsers = async () => {
            try {
                const { data } = await getAllUsers();
                const filteredUsers = data.filter(p => p._id !== user._id);
                setChatUsers(filteredUsers);
                setLoadingChatUsers(false);
            } catch (err) {
                console.error('RightSide: Error fetching users for chat dropdown:', err);
                setErrorChatUsers(true);
                setLoadingChatUsers(false);
            }
        };
        fetchUsers();
    }
  }, [showChatDropdown, user, chatUsers.length, errorChatUsers]);


   const handleNotificationIconClick = () => {
       console.log("Notification icon clicked. Toggling notifications list.");
       setShowNotifications((prev) => !prev);
       if (showChatDropdown) setShowChatDropdown(false);
       if (showLogoutButton) setShowLogoutButton(false);
   };

  const handleMessageIconClick = () => {
     console.log("Message icon clicked. Toggling chat dropdown.");
    setShowChatDropdown((prev) => !prev);
     if (showNotifications) setShowNotifications(false);
     if (showLogoutButton) setShowLogoutButton(false);
  };

  const handleSettingsIconClick = () => {
      console.log("Settings icon clicked. Toggling logout button visibility.");
      setShowLogoutButton((prev) => !prev);
      if (showNotifications) setShowNotifications(false);
      if (showChatDropdown) setShowChatDropdown(false);
  };

  const handleLogout = () => {
      console.log("Logout button clicked. Dispatching logOut action.");
      dispatch(logOut());
  };


  return (
    <div className="RightSide">
      <div className="navIcons">
        {/* --- Icono de Home (SE MANTIENE PRIMERO) --- */}
        <Link to="../home">
          <img
            src={FRONTEND_STATIC_FOLDER + 'home.png'}
            alt="home"
          />
        </Link>

        {/* *** Icono de Mensajes (Chat) (SE MUEVE A LA SEGUNDA POSICIÓN) *** */}
        <img
          src={FRONTEND_STATIC_FOLDER + 'comment.png'}
          alt="messages"
          onClick={handleMessageIconClick}
          style={{ cursor: 'pointer' }}
        />

        {/* --- Icono de Notificaciones y badge (SE MANTIENE TERCERO) --- */}
        <div className="notification-icon-container" onClick={handleNotificationIconClick}>
            <img
              src={FRONTEND_STATIC_FOLDER + 'noti.png'}
              alt="notifications"
            />
            {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
            )}
        </div>

        {/* *** Icono de Settings (SE MUEVE A LA CUARTA POSICIÓN) *** */}
        <SettingsOutlinedIcon
            style={{ fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={handleSettingsIconClick} // Click handler se mantiene
         />

         {/* Opcional: Icono de Chat badge si lo tienes */}
         {/* {unreadChatCount > 0 && (
              <span className="chat-badge">{unreadChatCount}</span>
         )} */}

      </div>

      <TrendCard />

      {/* --- Renderizar la lista de notificaciones condicionalmente (Usa dropdown-container) --- */}
      {/* Se posicionará bajo el icono de Notificaciones (ahora el tercero) */}
      {showNotifications && (
         <div className="dropdown-container notification-dropdown">
            <NotificationsList />
         </div>
      )}

      {/* --- Renderizar el dropdown de chat condicionalmente (Usa dropdown-container) --- */}
       {/* Se posicionará bajo el icono de Mensajes (ahora el segundo) */}
      {showChatDropdown && (
         <div className="dropdown-container chat-dropdown">
             <UsersToChatDropdown
                 users={chatUsers}
                 loading={loadingChatUsers}
                 error={errorChatUsers}
                 currentUser={user}
                 onCloseDropdown={() => setShowChatDropdown(false)}
             />
         </div>
      )}

      {/* --- Renderizar SOLO el botón de deslogueo condicionalmente, estilo "Share" --- */}
      {/* Se posicionará bajo el icono de Settings (ahora el cuarto) */}
      {showLogoutButton && (
         <div
            className="button rg-button logout-button-styled" // Usamos rg-button y añadimos una clase específica
            onClick={handleLogout}
            style={{
                position: 'absolute',
                // AJUSTA ESTE 'top' SI ES NECESARIO después de cambiar el orden de los iconos
                // Debe ser la altura de .navIcons + un pequeño espacio para aparecer debajo del icono de Settings (el cuarto)
                top: '70px', // <-- Probablemente necesite ajuste
                right: '0.1rem', // O left: 'auto', right: '0', margin: '0 auto' para centrar en su columna
                left: 'auto',
                zIndex: 999,
                width: 'auto', // Permite que el ancho se ajuste al contenido + padding
                padding: '0.5rem 1rem', // Ajusta si es necesario
            }}
         >
            Log Out
         </div>
      )}


      {/* Botón y modal de Share */}
      <div
        className="button rg-button"
        onClick={() => setModalOpened(true)}
      >
        Share
      </div>
      <ShareModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
      />

    </div>
  );
};

export default RightSide;