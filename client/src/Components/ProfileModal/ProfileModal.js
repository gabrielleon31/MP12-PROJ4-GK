import { Modal, useMantineTheme } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { uploadImage } from '../../actions/UploadAction'; // Para subir nueva imagen si se cambia
import { updateUser } from '../../actions/UserAction'; // Para despachar la acción de actualizar usuario
import './ProfileModal.css';


function ProfileModal({ modalOpened, setModalOpened, data }) {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const param = useParams();

  const { user, updateLoading, updateError } = useSelector((state) => state.authReducer.authData) || {}; // Añadimos updateLoading y updateError
  const initialUserData = (data && user && data._id === user._id) ? user : data;

  const { password, confirmpass, ...other } = initialUserData || {};
  const [formData, setFormData] = useState(other);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Estados para las URLs de previsualización
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState(
      initialUserData?.profilePicture ? process.env.REACT_APP_BACKEND_PUBLIC_FOLDER + initialUserData.profilePicture : null
  );
   const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(
      initialUserData?.coverPicture ? process.env.REACT_APP_BACKEND_PUBLIC_FOLDER + initialUserData.coverPicture : null
  );


  // Variable para la carpeta pública del backend (para mostrar imágenes existentes/previews)
  const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;


  useEffect(() => {
      // Cuando postData cambie, actualiza el estado local del formulario y la previsualización
      const { password, confirmpass, ...other } = data || {};
      setFormData(other);
      setProfileImagePreviewUrl(data?.profilePicture ? SERVER_PUBLIC_FOLDER + data.profilePicture : null);
      setCoverImagePreviewUrl(data?.coverPicture ? SERVER_PUBLIC_FOLDER + data.coverPicture : null);
       setProfileImage(null); // Reset file inputs when modal opens/data changes
       setCoverImage(null);
  }, [data, SERVER_PUBLIC_FOLDER]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imgFile = event.target.files[0]; // Renombrar a imgFile para claridad

      if (event.target.name === "profileImage") {
        setProfileImage(imgFile);
        // Crear URL de previsualización temporal para la nueva imagen
        setProfileImagePreviewUrl(URL.createObjectURL(imgFile));
      } else { // coverImage
        setCoverImage(imgFile);
         // Crear URL de previsualización temporal para la nueva imagen
        setCoverImagePreviewUrl(URL.createObjectURL(imgFile));
      }
    }
  }

   // Función para remover imagen de perfil
  const removeProfileImage = () => {
      setProfileImage(null); // Elimina el archivo seleccionado
      setProfileImagePreviewUrl(null); // Elimina la previsualización
      setFormData({...formData, profilePicture: null}); // Elimina la referencia en formData para actualizar en DB
  };

  // Función para remover imagen de portada
  const removeCoverImage = () => {
      setCoverImage(null); // Elimina el archivo seleccionado
      setCoverImagePreviewUrl(null); // Elimina la previsualización
      setFormData({...formData, coverPicture: null}); // Elimina la referencia en formData para actualizar en DB
  };


  const handleSubmit = async (e) => { // Añadimos async aquí
    e.preventDefault();

    let UserData = { ...formData }; // Copia los datos del formulario

    // --- Lógica para subir y asignar la imagen de perfil ---
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("image", profileImage); // <<< ¡CAMBIO CLAVE AQUÍ: "image"!
      try {
        const response = await dispatch(uploadImage(data));
        // Asumiendo que uploadImage devuelve el nombre del archivo en response.filename
        UserData.profilePicture = response; // Asigna el nombre del archivo subido a profilePicture
         console.log("Profile image uploaded successfully:", response);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        // Manejar el error de subida de imagen si es necesario (ej: mostrar mensaje al usuario)
        return; // Detener el handleSubmit si la subida falla
      }
    } else if (profileImagePreviewUrl === null && formData.profilePicture !== null) {
         // Caso: El usuario ha eliminado la imagen de perfil existente
         UserData.profilePicture = null;
    }


    // --- Lógica para subir y asignar la imagen de portada ---
    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append("name", fileName);
      data.append("image", coverImage); // <<< ¡CAMBIO CLAVE AQUÍ: "image"!
      try {
        const response = await dispatch(uploadImage(data));
         // Asumiendo que uploadImage devuelve el nombre del archivo en response.filename
        UserData.coverPicture = response; // Asigna el nombre del archivo subido a coverPicture
         console.log("Cover image uploaded successfully:", response);
      } catch (error) {
        console.error("Error uploading cover image:", error);
         // Manejar el error de subida de imagen si es necesario
         return; // Detener el handleSubmit si la subida falla
      }
    } else if (coverImagePreviewUrl === null && formData.coverPicture !== null) {
         // Caso: El usuario ha eliminado la imagen de portada existente
         UserData.coverPicture = null;
    }


    // --- Despachar la acción de actualizar usuario con los datos (incluyendo los nombres de archivo de las imágenes si se subieron) ---
    // userId lo obtenemos de Redux
    const userId = user?._id;
     console.log("Updating user with data:", UserData, "for user ID:", userId);
    if (userId) {
        dispatch(updateUser(userId, UserData));
         // Cerrar el modal después de despachar la acción (opcional, podrías querer esperar el éxito)
        setModalOpened(false);
    } else {
        console.error("Error: User ID not available for update.");
         // Manejar el caso donde no hay user ID (ej: no logueado)
    }
  }


  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size='55%'
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >

        <form className="infoForm" onSubmit={handleSubmit}>
          <h3>Your Info</h3>

          {/* Inputs de texto */}
          <div>
            <input type="text" placeholder='First Name' className='infoInput' name="firstname"
              onChange={handleChange} value={formData.firstname || ''} /> {/* Usar || '' para inputs controlados */}
            <input type="text" placeholder='Last Name' className='infoInput' name="lastname"
              onChange={handleChange} value={formData.lastname || ''} />
          </div>
           {/* Otros inputs de texto (worksAt, livesin, country, relationship) */}
           <div>
             <input type="text" placeholder='Works At' className='infoInput' name="worksAt"
                onChange={handleChange} value={formData.worksAt || ''} />
           </div>
           <div>
             <input type="text" placeholder='Lives in' className='infoInput' name="livesin"
                onChange={handleChange} value={formData.livesin || ''} />
              <input type="text" placeholder='Country' className='infoInput' name="country"
                onChange={handleChange} value={formData.country || ''} />
           </div>
           <div>
             <input type="text" placeholder='RelationShip Status' className='infoInput' name="relationship"
                onChange={handleChange} value={formData.relationship || ''} />
           </div>


          {/* --- Inputs y Previsualizaciones de Imágenes --- */}
          <div>
              <h5>Profile Image</h5>
              {/* Previsualización de la imagen de perfil */}
              {profileImagePreviewUrl && (
                  <div className="previewImage" style={{ width: '100%', marginBottom: '1rem' }}> {/* Ajusta el estilo según tu CSS */}
                      <img src={profileImagePreviewUrl} alt="Profile Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.5rem' }}/>
                       {/* Botón para eliminar la imagen de perfil */}
                       {/* Considera usar un icono en lugar de texto "X" */}
                      <button type="button" className="remove-image-button" onClick={removeProfileImage} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '3px' }}>X</button>
                  </div>
              )}
              {/* Input para subir nueva imagen de perfil */}
              <input type="file" name='profileImage' onChange={onImageChange} accept="image/*" />
          </div>

          <div>
             <h5>Cover Image</h5>
              {/* Previsualización de la imagen de portada */}
            {coverImagePreviewUrl && (
                <div className="previewImage" style={{ width: '100%', marginBottom: '1rem' }}>
                   <img src={coverImagePreviewUrl} alt="Cover Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.5rem' }}/>
                   <button type="button" className="remove-image-button" onClick={removeCoverImage} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '3px' }}>X</button>
                </div>
            )}
            {/* Input para subir nueva imagen de portada */}
            <div>
                 <h5>Cover Image</h5>
                 <input type="file" name='coverImage' onChange={onImageChange} accept="image/*" />
            </div>

          </div>


          {/* Botón de actualizar */}
          <button className='button infoButton' type="submit" disabled={updateLoading}> {/* Deshabilitar durante la carga */}
            {updateLoading ? 'Updating...' : 'Update'} {/* Mostrar texto de carga */}
          </button>

           {/* Indicador de error de actualización de usuario */}
            {updateError && <span style={{color: 'red', fontSize: '0.8rem', marginTop: '0.5rem'}}>Error updating user.</span>}


        </form>


      </Modal>

    </>
  );
}


export default ProfileModal