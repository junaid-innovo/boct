import { GET_DEFAULT, SELECT_BRANCH } from "../actions/actionTypes";
import store from "../store";

const initialState = {
  warehouses: [],
  defaultCenter: null,
  selectedBranch: null,
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_DEFAULT) {
    let navState = { ...state };
    navState.warehouses = action.result;
    navState.loadding = false;
    return navState;
  }
  if (action.type === SELECT_BRANCH) {
    let navState = { ...state };
    navState.defaultCenter = action.payload.defaultCenter;
    navState.selectedBranch = action.payload.selectedBranchId;
    navState.loadding = false;
    return navState;
  }

  return state;
};
export default reducers;
