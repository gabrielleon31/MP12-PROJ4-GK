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
    // 1. Obtener datos del usuario logueado (puede ir antes o después de Hooks, pero antes del return condicional)
    const { user } = useSelector(state => state.authReducer.authData) || {};

    // 2. DECLARACIÓN DE TODOS LOS HOOKS (useState, useEffect, etc.) - DEBEN IR AQUÍ, AL PRINCIPIO
    // --- Estados locales para los datos de administración ---
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para la carga inicial de datos
    const [error, setError] = useState(null); // Estado para errores al cargar datos

    // --- Estados para controlar los modales de detalles (Estos también son Hooks y deben ir aquí) ---
    const [userDetailsModalOpened, setUserDetailsModalOpened] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [postDetailsModalOpened, setPostDetailsModalOpened] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    // --- Fin Estados para controlar los modales de detalles ---

    // --- Estados para manejar el proceso de eliminación (También Hooks) ---
    const [deletingUserId, setDeletingUserId] = useState(null); // ID del usuario que se está eliminando
    const [deletingPostId, setDeletingPostId] = useState(null); // ID del post que se está eliminando
    const [deleteError, setDeleteError] = useState(null); // Estado para errores de eliminación
    // --- Fin Estados para manejar el proceso de eliminación ---


    // --- useEffect para CARGAR los datos de administración (Usuarios y Posts) ---
    // Este useEffect se ejecutará solo una vez al montar el componente (si user no está en dependencias)
    // o cuando 'user' cambie (si lo añades a dependencias, lo cual podría ser relevante si el login ocurre después de montar el componente)
    // La llamada a la API DENTRO del useEffect puede tener lógica condicional.
    useEffect(() => {
        console.log("AdminPage useEffect: Attempting to fetch admin data...");
        // Verifica si el usuario es admin y está logueado antes de intentar fetchear
        // Esta verificación es DENTRO del useEffect, no alrededor de la llamada a useEffect.
        if (user && user.isAdmin) {
             console.log("AdminPage useEffect: User is admin, fetching data...");
            const fetchData = async () => {
                setLoading(true); // Iniciar carga
                setError(null); // Limpiar errores anteriores
                try {
                    // Fetch de usuarios y posts en paralelo
                    const [usersResponse, postsResponse] = await Promise.all([
                        getAllUsersAdmin(),
                        getAllPostsAdmin(),
                    ]);

                    // Actualizar estados con los datos recibidos
                    setUsers(usersResponse.data);
                    setPosts(postsResponse.data);

                    setLoading(false); // Finalizar carga
                    console.log("AdminPage: Fetched admin data successfully.");

                } catch (err) {
                    console.error("AdminPage useEffect: Error fetching admin data:", err);
                    setError(err); // Guardar error
                    setLoading(false); // Finalizar carga incluso con error
                }
            };

            fetchData(); // Llama a la función de fetching

        } else {
             // Si el useEffect se ejecuta pero el usuario no es admin (y el Navigate no lo redirigió por alguna razón)
             console.log("AdminPage useEffect: User is not admin. Not fetching admin data.");
             setLoading(false); // Asegurarse de que el estado de carga se desactiva
             // setError("You must be an administrator to view this page."); // Opcional: establecer un mensaje de error de permisos
        }

        // Dependencias: React recomienda añadir 'user' si lo usas dentro del useEffect.
        // 'dispatch' (si lo usas) también iría aquí. Las funciones de API importadas (getAllUsersAdmin, etc.) generalmente no son dependencias si son estables.
    }, [user]); // Añadimos 'user' como dependencia


    // --- Redirección condicional (DEBE IR DESPUÉS DE TODAS LAS DECLARACIONES DE HOOKS) ---
    // Si el usuario NO existe O no es admin, redirige INMEDIATAMENTE.
    // Esto asegura que los Hooks se declaran (aunque no se ejecute la lógica de fetching dentro del useEffect si user.isAdmin es false),
    // pero el componente deja de renderizar el contenido del panel de admin si no tiene permisos.
    if (!user || !user.isAdmin) {
        console.log("AdminPage: User is not admin or not logged in. Redirecting.");
        return <Navigate to="/home" />; // Onde quieras redirigir si no es admin
    }
     // Si llegamos aquí, el usuario está logueado Y es admin. Continúa con el renderizado del panel.
    // --- Fin Redirección ---


    // --- Handlers para abrir modales de detalles ---
    const handleViewUserDetails = (userData) => {
        setSelectedUser(userData);
        setUserDetailsModalOpened(true);
    };

     const handleViewPostDetails = (postData) => {
        setSelectedPost(postData);
        setPostDetailsModalOpened(true);
     };

    // --- Handlers para eliminar ---
    const handleDeleteUser = async (userId) => {
        setDeletingUserId(userId); // Indica qué usuario se está eliminando
        setDeleteError(null); // Limpia errores de eliminación anteriores
        try {
            console.log(`AdminPage: Attempting to delete user with ID: ${userId}`);
            await deleteUserAdmin(userId);
            console.log(`AdminPage: User ${userId} deleted successfully.`);
            // Actualiza la lista de usuarios en el estado eliminando al usuario
            setUsers(users.filter(user => user._id !== userId));
            setDeletingUserId(null); // Reset el estado de eliminación
        } catch (err) {
            console.error(`AdminPage: Error deleting user with ID ${userId}:`, err);
            setDeleteError(`Error deleting user ${userId}.`); // Guarda el error
            setDeletingUserId(null); // Reset el estado de eliminación
        }
    };

    const handleDeletePost = async (postId) => {
        setDeletingPostId(postId); // Indica qué post se está eliminando
        setDeleteError(null); // Limpia errores de eliminación anteriores
         try {
            console.log(`AdminPage: Attempting to delete post with ID: ${postId}`);
            await deletePostAdmin(postId);
            console.log(`AdminPage: Post ${postId} deleted successfully.`);
            // Actualiza la lista de posts en el estado eliminando el post
            setPosts(posts.filter(post => post._id !== postId));
            setDeletingPostId(null); // Reset el estado de eliminación
         } catch (err) {
            console.error(`AdminPage: Error deleting post with ID ${postId}:`, err);
            setDeleteError(`Error deleting post ${postId}.`); // Guarda el error
            setDeletingPostId(null); // Reset el estado de eliminación
         }
    };


    // --- Renderizado (JSX) ---
    return (
        <div className="AdminPage">
            <h3>Admin Panel</h3>

            {/* Mensaje de carga o error general */}
            {loading && <p>Loading admin data...</p>}
            {error && <p style={{ color: 'red' }}>Error loading data: {error.message || 'Unknown error'}</p>}

            {/* Sección de Usuarios */}
            <h4>Users</h4>
            {!loading && !error && users.length > 0 ? ( // Mostrar solo si no carga/error y hay usuarios
                <div>
                    {users.map(userData => (
                        <div key={userData._id} className="admin-item">
                             <span><strong>ID:</strong> {userData._id}</span>
                             <span><strong>Name:</strong> {userData.firstname} {userData.lastname}</span>
                             <span><strong>Email:</strong> {userData.email}</span>
                             <span><strong>Is Admin:</strong> {userData.isAdmin ? 'Yes' : 'No'}</span>
                             {/* Mostrar otros detalles si es relevante para el admin */}
                             {/* <span><strong>Followers:</strong> {Array.isArray(userData.followers) ? userData.followers.length : 0}</span> */}
                             {/* <span><strong>Following:</strong> {Array.isArray(userData.following) ? userData.following.length : 0}</span> */}


                            {/* Botones de acción para Usuarios */}
                            <div className="admin-actions">
                                {/* Botón de Ver Detalles de Usuario */}
                                <button
                                     className='button small-button'
                                     onClick={() => handleViewUserDetails(userData)}
                                     disabled={loading || deletingUserId === userData._id || deletingPostId} // Deshabilitar si ya hay una operación en curso
                                >
                                    View Details
                                </button>

                                {/* Botón de Eliminar Usuario */}
                                {/* Puedes añadir una confirmación antes de eliminar */}
                                <button
                                     className='button small-button delete-button'
                                     onClick={() => { if (window.confirm(`Are you sure you want to delete user ${userData.firstname} ${userData.lastname}?`)) handleDeleteUser(userData._id); }}
                                     disabled={loading || deletingUserId === userData._id || deletingPostId} // Deshabilitar si ya hay una operación en curso
                                >
                                    {deletingUserId === userData._id ? 'Deleting...' : 'Delete User'} {/* Mostrar estado de eliminación */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (!loading && !error && users.length === 0) ? ( // Mostrar si no carga/error y NO hay usuarios
                <p>No users found.</p>
            ) : null /* No mostrar nada si está cargando o hay error general */ }


            {/* Sección de Posts */}
            <h4>Posts</h4>
             {!loading && !error && posts.length > 0 ? ( // Mostrar solo si no carga/error y hay posts
                <div>
                    {posts.map(postData => (
                        <div key={postData._id} className="admin-item">
                             <span><strong>ID:</strong> {postData._id}</span>
                             {/* Asegurarse de que userId está populado y tiene el nombre */}
                             <span><strong>Author:</strong> {postData.userId && typeof postData.userId === 'object' ? `${postData.userId.firstname} ${postData.userId.lastname}` : 'Unknown User'}</span>
                             <span><strong>Description:</strong> {postData.desc ? postData.desc.substring(0, 50) + '...' : 'No description'}</span> {/* Limitar la descripción larga */}
                             <span><strong>Likes:</strong> {Array.isArray(postData.likes) ? postData.likes.length : 0}</span>
                             {/* Opcional: Mostrar imagen si existe */}
                             {/* {postData.image && (
                                <img src={process.env.REACT_APP_BACKEND_PUBLIC_FOLDER + postData.image} alt="Post Image" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', marginTop: '0.5rem' }}/>
                             )} */}

                            {/* Botones de acción para Posts */}
                            <div className="admin-actions">
                                {/* Botón de Ver Detalles de Post */}
                                 <button
                                     className='button small-button'
                                     onClick={() => handleViewPostDetails(postData)}
                                     disabled={loading || deletingUserId || deletingPostId === postData._id} // Deshabilitar si ya hay una operación en curso
                                >
                                    View Details
                                </button>

                                {/* Botón de Eliminar Post */}
                                {/* Puedes añadir una confirmación antes de eliminar */}
                                <button
                                    className='button small-button delete-button'
                                    onClick={() => { if (window.confirm(`Are you sure you want to delete this post (ID: ${postData._id})?`)) handleDeletePost(postData._id); }}
                                    disabled={loading || deletingUserId || deletingPostId === postData._id} // Deshabilitar si ya hay una operación en curso
                                >
                                     {deletingPostId === postData._id ? 'Deleting...' : 'Delete Post'} {/* Mostrar estado de eliminación */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (!loading && !error && posts.length === 0) ? ( // Mostrar si no carga/error y NO hay posts
                <p>No posts found.</p>
            ) : null /* No mostrar nada si está cargando o hay error general */ }


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