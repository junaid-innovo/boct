import axios from "../../components/API/Axios";
import jwt from "jsonwebtoken";
import cookie from "js-cookie";
import { HTTP_STATUS_OK } from "../../components/Constants/HTTP_STATUS/status";
import {
  LOGIN,
  GET_USER_COMPANIES,
  LOGOUT,
  CHANGE_PASSWORD,
} from "../actions/actionTypes";
import Router from "next/router";
export const get_login = (formData, language) => {
  let lang = language;
  return (dispatch) => {
    axios
      .post(`api/user/login`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          if (response.token) {
            let jwtString = jwt.decode(response.token);
            let userName = jwtString.name[lang];
            localStorage.setItem("authtoken", response.token);
            localStorage.setItem("username", userName);
            localStorage.setItem(
              "Map_Key",
              "AIzaSyDcSzOdZ7pBnnxG6_KyxLZZW88E5HJHErM"
            );
            cookie.set("Map_Key", "AIzaSyDcSzOdZ7pBnnxG6_KyxLZZW88E5HJHErM");
            cookie.set("authtoken", response.token);
            Router.push("/");
            dispatch({
              type: LOGIN,
              payload: {
                loginStatus: true,
                token: response.token,
                message: response.message,
              },
            });
          }
        } else {
          if (parseInt(response.code) === 401) {
          }
          dispatch({
            type: LOGIN,
            payload: {
              loginStatus: false,
              token: response.token,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  };
};
export const reauthenticate = (token) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      payload: { loginStatus: true, message: response.message, token: token },
    });
  };
};
export const get_logout = () => {
  return (dispatch) => {
    axios
      .post(
        `api/user/logout`,
        {},
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("authtoken")}`,
          },
        }
      )
      .then((res) => {
        let response = res.data;
        if (res.status === 200) {
          cookie.remove("authtoken", response.token);
          Router.push("/login");
          dispatch({
            type: LOGOUT,
            payload: { loginStatus: false, message: response.message },
          });
        } else {
          if (parseInt(response.code) === 401) {
          }
          dispatch({
            type: LOGOUT,
            payload: { loginStatus: false, message: response.message },
          });
        }
      })
      .catch((error) => console.log(error));
  };
};
export const change_password = (data) => {
  return (dispatch) => {
    axios
      .post(`api/user/update-password`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (res.status === 200) {
          localStorage.removeItem("authtoken");
          localStorage.removeItem("username");
          cookie.remove("authtoken", response.token);
          Router.push("/login");
          dispatch({
            type: CHANGE_PASSWORD,
            payload: { loginStatus: false, message: response.message },
          });
        } else {
          if (parseInt(response.code) === 401) {
          }
          dispatch({
            type: CHANGE_PASSWORD,
            payload: { loginStatus: false, message: response.message },
          });
        }
      })
      .catch((error) => console.log(error));
  };
};
export const checkServerSideCookie = (ctx) => {
  if (ctx.isServer) {
    if (ctx.req.headers.cookie) {
      const token = getCookie("authtoken", ctx.req);
      ctx.store.dispatch(reauthenticate(token, user));
    }
  } else {
    const token = ctx.store.getState().authorization.token;
    if (token && user && ctx.pathname === "/login") {
      setTimeout(function () {
        Router.push("/");
      }, 0);
    }
  }
};
export const get_companies = (data) => {
  return (dispatch) => {
    axios
      .post(`api/user/companies`, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Authorization":
            "tGd6Y5JOeuO0yx2GzUOG1eHqAM79C0jlvte2Th5tLLVNtmVNLxONQ2NGnVRNVU8N",
        },
      })
      .then((res) => {
        let response = res.data;
        if (res.status === 200) {
          let data = response.data;
          dispatch({
            type: GET_USER_COMPANIES,
            payload: {
              companiesList: data,
              message: response.message,
            },
          });
        } else {
          if (parseInt(response.code) === 401) {
            this.showMessage(response.message, "error");
          }
          dispatch({
            type: GET_USER_COMPANIES,
            payload: {
              companiesList: [],
              message: response.message,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  };
};

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
      path: "/",
    });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split("=")[1];
};
