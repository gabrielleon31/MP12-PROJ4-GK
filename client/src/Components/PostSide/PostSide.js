// client/src/Components/PostSide/PostSide.js - ACTUALIZADO: Ocultando PostShare en otros perfiles

import React from 'react';
import './PostSide.css';
import PostShare from '../PostShare/PostShare';
import Posts from '../Posts/Posts';
// --- Importar lo necesario ---
import { useSelector } from 'react-redux'; // <-- Para obtener el usuario logueado
// Ya NO necesitas useParams aquí si Profile.js te pasa el ID por prop
// import { useParams } from 'react-router-dom';
// --- Fin Importar ---


// *** RECIBE profileUserId COMO PROP ***
const PostSide = ({ profileUserId }) => { // <-- Recibe la prop profileUserId

    // Ya NO necesitas obtener el ID aquí si lo recibes por prop
    // const params = useParams();
    // const profileUserId = params.id;

    // --- Obtiene el usuario logueado ---
    const { user } = useSelector((state) => state.authReducer.authData) || {}; // Asegura user no es null
    // --- Fin Obtener usuario logueado ---


    // Determina si estamos en la página principal (Home) o en un perfil
    // Si profileUserId existe, estamos en una página de perfil.
    // Si profileUserId NO existe, asumimos que estamos en la página principal (Home).
    // Puedes tener otra forma de determinar si estás en Home, pero esta es común si PostSide se usa en ambos lugares.
    const isProfilePage = !!profileUserId; // true si profileUserId tiene un valor, false si es undefined/null

    // Determina si el perfil que se está visitando es el del usuario logueado
    const isMyProfile = user && profileUserId && user._id === profileUserId;


    return (
        <div className="PostSide">

            {/* --- Condición para renderizar PostShare --- */}
            {/* Renderiza PostShare SOLO si estamos en la página principal (Home)
               O si estamos en una página de perfil Y ES NUESTRO PROPIO PERFIL */}
            {
                !isProfilePage || (isProfilePage && isMyProfile)
                // Alternativamente, de forma más simple:
                // user && (!profileUserId || user._id === profileUserId)
            }
            {
                // Esta es la condición más sencilla:
                // Renderiza PostShare si:
                // 1. No hay profileUserId (estamos en Home)
                // 2. O si hay profileUserId Y user logueado existe Y user logueado._id es igual a profileUserId (es mi perfil)
                (!profileUserId || (user && user._id === profileUserId)) && (
                    <PostShare />
                )
            }
            {/* --- Fin Condición --- */}


            {/* El componente que lista los posts (Posts.js o similar) */}
            {/* Este componente ya debería recibir el userId del perfil (profileUserId)
               para fetchear solo los posts de ese usuario específico cuando se visita un perfil.
               Si estás en Home, 'profileUserId' será undefined, y Posts.js deberá fetchear la timeline general. */}
            <Posts userId={profileUserId} location={isProfilePage ? 'profilePage' : 'home'} /> {/* O pasas userId de otra forma */}

        </div>
    );
};

export default PostSide;