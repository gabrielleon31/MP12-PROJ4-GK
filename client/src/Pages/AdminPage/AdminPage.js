// client/src/Pages/AdminPage/AdminPage.js - REVERTIDO (Solo Detalles y Eliminación)

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './AdminPage.css';
// --- Importar funciones API de administración ---
// Ya no necesitamos importar las funciones de actualización aquí si solo se usan en los modales de edición
import { getAllUsersAdmin, getAllPostsAdmin, deleteUserAdmin, deletePostAdmin } from '../../api/AdminRequest';
// --- Importar componentes de modales (Solo los de Detalles) ---
import UserDetailsModal from '../../Components/UserDetailsModal/UserDetailsModal';
import PostDetailsModal from '../../Components/PostDetailsModal/PostDetailsModal';
// Ya NO importamos los modales de edición aquí
// import EditUserAdminModal from '../../Components/EditUserAdminModal/EditUserAdminModal';
// import EditPostAdminModal from '../../Components/EditPostAdminModal/EditPostAdminModal';
// --- Fin Importación Modales ---


const AdminPage = () => {
    const { user } = useSelector(state => state.authReducer.authData) || {};

    // --- Estados locales para los datos de administración ---
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- Fin Estados locales ---

    // --- Estados para controlar los modales de detalles (mantienen el código existente) ---
    const [userDetailsModalOpened, setUserDetailsModalOpened] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [postDetailsModalOpened, setPostDetailsModalOpened] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    // --- Fin Estados para modales de detalles ---

    // --- YA NO NECESITAMOS Estados para controlar los modales de EDICIÓN ---
    // const [editUserModalOpened, setEditUserModalOpened] = useState(false);
    // const [userToEdit, setUserToEdit] = useState(null);
    // const [editPostModalOpened, setEditPostModalOpened] = useState(false);
    // const [postToEdit, setPostToEdit] = useState(null);
    // --- Fin NO NECESITAMOS Estados para modales de EDICIÓN ---


    console.log("AdminPage component rendered. Checking user admin status:", user?.isAdmin);
    // console.log("AdminPage Render: Current states:", { users, posts, loading, error, userDetailsModalOpened, postDetailsModalOpened /* REMOVIDO edit states */ });


    if (!user || !user.isAdmin) {
        console.warn("AdminPage: User is not admin or not logged in. Redirecting.");
        return <Navigate to="/home" replace />;
    }

    // --- useEffect para cargar los datos al montar el componente (mantiene el código existente) ---
    useEffect(() => {
        console.log("AdminPage useEffect: Effect triggered.");
        const fetchData = async () => {
            console.log("fetchData function START.");
            setLoading(true);
            setError(null);

            try {
                console.log("fetchData: Entering try block.");
                // Fetch users
                console.log("fetchData: Attempting to fetch users...");
                const usersResponse = await getAllUsersAdmin();
                console.log("fetchData: Received users response:", usersResponse.data);
                if (Array.isArray(usersResponse.data)) {
                     console.log("fetchData: Users data is an array. Setting users state.");
                     setUsers(usersResponse.data);
                } else {
                     console.error("fetchData: ERROR - Received unexpected data format for users.");
                     throw new Error("Received unexpected user data format from API");
                }

                // Fetch posts
                console.log("fetchData: Attempting to fetch posts...");
                const postsResponse = await getAllPostsAdmin();
                console.log("fetchData: Received posts data:", postsResponse.data);
                 if (Array.isArray(postsResponse.data)) {
                     console.log("fetchData: Posts data is an array. Setting posts state.");
                     setPosts(postsResponse.data);
                 } else {
                      console.error("fetchData: ERROR - Received unexpected data format for posts.");
                      throw new Error("Received unexpected post data format from API");
                 }

                console.log("fetchData: try block completing successfully.");
                setLoading(false);

            } catch (err) {
                console.error("fetchData: !!! CATCH BLOCK ENTERED !!! Error fetching admin data:", err);
                setError("Error loading data.");
                setLoading(false);
            }
             console.log("fetchData function OUTSIDE try/catch.");
        };
        console.log("AdminPage useEffect: Calling fetchData().");
        fetchData();
    }, [user]);


    // --- Funciones para manejar la eliminación (mantienen el código existente) ---
    const handleDeleteUser = async (userId) => {
        console.log(`handleDeleteUser: Attempting to delete user with ID: ${userId}`);
        // Opcional: Mostrar un cuadro de confirmación al usuario antes de eliminar
        if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
            try {
                await deleteUserAdmin(userId); // Llama a la función API de eliminación
                console.log(`handleDeleteUser: User ${userId} deleted successfully.`);
                // Actualizar la lista de usuarios en el frontend sin recargar la página
                setUsers(users.filter(user => user._id !== userId));
                console.log("handleDeleteUser: Frontend users list updated.");
                 // Opcional: Mostrar un mensaje de éxito al usuario (toast/snackbar)
            } catch (error) {
                console.error(`handleDeleteUser: Error deleting user ${userId}:`, error);
                 // Opcional: Mostrar un mensaje de error al usuario
                 alert(`Error deleting user: ${error.response?.data?.message || error.message || error}`); // Ejemplo básico de alerta
            }
        } else {
            console.log("handleDeleteUser: User deletion cancelled.");
        }
    };

    const handleDeletePost = async (postId) => {
        console.log(`handleDeletePost: Attempting to delete post with ID: ${postId}`);
         // Opcional: Mostrar un cuadro de confirmación
        if (window.confirm(`Are you sure you want to delete post ${postId}?`)) {
            try {
                await deletePostAdmin(postId); // Llama a la función API de eliminación
                console.log(`handleDeletePost: Post ${postId} deleted successfully.`);
                 // Actualizar la lista de posts en el frontend
                setPosts(posts.filter(post => post._id !== postId));
                console.log("handleDeletePost: Frontend posts list updated.");
                 // Opcional: Mostrar un mensaje de éxito
            } catch (error) {
                console.error(`handleDeletePost: Error deleting post ${postId}:`, error);
                 // Opcional: Mostrar un mensaje de error
                 alert(`Error deleting post: ${error.response?.data?.message || error.message || error}`); // Ejemplo básico de alerta
            }
        } else {
            console.log("handleDeletePost: Post deletion cancelled.");
        }
    };

    // --- Fin Funciones para manejar la eliminación ---

    // --- Funciones para manejar la apertura/cierre de modales de detalles (mantiene el código existente) ---

    const openUserDetailsModal = (user) => {
        console.log("openUserDetailsModal: User selected for details:", user);
        setSelectedUser(user); // Guarda el usuario seleccionado en el estado
        setUserDetailsModalOpened(true); // Abre el modal
    };

    const closeUserDetailsModal = () => {
        console.log("closeUserDetailsModal: Closing user details modal.");
        setUserDetailsModalOpened(false); // Cierra el modal
        setSelectedUser(null); // Limpia el usuario seleccionado al cerrar
    };

    const openPostDetailsModal = (post) => {
        console.log("openPostDetailsModal: Post selected for details:", post);
        setSelectedPost(post); // Guarda el post seleccionado en el estado
        setPostDetailsModalOpened(true); // Abre el modal
    };

    const closePostDetailsModal = () => {
        console.log("closePostDetailsModal: Closing post details modal.");
        setPostDetailsModalOpened(false); // Cierra el modal
        setSelectedPost(null); // Limpia el post seleccionado al cerrar
    };

    // --- Fin Funciones manejo modales de detalles ---

    // --- YA NO NECESITAMOS Funciones para manejar la apertura/cierre de modales de EDICIÓN ---
    // const openEditUserModal = (user) => { ... };
    // const closeEditUserModal = () => { ... };
    // const handleUserUpdated = (updatedUser) => { ... };
    // const openEditPostModal = (post) => { ... };
    // const closeEditPostModal = () => { ... };
    // const handlePostUpdated = (updatedPost) => { ... };
    // --- Fin NO NECESITAMOS Funciones manejo modales de EDICIÓN ---


    // --- Lógica de Renderizado basada en los estados ---
    console.log("AdminPage Render: Rendering based on states.", { usersLength: users.length, postsLength: posts.length, loading, error });

    if (loading) {
        return (
            <div className='AdminPage'>
                <h4>Admin Users</h4>
                <p>Loading Users...</p>
                <h4>Admin Posts</h4>
                <p>Loading Posts...</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className='AdminPage'>
                <h4>Admin Users</h4>
                 <p>{error}</p>
                <h4>Admin Posts</h4>
                 <p>{error}</p>
             </div>
        );
    }

    return (
        <div className='AdminPage'>
            <h3>Admin Panel</h3>

            {/* Sección de Usuarios */}
            <h4>Admin Users ({users.length})</h4>
            {Array.isArray(users) && users.length > 0 ? (
                <div className="user-list">
                    {users.map(u => (
                        // --- Añadir onClick al item para abrir modal de detalles de usuario ---
                        // Al hacer clic, llamamos a openUserDetailsModal con el objeto de usuario 'u'
                        // Añadir cursor: pointer para indicar que es clickable
                        <div key={u._id} className="admin-item" onClick={() => openUserDetailsModal(u)} style={{ cursor: 'pointer' }}>
                            {/* Muestra información básica del usuario */}
                            <span><strong>User ID:</strong> {u._id}</span>
                            <span><strong>Name:</strong> {u.firstname} {u.lastname}</span>
                            <span><strong>Email:</strong> {u.email}</span>
                             {/* Puedes añadir más campos aquí */}
                             {/* <span><strong>isAdmin:</strong> {u.isAdmin ? 'Yes' : 'No'}</span> */}

                            {/* *** Contenedor para los botones de acción (Solo Eliminar ahora) *** */}
                             <div className="admin-item-actions"> {/* Añadir una clase para estilizar */}
                                {/* --- Botón para eliminar usuario --- */}
                                {/* Usamos onClick={(e) => { e.stopPropagation(); handleDeleteUser(u._id); }} para evitar que el click propague al item padre */}
                                 <button className="button small-button delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteUser(u._id); }}>Delete User</button>
                             </div>

                        </div>
                    ))}
                </div>
            ) : (
                <p>No users found.</p>
            )}

            {/* Sección de Posts */}
            <h4>Admin Posts ({posts.length})</h4>
             {Array.isArray(posts) && posts.length > 0 ? (
                <div className="post-list">
                    {posts.map(p => (
                         // --- Añadir onClick al item para abrir modal de detalles de post ---
                         // Al hacer clic, llamamos a openPostDetailsModal con el objeto de post 'p'
                         // Añadir cursor: pointer
                        <div key={p._id} className="admin-item" onClick={() => openPostDetailsModal(p)} style={{ cursor: 'pointer' }}>
                             {/* Muestra información básica del post */}
                             {/* El autor (p.userId) está populado */}
                            <span><strong>Post by:</strong> {p.userId ? `${p.userId.firstname} ${p.userId.lastname}` : 'Unknown User'} (ID: {p.userId?._id})</span>
                            <span><strong>Post ID:</strong> {p._id}</span>
                            <span><strong>Description:</strong> {p.desc?.substring(0, 50)}{p.desc?.length > 50 ? '...' : ''}</span>
                             {p.image && <span><strong>Image:</strong> {p.image}</span>}
                             <span><strong>Likes:</strong> {Array.isArray(p.likes) ? p.likes.length : 0}</span>

                            {/* *** Contenedor para los botones de acción (Solo Eliminar ahora) *** */}
                            <div className="admin-item-actions"> {/* Añadir una clase para estilizar */}
                                {/* --- Botón para eliminar post --- */}
                                {/* Usamos onClick={(e) => { e.stopPropagation(); handleDeletePost(p._id); }} para evitar que el click propague al item padre */}
                                <button className="button small-button delete-button" onClick={(e) => { e.stopPropagation(); handleDeletePost(p._id); }}>Delete Post</button>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <p>No posts found.</p>
            )}

             {/* Puedes añadir más secciones aquí (ej: Comentarios, Estadísticas) */}


            {/* --- Renderizar los modales de detalles (mantienen el código existente) --- */}

            {/* Modal para mostrar detalles de Usuario */}
            {/* Renderizamos el modal SOLO si userDetailsModalOpened es true Y hay un usuario seleccionado */}
            {userDetailsModalOpened && selectedUser && (
                 <UserDetailsModal
                     modalOpened={userDetailsModalOpened}
                     setModalOpened={setUserDetailsModalOpened}
                     userData={selectedUser}
                 />
             )}


            {/* Modal para mostrar detalles de Post */}
            {postDetailsModalOpened && selectedPost && (
                 <PostDetailsModal
                      modalOpened={postDetailsModalOpened}
                      setModalOpened={setPostDetailsModalOpened}
                      postData={selectedPost}
                 />
             )}

             {/* --- Fin Renderizar modales de detalles --- */}

             {/* --- YA NO RENDERIZAMOS los modales de EDICIÓN aquí --- */}
             {/* {editUserModalOpened && userToEdit && (...) } */}
             {/* {editPostModalOpened && postToEdit && (...) } */}
             {/* --- Fin NO RENDERIZAMOS modales de EDICIÓN --- */}


        </div>
    );
};

export default AdminPage;