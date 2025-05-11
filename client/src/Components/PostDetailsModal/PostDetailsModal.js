// client/src/Components/PostDetailsModal/PostDetailsModal.js - NUEVO COMPONENTE

import { Modal, useMantineTheme } from '@mantine/core';
import React from 'react';
// Opcional: Importa un archivo CSS si quieres estilizarlo
// import './PostDetailsModal.css';

function PostDetailsModal({ modalOpened, setModalOpened, postData }) {
    const theme = useMantineTheme();

     // URL base para las imágenes del backend
     const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;

    // Si postData es null o undefined por alguna razón, no renderizar el contenido
    if (!postData) {
        return null;
    }

    // Helper para mostrar información del autor populado
    const renderAuthor = () => {
        if (!postData.userId || typeof postData.userId !== 'object') {
            return 'Unknown User';
        }
        // Asumiendo que userId está populado con al menos _id, firstname, lastname
        return `${postData.userId.firstname} ${postData.userId.lastname} (ID: ${postData.userId._id})`;
    };

    return (
        <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title={`Details for Post: ${postData._id}`} // Título del modal
            size="lg" // Tamaño del modal (md, lg, xl o porcentaje)
            overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }}
            centered // Centrar el modal
        >
            {/* Contenido del modal: Muestra los detalles del post */}
            {/* Puedes estilizar este div con CSS si creas PostDetailsModal.css */}
            <div className="post-details-content">
                <p><strong>Post ID:</strong> {postData._id}</p>
                {/* Muestra el autor populado */}
                <p><strong>Author:</strong> {renderAuthor()}</p>
                 {/* Puedes añadir la imagen de perfil del autor si está populada */}
                 {/* {postData.userId && postData.userId.profilePicture && (
                      <img
                         src={SERVER_PUBLIC_FOLDER + postData.userId.profilePicture}
                         alt="Author Profile"
                         style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                     />
                 )} */}

                {/* Muestra la descripción completa */}
                <p><strong>Description:</strong> {postData.desc}</p>

                {/* Muestra la imagen del post si existe */}
                {postData.image && (
                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                         <img
                             src={SERVER_PUBLIC_FOLDER + postData.image}
                             alt="Post Image"
                             style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} // Estilos para la imagen del post
                         />
                    </div>
                )}

                {/* Otros detalles */}
                <p><strong>Likes:</strong> {Array.isArray(postData.likes) ? postData.likes.length : 0}</p>
                {/* Puedes añadir la fecha de creación, número de comentarios, etc. */}
                 {/* <p><strong>Created At:</strong> {new Date(postData.createdAt).toLocaleString()}</p> */}
                 {/* Si los comentarios están populados o tienes un contador: */}
                 {/* <p><strong>Comments:</strong> {Array.isArray(postData.comments) ? postData.comments.length : 'N/A'}</p> */}

                {/* Opcional: Mostrar la lista de IDs de Likes */}
                 {/* {Array.isArray(postData.likes) && postData.likes.length > 0 && (
                     <div>
                         <strong>Liked by IDs:</strong>
                         <ul>
                             {postData.likes.map(likeId => <li key={likeId}>{likeId}</li>)}
                         </ul>
                     </div>
                 )} */}

                {/* Opcional: Integrar la sección de comentarios si quieres ver comentarios aquí */}
                 {/* <CommentsSection postId={postData._id} /> */}


            </div>

            {/* Opcional: Botón de cerrar */}
        </Modal>
    );
}

export default PostDetailsModal;