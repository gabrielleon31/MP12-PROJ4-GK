// Este es el archivo client/src/actions/PostAction.js
import * as PostApi from '../api/PostRequest';


// Acción para obtener los posts de un usuario específico (sus posts)
export const getTimelinePosts = id => async dispatch => {
  dispatch({ type: "RETRIEVING_START" });
  try {
    const { data } = await PostApi.getTimelinePosts(id);
    // Asegurarse de que la respuesta incluye posts y que userId está populado
    console.log("getTimelinePosts SUCCESS. Received data:", data);
    dispatch({ type: "RETRIEVING_SUCCESS", data });
  } catch (error) {
    console.error(`Error fetching timeline posts for user ${id}:`, error);
    dispatch({ type: "RETRIEVING_FAIL" });
  }
};

// Acción para obtener todos los posts (para el feed principal/homepage)
export const getAllPostsAction = () => async dispatch => {
  dispatch({ type: "RETRIEVING_START" });
  try {
    const { data } = await PostApi.getAllPosts();
    // Asegurarse de que la respuesta incluye posts y que userId está populado
     console.log("getAllPostsAction SUCCESS. Received data:", data);
    dispatch({ type: "RETRIEVING_SUCCESS", data });
  } catch (error) {
    console.error("Error fetching all posts (excluding own):", error);
    dispatch({ type: "RETRIEVING_FAIL" });
  }
};

// Acción para buscar posts
export const searchPostsAction = query => async dispatch => {
  dispatch({ type: 'SEARCH_POSTS_START' });
  try {
    const { data } = await PostApi.searchPosts(query);
     console.log("searchPostsAction SUCCESS. Received data:", data);
    dispatch({ type: 'SEARCH_POSTS_SUCCESS', data });
  } catch (error) {
    console.error("Error searching posts:", error);
    dispatch({ type: 'SEARCH_POSTS_FAIL' });
  }
};


// Acción para subir un post (crear)
// Nota: Esta acción no necesita un START/SUCCESS/FAIL en postReducer
// porque el nuevo post se añade directamente al array 'posts'
export const uploadPost = (postData) => async (dispatch, getState) => {
  dispatch({ type: "UPLOAD_POST_START" });
  try {
    const {
      authReducer: { authData },
    } = getState();
    const token = authData.token;
    const { data } = await PostApi.uploadPost(postData, token); // Asumimos que PostApi.uploadPost ahora devuelve el post populado
     console.log("uploadPost SUCCESS. Received data:", data);
    // Despachamos directamente con el post populado para que se añada al feed
    dispatch({ type: "UPLOAD_POST_SUCCESS", data });
    return data; // Opcional: retorna el post creado si el componente lo necesita
  } catch (error) {
    console.error("Error uploading post:", error);
    dispatch({ type: "UPLOAD_POST_FAIL" });
     throw error; // Re-lanzar error si el componente necesita saber el fallo
  }
};

// Acción para obtener un post por ID (Usada en SinglePostPage)
export const getPostAction = id => async dispatch => {
   dispatch({ type: "GETTING_POST_START" });
   try {
      const { data } = await PostApi.getPost(id); // <-- Llama a PostApi.getPost y asume que devuelve post populado
       console.log(`getPostAction SUCCESS for post ${id}. Received data:`, data);
      dispatch({ type: "GETTING_POST_SUCCESS", data });
      return data; // Opcional: retornar data
   } catch (error) {
      console.error(`Error getting post ${id}:`, error);
      dispatch({ type: "GETTING_POST_FAIL" });
      throw error;
   }
};

// Acción para actualizar un post
export const updatePostAction = (id, postData) => async dispatch => {
   dispatch({ type: "UPDATING_POST_START" });
   try {
      // CAPTURAR la respuesta del backend que ahora devuelve el post actualizado y populado
      const { data } = await PostApi.updatePost(id, postData); // <-- Capturamos { data }

      console.log(`Update Post API successful for post ${id}. Received data:`, data); // Log para verificar

      // Despachar la acción con los DATOS DEL POST ACTUALIZADO Y POPULADO recibidos del backend
      // action.data en el reducer será este objeto de post populado
      dispatch({ type: "UPDATING_POST_SUCCESS", postId: id, data: data }); // <-- Despachar data del backend
      // Opcional: retornar data si el componente que llama necesita la respuesta
      // return data;

   } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      dispatch({ type: "UPDATING_POST_FAIL", error: error }); // Pasa el error al reducer
      throw error; // Re-lanza el error
   }
};

// Acción para eliminar un post
export const deletePostAction = id => async dispatch => {
   dispatch({ type: "DELETING_POST_START" });
   try {
      await PostApi.deletePost(id); // PostApi.deletePost no necesita devolver data si solo elimina
       console.log(`Delete Post API successful for post ${id}.`);
      dispatch({ type: "DELETING_POST_SUCCESS", postId: id }); // Solo necesitamos el ID para eliminar en el reducer
   } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      dispatch({ type: "DELETING_POST_FAIL", error: error }); // Pasa el error al reducer
      throw error; // Re-lanza el error
   }
};


// --- NUEVA ACCIÓN PARA DAR LIKE / UNLIKE ---
// Acción para dar like / unlike a un post
// Esperamos que la API PUT /post/:id/like_dislike devuelva el post actualizado
export const likePostAction = (postId) => async (dispatch) => {
  // Opcional: Dispatch un START action si quieres un estado de carga por botón de like
  // dispatch({ type: "LIKE_POST_START", postId: postId });
  try {
    // Llama a la API likePost (definida en PostRequest.js)
    // Asumimos que el backend devuelve el post actualizado completo después de like/unlike
    const { data } = await PostApi.likePost(postId);

    console.log(`Like/Unlike successful for post ${postId}. Received updated post data:`, data); // Log de depuración

    // Despacha la acción de éxito con los DATOS DEL POST ACTUALIZADO recibidos del backend
    // action.data en el reducer será este objeto de post actualizado con los likes correctos
    dispatch({ type: "LIKE_POST_SUCCESS", postId: postId, data: data });

  } catch (error) {
    console.error(`Error liking/unliking post ${postId}:`, error);
    // Opcional: Dispatch una acción de FAIL si quieres manejar errores de likes en UI
    // dispatch({ type: "LIKE_POST_FAIL", postId: postId, error: error });
    // No es estrictamente necesario re-lanzar el error si el componente no necesita manejar fallos de like específicos.
    // throw error; // Comentado para no detener el flujo si falla el like
  }
};
// --- FIN NUEVA ACCIÓN ---


// Exporta todas las acciones que necesites
// export { getTimelinePosts, getAllPostsAction, searchPostsAction, uploadPost, getPostAction, updatePostAction, deletePostAction, likePostAction };