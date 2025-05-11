// server/Controllers/AdminController.js - ACTUALIZADO CON FUNCIONES DE ACTUALIZACIÓN

import UserModel from '../Models/userModel.js';
import PostModel from '../Models/postModel.js';
import mongoose from 'mongoose'; // Útil para validar IDs si es necesario
// Si necesitas interactuar con otros modelos (como comentarios o notificaciones para limpieza), impórtalos aquí

// --- Controlador para obtener TODOS los usuarios (Acción de Admin) ---
// Esta función será llamada por la ruta GET /admin/users
export const getAllUsersAdmin = async (req, res) => {
    console.log("Backend: Entering getAllUsersAdmin Controller");

    try {
        const users = await UserModel.find();

        // *** Importante: Excluir la contraseña antes de enviar al frontend por seguridad ***
        const filteredUsers = users.map(user => {
            const { password, ...otherDetails } = user._doc;
            return otherDetails;
        });

        console.log(`Backend: getAllUsersAdmin - Found ${filteredUsers.length} users. Sending to admin frontend.`);
        res.status(200).json(filteredUsers); // Envía la lista de usuarios (sin contraseñas)

    } catch (error) {
        console.error("Backend: getAllUsersAdmin - Error fetching users:", error);
        res.status(500).json({ message: "Internal server error fetching users." });
    }
    console.log("Backend: Exiting getAllUsersAdmin Controller");
};


// --- Controlador para eliminar un usuario por ID (Acción de Admin) ---
// Esta función será llamada por la ruta DELETE /admin/users/:id
export const deleteUserAdmin = async (req, res) => {
     console.log("Backend: Entering deleteUserAdmin Controller");
    const userIdToDelete = req.params.id; // Obtiene el ID del usuario a eliminar de los parámetros de la ruta

    // Opcional: Validar que el ID es un ObjectId válido
     if (!mongoose.Types.ObjectId.isValid(userIdToDelete)) {
         console.warn("Backend: deleteUserAdmin - Invalid user ID format:", userIdToDelete);
         return res.status(400).json({ message: "Invalid User ID format." });
     }

     // Opcional: Prevenir que un admin se elimine a sí mismo
     // const loggedInAdminId = req.userId; // ID del admin que está haciendo la petición (del authMiddleWare)
     // if (userIdToDelete === loggedInAdminId) {
     //     console.warn("Backend: deleteUserAdmin - Admin attempted to delete their own account.");
     //     return res.status(403).json({ message: "You cannot delete your own account." });
     // }


    try {
        // Encuentra y elimina el usuario por ID
        const deletedUser = await UserModel.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
             console.warn(`Backend: deleteUserAdmin - User with ID ${userIdToDelete} not found.`);
            return res.status(404).json({ message: "User not found." });
        }

         // *** Importante: Limpieza de datos asociados al usuario eliminado ***
         // Cuando un usuario es eliminado, probablemente quieras:
         // 1. Eliminar todos los posts creados por este usuario.
         // 2. Eliminar todos los comentarios creados por este usuario.
         // 3. Eliminar todas las notificaciones relacionadas con este usuario (enviadas o recibidas).
         // 4. Remover este usuario de las listas de seguidores/seguidos de otros usuarios.
         // 5. Eliminar este usuario de las conversaciones de chat.
         // Implementar esta limpieza es crucial para la integridad de la base de datos.

         // Ejemplo: Eliminar todos los posts del usuario
          // await PostModel.deleteMany({ userId: userIdToDelete });
          // console.log(`Backend: deleteUserAdmin - Deleted posts for user ${userIdToDelete}.`);

         // Puedes añadir más lógica de limpieza aquí (comentarios, notificaciones, relaciones, chats)...


        console.log(`Backend: deleteUserAdmin - User ${userIdToDelete} deleted successfully.`);
        // Devolver un mensaje de éxito
        res.status(200).json({ message: "User deleted successfully.", deletedUser: deletedUser }); // O solo un mensaje


    } catch (error) {
        console.error(`Backend: deleteUserAdmin - Error deleting user ${userIdToDelete}:`, error);
        res.status(500).json({ message: "Internal server error deleting user." });
    }

    console.log("Backend: Exiting deleteUserAdmin Controller");
};


