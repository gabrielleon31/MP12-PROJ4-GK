// Este es el archivo client/src/Components/CommentsSection/CommentsSection.js
import React, { useState, useEffect } from 'react';
import './CommentsSection.css';
import { useDispatch, useSelector } from 'react-redux';
// Asegúrate de que CommentAction esté importado correctamente
import { fetchComments, createComment } from '../../actions/CommentAction';


const CommentsSection = ({ postId }) => {
    const dispatch = useDispatch();
    // Obtenemos el usuario logueado del estado de Redux (con manejo de posible null)
    const { user } = useSelector((state) => state.authReducer.authData) || {};

    // Estados para manejar los comentarios y el formulario
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');

    // Estados para manejar carga y errores en la UI
    const [loadingComments, setLoadingComments] = useState(false); // Estado local para la carga de comentarios existentes
    const [addingComment, setAddingComment] = useState(false);   // Estado local para la adición de un nuevo comentario
    const [errorLoadingComments, setErrorLoadingComments] = useState(false); // Nuevo estado para errores de carga inicial
    const [errorAddingComment, setErrorAddingComment] = useState(false);   // Nuevo estado para errores al añadir

    // --- useEffect para CARGAR comentarios iniciales ---
    useEffect(() => {
        console.log(`CommentsSection useEffect: Fetching comments for post ${postId}`);
        const getPostComments = async () => {
             setLoadingComments(true); // Iniciar estado de carga
             setErrorLoadingComments(false); // Resetear error
            try {
                // La acción fetchComments ahora devuelve un objeto { data: commentsArray } de comentarios POPULADOS
                const response = await dispatch(fetchComments(postId));
                // Verificamos que la respuesta tiene la estructura esperada y es un array
                if (response && Array.isArray(response.data)) {
                    setComments(response.data); // Actualizar estado local con comentarios populados
                    console.log(`CommentsSection: Fetched ${response.data.length} comments.`);
                } else {
                     console.error("CommentsSection: fetchComments action returned unexpected data structure:", response);
                     setComments([]); // Asegurar que comments es un array vacío en caso de datos inesperados
                     setErrorLoadingComments(true); // Indicar error en UI
                }
            } catch (error) {
                console.error("CommentsSection: Error fetching comments:", error);
                setErrorLoadingComments(true); // Indicar error en UI
                setComments([]); // Asegurar que comments es un array vacío en caso de error
            } finally {
                setLoadingComments(false); // Finalizar estado de carga
            }
        };

        if (postId) { // Asegurarse de que tenemos un postId válido antes de fetchear
            getPostComments();
        }

        // Limpiar comentarios al desmontar el componente o cambiar postId (opcional)
        // return () => { setComments([]); };

    }, [postId, dispatch]); // Dependencias: re-fetch si cambia postId o dispatch

    // --- Función para manejar el envío de un nuevo comentario ---
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const trimmedCommentText = newCommentText.trim();

        if (!trimmedCommentText) {
            alert("Comment cannot be empty."); // Validación básica en frontend
            return;
        }

        // commentData solo necesita el texto. El userId se obtiene en el backend a través del token.
        const commentData = { text: trimmedCommentText };

        setAddingComment(true); // Iniciar estado de añadir
        setErrorAddingComment(false); // Resetear error de añadir

        try {
            // La acción createComment ahora devuelve un objeto { data: populatedCommentObject }
            // Este objeto contiene el comentario recién creado y POPULADO con info de autor
            const response = await dispatch(createComment(postId, commentData));
             // Verificamos que la respuesta tiene la estructura esperada y es un objeto
            if (response && response.data && typeof response.data === 'object') {
                // Añadir el nuevo comentario populado al principio de la lista local para que se vea inmediatamente
                // Aseguramos que el comentario tiene _id antes de añadirlo a la lista (Mongoose debe proporcionarlo)
                if (response.data._id) {
                     // Añadimos el comentario populado al estado local de comentarios
                     setComments([response.data, ...comments]);
                     setNewCommentText(''); // Limpiar el input del formulario
                     console.log("CommentsSection: New comment added successfully with ID:", response.data._id);
                } else {
                     console.error("CommentsSection: createComment action returned comment without _id:", response.data);
                     setErrorAddingComment(true); // Indicar error en UI
                }
            } else {
                 console.error("CommentsSection: createComment action returned unexpected data structure:", response);
                 setErrorAddingComment(true); // Indicar error en UI
            }

        } catch (error) {
            console.error("CommentsSection: Error adding comment:", error);
            setErrorAddingComment(true); // Indicar error en UI
             // Opcional: Manejar errores específicos (ej: 401 Unauthorized)
             if (error.response && error.response.status === 401) {
                 alert("You must be logged in to comment. Please log in.");
             } else {
                 alert("Error adding comment. Please try again.");
             }
        } finally {
            setAddingComment(false); // Finalizar estado de añadir
        }
    };

    // --- Renderizado del componente ---
    return (
        <div className="CommentsSection">
            {/* Título */}
            <h4>Comments</h4>

            {/* Indicadores de carga/error para la carga inicial de comentarios */}
            {loadingComments ? (
                <span>Loading Comments...</span>
            ) : errorLoadingComments ? (
                 <span className="error-message">Error loading comments.</span>
            ) : comments && comments.length > 0 ? ( // Mostrar lista si hay comentarios
                <div className="commentList">
                    {comments.map((comment) => (
                        // Renderizar cada comentario. Usamos _id como key principal.
                        <div key={comment._id} className="comment">
                            {/* Mostrar el nombre y apellido del autor populado */}
                            <span className="comment-author">
                                {/* Comprobamos que comment.userId existe, es un objeto, y tiene nombre/apellido */}
                                {comment.userId && typeof comment.userId === 'object' && comment.userId.firstname && comment.userId.lastname
                                    ? `${comment.userId.firstname} ${comment.userId.lastname}`
                                    : 'Unknown User'} {/* Fallback si los datos del autor no están populados correctamente o son incompletos */}
                            </span>
                            {/* Mostrar el texto del comentario */}
                            <span className="comment-text">{comment.text}</span>
                            {/* Opcional: muestra la fecha si la tienes y quieres */}
                            {/* {comment.createdAt && typeof comment.createdAt === 'string' && <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>} */}
                        </div>
                    ))}
                </div>
            ) : ( // Mostrar mensaje si no hay comentarios y no hay carga/error
                 <span>No comments yet.</span>
            )}

            {/* Formulario para añadir un nuevo comentario */}
            {/* Solo mostrar el formulario si el usuario está logueado (user existe) */}
            {user && (
                <form className="addCommentForm" onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        disabled={addingComment} // Deshabilitar input mientras se añade
                    />
                    <button type="submit" className="button" disabled={addingComment}>
                        {addingComment ? 'Adding...' : 'Comment'}
                    </button>
                </form>
            )}
             {/* Mensaje de error al añadir */}
             {errorAddingComment && (
                 <span className="error-message">Error adding comment. Please try again.</span>
            )}

        </div>
    );
};

export default CommentsSection;