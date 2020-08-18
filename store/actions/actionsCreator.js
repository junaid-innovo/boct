import { GET_DEFAULT } from "./actionTypes";
import axios from "../../components/API/Axios";
import cookie from "js-cookie";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_UN_AUTHORIZED,
} from "../../components/Constants/HTTP_STATUS/status";
import Router from "next/router";

export const get_defaults = () => {
  return (dispatch) => {
    axios
      .get("api/tower/v1/warehouses", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((response) => {
        let resp = response.data;
        if (resp.code === HTTP_STATUS_OK) {
          dispatch(saveDefaultResult(resp.data.ware_houses));
        } else if (resp.status === HTTP_STATUS_UN_AUTHORIZED) {
          localStorage.removeItem("authtoken");
          localStorage.removeItem("username");
          cookie.remove("authtoken", response.token);
          Router.push("/login");
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  };
};

export const saveDefaultResult = (res) => {
  return {
    type: GET_DEFAULT,
    result: res,
  };
};
