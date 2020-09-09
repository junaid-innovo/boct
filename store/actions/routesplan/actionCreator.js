import {
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  REMOVE_DELIVERY,
  ADD_DELIVERY,
  DELETE_DELIVERY,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  UPDATE_DELIVERY,
  GET_DYNAMIC_CONSTRAINTS,
  SAVE_GEO_FENCE,
  REMOVE_GEO_FENCE,
  CREATE_DYNAMIC_TRIP,
  APPROVE_DELIVERY_TRIP,
} from "../actionTypes";
import axios from "../../../components/API/Axios";
import { data } from "jquery";
import { FOR_ROUTES_PALN_PAGE_MESSAGES } from "../../../components/Constants/Other/Constants";
export const get_routes_and_capacity = (
  form_date,
  to_date,
  branchId,
  pageFor = ""
) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/routing/${form_date}/${to_date}/${branchId}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let data = response.data;
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch);
          if (pageFor === "available_deliveries") {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                foravailabledeliveries: data.orders,
                message: response.message,
              },
            });
          } else {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                routesAndPlanData: data,
                message: response.message,
              },
            });
          }
        } else {
          showErrorMessage(message, dispatch);
          if (pageFor === "available_deliveries") {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                foravailabledeliveries: data.orders,
                message: response.message,
              },
            });
          } else {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                routesAndPlanData: data,
                message: response.message,
              },
            });
          }
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const get_available_vehciles = (branchId, date) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/get-available-vehicles/${branchId}/${date}`, {
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
            type: GET_AVAILABLE_VEHICLES,
            payload: {
              vehicleList: data.vehicles,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const create_trip = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/create-trip/${branchId}`, data, {
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
            type: CREATE_TRIP,
            payload: {
              code: data.code,
              message: response.message,
              tripCode: data.trip_code,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: CREATE_TRIP,
            payload: {
              code: data.code,
              message: response.message,
              tripCode: null,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const create_static_trip = (branchId, data) => {
  return (dispatch) => {
    axios
      .put(`api/tower/v1/create-static-trip/${branchId}`, data, {
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
            type: CREATE_STATIC_TRIP,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: CREATE_STATIC_TRIP,
            payload: {
              statictripData: data,
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
export const remove_delivery = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/remove-delivery/${branchId}`, data, {
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
            type: REMOVE_DELIVERY,
            payload: {
              // statictripData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: REMOVE_DELIVERY,
            payload: {
              // statictripData: data,
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
export const add_delivery = (branchId, data, forPage = null) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/add-delivery/${branchId}`, data, {
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
          dispatch({
            type: ADD_DELIVERY,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPage);
          dispatch({
            type: ADD_DELIVERY,
            payload: {
              statictripData: data,
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

export const update_delivery = (branchId, data, forPage = null) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/update-trip/${branchId}`, data, {
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
          dispatch({
            type: UPDATE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPage);
          dispatch({
            type: UPDATE_DELIVERY,
            payload: {
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
export const delete_delivery = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/delete-trip/${branchId}`, data, {
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
            type: DELETE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: DELETE_DELIVERY,
            payload: {
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
export const get_dynamic_constraints = (branchId) => {
  return (dispatch) => {
    axios
      .get(`api/tower/v1/constraints/${branchId}`, {
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
            type: GET_DYNAMIC_CONSTRAINTS,
            payload: {
              message: response.message,
              constraints: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: GET_DYNAMIC_CONSTRAINTS,
            payload: {
              message: response.message,
              constraints: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const save_geo_fence = (branchId, data, overlay, accessKey) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/save-geo-fence/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        let data = response.data;
        let shapeData = {
          data: data,
          // overlay: overlay,
          accessKey: accessKey,
        };
        if (response.code === 200) {
          showSuccessMessage(message, dispatch);

          dispatch({
            type: SAVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: shapeData,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: SAVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: shapeData,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const remove_geo_fence = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/remove-geo-fence/${branchId}`, data, {
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
            type: REMOVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: REMOVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const create_dynamic_trip = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/create-dynamic-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (parseInt(response.code) === 200) {
          showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: CREATE_DYNAMIC_TRIP,
            payload: {
              message: response.message,
              dynamicTripData: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: CREATE_DYNAMIC_TRIP,
            payload: {
              message: response.message,
              dynamicTripData: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const approve_delivery_trip = (data, branchId) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/approve-reject-delivery_trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (parseInt(response.code) === 200) {
          showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: APPROVE_DELIVERY_TRIP,
            payload: {
              message: response.message,
              // dynamicTripData: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: APPROVE_DELIVERY_TRIP,
            payload: {
              message: response.message,
              // dynamicTripData: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
const showErrorMessage = (message, dispatch) => {
  dispatch({
    type: ERROR_MESSAGE,
    payload: {
      message: message,
      forPage: FOR_ROUTES_PALN_PAGE_MESSAGES,
    },
  });
};
const showSuccessMessage = (message, dispatch) => {
  dispatch({
    type: SUCCESS_MESSAGE,
    payload: {
      message: message,
      forPage: FOR_ROUTES_PALN_PAGE_MESSAGES,
    },
  });
};
