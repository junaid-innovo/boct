import { GET_DEFAULT, SELECT_BRANCH } from "../actions/actionTypes";

const initialState = {
  warehouses: [],
  defaultCenter: null,
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_DEFAULT) {
    return { warehouses: action.result };
  }

  return state;
};
export default reducers;