// --- Controlador para obtener TODOS los posts (Acción de Admin) ---
// Esta función será llamada por la ruta GET /admin/posts
export const getAllPostsAdmin = async (req, res) => {
     console.log("Backend: Entering getAllPostsAdmin Controller");

    try {
        // Como es un controlador de administrador, no hay restricción de quién los pide (isAdminMiddleWare ya lo verificó).
        // Simplemente busca TODOS los posts.
        // Popula el campo userId para obtener información del autor.
        const posts = await PostModel.find().sort({ createdAt: -1 }).populate('userId', 'firstname lastname profilePicture'); // Ordena por fecha descendente y popula autor

         // Opcional: Filtrar los posts si p.userId es null/undefined (si un usuario autor fue eliminado sin limpiar sus posts)
         const validPosts = posts.filter(post => post.userId !== null && post.userId !== undefined);
         if(posts.length !== validPosts.length) {
             console.warn(`Backend: getAllPostsAdmin - Found ${posts.length - validPosts.length} posts with missing author (userId is null/undefined).`);
         }


        console.log(`Backend: getAllPostsAdmin - Found ${validPosts.length} posts. Sending to admin frontend.`);
         // Envía la lista de posts (con autor populado)
        res.status(200).json(validPosts);

    } catch (error) {
        console.error("Backend: getAllPostsAdmin - Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error fetching posts." });
    }
     console.log("Backend: Exiting getAllPostsAdmin Controller");
};


// --- Controlador para eliminar un post por ID (Acción de Admin) ---
// Esta función será llamada por la ruta DELETE /admin/posts/:id
export const deletePostAdmin = async (req, res) => {
     console.log("Backend: Entering deletePostAdmin Controller");
    const postIdToDelete = req.params.id; // Obtiene el ID del post a eliminar de los parámetros de la ruta

    // Opcional: Validar que el ID es un ObjectId válido
     if (!mongoose.Types.ObjectId.isValid(postIdToDelete)) {
         console.warn("Backend: deletePostAdmin - Invalid post ID format:", postIdToDelete);
         return res.status(400).json({ message: "Invalid Post ID format." });
     }


    try {
        // Encuentra y elimina el post por ID
        const deletedPost = await PostModel.findByIdAndDelete(postIdToDelete);

        if (!deletedPost) {
             console.warn(`Backend: deletePostAdmin - Post with ID ${postIdToDelete} not found.`);
            return res.status(404).json({ message: "Post not found." });
        }

         // *** Opcional (y recomendado): Limpieza de datos asociados al post eliminado ***
         // Cuando un post es eliminado, probablemente quieras:
         // 1. Eliminar todos los comentarios asociados a este post
         // 2. Eliminar todas las notificaciones asociadas a este post (likes, comentarios)
         // Implementar esta limpieza es importante para la integridad de la base de datos.

         // Ejemplo: Eliminar todos los comentarios de este post
          // await CommentModel.deleteMany({ postId: postIdToDelete });
          // console.log(`Backend: deletePostAdmin - Deleted comments for post ${postIdToDelete}.`);

         // Puedes añadir más lógica de limpieza aquí (notificaciones, etc.)...


        console.log(`Backend: deletePostAdmin - Post ${postIdToDelete} deleted successfully.`);
        // Devolver un mensaje de éxito
        res.status(200).json({ message: "Post deleted successfully.", deletedPost: deletedPost }); // O solo un mensaje


    } catch (error) {
        console.error(`Backend: deletePostAdmin - Error deleting post ${postIdToDelete}:`, error);
        res.status(500).json({ message: "Internal server error deleting post." });
    }

    console.log("Backend: Exiting deletePostAdmin Controller");
};


