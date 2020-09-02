import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import "./styles/styles.css";

// require("./");
import Header from "../components/Header/Header";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import reducer from "../store/reducers/reducers";
import liveReducer from "../store/reducers/liveReducers";
import controltowerReducer from "../store/reducers/controltowerReducer";
import routesPlanReducer from "../store/reducers/routesandPlanReducer";
import navBarReducer from "../store/reducers/navbarReducer";
import authorizationReducer from "../store/reducers/authorizationReducer";
import reduxThunk from "redux-thunk";
import toastReducer from "../store/reducers/toastReducer";
import mapReducer from "../store/reducers/mapReducer";
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
import withRedux from "next-redux-wrapper";
import Router from "next/router";
// require("./index.css");

import { result } from "lodash";
import { composeWithDevTools } from "redux-devtools-extension";
import { initializeFirebase } from "../components/notifications/Push";
import Cookies from "js-cookie";
import { getInitialProps } from "react-i18next";
import { route } from "next/dist/next-server/server/router";
import { type } from "jquery";
const logger = (store) => {
  return (next) => {
    return (action) => {
      const result = next(action);

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
  toastmessages: toastReducer,
  map: mapReducer,
});
const store = createStore(
  combinedReducer,
  composeEnhancers(applyMiddleware(logger, reduxThunk))
);

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    // const token = Cookies.get("authtoken");
    return (
      <React.Fragment>
        <Header />
        <Provider store={store}>
          <Component {...pageProps} />
          {/* {typeof token !== "undefined" ? ( */}
        </Provider>
        <Header />
      </React.Fragment>
    );
  }
}
export const redirect = (path, ctx) => {
  const { res, req } = ctx;
  let pathname = ctx.pathname;
  console.log("RESPONSE CTX", res);
  if (res) {
    if (pathname !== "/login") {
      // typeof window !== "undefined"
      //   ? Router.push("/login")
      // :
      res.redirect("/login");
      res.end();
    } else {
      console.log("LOGIN PAGE");
    }
  }
};
// export const redirectTo = (destination, ctx) => {
//   // typeof window !== "undefined"
//   //   ? Router.push("/login")
//   //   : ctx.res.writeHead(302, { Location: "/login" }).end();
//   if (ctx.res) {
//     ctx.res.writeHead(301, { Location: destination });
//     ctx.res.end();
//   } else {
//     window.location = destination;
//   }
// };
MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pathname = ctx.pathname;
  // const cookie =
  let list = {};
  let rc = ctx.req ? ctx.req.headers.cookie : null;

  if (rc && typeof rc !== "undefined") {
    rc.split(";").forEach(function (cookie) {
      var parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }
  if (typeof navigator !== "undefined") {
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
  }
  // if (typeof window === "undefined" && !ctx.res.writeHead) {
  //   // This is the SSR mode
  //   return { metaRedirect: true };
  // }
  // if (typeof window !== "undefined") {
  //   alert("TEST");
  //   console.log("COOKIESJHKSJHDJSHDJSHDJSHDJSHDJ");
  // }
  // console.log("CHECK TOKEN123", list["authtoken"]);
  if (typeof list["authtoken"] === "undefined") {
    redirect("/login", ctx);
  }
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};
// export default wrapper.withRedux(appWithTranslation(MyApp));
export default appWithTranslation(MyApp);
