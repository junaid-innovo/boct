import { GET_DEFAULT, SELECT_BRANCH } from "../actions/actionTypes";

const initialState = {
  warehouses: [],
  selectedBranch: null,
  defaultCenter: null,
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_DEFAULT) {
    return { warehouses: action.result, selectedBranch: null };
  }
  if (action.type === SELECT_BRANCH) {
    let updateState = { ...state };
    updateState.selectedBranch = action.payload.selectedBranchId;
    return { ...updateState };
  }
  return state;
};
export default reducers;
