import { Modal, useMantineTheme } from '@mantine/core';
import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '../../actions/UploadAction'; // Para subir nueva imagen si se cambia
import { updatePostAction } from '../../actions/PostAction'; // Para despachar la acción de actualizar post
import './EditPostModal.css'; // Asegúrate de crear este archivo CSS

// Importa iconos si los usas (opcional, si usas el icono UilTimes para remover imagen)
// import { UilTimes } from '@iconscout/react-unicons';


function EditPostModal({ modalOpened, setModalOpened, postData }) { // Recibe postData como prop
    const theme = useMantineTheme();
    const dispatch = useDispatch();

    // Estado local para el formulario de edición
    const [formData, setFormData] = useState({
        desc: postData.desc, // Inicializa con la descripción actual del post
        image: postData.image // Inicializa con la imagen actual del post (nombre del archivo)
    });
    const [imageFile, setImageFile] = useState(null); // Estado para la nueva imagen seleccionada
    // Estado para la URL de previsualización (usa el nombre de archivo si existe)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(
        postData.image ? process.env.REACT_APP_BACKEND_PUBLIC_FOLDER + postData.image : null
    );

    const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
    // FRONTEND_STATIC_FOLDER no parece usarse en este modal, puedes eliminarlo si no lo necesitas
    // const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';


    // Usar useEffect para actualizar el estado local cuando postData cambie (al abrir el modal con otro post)
    useEffect(() => {
        console.log("EditPostModal useEffect: postData changed", postData);
        setFormData({
            desc: postData.desc,
            image: postData.image // Asegurarse de que esto es null si no hay imagen
        });
        setImageFile(null); // Resetear archivo de imagen al cambiar de post
        // Resetear previsualización basada en la nueva postData
        setImagePreviewUrl(postData.image ? SERVER_PUBLIC_FOLDER + postData.image : null);
    }, [postData, SERVER_PUBLIC_FOLDER]); // Dependencias: postData y SERVER_PUBLIC_FOLDER


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImageFile(img);
            // Actualizar la previsualización con la nueva imagen seleccionada
            setImagePreviewUrl(URL.createObjectURL(img));
            // También podrías querer actualizar formData.image aquí con un indicador temporal
            // o simplemente dejar que se maneje en el handleSubmit.
            // setFormData({ ...formData, image: 'PENDING_UPLOAD' }); // Ejemplo
        }
    };

    // --- LA FUNCIÓN removeImage DEBE ESTAR DEFINIDA AQUÍ DENTRO DEL COMPONENTE ---
    const removeImage = () => {
        console.log("Removing image");
        setImageFile(null);         // Limpiar el archivo de imagen seleccionado
        setImagePreviewUrl(null);   // Limpiar la URL de previsualización
        // Establecer el campo 'image' en formData a null para indicarle al backend que la elimine
        setFormData({ ...formData, image: null });
         // Esto también asegura que si editas de nuevo antes de guardar, no aparezca la previsualización vieja
         const fileInput = document.querySelector('input[type="file"][name="image"]');
         if (fileInput) fileInput.value = ''; // Limpiar el input file
    };
    // --- FIN removeImage ---


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clonamos formData para no mutar el estado directamente antes del dispatch
        let updatedPostData = { ...formData };
        // Asegurarse de enviar el userId y el ID del post (estos no cambian)
        updatedPostData.userId = postData.userId._id; // Asegurarse de que postData.userId tiene el _id
        updatedPostData._id = postData._id;

        console.log("Handling Submit:", updatedPostData);
        console.log("Image file selected:", imageFile);
        console.log("Image preview URL:", imagePreviewUrl);


        // --- Lógica de manejo de imagen ---

        // Caso 1: Se seleccionó un nuevo archivo de imagen (reemplazar o añadir si no había)
        if (imageFile) {
            const data = new FormData();
            // No necesitas adjuntar el nombre aquí, Multer lo genera o usa el original si no hay colisión
            // const fileName = Date.now() + imageFile.name;
            // data.append("name", fileName); // Eliminar esta línea

            // Asegúrate de que el nombre del campo es "image" para que coincida con el backend
            data.append("image", imageFile); // <-- ¡VERIFICAR ESTO! Debe ser "image"

            console.log("Uploading new image...");
            try {
                // La acción uploadImage ahora retorna la cadena de texto del filename
                const uploadedFilename = await dispatch(uploadImage(data));

                // Verificar si la acción retornó una cadena de texto válida (el nombre del archivo)
                if (uploadedFilename && typeof uploadedFilename === 'string') {
                     updatedPostData.image = uploadedFilename; // Asignar la cadena de texto del filename
                     console.log("New image uploaded successfully. Filename:", uploadedFilename);
                } else {
                     // Esto puede ocurrir si la acción falla o retorna algo inesperado
                     console.error("Upload image action did not return a valid filename string:", uploadedFilename);
                     alert("Error uploading new image. Please try again. (Invalid filename received from action)");
                     return; // Detener si la subida falla o retorna datos incorrectos
                }

            } catch (error) {
                console.error("Error uploading image in modal:", error); // Log más específico
                // Puedes añadir manejo de errores más específico basado en el código de estado si quieres
                 if (error.response && error.response.status === 400) {
                     alert("Error uploading new image: No file provided or invalid format.");
                } else {
                     alert("Error uploading new image. Please try again. (Server Error during upload)");
                }
                return; // Detener si la subida falla (por error del backend o de red)
            }
        }
        // Caso 2: El post original tenía imagen (postData.image), pero imageFile es null Y imagePreviewUrl es null.
        // Esto indica que el usuario eliminó la imagen existente SIN subir una nueva.
        else if (postData.image && imageFile === null && imagePreviewUrl === null) {
             updatedPostData.image = null; // Establecer explícitamente a null para que el backend la elimine
             console.log("Image was removed by user.");
        }
        // Caso 3: No se seleccionó nueva imagen (imageFile es null) Y la imagen original no se eliminó (imagePreviewUrl no es null o postData.image era null).
        // En este caso, updatedPostData.image ya tiene el valor correcto (el nombre del archivo original si lo había, o null si no lo había). No hacemos nada.
        // updatedPostData.image = formData.image; // Esto ya está hecho al clonar formData


        // --- Fin Lógica de manejo de imagen ---


        // Despachar la acción para actualizar el post
        // Solo despachamos si no hubo un error fatal en la subida de imagen (si aplica)
        console.log("Dispatching updatePostAction with data:", updatedPostData);
        try {
            // updatePostAction espera el ID del post y los datos actualizados
            await dispatch(updatePostAction(postData._id, updatedPostData));
            console.log("Post updated successfully");
            setModalOpened(false); // Cerrar el modal al completar la actualización
            // El reducer ya tiene la lógica para actualizar la UI en tiempo real.
        } catch (error) {
            console.error("Error updating post after image handling:", error); // Log más específico
            alert("Error updating post. Please try again. (Update failed)");
        }
    };


    return (
        <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title="Edit Post"
            size="55%" // Ajusta el tamaño según necesites
            overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }}
            centered // Centra el modal en la pantalla
            // Puedes añadir onExit={resetForm} si tuvieras un estado de formulario más complejo que resetear al cerrar
        >
            {/* Contenido del formulario de edición */}
            <form className="infoForm EditPostForm" onSubmit={handleSubmit}> {/* Añadimos onSubmit al form */}
                {/* Campo de descripción */}
                <div>
                    <input
                        type="text"
                        placeholder="What's happening?"
                        className="infoInput"
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                    />
                </div>

                {/* Previsualización de la imagen */}
                {imagePreviewUrl && (
                    <div className="previewImage">
                        {/* Icono para remover la imagen (puedes usar UilTimes si lo importas y estilizas) */}
                        {/* <UilTimes onClick={removeImage} className="remove-icon" /> */}
                        <img src={imagePreviewUrl} alt="Preview" />
                        {/* Botón para eliminar la imagen actual */}
                         <button type="button" className="remove-image-button" onClick={removeImage}>Remove Image</button>
                    </div>
                )}


                {/* Input para subir nueva imagen */}
                <div>
                     <h5>Post Image</h5>
                     <input type="file" name='image' onChange={onImageChange} accept="image/*" /> {/* Añadimos accept */}
                </div>


                {/* Botón de guardar */}
                {/* El type="submit" en el botón dispara el onSubmit del form */}
                <button
                    className="button infoButton"
                    type="submit" // Importante: type="submit" para que funcione el onSubmit del form
                >
                    Update Post
                </button>
            </form>

        </Modal>
    );
}

export default EditPostModal;