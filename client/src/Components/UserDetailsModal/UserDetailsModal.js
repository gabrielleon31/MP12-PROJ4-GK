// client/src/Components/UserDetailsModal/UserDetailsModal.js - NUEVO COMPONENTE

import { Modal, useMantineTheme } from '@mantine/core';
import React from 'react';
// Opcional: Importa un archivo CSS si quieres estilizarlo
// import './UserDetailsModal.css';

function UserDetailsModal({ modalOpened, setModalOpened, userData }) {
    const theme = useMantineTheme();

    // Si userData es null o undefined por alguna razón, no renderizar el contenido
    if (!userData) {
        return null;
    }

    return (
        <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title={`Details for User: ${userData.firstname} ${userData.lastname}`} // Título del modal
            size="md" // Tamaño del modal (md, lg, xl o porcentaje como "55%")
            overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }}
            centered // Centrar el modal
        >
            {/* Contenido del modal: Muestra los detalles del usuario */}
            {/* Puedes estilizar este div con CSS si creas UserDetailsModal.css */}
            <div className="user-details-content">
                <p><strong>ID:</strong> {userData._id}</p>
                <p><strong>First Name:</strong> {userData.firstname}</p>
                <p><strong>Last Name:</strong> {userData.lastname}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                {/* Muestra otros campos que vengan en el objeto userData */}
                {userData.username && <p><strong>Username:</strong> {userData.username}</p>}
                {userData.worksAt && <p><strong>Works At:</strong> {userData.worksAt}</p>}
                {userData.livesin && <p><strong>Lives In:</strong> {userData.livesin}</p>}
                {userData.country && <p><strong>Country:</strong> {userData.country}</p>}
                {userData.relationship && <p><strong>Relationship Status:</strong> {userData.relationship}</p>}
                {/* Muestra si es admin (si este campo se envía en la respuesta) */}
                 {userData.isAdmin !== undefined && <p><strong>Is Admin:</strong> {userData.isAdmin ? 'Yes' : 'No'}</p>}

                {/* Opcional: Mostrar seguidores y seguidos (si son solo IDs, tendrías que fetchear más datos) */}
                 {/* <p><strong>Followers:</strong> {Array.isArray(userData.followers) ? userData.followers.length : 'N/A'}</p> */}
                 {/* <p><strong>Following:</strong> {Array.isArray(userData.following) ? userData.following.length : 'N/A'}</p> */}

                {/* Puedes añadir la imagen de perfil aquí si quieres */}
                 {/* {userData.profilePicture && (
                     <img
                         src={process.env.REACT_APP_BACKEND_PUBLIC_FOLDER + userData.profilePicture}
                         alt="Profile Picture"
                         style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginTop: '1rem' }}
                     />
                 )} */}

            </div>

            {/* Opcional: Botón de cerrar en el footer del modal si usas Mantine */}
            {/* <Modal.Footer>
                <button className="button" onClick={() => setModalOpened(false)}>Close</button>
            </Modal.Footer> */}
        </Modal>
    );
}

export default UserDetailsModal;