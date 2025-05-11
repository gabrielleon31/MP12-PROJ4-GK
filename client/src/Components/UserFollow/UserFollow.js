import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unFollowUser } from '../../actions/UserAction';



const UserFollow = ({ person }) => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    // Asegúrate de que person.followers es un array antes de usar includes
    const [following, setFollowing] = useState(Array.isArray(person.followers) ? person.followers.includes(user._id) : false);

    // Usamos la variable para la carpeta pública del backend para imágenes subidas
    const SERVER_PUBLIC_FOLDER = process.env.REACT_APP_BACKEND_PUBLIC_FOLDER;
    // Usamos process.env.PUBLIC_URL + '/Img/' para imágenes estáticas del frontend
    const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/'; // O simplemente '/Img/' si no hay subrutas


    const handleFollow = () => {
        following ? dispatch(unFollowUser(person._id, user))
            : dispatch(followUser(person._id, user))

        setFollowing((prev) => !prev)
    }

    return (
        <div className="follower">

            <div>
                {/* Usamos SERVER_PUBLIC_FOLDER para la foto de perfil si existe,
                    si no, usamos FRONTEND_STATIC_FOLDER para la imagen por defecto */}
                <img
                  src={
                    person.profilePicture
                      ? SERVER_PUBLIC_FOLDER + person.profilePicture // Imagen subida por el usuario
                      : FRONTEND_STATIC_FOLDER + "defaultProfile.png" // Imagen estática por defecto
                  }
                  alt="Profile"
                  className='followerImg'
                />
                <div className="name">
                    <span>{person.firstname} {person.lastname}</span> {/* Mostrar nombre y apellido */}
                    <span>@{person.username || person.firstname}</span> {/* Mostrar username si existe, sino firstname */}
                </div>
            </div>

            <button className='button fc-button' onClick={handleFollow}>
                {following ? "Unfollow" : "Follow"}
            </button>

        </div>

    )
}

export default UserFollow