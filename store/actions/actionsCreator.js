import { GET_DEFAULT, SUCCESS_MESSAGE, ERROR_MESSAGE } from "./actionTypes";
import axios from "../../components/API/Axios";
import cookie from "js-cookie";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_UN_AUTHORIZED,
} from "../../components/Constants/HTTP_STATUS/status";
import { FOR_NAV_BAR_PAGE_MESSAGES } from "../../components/Constants/Other/Constants";
import Router from "next/router";
import store from "../store";
let states = store.getState();
export const get_defaults = () => {
  states.live.loading = true;
  return (dispatch) => {
    axios
      .get("api/tower/v1/warehouses", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((response) => {
        states.live.loading = false;
        let resp = response.data;
        let message = resp.message;
        if (resp.code === HTTP_STATUS_OK) {
          dispatch({
            type: SUCCESS_MESSAGE,
            payload: {
              message: message,
              forPage: FOR_NAV_BAR_PAGE_MESSAGES,
            },
          });
          dispatch(saveDefaultResult(resp.data.ware_houses));
        } else if (resp.status === HTTP_STATUS_UN_AUTHORIZED) {
          localStorage.removeItem("authtoken");
          localStorage.removeItem("username");
          cookie.remove("authtoken", response.token);
          dispatch({
            type: ERROR_MESSAGE,
            payload: {
              message: message,
              forPage: FOR_NAV_BAR_PAGE_MESSAGES,
            },
          });
          // Router.push("/login");
        }
      })
      .catch((error) => {
        states.live.loading = false;
        dispatch({
          type: ERROR_MESSAGE,
          payload: {
            message: error.toString(),
            forPage: FOR_NAV_BAR_PAGE_MESSAGES,
          },
        });
      });
  };
};

const saveDefaultResult = (res) => {
  return {
    type: GET_DEFAULT,
    result: res,
  };
};
