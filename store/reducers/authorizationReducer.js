import {
  GET_DEFAULT,
  GET_TOWER,
  GET_USER_COMPANIES,
  LOGIN,
} from "../actions/actionTypes";

const initialState = {
  logggedIn: false,
  logggedOut: false,
  token: null,
  companiesList: [],
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
    return { ...loginData };
  }
  return state;
};
export default reducers;
