import { GET_DEFAULT } from "./actionTypes";
import axios from "../../components/API/Axios";
import { HTTP_STATUS_OK } from "../../components/Constants/HTTP_STATUS/status";

export const get_defaults = () => {
  return (dispatch) => {
    axios
      .get("2020-03-10/warehouses")
      .then((response) => {
        let resp = response.data;
        if (resp.code === HTTP_STATUS_OK) {
          dispatch(saveDefaultResult(resp.data));
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
