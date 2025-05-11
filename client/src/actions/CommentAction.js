import * as CommentApi from '../api/CommentRequest.js';

export const createComment = (postId, commentData) => async (dispatch) => {
  dispatch({ type: 'COMMENT_ADD_START' });
  try {
    const { data } = await CommentApi.addComment(postId, commentData);
    dispatch({ type: 'COMMENT_ADD_SUCCESS', data });
    return { data }; // <-- Añadimos el retorno de data
  } catch (error) { // <-- Capturamos el error para loguearlo
    console.error("Error creating comment:", error); // Log del error
    dispatch({ type: 'COMMENT_ADD_FAIL' });
    throw error; // <-- Re-lanzamos el error para que CommentsSection pueda capturarlo
  }
};

export const fetchComments = (postId) => async (dispatch) => {
  dispatch({ type: 'COMMENTS_FETCH_START' });
  try {
    const { data } = await CommentApi.getComments(postId);
    dispatch({ type: 'COMMENTS_FETCH_SUCCESS', data });
    return { data }; // <-- Añadimos el retorno de data
  } catch (error) { // <-- Capturamos el error para loguearlo
    console.error("Error fetching comments:", error); // Log del error
    dispatch({ type: 'COMMENTS_FETCH_FAIL' });
    throw error; // <-- Re-lanzamos el error para que CommentsSection pueda capturarlo
  }
};