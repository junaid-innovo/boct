import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import liveReducer from "../store/reducers/liveReducers";
import controltowerReducer from "../store/reducers/controltowerReducer";
import routesPlanReducer from "../store/reducers/routesandPlanReducer";
import navBarReducer from "../store/reducers/navbarReducer";
import authorizationReducer from "../store/reducers/authorizationReducer";
const logger = (store) => {
  return (next) => {
    return (action) => {
      const result = next(action);
      console.log("CHECK ACTION RESULT", result);
      return result;
    };
  };
};
const composeEnhancers =
  (typeof window != "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const combinedReducer = combineReducers({
  live: liveReducer,
  controltower: controltowerReducer,
  navbar: navBarReducer,
  routesplan: routesPlanReducer,
  authorization: authorizationReducer,
});

const store = createStore(
  combinedReducer,
  composeEnhancers(applyMiddleware(logger, thunkMiddleware))
);

export default store;
