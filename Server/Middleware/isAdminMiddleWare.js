import UserModel from '../Models/userModel.js'; // Importa tu modelo de usuario
import mongoose from 'mongoose'; // Para validar ObjectId si es necesario

const isAdminMiddleWare = async (req, res, next) => {
    console.log("Backend: Entering isAdminMiddleWare");

    // authMiddleWare debe haber adjuntado req.userId si la ruta está protegida por authMiddleWare
    const userId = req.userId;

    // *** VERIFICACIÓN: Asegurarse de que req.userId existe ***
    // Si este middleware se usa después de authMiddleWare, req.userId debería existir.
    // Si no existe, significa que authMiddleWare no se ejecutó o falló,
    // o que este middleware se usó en una ruta no protegida por authMiddleWare.
    if (!userId) {
        console.warn("Backend: isAdminMiddleWare - userId not found in request. Is authMiddleWare applied?");
         // Puedes devolver un 401 o dejar que authMiddleWare lo maneje si se aplica antes
        return res.status(401).json({ message: "Authentication required to check admin status." });
    }

     // Opcional: Validar que el userId es un ID válido de Mongoose
     if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.warn("Backend: isAdminMiddleWare - Invalid userId format:", userId);
         return res.status(401).json({ message: "Invalid user ID format." });
     }


    try {
        // *** Buscar al usuario en la base de datos para verificar el campo isAdmin ***
        const user = await UserModel.findById(userId);

        // *** Verificar si el usuario existe y si es administrador ***
        if (user && user.isAdmin === true) {
            console.log(`Backend: isAdminMiddleWare - User ${userId} is admin. Access granted.`);
            // Si el usuario existe y es administrador, permite que la petición continúe
            next();

        } else {
            console.warn(`Backend: isAdminMiddleWare - User ${userId} is not found or not admin. Access denied.`);
            // Si el usuario no se encuentra o no es administrador, deniega el acceso
            res.status(403).json({ message: "Access forbidden: Admin privileges required." });
        }

    } catch (error) {
        // *** Manejar errores de base de datos u otros errores inesperados ***
        console.error("Backend: isAdminMiddleWare - Error in try-catch block:", error);
        res.status(500).json({ message: "Internal server error during admin check." });
    }

    console.log("Backend: Exiting isAdminMiddleWare"); // Este log solo se verá si se devuelve una respuesta antes o si next() se llama y la cadena de middleware termina aquí.
};

export default isAdminMiddleWare;