// Este es el archivo client/src/Components/InfoCard/InfoCard.js
import React, { useEffect, useState } from 'react';
import './InfoCard.css';
import EditIcon from '@mui/icons-material/Edit';
import ProfileModal from '../ProfileModal/ProfileModal';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as UserApi from '../../api/UserRequest.js';
import { logOut } from '../../actions/AuthAction';


const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  const { user } = useSelector((state) => state.authReducer.authData) || {}; // Usar || {}

  const profileUserId = params.id || (user ? user._id : null);

  const [profileUser, setProfileUser] = useState(profileUserId && user && profileUserId === user._id ? user : null);


  useEffect(() => {
    console.log("InfoCard useEffect: profileUserId:", profileUserId, "user._id:", user ? user._id : 'null');

    if (profileUserId && user && profileUserId !== user._id) {
       console.log("InfoCard useEffect: profileUserId is NOT logged-in user. Fetching profile from API:", profileUserId);
      const fetchProfileUser = async () => {
        try {
          const profileUserResponse = await UserApi.getUser(profileUserId);
          setProfileUser(profileUserResponse.data);
        } catch (error) {
          console.error("InfoCard: Error fetching profile user from API:", error);
          setProfileUser(null);
        }
      };
      fetchProfileUser();
    } else if (profileUserId && user && profileUserId === user._id) {
       console.log("InfoCard useEffect: profileUserId IS logged-in user. Using Redux state.");
       setProfileUser(user);
    } else if (!profileUserId && user) {
         console.log("InfoCard useEffect: No profileId in URL (Homepage). Using logged-in user from Redux.");
        setProfileUser(user);
    }


  }, [profileUserId, user ? user._id : null, dispatch, user]);


  const handleLogOut = () => {
    dispatch(logOut());
  }


   if (!profileUser && profileUserId) {
        return <div>Loading Profile Info...</div>;
   }
   if (!profileUser && (!profileUserId || !user)) {
        return null;
   }


  return (
    <div className='InfoCard'>

      <div className="infoHead">
        <h4>Profile Info</h4>

        {user && profileUser && user._id === profileUser._id ?
          (<div>
            <EditIcon width='2rem' height='1.2rem'
              onClick={() => setModalOpened(true)} />

            <ProfileModal modalOpened={modalOpened} setModalOpened={setModalOpened}
              data={user}
            />
          </div>)
          : (" ")
        }

      </div>

      <div className="info">
        <span>
          <b>Status </b>
        </span>
        <span>{profileUser.relationship || '-'}</span> {/* Usar fallback '-' */}
      </div>

      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{profileUser.livesin || '-'}</span> {/* Usar fallback '-' */}
      </div>

      <div className="info">
        <span>
          <b>Works at </b>
        </span>
        <span>{profileUser.worksAt || '-'}</span> {/* Usar fallback '-' */}
      </div>

      {user && profileUser && user._id === profileUser._id && (
         <button className='button logout-button' onClick={handleLogOut}>Log Out</button>
      )}
    </div>
  );
};

export default InfoCard;