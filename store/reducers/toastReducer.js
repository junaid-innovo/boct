import {
  GET_ROUTES_PLAN,
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  ADD_DELIVERY,
  REMOVE_DELIVERY,
  CLEAR_ROUTES_PLAN,
  UPDATE_DELIVERY,
  DELETE_DELIVERY,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
} from "../actions/actionTypes";

const initialState = {
  type: null,
  messageId: null,
  message: null,
  forPage: null,
};

const toastReducers = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_MESSAGE:
      let currSuccessState = { ...state };
      currSuccessState.messageId++;
      currSuccessState.type = action.type;
      currSuccessState.message = action.payload.message;
      currSuccessState.forPage = action.payload.forPage;
      return currSuccessState;
    case ERROR_MESSAGE:
      let currState = { ...state };
      currState.messageId++;
      currState.type = action.type;
      currState.message = action.payload.message;
      currState.forPage = action.payload.forPage;
      return currState;
  }
  return state;
};
export default toastReducers;
