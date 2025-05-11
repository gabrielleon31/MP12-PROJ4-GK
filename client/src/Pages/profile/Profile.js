// client/src/Pages/Profile/Profile.js - ACTUALIZADO: Pasando userId a PostSide

import React from 'react';
import './Profile.css';
import ProfilePageLeft from '../../Components/ProfilePageLeft/ProfilePageLeft';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import PostSide from '../../Components/PostSide/PostSide';
import RightSide from '../../Components/RightSide/RightSide';
import { useParams } from 'react-router-dom'; // <-- Importar useParams


const Profile = () => {
  const params = useParams(); // <-- Obtiene los parámetros de la URL
  const profileUserId = params.id; // <-- Extrae el ID del usuario del perfil

  return (
    <div className='Profile'>
      <ProfilePageLeft />

      <div className="ProfilePage-Center">
        <ProfileCard location="profilePage" />
        {/* *** PASAR profileUserId COMO PROP A PostSide *** */}
        <PostSide profileUserId={profileUserId} /> {/* <-- Le pasamos el ID del usuario del perfil */}
      </div>

      <RightSide />
    </div>
  );
};

export default Profile;