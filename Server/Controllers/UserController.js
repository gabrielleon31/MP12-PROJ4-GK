import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import NotificationModel from '../Models/Notification/Notification.js';


// get All users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map(user => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};


// get a user
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("Please, try again: invalid user!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


// Update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, password } = req.body;

  if (id === _id) {
    // si cambió la contraseña, la hasheamos
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password.toString(), salt);
    }

    try {
      const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

      // firmamos con JWT_SECRET (igual que en el registro/login)
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only update your own profile");
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { _id, currentUserAdminStatus } = req.body;

  if (_id === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can only delete your own profile");
  }
};


// Follow a user
export const followUser = async (req, res) => {
  const id = req.params.id; // ID del usuario a seguir
  const { _id } = req.body; // ID del usuario actual (quien sigue)

  if (_id === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const userToFollow = await UserModel.findById(id);
      const currentUser   = await UserModel.findById(_id);

      if (!userToFollow.followers.includes(_id)) {
        await userToFollow.updateOne({ $push: { followers: _id } });
        await currentUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");

        // --- AÑADIR LÓGICA PARA CREAR NOTIFICACIÓN DE FOLLOW AQUÍ ---
         const newNotification = new NotificationModel({
             type: 'follow',
             senderId: _id,          // Quien siguió
             receiverId: id,         // Quien fue seguido
             // postId/commentId/text no son necesarios para follows
         });
         await newNotification.save();
         console.log(`Notification created: Follow on user ${id} by user ${_id}`);
        // --- FIN LÓGICA NOTIFICACIÓN ---

      } else {
        res.status(403).json("User is already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// Unfollow a user
export const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const userToUnfollow = await UserModel.findById(id);
      const currentUser     = await UserModel.findById(_id);

      if (userToUnfollow.followers.includes(_id)) {
        await userToUnfollow.updateOne({ $pull: { followers: _id } });
        await currentUser    .updateOne({ $pull: { following: id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};


// Search users by firstname, lastname, or username (case-insensitive)
export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      // Si la consulta está vacía, puedes decidir si devolver todos los usuarios (excluyendo el actual),
      // un array vacío, o los usuarios sugeridos. Devolver vacío es común para barras de búsqueda.
      return res.status(200).json([]);
    }

    // Crear una expresión regular para la búsqueda case-insensitive
    const regex = new RegExp(q, 'i');

    const users = await UserModel.find({
      $or: [ // Usar $or para buscar en cualquiera de estos campos
        { firstname: { $regex: regex } },
        { lastname:  { $regex: regex } },
        // **Asegúrate de que tu userModel.js incluye un campo 'username' si descomentas la línea de abajo:**
        // { username:  { $regex: regex } },
      ]
      // Opcional: excluir al usuario actual de los resultados de búsqueda
      // Y si quieres excluir al usuario actual, puedes añadir una condición AND:
      // $and: [ { _id: { $ne: req.userId } }, { $or: [ ... ] } ]
      // Pero req.userId solo está disponible si usas authMiddleWare en la ruta /user/search
      // Como la ruta /user/search NO usa authMiddleWare actualmente, no puedes usar req.userId aquí.
      // Si quieres excluir al usuario actual, podrías pasar su ID desde el frontend.
    });

    // Excluir la contraseña antes de enviar al frontend por seguridad
    const filteredUsers = users.map(user => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error searching users:", error); // Log del error
    res.status(500).json({ message: error.message });
  }
};
