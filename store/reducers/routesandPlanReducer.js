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
  GET_DYNAMIC_CONSTRAINTS,
} from "../actions/actionTypes";

const initialState = {
  routesPlan: [],
  orders: [],
  routeOrders: [],
  summaryStats: null,
  constraints: null,
  routesPlanLoaded: false,
  vehicleList: [],
  message: null,
  code: null,
  tripCode: null,
  staticTripData: null,
  routesAndPlanData: null,
  foravailableDeliveries: null,
};

const reducers = (state = initialState, action) => {
  if (action.type === GET_ROUTES_CAPACITY) {
    let currState = { ...state };
    if (typeof action.payload.routesAndPlanData !== "undefined") {
      currState.routesAndPlanData = action.payload.routesAndPlanData;
    } else {
      currState.foravailableDeliveries = action.payload.foravailabledeliveries;
    }
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === GET_AVAILABLE_VEHICLES) {
    let currState = { ...state };
    currState.vehicleList = action.payload.vehicleList;
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === CREATE_TRIP) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.code = action.payload.code;
    currState.tripCode = action.payload.tripCode;
    return currState;
  }
  if (action.type === CREATE_STATIC_TRIP) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.staticTripData = action.payload.statictripData;
    return currState;
  }
  if (action.type === ADD_DELIVERY) {
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === REMOVE_DELIVERY) {
    let currState = { ...state };
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === CLEAR_ROUTES_PLAN) {
    let currState = { ...state };
    currState.routesAndPlanData = null;
    currState.message = null;
    return currState;
  }
  if (action.type === UPDATE_DELIVERY) {
    let currState = { ...state };
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === DELETE_DELIVERY) {
    let currState = { ...state };
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === GET_DYNAMIC_CONSTRAINTS) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.constraints = action.payload.constraints;
    return currState;
  }
  return state;
};
export default reducers;
