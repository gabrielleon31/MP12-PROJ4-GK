// Este es el archivo client/src/Components/Posts/Posts.js
import React, { useEffect } from 'react';
import './Posts.css';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getTimelinePosts, getAllPostsAction } from '../../actions/PostAction';
import { useParams } from 'react-router-dom';


const Posts = ({ location }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authReducer.authData);
  const user = authData ? authData.user : null;

  // Usamos feedLoading y feedError para la carga del feed
  // Mantenemos los otros estados si Posts.js necesita saber sobre ellos (aunque no parece)
  const { posts, feedLoading, feedError, updatingPostLoading, deletingPostLoading } = useSelector((state) => state.postReducer);


  const isMyProfilePage = params.id && user && params.id === user._id;
  const isOtherUserProfilePage = params.id && user && params.id !== user._id;
  const isHomePage = !params.id;

  // --- LOGS DE DEPURACIÓN (puedes dejarlos o quitarlos) ---\
  // console.log("Posts.js Render: params:", params, "user:", user, "isMyProfilePage:", isMyProfilePage, "isOtherUserProfilePage:", isOtherUserProfilePage, "isHomePage:", isHomePage);
  // console.log("Posts.js useEffect running...");
  // --- FIN LOGS ---\


  useEffect(() => {
    console.log("Posts.js useEffect: Fetching posts...");
    if (user && user._id) {
      if (isMyProfilePage) {
        // console.log("Posts.js: On My Profile Page. Fetching only MY posts.");
        dispatch(getTimelinePosts(user._id));

      } else if (isOtherUserProfilePage) {
         // console.log(`Posts.js: On Other User Profile Page (${params.id}). Fetching only THEIR posts.`);
        dispatch(getTimelinePosts(params.id));

      } else if (isHomePage) {
         // console.log("Posts.js: On Homepage. Fetching ALL posts (excluding own).");
         dispatch(getAllPostsAction());
      }
    } else {
         console.log("Posts.js: User not logged in or user._id missing. Not fetching posts.");
    }

    // Dependencias del useEffect: re-fetch cuando cambia el ID del perfil, el usuario logueado, la ubicación o dispatch
    // No dependemos de 'posts', 'feedLoading', etc. porque queremos que el effect solo cargue los posts iniciales
  }, [params.id, user ? user._id : null, dispatch, location]);


  // Renderizado condicional basado en feedLoading
  // Ya no usamos el estado 'loading' general
  return (
    <div className='Posts'>
      {feedLoading ? ( // Usar feedLoading aquí
        "Fetching Posts..."
      ) : feedError ? ( // Usar feedError aquí
         <span>Error loading posts.</span>
      ) : posts && posts.length === 0 ? (
        isMyProfilePage ? (
            `You haven't posted anything yet.`
        ) : isOtherUserProfilePage ? (
             `This user hasn't posted anything yet.`
        ) : (
            `No posts from other users available yet.`
        )
      ) : posts ? (
        posts.map((post) => (
          // Pasar el post completo como 'data'
          <Post key={post._id} data={post} />
        ))
      ) : (
          // Estado inicial antes de cargar o si posts es null/undefined por alguna razón
          <span>No posts available.</span>
      )}
       {/* Puedes añadir aquí indicadores visuales más pequeños para updatingPostLoading o deletingPostLoading
           si quieres mostrar algo en la UI mientras se edita/elimina un post específico.
           Por ejemplo, un spinner pequeño en el post afectado.
           Por ahora, solo la actualización visual se encargará de eso.
       */}
        {updatingPostLoading && <span style={{textAlign: 'center', marginTop: '1rem'}}>Updating post...</span>}
        {deletingPostLoading && <span style={{textAlign: 'center', marginTop: '1rem'}}>Deleting post...</span>}

    </div>
  );
};

export default Posts;