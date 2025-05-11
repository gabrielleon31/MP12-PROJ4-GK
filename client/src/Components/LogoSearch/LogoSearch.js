// Este es el archivo client/src/Components/LogoSearch/LogoSearch.js
import React, { useState } from 'react';
import './LogoSearch.css';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { searchPostsAction } from '../../actions/PostAction';
import { searchUsersAction } from '../../actions/UserAction'; // Asegúrate de importar esta acción
import { Link } from 'react-router-dom';


const LogoSearch = () => {
  const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';

  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('posts');

  const dispatch = useDispatch();
  const postResults = useSelector(
    (state) => state.postReducer.searchResults
  ) || [];
  const userResults = useSelector(
    (state) => state.authReducer.userSearchResults // Asumo que se guarda aquí
  ) || [];


  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) { return; }

    if (searchType === 'posts') {
        dispatch(searchPostsAction(trimmed));
    } else {
        dispatch(searchUsersAction(trimmed));
    }
  };

  return (
    <div className="LogoSearch">
      <img src={FRONTEND_STATIC_FOLDER + 'logo.png'} alt="Logo" className="logo-img" />

      <form className="Search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`Search ${searchType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="s-icon">
          <SearchIcon />
        </button>
      </form>

      <div className="searchTypeToggle">
          <button onClick={() => setSearchType('posts')} disabled={searchType === 'posts'}>Posts</button>
          <button onClick={() => setSearchType('users')} disabled={searchType === 'users'}>Users</button>
      </div>


      {query.trim() !== '' && searchType === 'posts' && postResults.length > 0 && (
        <div className="searchResults">
          <ul>
            {postResults.map((post) => (
              // **Estos resultados ahora son enlaces al post individual**
              <li key={post._id}>
                <Link to={`/post/${post._id}`}>
                   {/* Muestra la descripción del post y el nombre completo del autor populado */}
                   {/* Comprobamos si post.userId existe y tiene firstname/lastname */}
                   "{post.desc}" by {post.userId && post.userId.firstname && post.userId.lastname ? `${post.userId.firstname} ${post.userId.lastname}` : 'Unknown User'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query.trim() !== '' && searchType === 'users' && userResults.length > 0 && (
        <div className="searchResults">
          <ul>
            {userResults.map((user) => {
              return (
                <li key={user._id}>
                    <Link to={`/profile/${user._id}`}>{user.firstname} {user.lastname}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {query.trim() !== '' && searchType === 'posts' && postResults.length === 0 && (
          <div className="searchResults">No posts found for "{query}"</div>
      )}
      {query.trim() !== '' && searchType === 'users' && userResults.length === 0 && (
           <div className="searchResults">No users found for "{query}"</div>
       )}

    </div>
  );
};

export default LogoSearch;