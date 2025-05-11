// client/src/Pages/SinglePostPage/SinglePostPage.js - ACTUALIZADO con clases CSS y manejo de carga/error
import React, { useEffect } from 'react';
import Post from '../../Components/Post/Post';
import { useDispatch, useSelector } from 'react-redux';
// Asegúrate de que la acción para obtener un solo post esté importada
import { getPostAction } from '../../actions/PostAction';
import { useParams, useNavigate } from 'react-router-dom';
import './SinglePostPage.css'; // Asegúrate de que tienes este archivo CSS importado


const SinglePostPage = () => {
  const { postId } = useParams(); // Obtiene el ID del post de la URL
  const dispatch = useDispatch();
  // Obtiene el estado de Redux para el post individual
  const { post, gettingPost, gettingPostError } = useSelector((state) => state.postReducer);
  // Obtiene el usuario logueado (para pasarlo al componente Post si es necesario)
  const { user } = useSelector((state) => state.authReducer.authData) || {};


  const navigate = useNavigate(); // Hook para navegar

  // --- useEffect para CARGAR el post individual ---
  useEffect(() => {
    console.log(`SinglePostPage useEffect. postId from URL: ${postId}`);
    if (postId) {
      console.log(`SinglePostPage: Fetching post with ID: ${postId}`);
      dispatch(getPostAction(postId));
    }
     // Dependencias: Aseguramos que se ejecute si cambia el postId o si dispatch cambia (aunque dispatch es estable)
  }, [postId, dispatch]);


  // --- Handler para el botón "Go Back" ---
  const handleGoBack = () => {
     console.log("SinglePostPage: Go Back button clicked, navigating -1");
     navigate(-1); // Navega un paso atrás en el historial
  };


  // --- Renderizado condicional basado en estado de carga y error ---

  if (gettingPost) {
    // Muestra un mensaje de carga mientras se obtiene el post
    return (
      <div className="SinglePostPage" style={{ textAlign: 'center', marginTop: '2rem' }}>
        Loading post...
      </div>
    );
  }

  if (gettingPostError) {
    // Muestra un mensaje de error si falla la carga
    console.error("SinglePostPage: Error loading post:", gettingPostError);
    return (
      <div className="SinglePostPage" style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>
        Error loading post.
      </div>
    );
  }

  if (!post) {
    // Muestra un mensaje si el post no se encuentra (ej. ID inválido o eliminado)
    return (
        <div className="SinglePostPage" style={{ textAlign: 'center', marginTop: '2rem' }}>
          Post not found.
        </div>
      );
  }

  // --- Si el post se cargó exitosamente, renderizar el contenido ---
  return (
    // Contenedor principal de la página con la clase CSS
    <div className="SinglePostPage">
       {/* Botón "Go Back" con la clase CSS */}
       {/* Añadimos padding al contenedor principal para que el botón no se pegue al borde */}
       <button onClick={handleGoBack} className="go-back-button">
           Go Back
       </button>

       {/* Contenido principal del post con la clase CSS */}
        <div className="SinglePostPage-Content">
            {/* El componente Post muestra el post individual */}
            {/* Le pasamos los datos del post y el usuario logueado si los necesita para likes/interacción */}
            <Post data={post} user={user} />

            {/* Si tienes una sección de comentarios implementada y quieres mostrarla aquí, descomenta */}
            {/* {post && <CommentsSection postId={post._id} />} */}
        </div>

         {/* Puedes añadir ProfileSide o RightSide aquí si quieres un layout similar a Home/Profile */}
         {/* Por ahora, los quito para simplificar esta página si solo muestra el post */}
         {/* <ProfileSide /> */}
         {/* <RightSide /> */}

    </div>
  );
};

export default SinglePostPage;