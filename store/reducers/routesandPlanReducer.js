import {
  GET_ROUTES_PLAN,
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  ADD_DELIVERY,
  REMOVE_DELIVERY,
} from "../actions/actionTypes";

const initialState = {
  routesPlan: [],
  orders: [],
  routeOrders: [],
  summaryStats: null,
  constraints: null,
  routesPlanLoaded: false,
  vehicleList: [],
  message: "",
  code: null,
  tripCode: null,
  staticTripData: null,
  routesAndPlanData: null,
};

const reducers = (state = initialState, action) => {
  if (action.type === GET_ROUTES_CAPACITY) {
    let currState = { ...state };
    currState.routesAndPlanData = action.payload.routesAndPlanData;
    currState.message = action.payload.message;
    // currState.routeOrders = action.payload.routeOrders;
    // currState.summaryStats = action.payload.summaryStats;
    // currState.constraints = action.payload.constraints;
    // currState.routesPlanLoaded = true;
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
    currState.message = action.payload.message;
    return currState;
  }

  return state;
};
export default reducers;
