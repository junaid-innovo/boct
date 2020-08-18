import {
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  REMOVE_DELIVERY,
  ADD_DELIVERY,
} from "../actionTypes";
import axios from "../../../components/API/Axios";
import { data } from "jquery";
export const get_routes_and_capacity = (form_date, to_date, branchId) => {
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
          // let orders = data.orders;
          // let constraints = data.constraints;
          // let summarystats = data.counters;
          // let modifiedOrders = [];

          // orders.map((val, key) => {
          //   modifiedOrders.push({ order: val });
          // });
          dispatch({
            type: GET_ROUTES_CAPACITY,
            payload: {
              routesAndPlanData: data,
              // orders: modifiedOrders,
              // routeOrders: { deliveries: orders },
              // constraints: _.sortBy(constraints, "constraint_id"),
              // summaryStats: summarystats,
              // message: response.message,
              // },
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
      .put(`api/tower/v1/remove-delivery/${branchId}`, data, {
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
              // statictripData: data,
              message: response.message,
            },
          });
        } else {
          dispatch({
            type: ADD_DELIVERY,
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
