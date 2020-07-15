import { GET_ROUTES_PLAN } from "../actions/actionTypes";

const initialState = {
  routesPlan: [],
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_ROUTES_PLAN) {
    return { routesPlan: ["routes"] };
  }
  return state;
};
export default reducers;
