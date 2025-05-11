import React from 'react';
import './Home.css';

import LogoSearch   from '../../Components/LogoSearch/LogoSearch';
import ProfileSide  from '../../Components/profileSide/ProfileSide';
import PostSide     from '../../Components/PostSide/PostSide';
import RightSide    from '../../Components/RightSide/RightSide';

const Home = () => {
  return (
    <div className="HomeContainer">
      {/* Solo aquí */}
      <LogoSearch />

      <div className="Home">
        <ProfileSide />
        <PostSide />
        <RightSide />
      </div>
    </div>
  );
};

export default Home;
