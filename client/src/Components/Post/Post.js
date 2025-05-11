import React, { useState, useEffect } from "react"; // Importa useEffect si lo necesitas (aunque no para likes)
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
// Asegúrate de importar likePostAction
import { deletePostAction, updatePostAction, likePostAction } from "../../actions/PostAction"; // Añade likePostAction aquí
import CommentsSection from "../CommentsSection/CommentsSection";
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Importa el nuevo modal de edición
import EditPostModal from '../EditPostModal/EditPostModal';


const Post = ({ data }) => {
  const dispatch = useDispatch();
  // Obtenemos el usuario logueado (con manejo de posible null)
  const { user } = useSelector((state) => state.authReducer.authData) || {};

  const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
  const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';

  // --- Inicialización de estados LOCALS ---
  // Estos estados ahora dependen COMPLETAMENTE de los datos 'data' del post (que vienen de Redux)
  // Cuando Redux actualiza 'data' (por un like/unlike u otra operación), estos estados se re-inicializan.

  // Usamos Array.isArray para proteger contra data.likes no siendo un array válido
  const [liked, setLiked] = useState(Array.isArray(data.likes) ? data.likes.includes(user?._id) : false);
  // El contador de likes también se inicializa desde el array de likes
  const [likesCount, setLikesCount] = useState(Array.isArray(data.likes) ? data.likes.length : 0);

  // Estado para controlar la visibilidad de la sección de comentarios
  const [showComments, setShowComments] = useState(false);

  // Estado para controlar la visibilidad de las opciones del post (Editar/Eliminar)
  const [showOptions, setShowOptions] = useState(false);

  // Nuevo estado para controlar la apertura del modal de edición
  const [editModalOpened, setEditModalOpened] = useState(false);

  // --- FIN Inicialización de estados LOCALS ---


  // --- useEffect para SINCRONIZAR estados locales con los datos de Redux ---
  // Este useEffect es CRUCIAL para que los estados 'liked' y 'likesCount'
  // se actualicen visualmente CADA VEZ que los datos 'data.likes' cambian en Redux.
  // Aunque no es estrictamente necesario si el componente se re-renderiza completamente,
  // asegura que los estados locales siempre reflejen la fuente de verdad (Redux).
  useEffect(() => {
      console.log(`Post ${data._id}: Data likes changed. Syncing local state. New likes count: ${Array.isArray(data.likes) ? data.likes.length : 0}`);
      setLiked(Array.isArray(data.likes) ? data.likes.includes(user?._id) : false);
      setLikesCount(Array.isArray(data.likes) ? data.likes.length : 0);
  }, [data.likes, user?._id]); // Depende de data.likes y el ID del usuario logueado


  // --- Función para manejar el Like/Unlike ---
  const handleLike = () => {
    console.log("Like button clicked for post:", data._id);
    // No actualizamos el estado local inmediatamente.
    // Despacha la acción de Redux para manejar like/unlike vía API y actualizar el estado de Redux.
    // El useEffect de arriba se encargará de actualizar los estados locales
    // una vez que el reducer actualice el array 'likes' en Redux y el componente se re-renderice.
    dispatch(likePostAction(data._id));

    // Las líneas de actualización de estado local ya NO van aquí:
    // setLiked((prev) => !prev);
    // setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };
  // --- Fin handleLike ---


  // Función para alternar la visibilidad de los comentarios
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // --- Lógica para Editar y Eliminar (mantener) ---

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePostAction(data._id));
      console.log(`Delete dispatched for post ${data._id}`);
    }
    setShowOptions(false); // Cerrar el menú después de la acción
  };

  const handleEditClick = () => {
    // Abrir el modal de edición
    setEditModalOpened(true);
    console.log(`Opening edit modal for post ${data._id}`);
    setShowOptions(false); // Cerrar el menú después de la acción
  };

  // --- Fin Lógica para Editar y Eliminar ---


  return (
    <div className="Post">

      {/* Opciones de Editar/Eliminar (solo para el autor del post) */}
      {/* Aseguramos que user y data.userId existen y comparamos IDs */}
      {user && data.userId && typeof data.userId === 'object' && data.userId._id && user._id === data.userId._id && (
        <div className="post-options">
          {/* Icono de opciones */}
          <MoreVertIcon style={{ cursor: 'pointer' }} onClick={() => setShowOptions(!showOptions)} />

          {/* Menú desplegable de opciones */}
          {showOptions && (
            <div className="options-dropdown">
              <div className="option-item" onClick={handleEditClick}>Edit</div>
              <div className="option-item" onClick={handleDeleteClick}>Delete</div>
            </div>
          )}
        </div>
      )}


      {/* Imagen del post */}
      {data.image && ( // Mostrar imagen solo si data.image tiene un valor (no null o undefined)
        <img
          src={SERVER_PUBLIC_FOLDER + data.image} // Usar SERVER_PUBLIC_FOLDER
          alt="Post"
          className="post-img"
        />
      )}


      <div className="postReact">
        {/* Icono de Like */}
        <img
          className="react-icon"
          // Usamos el estado local 'liked' para mostrar el icono correcto
          src={FRONTEND_STATIC_FOLDER + (liked ? "like.png" : "notlike.png")}
          alt={liked ? "liked" : "not liked"}
          onClick={handleLike} // Llama a handleLike (que despacha la acción de Redux)
        />
        {/* Icono de Comentarios */}
        <img
          className="react-icon"
          src={FRONTEND_STATIC_FOLDER + "comment.png"}
          alt="comment"
          onClick={toggleComments}
        />
        {/* Icono de compartir - puedes añadirle funcionalidad de compartir este post aquí */}
        <img
          className="react-icon"
          src={FRONTEND_STATIC_FOLDER + "share.png"}
          alt="share"
        />
      </div>

      {/* Contador de likes */}
      {/* Usamos el estado local 'likesCount' para mostrar el número */}
      <span className="likes-count">{likesCount} likes</span>


      <div className="detail">
        {/* Muestra el nombre y apellido del autor populado */}
        {/* Aseguramos que data.userId es un objeto y tiene las propiedades esperadas */}
        <span className="username">
          {data.userId && typeof data.userId === 'object' && data.userId.firstname && data.userId.lastname
            ? `${data.userId.firstname} ${data.userId.lastname}`
            : 'Unknown User'}
        </span>
        <span className="desc">{data.desc}</span>
      </div>

      {/* Sección de Comentarios: se muestra condicionalmente */}
      {showComments && <CommentsSection postId={data._id} />}

      {/* Modal de edición de post */}
      {/* El modal recibe el post completo 'data' */}
      <EditPostModal
        modalOpened={editModalOpened}
        setModalOpened={setEditModalOpened}
        postData={data} // Pasamos los datos del post al modal
      />

    </div>
  );
};

export default Post;