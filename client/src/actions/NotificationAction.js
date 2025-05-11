// Este es el archivo client/src/actions/NotificationAction.js
import * as NotificationApi from '../api/NotificationRequest';


// Acción para obtener las notificaciones del usuario logueado
export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: "FETCH_NOTIFICATIONS_START" });
  try {
    // Llama a la API para obtener notificaciones (devolverá notificaciones POPULADAS)
    const { data } = await NotificationApi.getNotifications();

    console.log("Fetch Notifications API successful. Received data:", data); // Log de depuración

    // Despacha la acción de éxito con la lista de notificaciones
    dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", data: data });

    // Opcional: retornar data si el componente que llama la necesita (ej: para mostrar un conteo)
    // return data;

  } catch (error) {
    console.error("Error fetching notifications:", error);
    dispatch({ type: "FETCH_NOTIFICATIONS_FAIL", error: error }); // Pasa el error al reducer
    // No es estrictamente necesario re-lanzar el error a menos que la UI necesite manejar el fallo de forma específica
    // throw error;
  }
};

// Acción para marcar todas las notificaciones del usuario logueado como leídas
export const markAllNotificationsAsRead = () => async (dispatch) => {
  dispatch({ type: "MARK_NOTIFICATIONS_READ_START" });
  try {
    // Llama a la API para marcar como leídas
    await NotificationApi.markAllAsRead();

    console.log("Mark Notifications as Read API successful."); // Log de depuración

    // Despacha la acción de éxito. El reducer actualizará el estado para reflejar que están leídas.
    dispatch({ type: "MARK_NOTIFICATIONS_READ_SUCCESS" });

  } catch (error) {
    console.error("Error marking notifications as read:", error);
    dispatch({ type: "MARK_NOTIFICATIONS_READ_FAIL", error: error }); // Pasa el error al reducer
    // No es estrictamente necesario re-lanzar el error
    // throw error;
  }
};

// Opcional: Acción para eliminar una notificación específica
// export const deleteNotificationAction = (notificationId) => async (dispatch) => {
//   dispatch({ type: "DELETE_NOTIFICATION_START" });
//   try {
//     await NotificationApi.deleteNotification(notificationId);
//     dispatch({ type: "DELETE_NOTIFICATION_SUCCESS", notificationId: notificationId }); // Pasa el ID para que el reducer lo elimine
//   } catch (error) {
//     console.error(`Error deleting notification ${notificationId}:`, error);
//     dispatch({ type: "DELETE_NOTIFICATION_FAIL", error: error });
//     throw error;
//   }
// };