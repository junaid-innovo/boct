import { GET_LIVE } from "../actions/actionTypes";

const initialState = {
  counter: 0,
  results: [],
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_LIVE) {
    return { counter: state.counter + 1 };
  }
  return state;
};
export default reducers;