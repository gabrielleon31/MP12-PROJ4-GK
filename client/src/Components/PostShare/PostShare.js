import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";
import {
  UilScenery,
  UilPlayCircle,
  UilMapMarker,
  UilSchedule,
  UilTimes,
} from "@iconscout/react-unicons";
import "./PostShare.css";

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);

  // Usamos la variable para la carpeta pública del backend para imágenes subidas
  const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  // Usamos process.env.PUBLIC_URL + '/Img/' para imágenes estáticas del frontend
  const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/'; // O simplemente '/Img/' si no hay subrutas


  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const removeImage = () => setImageFile(null);

  const handleShare = async () => {
    let imageName = "";
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile); // "image" debe coincidir con el nombre del campo en UploadRoute.js
      try {
         const result = await dispatch(uploadImage(formData));
         imageName = result; // uploadImage action now returns the filename
      } catch (error) {
         console.error("Error uploading image:", error);
         // Manejar el error de subida de imagen si es necesario
         return; // Detener el proceso si falla la subida de imagen
      }
    }

    // Crear el objeto del post con el nombre de la imagen si existe
    const postData = {
        userId: user._id,
        desc: desc,
        image: imageName || "", // Si no se subió imagen, el campo 'image' puede ser una cadena vacía
    };

    // Subir el post
    await dispatch(uploadPost(postData));

    // Resetear el formulario
    setDesc("");
    setImageFile(null);
  };

  return (
    <div className="PostShare">
      {/* Usamos SERVER_PUBLIC_FOLDER para la foto de perfil si viene del backend,
          si no, usamos FRONTEND_STATIC_FOLDER para la imagen por defecto */}
      <img
        src={
          user.profilePicture
            ? SERVER_PUBLIC_FOLDER + user.profilePicture // Imagen subida por el usuario
            : FRONTEND_STATIC_FOLDER + "defaultProfile.png" // Imagen estática por defecto
        }
        alt="Profile"
      />

      <input
        type="text"
        placeholder="Write a caption..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      {/* Si hay imagen seleccionada, muestro preview */}
      {imageFile && (
        <div className="previewImage">
          <UilTimes onClick={removeImage} className="remove-icon" />
          <img src={URL.createObjectURL(imageFile)} alt="Preview" />
        </div>
      )}

      <div className="share-options">
        {/* Photo: mantenemos label + input file */}
        <label className="option" htmlFor="file-input">
          <UilScenery className="option-icon" />
          <span>Photo</span>
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* Otros iconos estáticos usan FRONTEND_STATIC_FOLDER */}
        <div className="option">
          <UilPlayCircle className="option-icon" />
          <span>Video</span>
        </div>

        <div className="option">
          <UilMapMarker className="option-icon" />
          <span>Location</span>
        </div>

        <div className="option">
          <UilSchedule className="option-icon" />
          <span>Schedule</span>
        </div>

        <button className="share-btn" onClick={handleShare}>
           {/* Icono de compartir estático usa FRONTEND_STATIC_FOLDER */}
          <img
            src={FRONTEND_STATIC_FOLDER + "share.png"} // Ajusta si el path es diferente
            alt="share"
            className="share-icon"
          />
          Share
        </button>
      </div>
    </div>
  );
};

export default PostShare;