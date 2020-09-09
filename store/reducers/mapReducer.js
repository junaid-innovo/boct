import {
  GET_DEFAULT,
  GET_TOWER,
  SAVE_GEO_FENCE,
  REMOVE_GEO_FENCE,
} from "../actions/actionTypes";

const initialState = {
  message: null,
  data: null,
};
const mapReducers = (state = initialState, action) => {
  if (action.type === SAVE_GEO_FENCE) {
    let mapState = { ...state };
    mapState.message = action.payload.message;
    mapState.data = action.payload.geofenceData;
    return mapState;
  }
  if (action.type === REMOVE_GEO_FENCE) {
    let mapState = { ...state };
    mapState.message = action.payload.message;
    mapState.data = action.payload.geofenceData;
    return mapState;
  }
  return state;
};
export default mapReducers;
