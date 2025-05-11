// Este es el archivo server/Models/postModel.js
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        // Cambiar el tipo a ObjectId y añadir la referencia al modelo 'Users'
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users', // <-- Asegúrate de que 'Users' es el nombre de tu modelo de usuario (normalmente es 'User' o 'users', verifica tu userModel.js)
            required: true
        },
        desc: String, // Asegúrate de que tu campo de texto para el post se llama 'desc'
        likes: [],
        image: String // Si manejas imágenes en los posts
    },
    {
        timestamps: true,
    }
)

const postModel = mongoose.model("Posts", postSchema); // Asegúrate de que el nombre del modelo es "Posts" o lo que uses

export default postModel;