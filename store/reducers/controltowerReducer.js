import { GET_DEFAULT, GET_TOWER } from "../actions/actionTypes";

const initialState = {
  controltower: 0,
  results: [],
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_TOWER) {
    return { controltower: state.controltower + 1 };
  }
  return state;
};
export default reducers;
