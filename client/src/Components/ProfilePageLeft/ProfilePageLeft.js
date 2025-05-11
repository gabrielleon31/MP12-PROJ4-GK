import React from 'react';
import './ProfilePageLeft.css';
import InfoCard      from '../InfoCard/InfoCard';
import FollowersCard from '../FollowersCard/FollowersCard';

const ProfilePageLeft = () => {
  return (
    <div className="ProfilePageLeft">
      {/* Info del perfil completo + seguidores */}
      <InfoCard />
      <FollowersCard />
    </div>
  );
};

export default ProfilePageLeft;
