// Este es el archivo server/index.js - CON AdminRoute MONTADO

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

// Importar tus routers REST
import authRoute from "./Routes/AuthRoute.js";
import postRoute from "./Routes/PostRoute.js";
import uploadRoute from "./Routes/UploadRoute.js";
import userRoute from "./Routes/UserRoute.js";
import commentRoute from "./Routes/CommentRoute.js";
import notificationRoute from "./Routes/NotificationRoute.js";
// --- Importar rutas de Chat y Mensajes ---
import conversationRoute from "./Routes/ConversationRoute.js";
import messageRoute from "./Routes/MessageRoute.js";
// --- Importar rutas de Administración ---
import adminRoute from "./Routes/AdminRoute.js"; // <<< Importar AdminRoute
// --- Fin Importación Routers ---


console.log("All initial routes imported in index.js");

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Crear instancia de Express
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

let activeUsers = [];
console.log("Socket.IO server initialized.");

// Middleware general para loguear peticiones recibidas (opcional, pero útil)
// app.use((req, res, next) => {
//     console.log(`Backend: Middleware - Received Request: ${req.method} ${req.url}`);
//     next();
// });


io.on("connection", (socket) => {
    console.log(`Socket.IO: User Connected: ${socket.id}`);

    // *** Lógica de Socket.IO (Mantener/Completar según necesidad para chat y notificaciones) ***
    // Este es el lugar donde manejas eventos como 'new-user-add', 'send-message', etc.
    // Si ya implementaste la lógica para notificaciones en tiempo real aquí, mantenla.
    // Si necesitas añadirla, este es el bloque principal.
    // La lógica completa de Socket.IO podría estar en un archivo separado para mantener index.js limpio.

    // Ejemplo (básico) de manejo de un evento 'test-event'
    // socket.on('test-event', (data) => {
    //     console.log('Socket.IO: Received test-event:', data);
    //     // io.emit('some-event', { message: 'Hello from server!' }); // Emitir a todos
    //     // socket.emit('another-event', { message: 'Only for you!' }); // Emitir al remitente
    // });

    // Ejemplo básico de manejo de desconexión
    // socket.on('disconnect', () => {
    //     console.log(`Socket.IO: User Disconnected: ${socket.id}`);
    //     // Eliminar usuario de activeUsers si lo estás gestionando aquí
    // });

    // Asegúrate de que tus manejadores de Socket.IO estén dentro de este bloque `io.on("connection", ...)`
    // O que este bloque llame a funciones definidas en otro archivo que contengan la lógica de Socket.IO.

    // *** Fin Lógica de Socket.IO ***

});


// Middlewares para parsear el cuerpo de las peticiones y CORS
app.use(express.json({ limit: "30mb", extended: true })); // Para parsear JSON en el body
app.use(express.urlencoded({ limit: "30mb", extended: true })); // Para parsear URL-encoded

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" })); // Configurar CORS

// Servir archivos estáticos desde la carpeta 'public/images'
const __publicdirname = path.join(__dirname, 'public');
console.log("Serving static files from:", __publicdirname);
// IMPORTANTE: El frontend accederá a estas imágenes con la URL base + /images/nombre-archivo.png
// ej: http://localhost:5000/images/nombre-archivo.png
// La línea de abajo configura Express para servir archivos desde __publicdirname cuando la URL empieza por /images
app.use(express.static(__publicdirname)); // <<< RUTA BASE /images


// --- Montar tus routers REST ---
console.log("Mounting REST routes...");
app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/upload", uploadRoute);
app.use("/user", userRoute);
app.use("/comment", commentRoute);
app.use("/notification", notificationRoute);
// --- Montar rutas de Chat y Mensajes ---
app.use("/conversation", conversationRoute);
app.use("/message", messageRoute);
// --- Montar rutas de Administración ---
app.use("/admin", adminRoute); // <<< Montar AdminRoute en la ruta base /admin
// --- Fin Montar Routers ---

console.log("All REST routes mounted.");


// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // O '127.0.0.1' si prefieres (para localhost)
console.log("Attempting to start server...");

// Iniciar el servidor HTTP (que Express y Socket.IO usan)
httpServer.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`)
);