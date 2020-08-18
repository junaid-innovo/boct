import {
  GET_DEFAULT,
  GET_TOWER,
  GET_USER_COMPANIES,
  LOGIN,
  LOGOUT,
  CHANGE_PASSWORD,
} from "../actions/actionTypes";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  logggedIn: false,
  logggedOut: false,
  token: null,
  companiesList: [],
  message: null,
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_USER_COMPANIES) {
    let loginData = { ...state };
    loginData.companiesList = action.payload.companiesList;
    return { ...loginData };
  }
  if (action.type === LOGIN) {
    let loginData = { ...state };
    loginData.logggedIn = action.payload.loginStatus;
    loginData.token = action.payload.token;
    loginData.message = action.payload.message;
    return { ...loginData };
  }
  if (action.type === LOGOUT || action.type === CHANGE_PASSWORD) {
    let loginData = { ...state };
    loginData.logggedIn = action.payload.loginStatus;
    loginData.message = action.payload.message;
    return { ...loginData };
  }
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload.authReducer };
  }
  return state;
};
export default reducers;
