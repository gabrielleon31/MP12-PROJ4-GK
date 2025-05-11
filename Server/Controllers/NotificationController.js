// Este es el archivo server/Controllers/NotificationController.js
import NotificationModel from '../Models/Notification/Notification.js'; // Asegúrate de importar tu modelo de notificación
import mongoose from 'mongoose'; // Necesario si usas mongoose.Types.ObjectId.isValid


// Obtener notificaciones para el usuario logueado
// Esta ruta debe estar protegida por authMiddleWare
export const getNotifications = async (req, res) => {
  // req.userId contiene el ID del usuario logueado del middleware
  const loggedInUserId = req.userId;

  try {
    // Buscar notificaciones donde el usuario logueado es el receptor
    // Ordenar por fecha de creación descendente (más recientes primero)
    // POPULAR el senderId para obtener información del usuario que causó la notificación
    // Opcional: Popular postId y commentId si necesitas detalles del post/comentario en la notificación
    const notifications = await NotificationModel.find({ receiverId: loggedInUserId })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
      .populate('senderId', 'firstname lastname profilePicture') // Popular el usuario que envió/causó la notificación
      // .populate('postId', 'desc image') // Opcional: popular post si necesitas su info
      // .populate('commentId', 'text') // Opcional: popular comentario si necesitas su info
      .limit(50); // Opcional: Limitar el número de notificaciones devueltas


    res.status(200).json(notifications); // Devolver la lista de notificaciones POPULADAS

  } catch (err) {
    console.error(`Error getting notifications for user ${loggedInUserId}:`, err);
    res.status(500).json({ message: err.message });
  }
};


// Marcar notificaciones como leídas
// Puede ser una ruta PUT para marcar una o varias, o DELETE para eliminar
// Por ahora, una simple ruta para marcar todas las no leídas como leídas
export const markAllAsRead = async (req, res) => {
  const loggedInUserId = req.userId; // ID del usuario logueado

  try {
    // Marcar todas las notificaciones no leídas de este usuario como leídas
    const result = await NotificationModel.updateMany(
      { receiverId: loggedInUserId, isRead: false },
      { $set: { isRead: true } }
    );

    // Devolver el número de notificaciones modificadas o un mensaje de éxito
    res.status(200).json({ message: "All notifications marked as read", modifiedCount: result.modifiedCount });

  } catch (err) {
    console.error(`Error marking notifications as read for user ${loggedInUserId}:`, err);
    res.status(500).json({ message: err.message });
  }
};


// Opcional: Eliminar una notificación específica
// export const deleteNotification = async (req, res) => {
//   const notificationId = req.params.id;
//   const loggedInUserId = req.userId; // Asegurarse de que solo el receptor pueda eliminarla

//   try {
//     const notification = await NotificationModel.findById(notificationId);

//     if (!notification) {
//        return res.status(404).json("Notification not found");
//     }

//     // Verificar que el usuario logueado es el receptor de la notificación antes de eliminar
//     if (notification.receiverId.toString() !== loggedInUserId.toString()) {
//        return res.status(403).json("Action forbidden - You are not the recipient of this notification");
//     }

//     await notification.deleteOne();
//     res.status(200).json("Notification deleted successfully");

//   } catch (err) {
//      console.error(`Error deleting notification ${notificationId}:`, err);
//      res.status(500).json({ message: err.message });
//   }
// };