// --- NUEVO: Controlador para actualizar un usuario por ID (Acción de Admin) ---
// Esta función será llamada por la ruta PUT /admin/users/:id
export const updateUserAdmin = async (req, res) => {
     console.log("Backend: Entering updateUserAdmin Controller");
    const userIdToUpdate = req.params.id; // Obtiene el ID del usuario a actualizar de los parámetros de la ruta
     // Los datos actualizados vendrán en req.body (firstname, lastname, username, etc.)

    // Opcional: Validar que el ID es un ObjectId válido
     if (!mongoose.Types.ObjectId.isValid(userIdToUpdate)) {
         console.warn("Backend: updateUserAdmin - Invalid user ID format:", userIdToUpdate);
         return res.status(400).json({ message: "Invalid User ID format." });
     }

     // Opcional: Prevenir que un admin cambie su propio isAdmin a false (si quieres)
     // const loggedInAdminId = req.userId; // ID del admin que está haciendo la petición (del authMiddleWare)
     // if (userIdToUpdate === loggedInAdminId.toString() && req.body.isAdmin === false) { // Comparar como string
     //     console.warn("Backend: updateUserAdmin - Admin attempted to remove their own admin status.");
     //     return res.status(403).json({ message: "You cannot remove your own admin status." });
     // }
      // Opcional: Prevenir que un admin intente cambiar la contraseña desde aquí (si el modal de edición no la incluye)
      // if (req.body.password) {
      //      console.warn("Backend: updateUserAdmin - Attempted to update password via admin user update.");
      //      delete req.body.password; // Elimina el campo password del body antes de actualizar
      // }


    try {
        // Encuentra el usuario por ID y actualiza sus campos con los datos de req.body
        // { new: true } devuelve el documento actualizado después de la actualización
        const updatedUser = await UserModel.findByIdAndUpdate(userIdToUpdate, {
             $set: req.body, // $set actualiza solo los campos presentes en req.body
             // Si quieres poder eliminar campos (como profilePicture), tendrías que manejarlo explícitamente
             // $unset: { profilePicture: "" } si req.body.profilePicture es null o ""
        }, { new: true });

        if (!updatedUser) {
             console.warn(`Backend: updateUserAdmin - User with ID ${userIdToUpdate} not found.`);
            return res.status(404).json({ message: "User not found." });
        }

         // *** Importante: Excluir la contraseña antes de enviar al frontend por seguridad ***
         const { password, ...otherDetails } = updatedUser._doc;

        console.log(`Backend: updateUserAdmin - User ${userIdToUpdate} updated successfully.`);
        // Envía el usuario actualizado (sin contraseña) de vuelta al frontend
        res.status(200).json(otherDetails);


    } catch (error) {
        console.error(`Backend: updateUserAdmin - Error updating user ${userIdToUpdate}:`, error);
        res.status(500).json({ message: "Internal server error updating user." });
    }

     console.log("Backend: Exiting updateUserAdmin Controller");
};


// --- NUEVO: Controlador para actualizar un post por ID (Acción de Admin) ---
// Esta función será llamada por la ruta PUT /admin/posts/:id
export const updatePostAdmin = async (req, res) => {
     console.log("Backend: Entering updatePostAdmin Controller");
    const postIdToUpdate = req.params.id; // Obtiene el ID del post a actualizar de los parámetros de la ruta
    const updateData = req.body; // Los datos actualizados vienen en req.body (desc, image, etc.)

    // Opcional: Validar que el ID es un ObjectId válido
     if (!mongoose.Types.ObjectId.isValid(postIdToUpdate)) {
         console.warn("Backend: updatePostAdmin - Invalid post ID format:", postIdToUpdate);
         return res.status(400).json({ message: "Invalid Post ID format." });
     }

     // Opcional: Validar que updateData tiene los campos esperados (ej: desc)
     if (!updateData || typeof updateData !== 'object') {
          console.warn("Backend: updatePostAdmin - Invalid update data provided.");
          return res.status(400).json({ message: "Invalid update data provided." });
     }


    try {
        // Encuentra el post por ID y actualiza sus campos
        const updatedPost = await PostModel.findByIdAndUpdate(postIdToUpdate, {
             $set: updateData, // Actualiza los campos con los datos de updateData
             // Si quieres poder eliminar la imagen (si updateData.image es null), puedes usar $unset condicionalmente
             // $unset: updateData.image === null ? { image: "" } : {}
        }, { new: true })
        .populate('userId', 'firstname lastname profilePicture') // Popula de nuevo el autor para enviarlo completo
        .sort({ createdAt: -1 }); // Asegura el orden si se necesita consistencia

        if (!updatedPost) {
             console.warn(`Backend: updatePostAdmin - Post with ID ${postIdToUpdate} not found.`);
            return res.status(404).json({ message: "Post not found." });
        }

        console.log(`Backend: updatePostAdmin - Post ${postIdToUpdate} updated successfully.`);
        // Envía el post actualizado (con autor populado) de vuelta al frontend
        res.status(200).json(updatedPost);

    } catch (error) {
        console.error(`Backend: updatePostAdmin - Error updating post ${postIdToUpdate}:`, error);
        res.status(500).json({ message: "Internal server error updating post." });
    }

     console.log("Backend: Exiting updatePostAdmin Controller");
};

// --- Puedes añadir más controladores aquí ---
// ...