// Este es el archivo client/src/Components/ProfileCard/ProfileCard.js - ACTUALIZADO CON LOGS PARA DEBUG AVATAR
import React, { useEffect, useState } from 'react';
import './ProfileCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as UserApi from '../../api/UserRequest.js'; // Asegúrate de que la ruta sea correcta
import { logOut } from '../../actions/AuthAction.js'; // Asegúrate de que la ruta sea correcta


const ProfileCard = ({ location }) => {
  const dispatch = useDispatch();
  const params = useParams();

  // Obtiene el usuario logueado del estado de Redux (con manejo de posible null)
  const { user } = useSelector(state => state.authReducer.authData) || {};
  // Obtiene los posts del estado de Redux para contarlos en la página de perfil
  const { posts } = useSelector(state => state.postReducer);

  // Determina el ID del usuario del perfil que se está visualizando (puede ser el logueado o el de los params)
  const profileUserId = params.id || (user ? user._id : null);

  // Estado local para almacenar los datos del usuario del perfil que se está visualizando
  // Inicializa profileUser con los datos del usuario logueado si estás en tu propio perfil
  const [profileUser, setProfileUser] = useState(profileUserId && user && profileUserId === user._id ? user : null);


  // Variables para las carpetas públicas de imágenes
  const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER; // URL base de imágenes subidas (backend)
  const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/'; // Ruta base de imágenes estáticas (frontend)


  // --- useEffect para OBTENER los datos del usuario del perfil si NO es el usuario logueado ---
  useEffect(() => {
    console.log("ProfileCard useEffect: Checking profile user ID...");
    console.log("ProfileCard useEffect: profileUserId from params/redux:", profileUserId);
    console.log("ProfileCard useEffect: logged-in user ID:", user ? user._id : 'null');


    // Si estamos en la página de perfil de otro usuario (el ID en params es diferente al del usuario logueado)
    // O si profileUser aún no se ha cargado y hay un profileUserId definido (ej: después de login)
    if (profileUserId && user && profileUserId !== user._id) {
       console.log(`ProfileCard useEffect: profileUserId (${profileUserId}) is NOT logged-in user ID (${user._id}). Fetching profile from API.`);
      const fetchProfileUser = async () => {
        try {
          // Llama a la API para obtener los datos del usuario del perfil
          const profileUserResponse = await UserApi.getUser(profileUserId);
          setProfileUser(profileUserResponse.data); // Actualiza el estado local con los datos fetcheados
           console.log("ProfileCard useEffect: Fetched profile user data:", profileUserResponse.data);
        } catch (error) {
          console.error("ProfileCard: Error fetching profile user from API:", error);
          // Puedes añadir lógica para mostrar un mensaje de error en la UI
        }
      };
      fetchProfileUser();

    } else if (profileUserId && user && profileUserId === user._id) {
         // Si es la página de perfil del usuario logueado, asegúrate de usar los datos del usuario logueado de Redux
         // Esto ayuda a que la tarjeta se actualice si los datos del usuario en Redux cambian (ej: después de editar el perfil)
         console.log("ProfileCard useEffect: profileUserId IS logged-in user ID. Using Redux user data.");
         setProfileUser(user); // Asegurarse de que profileUser sea el usuario logueado de Redux

    } else if (!profileUserId && user) {
         // Si no hay profileUserId en params pero hay un user logueado (Homepage),
         // profileUserId se habrá inicializado con user._id, este caso no debería ocurrir si params.id || user._id es correcto.
          console.log("ProfileCard useEffect: No profileUserId found, but user is logged in. This state might indicate an issue.");

    } else if (!profileUserId && !user && location !== 'homepage') {
         // Si no hay profileUserId y no hay user (no logueado) y NO estamos en la homepage
         // (ej: intentando acceder a /profile/someId sin login, aunque el routing debería redirigir)
          console.log("ProfileCard useEffect: No profileUserId and no logged-in user.");
    }


  }, [dispatch, profileUserId, user]); // Dependencias del efecto: dispatcher, el ID del perfil, y el objeto de usuario logueado


  // Manejar el logout (si el location es "profilePage" y es el usuario logueado)
  const handleLogOut = () => {
    dispatch(logOut());
  };

  // Si profileUser aún no se ha cargado (solo si profileUserId existe, si no existe y no hay user, simplemente no renderizamos nada)
   // Esto es para mostrar un estado de carga si estamos esperando los datos de otro usuario
  if (!profileUser && profileUserId) {
      console.log("ProfileCard Render: profileUser is null, profileUserId exists. Showing loading state.");
      return <div>Loading Profile Card...</div>;
  }

  // Si no hay un profileUser para mostrar (ej: no logueado, no hay ID en params, o fetch falló)
  if (!profileUser && (!profileUserId || !user) && location !== 'homepage') {
       console.log("ProfileCard Render: No profileUser to display and not on homepage.");
      // return null; // No renderizar nada en este caso
       // O podrías renderizar un estado por defecto o un mensaje de error si lo prefieres
       return <div>User profile data not available.</div>;
  }
    // En la homepage, si no hay usuario logueado (aunque el routing debería prevenirlo)
    if (!user && location === 'homepage') {
         console.log("ProfileCard Render: No logged-in user on homepage.");
        // return null; // O renderizar un estado para no logueado
    }


  // Renderizar la Profile Card si tenemos datos de profileUser
  // Usamos un renderizado condicional simple para el caso en que profileUser es null/undefined
  return (
    <div className='ProfileCard'>

      <div className="ProfileImages">
        {/* IMAGEN DE PORTADA */}
        {/* Usamos SERVER_PUBLIC_FOLDER para imágenes subidas, FRONTEND_STATIC_FOLDER para la por defecto */}
        <img
          src={profileUser?.coverPicture
            ? SERVER_PUBLIC_FOLDER + profileUser.coverPicture
            : FRONTEND_STATIC_FOLDER + "defaultCover.jpg"} // Asegúrate de tener defaultCover.jpg en public/Img
          alt="Cover"
          className="CoverImage"
        />

        {/* *** IMAGEN DE PERFIL (AVATAR) - Con logs de depuración *** */}
         {/* LOGS PARA DEBUGGING DEL AVATAR */}
        {console.log("ProfileCard Render: SERVER_PUBLIC_FOLDER:", SERVER_PUBLIC_FOLDER)}
        {console.log("ProfileCard Render: profileUser data:", profileUser)} 
        {console.log("ProfileCard Render: profileUser?.profilePicture:", profileUser?.profilePicture)}
        {console.log("ProfileCard Render: Attempting to construct profile image URL...")}
        {console.log("ProfileCard Render: Constructed profile image URL:",
             profileUser?.profilePicture
               ? SERVER_PUBLIC_FOLDER + profileUser.profilePicture // Si tiene imagen subida
               : FRONTEND_STATIC_FOLDER + "defaultProfile.png" // Si no tiene, usar por defecto
        )}
        {/* FIN LOGS */}

        <img
          src={
             profileUser?.profilePicture
               ? SERVER_PUBLIC_FOLDER + profileUser.profilePicture // Si tiene imagen subida
               : FRONTEND_STATIC_FOLDER + "defaultProfile.png" // Si no tiene, usar por defecto
          }
          alt="Profile"
          className="profileImage" // Asegúrate de que tienes esta clase CSS en ProfileCard.css
        />
        {/* *** FIN IMAGEN DE PERFIL *** */}
      </div>

      {/* Nombre y Apellido del usuario del perfil */}
      <div className="ProfileName">
        {/* Usamos profileUser?.firstname y ?.lastname para seguridad */}
        <span>{profileUser?.firstname} {profileUser?.lastname}</span>
        {/* Opcional: Mostrar @username si lo tienes en tu modelo */}
        {/* <span>@{profileUser?.username || profileUser?.firstname}</span> */}
        {/* Mostrar 'about' o estado */}
        <span>{profileUser?.about || profileUser?.relationship || "No description"}</span> {/* Puedes elegir qué campo mostrar */}
      </div>

      {/* Separador */}
      <div className="followStatus">
        <hr />
        {/* Contador de seguidores/seguidos */}
        <div>
          {/* Usamos Array.isArray para verificar si followers/following es un array antes de .length */}
          <div className="follow">
            <span>{Array.isArray(profileUser?.followers) ? profileUser.followers.length : 0}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div> {/* Separador visual (Vertical Line) */}
          <div className="follow">
            <span>{Array.isArray(profileUser?.following) ? profileUser.following.length : 0}</span>
            <span>Following</span>
          </div>

          {/* Mostrar contador de Posts solo en la página de perfil */}
          {location === "profilePage" && (
            <>
              <div className="vl"></div> {/* Separador visual */}
              <div className="follow">
                 {/* Contamos los posts del ESTADO DE REDUX que pertenecen a este profileUser */}
                 {/* Aseguramos que posts es un array, profileUser existe y tiene ID, y el post.userId está populado */}
                <span> {Array.isArray(posts) && profileUser && profileUser._id ? posts.filter(post => post.userId && post.userId._id && post.userId._id.toString() === profileUser._id.toString()).length : 0} </span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr /> {/* Separador */}
      </div>


      {/* "My Profile" link en la homepage */}
      {/* Solo mostrar si NO estamos en la página de perfil Y el usuario logueado existe */}
      {location !== "profilePage" && user && (
        <span>
           <Link style={{ textDecoration: "none", color: "inherit" }} to={`/profile/${user._id}`}>
             My Profile
           </Link>
        </span>
      )}

      {/* Botón de Logout en la página de perfil del usuario logueado */}
      {/* Solo mostrar si estamos en la página de perfil Y es el usuario logueado */}
       {location === "profilePage" && user && profileUser && user._id === profileUser._id && (
          <button className='button logout-button' onClick={handleLogOut}>Log Out</button>
       )}

    </div>
  );
};

export default ProfileCard;