import * as UploadApi from "../api/UploadRequest";

export const uploadImage = (formData) => async (dispatch) => {
  dispatch({ type: "UPLOAD_IMAGE_START" });
  try {
    const { data } = await UploadApi.uploadImage(formData);
    dispatch({ type: "UPLOAD_IMAGE_SUCCESS", data });
    return data.filename;
  } catch (error) {
    dispatch({ type: "UPLOAD_IMAGE_FAIL" });
    throw error;
  }
};

export const uploadPost = (postData) => async (dispatch, getState) => {
  dispatch({ type: "UPLOAD_POST_START" });
  try {
    const {
      authReducer: { authData },
    } = getState();
    const token = authData.token;
    const { data } = await UploadApi.uploadPost(postData, token);
    dispatch({ type: "UPLOAD_POST_SUCCESS", data });
  } catch (error) {
    dispatch({ type: "UPLOAD_POST_FAIL" });
  }
};
