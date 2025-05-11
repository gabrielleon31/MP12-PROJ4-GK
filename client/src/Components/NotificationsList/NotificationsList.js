// Este es el archivo client/src/Components/NotificationsList/NotificationsList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllNotificationsAsRead } from '../../actions/NotificationAction';
import './NotificationsList.css'; // Asegúrate de crear este archivo CSS


// Helper function to format notification text
const formatNotificationText = (notification) => {
    // Asegurarnos de que notification y notification.senderId existen y tienen las propiedades esperadas
    const senderName = notification.senderId && typeof notification.senderId === 'object' && notification.senderId.firstname && notification.senderId.lastname
        ? `${notification.senderId.firstname} ${notification.senderId.lastname}`
        : 'Someone'; // Fallback name

    switch (notification.type) {
        case 'like':
            return `${senderName} liked your post.`;
        case 'comment':
             // Usamos el texto del comentario si está disponible, si no, solo "commented on your post"
             const commentText = notification.text ? `: "${notification.text.substring(0, 30)}${notification.text.length > 30 ? '...' : ''}"` : '';
            return `${senderName} commented on your post${commentText}.`;
        case 'follow':
            return `${senderName} started following you.`;
        case 'message':
             // Si implementas mensajes y el texto está en 'text'
             const messageText = notification.text ? `: "${notification.text.substring(0, 30)}${notification.text.length > 30 ? '...' : ''}"` : '';
             return `${senderName} sent you a message${messageText}.`;
        default:
            return 'New notification.';
    }
};


const NotificationsList = () => {
    const dispatch = useDispatch();
    // Leemos el estado de notificaciones del reducer
    const { notifications, loading, error } = useSelector((state) => state.notificationReducer);
    const { user } = useSelector((state) => state.authReducer.authData) || {}; // Usuario logueado

    // Fetch notifications when the component mounts or user changes
    useEffect(() => {
        console.log("NotificationsList useEffect: Fetching notifications...");
        if (user && user._id) {
            dispatch(fetchNotifications());
        }
    }, [user?._id, dispatch]); // Depende del ID del usuario logueado y dispatch


    // Función para marcar todas como leídas (puedes llamarla desde un botón)
    const handleMarkAllAsRead = () => {
        console.log("Marking all notifications as read...");
        dispatch(markAllNotificationsAsRead());
    };


    return (
        <div className="NotificationsList">
            <h4>Your Notifications</h4>

            {loading ? (
                <span>Loading Notifications...</span>
            ) : error ? (
                 <span className="error-message">Error loading notifications.</span>
            ) : notifications && notifications.length > 0 ? (
                <div className="notificationItems">
                    {notifications.map((notification) => (
                        // Cada elemento de notificación
                        <div key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                            {/* Puedes añadir un icono basado en notification.type */}
                            {/* Por ahora solo mostramos el texto */}
                            <span>{formatNotificationText(notification)}</span>
                            {/* Opcional: Mostrar la fecha/hora */}
                            {notification.createdAt && (
                                 <span className="notification-date">{new Date(notification.createdAt).toLocaleString()}</span>
                            )}
                             {/* Opcional: Enlazar a la fuente de la notificación (post, perfil, etc.) */}
                             {/* Esto requiere que notification.postId, notification.senderId etc. estén populados o que sus IDs estén disponibles */}
                             {/* Por ejemplo, para un like/comment en un post: */}
                             {/* {notification.postId && <Link to={`/post/${notification.postId}`}>View Post</Link>} */}

                        </div>
                    ))}
                     {/* Botón para marcar todas como leídas */}
                     {notifications.some(n => !n.isRead) && ( // Mostrar botón solo si hay alguna no leída
                          <button className="button mark-as-read-button" onClick={handleMarkAllAsRead}>
                              Mark All as Read
                          </button>
                     )}
                </div>
            ) : (
                <span>No new notifications.</span>
            )}

        </div>
    );
};

export default NotificationsList;