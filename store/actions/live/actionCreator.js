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
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "../../actions/actionTypes";
import Cookies from "js-cookie";
import { GET_TRIPS } from "../actionTypes";
import { FOR_LIVE_PAGE_MESSAGES } from "../../../components/Constants/Other/Constants";
export const get_trips_list = (currentDate, id, forPageType = null) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/${currentDate}/${id}/trip-listing`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch, forPageType);
          let data = response.data;
          dispatch({
            type: GET_TRIPS,
            payload: {
              selectedBranchId: id,
              tripList: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPageType);
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch, forPageType);
      });
  };
};

export const get_trip_deliveries = (trip_id, store_id, forPage = null) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/${trip_id}/trip-deliveries-listing/${store_id}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch, forPage);
          let data = response.data;
          let result = dispatch({
            type: GET_TRIP_DELIVERIES,
            payload: {
              deliveriesList: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPage);
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
        showErrorMessage(error.toString(), dispatch, forPage);
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
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch);
          let data = response.data;
          let result = dispatch({
            type: GET_CANCEL_REASONS,
            payload: {
              cancelReasonList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
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
        showErrorMessage(error.toString(), dispatch);
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
        let message = response.message;
        if (response.code === 200) {
          let data = response.data;
          showSuccessMessage(message, dispatch);

          let result = dispatch({
            type: GET_DELIVERY_SLOTS,
            payload: {
              deliverySlotList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
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
        showErrorMessage(error.toString(), dispatch);
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
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: CANCEL_ORDER,
            payload: {
              cancelOrderData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
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
        showErrorMessage(error.toString(), dispatch);
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
        let message = response.message;
        if (response.code === 200) {
          let data = response.data;
          showSuccessMessage(message, dispatch);
          dispatch({
            type: UPDATE_DELIVERY_TIME,
            payload: {
              updateOrderDeliveryResponse: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
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
        showErrorMessage(error.toString(), dispatch);
      });
  };
};

const showErrorMessage = (message, dispatch, forPage = null) => {
  dispatch({
    type: ERROR_MESSAGE,
    payload: {
      message: message,
      forPage: FOR_LIVE_PAGE_MESSAGES,
      forPage: forPage ? forPage : FOR_LIVE_PAGE_MESSAGES,
    },
  });
};
const showSuccessMessage = (message, dispatch, forPage = null) => {
  dispatch({
    type: SUCCESS_MESSAGE,
    payload: {
      message: message,
      forPage: forPage ? forPage : FOR_LIVE_PAGE_MESSAGES,
    },
  });
};
