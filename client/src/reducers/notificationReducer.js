// Este es el archivo client/src/reducers/notificationReducer.js - ACTUALIZADO
const initialState = {
  notifications: [], // Array para almacenar las notificaciones del usuario
  loading: false,      // Indicador de carga para obtener notificaciones
  error: false,        // Indicador de error al obtener notificaciones
  markingAsRead: false, // Indicador de carga para marcar como leídas
  markAsReadError: false, // Indicador de error al marcar como leídas
  // Opcional: newNotificationsCount: 0, // Para llevar un conteo de notificaciones no leídas
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- Casos para obtener notificaciones ---
    case "FETCH_NOTIFICATIONS_START":
      return { ...state, loading: true, error: false };
    case "FETCH_NOTIFICATIONS_SUCCESS":
      // action.data debe ser un array de notificaciones POPULADAS
      return { ...state, notifications: action.data, loading: false, error: false };
    case "FETCH_NOTIFICATIONS_FAIL":
      console.error("Notification fetch failed:", action.error);
      return { ...state, loading: false, error: true };

    // --- Casos para marcar como leídas ---
    case "MARK_NOTIFICATIONS_READ_START":
      return { ...state, markingAsRead: true, markAsReadError: false };
    case "MARK_NOTIFICATIONS_READ_SUCCESS":
      // Marcar todas las notificaciones en el estado como leídas
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, isRead: true })),
        markingAsRead: false,
        markAsReadError: false,
      };
    case "MARK_NOTIFICATIONS_READ_FAIL":
       console.error("Mark notifications as read failed:", action.error);
      return { ...state, markingAsRead: false, markAsReadError: true };

    // Opcional: Caso para añadir una notificación en tiempo real (si usas Socket.IO)
    // case "ADD_NOTIFICATION": // Socket.IO enviaría { type: "ADD_NOTIFICATION", data: newNotification }
    //    return { ...state, notifications: [action.data, ...state.notifications] }; // Añadir la nueva notificación al principio


    // --- NUEVO CASO PARA LIMPIAR ESTADO AL CERRAR SESIÓN ---
    case "LOG_OUT": // Cuando se despacha la acción de cerrar sesión
         console.log("notificationReducer: Handling LOG_OUT, resetting state."); // Log de depuración
         return initialState; // Reinicia el estado a su valor inicial
    // --- FIN NUEVO CASO ---


    default:
      return state;
  }
};

export default notificationReducer;