import { GET_DEFAULT } from "./actionTypes";
import axios from "../../components/API/Axios";
import { HTTP_STATUS_OK } from "../../components/Constants/HTTP_STATUS/status";

export const get_defaults = () => {
  // let data = {
  //   email: "sod@yopmail.com",
  // };
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
