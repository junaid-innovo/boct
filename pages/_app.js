import "./styles/styles.css";
import Header from "../components/Header/Header";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import reducer from "../store/reducers/reducers";
import liveReducer from "../store/reducers/liveReducers";
import controltowerReducer from "../store/reducers/controltowerReducer";
import routesPlanReducer from "../store/reducers/routesandPlanReducer";
import navBarReducer from "../store/reducers/navbarReducer";
import authorizationReducer from "../store/reducers/authorizationReducer";
import reduxThunk from "redux-thunk";
import App from "next/app";
import { Provider } from "react-redux";
import { withRouter } from "next/router";
import { appWithTranslation } from "../i18n";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Router from "next/router";
// require("./index.css");

import { result } from "lodash";
import { composeWithDevTools } from "redux-devtools-extension";
import { initializeFirebase } from "../components/notifications/Push";
import Cookies from "js-cookie";
import { getInitialProps } from "react-i18next";
import { route } from "next/dist/next-server/server/router";
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
const reducers = combineReducers({
  live: liveReducer,
  controltower: controltowerReducer,
  ctr: reducer,
  navbar: navBarReducer,
  routesplan: routesPlanReducer,
  authorization: authorizationReducer,
});
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(logger, reduxThunk))
);

class MyApp extends App {
  componentDidMount() {
    const { router } = this.props;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(function (registration) {
          initializeFirebase();
        });
    }
    const token = Cookies.get("authtoken");

    if (typeof token === "undefined") {
      Router.replace("/login");
    }
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
        <Header />
      </React.Fragment>
    );
  }
}
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};
export default appWithTranslation(MyApp);
