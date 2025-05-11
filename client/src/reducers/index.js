import { combineReducers } from "redux";

import authReducer from "./authReducer.js";
import postReducer from "./postReducer.js";
import notificationReducer from './notificationReducer';
import chatReducer from './chatReducer';

export const reducers = combineReducers({ authReducer, postReducer, notificationReducer, chatReducer })

