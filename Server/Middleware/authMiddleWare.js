// server/Middleware/authMiddleWare.js - AÑADIR LOGS DE ENTRADA/SALIDA Y ERROR

import jwt from 'jsonwebtoken'; // Asegúrate de importar jwt
import dotenv from 'dotenv'; // Si usas variables de entorno aquí

dotenv.config(); // Cargar variables de entorno si las necesitas (ej: JWT_SECRET)

const authMiddleWare = async (req, res, next) => {
    // *** AÑADE ESTE LOG AL PRINCIPIO DEL MIDDLEWARE ***
    console.log("Backend: Entering authMiddleWare");

    try {
        // Intenta obtener el token de la cabecera Authorization
        // La cabeceraAuthorization es típicamente 'Bearer TOKEN_AQUÍ'
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("Backend: authMiddleWare - No Authorization header.");
            // Si no hay cabecera Authorization, probablemente la ruta requiere autenticación
            return res.status(401).json({ message: "Authorization header missing." });
             // O next('route') si quieres saltar el resto de middlewares de autenticación
        }

        const token = authHeader.split(' ')[1]; // Divide "Bearer TOKEN" y toma la segunda parte (el token)

        // Verifica el token
        // Asegúrate de que process.env.JWT_SECRET está configurado correctamente en tu .env
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Backend: authMiddleWare - JWT verification failed:", err.message);
                // Si la verificación falla (token inválido, expirado, etc.)
                return res.status(401).json({ message: "Invalid or expired token." });
            }

            // Si el token es válido, adjunta el ID del usuario al objeto de petición
            // Esto hace que req.userId esté disponible en tus controladores
            req.userId = decoded.id; // Asegúrate de que tu token JWT guarda el ID del usuario en un campo 'id' o similar
            console.log(`Backend: authMiddleWare - Token verified. User ID: ${req.userId}`);

            // Pasa la petición al siguiente middleware o al manejador de ruta
            // *** AÑADE ESTE LOG ANTES DE next() ***
            console.log("Backend: Exiting authMiddleWare (success)");
            next();
        });

    } catch (error) {
        // Captura cualquier otro error que pueda ocurrir en el middleware (ej: problema con split)
        // *** ESTE LOG DEBE CAPTURAR ERRORES NO ESPERADOS ***
        console.error("Backend: Error in authMiddleWare catch block:", error);
        // Devolver una respuesta de error o pasar el error al manejador de errores de Express
        res.status(500).json({ message: "Internal server error during authentication." });
        // O puedes usar next(error); si tienes un middleware de manejo de errores global al final de index.js
    }
};

export default authMiddleWare;