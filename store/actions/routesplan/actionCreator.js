import {
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  REMOVE_DELIVERY,
  ADD_DELIVERY,
  DELETE_DELIVERY,
} from "../actionTypes";
import axios from "../../../components/API/Axios";
import { data } from "jquery";
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
        if (response.code === 200) {
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
      .catch((error) => {});
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
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: GET_AVAILABLE_VEHICLES,
            payload: {
              vehicleList: data.vehicles,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {});
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
        if (response.code === 200) {
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
      .catch((error) => {});
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
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: CREATE_STATIC_TRIP,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: CREATE_STATIC_TRIP,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {});
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
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: REMOVE_DELIVERY,
            payload: {
              // statictripData: data,
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: REMOVE_DELIVERY,
            payload: {
              // statictripData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {});
  };
};
export const add_delivery = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/add-delivery/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: ADD_DELIVERY,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: ADD_DELIVERY,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {});
  };
};

export const update_delivery = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/tower/v1/update-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: UPDATE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: UPDATE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {});
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
        if (response.code === 200) {
          let data = response.data;
          dispatch({
            type: DELETE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: DELETE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {});
  };
};
