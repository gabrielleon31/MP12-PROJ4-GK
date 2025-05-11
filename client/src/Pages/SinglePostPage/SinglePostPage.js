// Este es el archivo client/src/Pages/SinglePostPage/SinglePostPage.js
import React, { useEffect } from 'react';
import Post from '../../Components/Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getPostAction } from '../../actions/PostAction';
import { useParams, useNavigate } from 'react-router-dom';
import './SinglePostPage.css'; // Asegúrate de que tienes este archivo CSS

// No importar ProfileSide ni RightSide si no los vas a usar
// import RightSide from '../../Components/RightSide/RightSide';
// import ProfileSide from '../../Components/profileSide/ProfileSide';


const SinglePostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, gettingPost, gettingPostError } = useSelector((state) => state.postReducer);
  const { user } = useSelector((state) => state.authReducer.authData) || {}; // Usuario logueado (manejar null)


  const navigate = useNavigate(); // Hook para navegar


  useEffect(() => {
    console.log(`SinglePostPage useEffect. postId from URL: ${postId}`);
    if (postId) {
      console.log(`SinglePostPage: Fetching post with ID: ${postId}`);
      dispatch(getPostAction(postId));
    }
  }, [postId, dispatch]);


  const handleGoBack = () => {
     navigate(-1); // Navega un paso atrás
  };


  if (gettingPost) {
    return <div className="SinglePostPage">Loading post...</div>;
  }

  if (gettingPostError) {
     console.error("SinglePostPage: Error loading post:", gettingPostError);
    return <div className="SinglePostPage">Error loading post.</div>;
  }

  if (!post) {
    return <div className="SinglePostPage">Post not found.</div>;
  }

  return (
    <div className="SinglePostPage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
       <button onClick={handleGoBack} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
           Go Back
       </button>

        <div className="SinglePostPage-Content" style={{ maxWidth: '50rem', width: '100%' }}>
           <Post key={post._id} data={post} currentUser={user} />

           {/* Aquí podrías añadir la sección de comentarios si la tienes */}
           {/* <CommentsSection postId={post._id} /> */}
        </div>
    </div>
  );
};

export default SinglePostPage;