import { GET_DEFAULT } from "../actions/actionTypes";

const initialState = {
  warehouses: [],
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_DEFAULT) {
    return { warehouses: action.result };
  }
  return state;
};
export default reducers;
