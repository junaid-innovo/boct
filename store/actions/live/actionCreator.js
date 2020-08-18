import axios from "../../../components/API/Axios";
import jwt from "jsonwebtoken";
import { HTTP_STATUS_OK } from "../../../components/Constants/HTTP_STATUS/status";
import {
  LOGIN,
  GET_USER_COMPANIES,
  GET_TRIP_DELIVERIES,
  GET_CANCEL_REASONS,
  GET_DELIVERY_SLOTS,
  CANCEL_ORDER,
  UPDATE_DELIVERY_TIME,
} from "../../actions/actionTypes";
import Cookies from "js-cookie";
import { GET_TRIPS } from "../actionTypes";
export const get_trips_list = (currentDate, id) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/${currentDate}/${id}/trip-listing`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          //   if (response.message) {
          //     this.showMessage(response.message, "error");
          //   }
          //   if (data.length > 0) {
          // this.showMessage(
          //   this.props.t("Vehicle Listed Successfully"),
          //   "success"
          // );
          dispatch({
            type: GET_TRIPS,
            payload: {
              selectedBranchId: id,
              tripList: data,
              message: response.message,
            },
          });
          // this.setState({
          //   trips: data,
          //   vehicles: data,
          //   disablebtn: false,
          //   routeloading: false,
          //   defaultCenter: center,
          //   pageBodyStyle: {},
          // });
          //   } else {
          //     // this.showMessage(this.props.t("No Record Found"), "error");
          //     dispatch({
          //       type: GET_TRIPS,
          //       payload: {
          //         tripList: data,
          //         message: response.message,
          //       },
          //     });
          // this.setState({
          //   disablebtn: false,
          //   routeloading: false,
          // });
          //   }
        }
      })
      .catch((error) => {
        //    / this.showMessage(error.toString(), "error", false);
      });
  };
};

export const get_trip_deliveries = (trip_id, store_id) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/${trip_id}/trip-deliveries-listing/${store_id}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;

          let result = dispatch({
            type: GET_TRIP_DELIVERIES,
            payload: {
              deliveriesList: data,
              message: response.message,
            },
          });
          console.log("check data", result);
        } else {
          dispatch({
            type: GET_TRIP_DELIVERIES,
            payload: {
              deliveriesList: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        //    / this.showMessage(error.toString(), "error", false);
      });
  };
};

export const get_cancel_reasons = (order, store_id) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/cancel-reasons/${store_id}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;

          let result = dispatch({
            type: GET_CANCEL_REASONS,
            payload: {
              cancelReasonList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
          console.log("check data", result);
        } else {
          dispatch({
            type: GET_CANCEL_REASONS,
            payload: {
              cancelReasonList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        //    / this.showMessage(error.toString(), "error", false);
      });
  };
};
export const get_delivery_slots = (order, store_id) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/delivery-slots/${store_id}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;

          let result = dispatch({
            type: GET_DELIVERY_SLOTS,
            payload: {
              deliverySlotList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
          console.log("check data", result);
        } else {
          dispatch({
            type: GET_DELIVERY_SLOTS,
            payload: {
              deliverySlotList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        //    / this.showMessage(error.toString(), "error", false);
      });
  };
};

export const cancel_order = (data, store_id) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/cancel-orders/${store_id}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: CANCEL_ORDER,
            payload: {
              cancelOrderData: data,
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: CANCEL_ORDER,
            payload: {
              cancelOrderData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        //    / this.showMessage(error.toString(), "error", false);
      });
  };
};

export const update_order_delivery_time = (data, store_id) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/update-delivery-order/${store_id}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;

          dispatch({
            type: UPDATE_DELIVERY_TIME,
            payload: {
              updateOrderDeliveryResponse: data,
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: UPDATE_DELIVERY_TIME,
            payload: {
              updateOrderDeliveryResponse: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        //    / this.showMessage(error.toString(), "error", false);
      });
  };
};
