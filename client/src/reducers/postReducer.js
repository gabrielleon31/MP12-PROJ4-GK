// Este es el archivo client/src/reducers/postReducer.js
const initialState = {
  posts: [],
  uploading: false, // Para la subida inicial de un nuevo post/imagen
  uploadError: false,

  searchResults: [], // Para la búsqueda de posts
  searchLoading: false,
  searchError: false,

  // Estados para la carga del feed principal o el timeline de un perfil
  feedLoading: false,
  feedError: false,

  // Estados para obtener un post individual
  gettingPost: false,
  gettingPostError: false,
  post: null, // Para almacenar un solo post (usado en SinglePostPage)

  // Estados para las operaciones de edición/eliminación
  updatingPostLoading: false,
  updatingPostError: false,
  deletingPostLoading: false,
  deletingPostError: false,

  // Nuevos estados para las operaciones de like/unlike
  likePostLoading: false, // Indicador general de carga para likes
  likePostError: false,
  // Opcional: likePostId: null, // Si quieres rastrear qué post se está likando/deslikando
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    // --- Casos de Subida de Posts (mantener) ---
    // UPLOAD_IMAGE_START/SUCCESS/FAIL son más relevantes para el componente de subida (PostShare)
    // Pero los mantengo aquí por si acaso hay alguna dependencia indirecta.
    case 'UPLOAD_IMAGE_START':
      // Este reducer no maneja el estado de la imagen individual, pero puedes usarlo si quieres un indicador global
      return { ...state, uploading: true, uploadError: false };
    case 'UPLOAD_IMAGE_SUCCESS':
      return { ...state, uploading: false, uploadError: false }; // action.data aquí es el filename
    case 'UPLOAD_IMAGE_FAIL':
       console.error("Image upload failed:", action.error);
      return { ...state, uploading: false, uploadError: true };

    case 'UPLOAD_POST_START':
      return { ...state, uploading: true, uploadError: false }; // uploading se usa para el post general
    case 'UPLOAD_POST_SUCCESS':
      // Asumimos que action.data es el post COMPLETO y POPULADO del backend
      // Añadimos el nuevo post al principio del feed para que aparezca arriba
      return { ...state, uploading: false, uploadError: false, posts: [action.data, ...state.posts] };
    case 'UPLOAD_POST_FAIL':
       console.error("Post upload failed:", action.error);
      return { ...state, uploading: false, uploadError: true };
    // --- Fin Casos de Subida de Posts ---

    // --- Casos de Carga del Feed (mantener nombres específicos) ---
    case 'RETRIEVING_START':
        return {...state, feedLoading: true, feedError: false};
    case 'RETRIEVING_SUCCESS':
        // Asumimos que action.data contiene un array de posts POPULADOS
        return {...state, posts: action.data, feedLoading: false, feedError: false};
    case 'RETRIEVING_FAIL':
         console.error("Feed retrieval failed:", action.error);
        return {...state, feedLoading: false, feedError: true};
    // --- Fin Casos de Carga del Feed ---

    // --- CASOS PARA BÚSQUEDA (mantener) ---\
    case 'SEARCH_POSTS_START':
      return { ...state, searchLoading: true, searchError: false, searchResults: [] };
    case 'SEARCH_POSTS_SUCCESS':
      // Asumimos que action.data es un array de posts POPULADOS
      return { ...state, searchLoading: false, searchError: false, searchResults: action.data };
    case 'SEARCH_POSTS_FAIL':
       console.error("Post search failed:", action.error);
      return { ...state, searchLoading: false, searchError: true, searchResults: [] };
     // --- FIN CASOS BÚSQUEDA ---\

    // --- CASOS PARA OBTENER UN POST INDIVIDUAL (mantener) ---\
    case 'GETTING_POST_START':
      return { ...state, gettingPost: true, gettingPostError: false, post: null };
    case 'GETTING_POST_SUCCESS':
      // Asumimos que action.data es un post POPULADO
      return { ...state, gettingPost: false, gettingPostError: false, post: action.data };
    case 'GETTING_POST_FAIL':
       console.error("Getting single post failed:", action.error);
      return { ...state, gettingPost: false, gettingPostError: true, post: null };
    // --- FIN CASOS POST INDIVIDUAL ---\


    // --- CASOS PARA EDITAR Y ELIMINAR POSTS (mantener estados de carga específicos) ---\

    case 'UPDATING_POST_START':
        return { ...state, updatingPostLoading: true, updatingPostError: false };
    case 'UPDATING_POST_SUCCESS':
      // action.data contiene los datos del post actualizado y POPULADO (recibidos del backend vía acción)
      // Encontrar el post en el estado y reemplazarlo con los datos actualizados
      return {
        ...state,
        posts: state.posts.map(post =>
          // Usamos action.data._id para encontrar el post correcto
          post._id === action.data._id ? action.data : post // Reemplaza el post COMPLETO con action.data
        ),
        // También actualizamos el post individual si es el que se está viendo
        post: state.post && state.post._id === action.data._id ? action.data : state.post,
        updatingPostLoading: false,
        updatingPostError: false,
      };
    case 'UPDATING_POST_FAIL':
        console.error("Updating post failed:", action.error);
        return { ...state, updatingPostLoading: false, updatingPostError: true };


    case 'DELETING_POST_START':
        return { ...state, deletingPostLoading: true, deletingPostError: false };
    case 'DELETING_POST_SUCCESS':
       // action.postId contiene el ID del post eliminado (enviado desde la acción)
       // Filtrar el post eliminado del array de posts
       return {
         ...state,
         posts: state.posts.filter(post => post._id !== action.postId),
         // Si el post eliminado es el que se está viendo en la página individual, resetear el estado post
         post: state.post && state.post._id === action.postId ? null : state.post,
         deletingPostLoading: false,
         deletingPostError: false,
       };
    case 'DELETING_POST_FAIL':
        console.error("Deleting post failed:", action.error);
        return { ...state, deletingPostLoading: false, deletingPostError: true };

    // --- FIN CASOS EDITAR Y ELIMINAR POSTS ---\


    // --- NUEVO CASO PARA LIKES ---
    // Cuando un post recibe like/unlike con éxito
    case 'LIKE_POST_SUCCESS':
      // action.data contiene los datos del post actualizado y POPULADO (recibidos del backend vía acción)
      // action.postId es el ID del post (pasado desde la acción)
      // Find the post in the state and update its likes array
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.postId) {
            // Si el ID coincide, actualiza el array de likes de ese post
            // action.data.likes es el array de likes correcto que viene del backend
            // action.data también puede tener otros campos actualizados si el backend los envía (ej: updatedAt)
            return { ...post, likes: action.data.likes };
             // Si el backend solo devuelve action.data = { likes: [...] }, podrías usar:
             // return { ...post, likes: action.data.likes };
          }
          return post; // Mantener los otros posts sin cambios
        }),
        // Si el post likado/deslikado es el que se está viendo en la página individual, actualízalo también
        post: state.post && state.post._id === action.postId ? { ...state.post, likes: action.data.likes } : state.post,

        // Opcional: reset likePostLoading state if you implemented it
        likePostLoading: false, // Suponiendo que implementaste likePostLoading en START
        likePostError: false,
      };
    // Opcional: Añadir LIKE_POST_START y LIKE_POST_FAIL cases si los despachas
    case 'LIKE_POST_START':
        return { ...state, likePostLoading: true, likePostError: false /*, likePostId: action.postId*/ };
    case 'LIKE_POST_FAIL':
         console.error("Liking/Unliking post failed:", action.error);
        return { ...state, likePostLoading: false, likePostError: true /*, likePostId: null*/ };
    // --- FIN NUEVO CASO ---


    default:
      return state;
  }
}