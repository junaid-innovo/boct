import React, { Component, setTimeOut } from "react";
import {
  Form,
  FormGroup,
  Row,
  InputGroup,
  Button,
  ButtonGroup,
  Navbar,
  Nav,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import Map from "../googlemap/Map";
// import axios from 'axios'
import axios from "../API/Axios";
import {
  LOCAL_API_URL,
  LANGUAGE_STRING,
} from "../Constants/Enviroment/Enviroment";
import {
  ALL_ORDERS,
  UNASSIGNED_ORDERS,
  ORDERS_IN_PRODUCTION,
  DELIVERY_TRIPS,
  ORDERS_READYFORPICKUP,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_READY_FOR_PICKUP,
} from "../Constants/Order/Constants";
import CreateTripModal from "../Modal/CreateTripModal";
import { get_trips_list } from "../../store/actions/live/actionCreator";
import {
  col3,
  col12,
  col4,
  col2,
  col5,
  col1,
  col6,
  col7,
  col9,
  col8,
  col10,
  col11,
  col_md_auto,
  col_lg_auto,
  col_sm_auto,
  col_xs_auto,
} from "../Constants/Classes/BoostrapClassses";
import { OrderTableColumns } from "../Constants/TableColumns/OrderColumns";
import { DeliveryTripColumns } from "../Constants/TableColumns/DeliveryTripColumns";
import RouteSummary from "./RouteSummary";
import CustomDatePickerInput from "../UI/Input/CustomDatePickerInput";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { LoadPropagateLoader } from "../Loaders/Loaders";
import style from "./RoutesPlan.module.css";
import BoostrapDataTable from "../datatable/Datatable";
import DeliveryTripDataTable from "../datatable/DeliveryTripDataTable";
import SampleData from "../SampleData/RoutesPlanData.json";
import DatePicker from "react-datepicker";
import { LoadFadeLoader, LoadClipLoader } from "../Loaders/Loaders";
import { BounceLoader, ClipLoader } from "react-spinners";

import BackDrop from "../UI/BackDrop/BackDrop";
import moment from "moment";
import { Trans } from "react-i18next";
import _ from "lodash";
import {
  get_routes_and_capacity,
  get_available_vehciles,
  create_trip,
} from "../../store/actions/routesplan/actionCreator";
import { connect } from "react-redux";
class CustomRoutesPlan extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.timeout = null;
    this.toastId = React.createRef();
    this.state = {
      planCode: "PLAN-",
      listview: true,
      mapview: false,
      date: [new Date(), new Date()],
      DateTimeRange: [new Date(), new Date()],
      startDate: new Date(),
      endDate: new Date(),
      rangedate: [new Date(), new Date()],
      isActive: null,
      routeIsActive: null,
      mapfeatures: {
        showMarker: true,
        showRoutes: false,
        showOriginMarker: true,
        drawing: true,
        polygon: false,
        orderType: null,
        routesEnabled: false,
      },
      selectedOrderId: [],
      selectedBranchId: null,
      forDataTableSelectedId: [],
      selectedRoute: null,
      createTrip: false,
      tripDate: new Date(),
      dateFormat: "yyyy-MM-dd",
      vehicleList: [],
      selectedVehicle: null,
      allorders: [],
      orders: [],
      routes: [],
      routeOrders: null,
      polygonPaths: null,
      routesEnabled: false,
      showOrders: false,
      showDeliveryTrip: false,
      showOrdersInProduction: false,
      showTripModal: false,
      ordersInProduction: [],
      routesOrdersInProduction: [],
      deliveryTrips: [],
      routeTrips: [],
      isChanged: false,
      defaultMenuText: null,
      defaultMenuText2: null,
      disabledeliveryTrip: false,
      tripcallPending: false,
      pageloading: true,
      dataTableloading: true,
      defaultCenter: null,
      vehicleLoading: false,
      showBackdrop: true,
      selectedOrdersDetail: [],
      generatedTripCode: null,
      AllFilter: "All Orders",
      mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=en}`,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedBranch !== prevProps.selectedBranch) {
      this.setState({
        // selectedBranchId: this.props.selectedwarehouse_id,
        routeOrders: null,
        selectedRoute: null,
        showDeliveryTrip: false,
        deliveryTrips: [],
        showOrders: false,
        showOrdersInProduction: false,
        routes: [],
        isActive: null,
        allorders: [],
        routeIsActive: null,
        isChanged: false,
        pageloading: true,
        selectedBranchId: this.props.selectedBranch,
        // defaultCenter: null,
      });
      this.getRoutesandCapacity();
      if (this.state.tripDate) {
        this.props.getAvailableVehiclesApi(
          this.props.selectedBranch,
          moment(this.state.tripDate).format("YYYY-MM-DD")
        );
      }
    }
    if (this.props.routeStatus !== prevProps.routeStatus) {
      let mapFeatures = { ...this.state.mapfeatures };
      mapFeatures.routesEnabled = this.props.routeStatus;
      this.setState({
        routesEnabled: this.props.routeStatus,
        mapfeatures: mapFeatures,
      });
    }
    if (this.state.tripDate !== prevState.tripDate) {
      if (this.props.selectedBranch) {
        this.getVehicleList(false, this.state.selectedBranchId);
      }
    }

    //new
    if (this.props.tripList !== prevProps.tripList) {
      let store_address = { ...this.props.defaultCenter };

      let mapfeatures = { ...this.state.mapfeatures };
      mapfeatures.orderType = DELIVERY_TRIPS;
      let data = this.props.tripList;
      this.setState({
        isActive: 2,
        showDeliveryTrip: true,
        routeTrips: data,
        routeOrders: {
          deliveries: [],
          store_address: {
            latitude: store_address.lat,
            longitude: store_address.lng,
          },
        },
        polygonPaths: null,
        mapfeatures: mapfeatures,
        showOrdersInProduction: false,
        showOrders: false,
        deliveryTrips: data,
        selectedRoute: ALL_ORDERS,
        defaultMenuText: "All Trips",
        defaultMenuText2: "Unassigned Trips",
        tripcallPending: false,
        dataTableloading: false,
      });
    }
    if (this.state.vehicleList !== this.props.vehicleList) {
      this.setState({
        vehicleList: this.props.vehicleList,
        vehicleLoading: false,
      });
    }
    if (this.props.message !== prevProps.message) {
      this.showMessage(this.props.message, "success");
    }
    if (this.props.routesAndPlanData !== prevProps.routesAndPlanData) {
      let mapfeatures = { ...this.state.mapfeatures };
      mapfeatures.orderType = ORDERS_READYFORPICKUP;
      let data = this.props.routesAndPlanData;
      let orders = data.orders.filter((order) => {
        return (
          parseInt(order.order_status_id) === ORDER_STATUS_READY_FOR_PICKUP
        );
      });
      let allOrders = data.orders;

      let ordersInProduction = data.orders.filter((order) => {
        return parseInt(order.order_status_id) === ORDER_STATUS_CONFIRMED; // confirmed
      });

      let store_address = { ...this.state.defaultCenter };

      this.setState({
        allorders: allOrders,
        orders: orders,
        isActive: 1,
        mapfeatures: mapfeatures,
        defaultMenuText: "All Orders",
        defaultMenuText2: "Unassigned Orders",
        selectedRoute: ALL_ORDERS,
        routeIsActive: "all_orders",
        routeOrders: {
          deliveries: orders,
          store_address: {
            latitude: store_address.lat,
            longitude: store_address.lng,
          },
        },
        ordersInProduction: [...ordersInProduction],
        routesOrdersInProduction: [...ordersInProduction],
        showOrders: true,
        showDeliveryTrip: false,
        showOrdersInProduction: false,
        routes: data.Routes,
        isChanged: true,
        pageloading: false,
        showBackdrop: false,
        dataTableloading: false,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedwarehouse_id) {
      // if (!state.selectedBranchId) {
      return {
        selectedBranchId: props.selectedwarehouse_id,
        defaultCenter: props.defaultCenter,
      };
      // }
    }
    return state;
  }
  // setTimeOut(() => this.setState({ firstLoader: true }), 1000))
  // setTimeOut(() => this.setState({ secondLoader: true }), 1000))
  // setTimeOut(() => this.setState({ thirdLoader: true }), 1000))
  componentDidMount() {
    this._isMounted = true;

    if (this.props.selectedBranch) {
      if (this._isMounted) {
        this.getRoutesandCapacity();
        this.setState({
          selectedBranchId: this.props.selectedBranch,
        });
      }
      // this.getRoutesandCapacity();

      if (this.state.tripDate) {
        this.getVehicleList(true, this.props.selectedwarehouse_id);
      }
    }
    if (this.props.routeStatus) {
      let mapFeatures = { ...this.state.mapfeatures };
      mapFeatures.routesEnabled = this.props.routeStatus;
      this.setState({
        routesEnabled: this.props.routeStatus,
        mapfeatures: mapFeatures,
      });
    } else {
      let mapFeatures = { ...this.state.mapfeatures };
      mapFeatures.routesEnabled = this.props.routeStatus;
      this.setState({
        routesEnabled: this.props.routeStatus,
        mapfeatures: mapFeatures,
      });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  removeCancelDeliveries = (cancelled_delivery_trip_id) => {
    let deliveryTrips = [...this.state.deliveryTrips];
    _.remove(
      deliveryTrips,
      ({ delivery_trip_id }) => cancelled_delivery_trip_id === delivery_trip_id
    );
    this.setState({
      deliveryTrips: deliveryTrips,
      routeTrips: deliveryTrips,
    });
  };
  getRoutesandCapacity = () => {
    this.props.getrouteandplanApi(
      "2020-08-13",
      "2020-08-13",
      this.props.selectedBranch
    );
    // let mapfeatures = { ...this.state.mapfeatures };
    // mapfeatures.orderType = ORDERS_READYFORPICKUP;
    // let data = SampleData;
    // let orders = data.orders.filter((order) => {
    //   return parseInt(order.order_status_id) === ORDER_STATUS_READY_FOR_PICKUP;
    // });
    // let allOrders = data.orders;

    // let ordersInProduction = data.orders.filter((order) => {
    //   return parseInt(order.order_status_id) === ORDER_STATUS_CONFIRMED; // confirmed
    // });

    // let store_address = { ...this.state.defaultCenter };

    // this.setState({
    //   allorders: allOrders,
    //   orders: orders,
    //   isActive: 1,
    //   mapfeatures: mapfeatures,
    //   defaultMenuText: "All Orders",
    //   defaultMenuText2: "Unassigned Orders",
    //   selectedRoute: ALL_ORDERS,
    //   routeIsActive: "all_orders",
    //   routeOrders: {
    //     deliveries: orders,
    //     store_address: {
    //       latitude: store_address.lat,
    //       longitude: store_address.lng,
    //     },
    //   },
    //   ordersInProduction: [...ordersInProduction],
    //   routesOrdersInProduction: [...ordersInProduction],
    //   showOrders: true,
    //   showDeliveryTrip: false,
    //   showOrdersInProduction: false,
    //   routes: data.Routes,
    //   isChanged: true,
    //   pageloading: false,
    //   showBackdrop: false,
    //   dataTableloading: false,
    // });
    // let start_date = moment(this.state.date[0]).format("YYYY-MM-DD");
    // let end_date = moment(this.state.date[1]).format("YYYY-MM-DD");
    // axios
    //   .get(
    //     `storesupervisor/v1/${this.state.selectedBranchId}/routingAndCapacity`,
    //     {
    //       headers: {
    //         Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     let response = res.data;
    //     let mapfeatures = { ...this.state.mapfeatures };
    //     mapfeatures.orderType = ORDERS_READYFORPICKUP;
    //     if (response.code === 200) {
    //       if (this._isMounted) {
    //         toast.dismiss();
    //         this.showMessage(
    //           this.props.t("Route Data Retrieved Successfully"),
    //           "success",
    //           1500
    //         );

    //         let data = response.data;
    //         let orders = data.orders.filter(({ order }) => {
    //           return (
    //             parseInt(order.order_status_id) ===
    //             ORDER_STATUS_READY_FOR_PICKUP
    //           );
    //         });

    //         let allOrders = data.orders;

    //         let ordersInProduction = data.orders.filter(({ order }) => {
    //           return parseInt(order.order_status_id) === ORDER_STATUS_CONFIRMED; // confirmed
    //         });

    //         let store_address = { ...this.state.defaultCenter };

    //         this.setState({
    //           allorders: allOrders,
    //           orders: orders,
    //           isActive: 1,
    //           mapfeatures: mapfeatures,
    //           defaultMenuText: "All Orders",
    //           defaultMenuText2: "Unassigned Orders",
    //           selectedRoute: ALL_ORDERS,
    //           routeIsActive: "all_orders",
    //           routeOrders: {
    //             deliveries: orders,
    //             store_address: {
    //               latitude: store_address.lat,
    //               longitude: store_address.lng,
    //             },
    //           },
    //           ordersInProduction: [...ordersInProduction],
    //           routesOrdersInProduction: [...ordersInProduction],
    //           showOrders: true,
    //           showDeliveryTrip: false,
    //           showOrdersInProduction: false,
    //           routes: data.Routes,
    //           isChanged: true,
    //           pageloading: false,
    //           showBackdrop: false,
    //           dataTableloading: false,
    //         });
    //       }
    //     } else {
    //       this.setState({
    //         pageloading: false,
    //         showOrders: true,
    //         dataTableloading: false,
    //         isActive: 1,
    //         mapfeatures: mapfeatures,
    //         defaultMenuText: "All Orders",
    //         defaultMenuText2: "Unassigned Orders",
    //         selectedRoute: ALL_ORDERS,
    //         routeIsActive: "all_orders",
    //         isChanged: true,
    //       });
    //       if (response.code === 404) {
    //         if (response.message) {
    //           this.showMessage(response.message, "error");
    //         }
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     this.setState({ pageloading: false });
    //     this.showMessage(error.toString(), "error", false);
    //   });
  };

  getDeliveryTrips = (e) => {
    if (this.state.tripcallPending) {
      return false;
    } else {
      if (this.state.deliveryTrips.length > 0) {
        return false;
      } else {
        this.setState({
          tripcallPending: true,
          dataTableloading: true,
          showOrders: false,
          showOrdersInProduction: false,
        });
        this.props.getTripsApi("2020-04-24", this.props.selectedBranch);
      }
      //   let start_date = moment(this.state.date[0]).format("YYYY-MM-DD");
      //   let end_date = moment(this.state.date[1]).format("YYYY-MM-DD");
      //   axios
      //     .get(
      //       `storesupervisor/v1/${this.state.selectedBranchId}/deliveryTrips`,
      //       {
      //         headers: {
      //           Authorization: `bearer ${localStorage.getItem("authtoken")}`,
      //         },
      //       }
      //     )
      //     .then((res) => {
      //       let response = res.data;
      //       if (response.code === 200) {
      //         if (this._isMounted) {
      //           this.showMessage(
      //             this.props.t("Delivery Trips Retrieved Successfully"),
      //             "success",
      //             1500
      //           );
      //           //testkaleem

      //           let store_address = { ...this.state.defaultCenter };

      //           let mapfeatures = { ...this.state.mapfeatures };
      //           mapfeatures.orderType = DELIVERY_TRIPS;
      //           let data = response.data;
      //           this.setState({
      //             isActive: 2,
      //             showDeliveryTrip: true,
      //             routeTrips: data,
      //             routeOrders: {
      //               deliveries: [],
      //               store_address: {
      //                 latitude: store_address.lat,
      //                 longitude: store_address.lng,
      //               },
      //             },
      //             polygonPaths: null,
      //             mapfeatures: mapfeatures,
      //             showOrdersInProduction: false,
      //             showOrders: false,
      //             deliveryTrips: data,
      //             selectedRoute: ALL_ORDERS,
      //             defaultMenuText: "All Trips",
      //             defaultMenuText2: "Unassigned Trips",
      //             tripcallPending: false,
      //             dataTableloading: false,
      //           });
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       this.showMessage(error.toString(), "error", false);
      //     });
      // }
    }
  };

  assignPlanRoute = () => {
    let data = {
      vehicle_id: this.state.selectedVehicle,
      // trip_code: this.state.planCode,
      warehouse_id: parseInt(this.state.selectedBranchId),
      order_ids: this.state.selectedOrderId,
      route_id: 1,
      trip_date: moment(this.state.tripDate).format("YYYY-MM-DD"),
    };
    this.setState({
      pageloading: true,
    });
    axios
      .post(`storesupervisor/v1/planRoute`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let store_address = { ...this.state.defaultCenter };
        if (response.code === 200) {
          this.showMessage(this.props.t("Route Saved Successfully"), "success");
          if (this.state.routeOrders.deliveries) {
            let selectedOrderIds = [...this.state.routeOrders.deliveries];
            let getallorders = [...this.state.allorders];
            _.remove(selectedOrderIds, ({ order }) =>
              this.state.selectedOrderId.includes(order.order_id)
            );
            _.remove(getallorders, ({ order }) =>
              this.state.selectedOrderId.includes(order.order_id)
            );

            // this.getRoutesandCapacity()
            this.setState({
              allorders: getallorders,
              routeOrders: {
                deliveries: selectedOrderIds,
                // let store_address = { ...this.state.defaultCenter }
                store_address: {
                  latitude: store_address.lat,
                  longitude: store_address.lng,
                },
              },
              createTrip: false,
              selectedVehicle: null,
              selectedOrderId: [],
              pageloading: false,
            });
          }
        } else {
          this.showMessage(response.mesaege, "error");
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), "error", false);
      });
  };

  assignPlanRoute2 = () => {
    let data = {
      vehicle_id: this.state.selectedVehicle,
      route_id:
        this.state.selectedRoute !== ALL_ORDERS &&
        this.state.selectedRoute !== UNASSIGNED_ORDERS
          ? this.state.selectedRoute
          : "",
      trip_code: "",
      store_location: this.props.defaultCenter,
      trip_date: moment(this.state.tripDate).format("YYYY-MM-DD"),
      // trip_code: this.state.planCode,
      order_ids: this.state.selectedOrdersDetail,
    };

    this.setState({
      pageloading: true,
    });

    this.props.createTripApi(this.props.selectedBranch, JSON.stringify(data));
    // axios
    //   .post(`storesupervisor/v1/planRouteDemo`, data, {
    //     headers: {
    //       Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       let newCode = response.trip_code;
    //       if (response.message) {
    //         this.showMessage(`${response.message}`, "success", 3000);
    //       } else {
    //         // this.showMessage(response.message, 'success', 3000)
    //       }

    //       if (this.state.routeOrders.deliveries) {
    //         let selectedOrderIds = [...this.state.routeOrders.deliveries];
    //         _.remove(selectedOrderIds, ({ order }) =>
    //           this.state.selectedOrderId.includes(order.order_id)
    //         );
    //         let store_address = { ...this.state.defaultCenter };

    //         this.setState({
    //           routeOrders: {
    //             deliveries: selectedOrderIds,
    //             store_address: {
    //               latitude: store_address.lat,
    //               longitude: store_address.lng,
    //             },
    //           },
    //           createTrip: false,
    //           tripDate: new Date(),
    //           selectedVehicle: null,
    //           selectedOrderId: [],
    //           selectedOrdersDetail: [],
    //           pageloading: false,
    //           generatedTripCode: newCode,
    //         });
    //       }
    //     } else {
    //       this.setState({
    //         pageloading: false,
    //       });
    //       this.showMessage(response.message, "error");
    //     }
    //   })
    //   .catch((error) => {
    //     this.showMessage(error.toString(), "error", false);
    //     this.setState({
    //       pageloading: false,
    //     });
    //   });
  };

  onDateTimeRangeChange = (date) => {
    this.setState({ DateTimeRange: date });
  };
  onPlanCodeChange = (e) => {
    let prefix = "PLAN-";
    let code = "";
    if (e.target.value.length < 0) {
      code = `${prefix}${e.target.value}`;
    } else {
      if (e.target.value.length < 5) {
        code = prefix;
      } else {
        code = e.target.value;
      }
    }
    this.setState({
      planCode: code,
    });
  };
  onVehicleChange = (e) => {
    this.setState({
      selectedVehicle: e.target.value,
    });
  };
  renderDateRangePicker = (minDate) => {
    return (
      <React.Fragment>
        {/* <DateTimeRangePicker
          style={style}
          disableClock={true}
          // minDate={new Date().getDate()+7}
          // minDate={new Date(Date.now() + 1*24*60*60*1000)}
          minDate={
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 7,
              0,
              0,
              0
            )
          }
          onChange={this.onDateTimeRangeChange}
          value={this.state.DateTimeRange}
        /> */}
      </React.Fragment>
    );
  };

  onDateRangeChange = (date) => {
    this.setState({
      rangedate: date,
    });
  };
  showMessage = (message, type, autoClose = 2000) => {
    toast(message, {
      toastId: this.toastId,
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success" ? style.toastContainerSuccess : style.toastContainer,
    });
  };

  setDataTableSelectedId = (order_ids, orders_in_detail) => {
    if (order_ids.length === 0) {
      this.setState({
        selectedVehicle: null,
        tripDate: new Date(),
        createTrip: false,
        planCode: "PLAN-",
      });
    }
    this.setState({
      selectedOrderId: _.uniq(order_ids),
      selectedOrdersDetail: orders_in_detail,
      generatedTripCode: null,
    });
  };
  getMapSelectedOrderId = (order_id, orders_in_detail) => {
    let order_detail = orders_in_detail;
    // let order_detail = [...this.state.selectedOrdersDetail]
    // orders_in_detail.map((val) => {
    //    order_detail.push(val)
    // })
    if (order_id.length === 0) {
      this.setState({
        selectedVehicle: null,
        tripDate: new Date(),
        createTrip: false,
        planCode: "PLAN-",
        generatedTripCode: null,
      });
    }
    this.setState({
      selectedOrderId: order_id,
      selectedOrdersDetail: _.uniqBy(order_detail, "id"),
      generatedTripCode: null,
    });
  };
  onRouteChange = (e) => {
    let status = null;
    if (this.state.isActive === 1) {
      status = ORDER_STATUS_READY_FOR_PICKUP;
    } else if (this.state.isActive === 2) {
      status = DELIVERY_TRIPS;
    } else {
      status = ORDER_STATUS_CONFIRMED;
    }
    let route_id = e.target.value;
    let selectedRoute = parseInt(route_id);
    // if (selectedRoute === UNASSIGNED_ORDERS) {
    let getRouteOrders = [];
    let getRouteDeliveryTrip = [];
    if (status === ORDER_STATUS_READY_FOR_PICKUP) {
      if (this.state.orders.length > 0) {
        if (selectedRoute === UNASSIGNED_ORDERS) {
          getRouteOrders = _.filter(this.state.orders, (col, i) => {
            let order = col.order;
            return order.routes.length === 0;
          });
        } else if (selectedRoute === ALL_ORDERS) {
          getRouteOrders = [...this.state.orders];
        } else {
          getRouteOrders = _.filter(this.state.orders, (col, i) => {
            let order = col.order;
            return order.routes.includes(selectedRoute);
          });
        }
      }
    } else if (status === ORDER_STATUS_CONFIRMED) {
      if (selectedRoute === UNASSIGNED_ORDERS) {
        getRouteOrders = _.filter(this.state.ordersInProduction, (col, i) => {
          let order = col.order;
          return order.routes.length === 0;
        });
      } else if (selectedRoute === ALL_ORDERS) {
        getRouteOrders = [...this.state.ordersInProduction];
      } else {
        getRouteOrders = _.filter(this.state.ordersInProduction, (col, i) => {
          let order = col.order;
          return order.routes.includes(selectedRoute);
        });
      }
    } else {
      if (this.state.deliveryTrips.length > 0) {
        if (selectedRoute === UNASSIGNED_ORDERS) {
          getRouteDeliveryTrip = _.filter(
            this.state.deliveryTrips,
            (trip, i) => {
              let id = trip.route_id;
              return id.length === 0;
            }
          );
        } else if (selectedRoute === ALL_ORDERS) {
          getRouteDeliveryTrip = [...this.state.deliveryTrips];
        } else {
          getRouteDeliveryTrip = _.filter(this.state.orders, (trip, i) => {
            let id = trip.route_id;
            return id === selectedRoute;
          });
        }
      }
    }
    let getRouteOrdersInProduction;
    if (this.state.ordersInProduction.length > 0) {
      getRouteOrdersInProduction = _.filter(
        this.state.ordersInProduction,
        (col, i) => {
          let order = col.order;
          return order.routes.includes(selectedRoute);
        }
      );
    }
    let finalpath = [];
    let getGeoLocation = [];
    if (this.state.routes.length > 0) {
      getGeoLocation = _.filter(
        this.state.routes,
        (route, i) => route.route_id === selectedRoute
      );
      getGeoLocation = _.map(getGeoLocation, "geofence_locations");
      if (getGeoLocation[0]) {
        getGeoLocation[0].map((point) => {
          finalpath.push({
            lat: parseFloat(point.lat),
            lng: parseFloat(point.lng),
          });
        });
      }
    }
    let store_address = { ...this.state.defaultCenter };
    let order = {
      deliveries: [],
      store_address: { latitude: null, longitude: null },
    };
    if (typeof getRouteOrders !== "undefined" && getRouteOrders.length > 0) {
      let order = {
        deliveries: [],
        store_address: { latitude: null, longitude: null },
      };
      order.store_address.latitude = store_address.lat;
      order.store_address.longitude = store_address.lng;
      order.deliveries = [...getRouteOrders];
    }
    this.setState({
      routeOrders: {
        deliveries: getRouteOrders,
        store_address: {
          latitude: store_address.lat,
          longitude: store_address.lng,
        },
      },
      // routeOrders: order,
      routeTrips: getRouteDeliveryTrip,
      selectedRoute: selectedRoute,
      routesOrdersInProduction: getRouteOrders,
      selectedOrderId: [],
      createTrip: false,
      selectedVehicle: null,
      // selectedRoute: selectedRoute,
      // polygonPaths: finalpath,
      routeIsActive: route_id,
    });
  };

  onTripDateChange = (date) => {
    this.setState({
      tripDate: date,
      // vehicleLoading: true,
      pageloading: true,
      selectedVehicle: null,
    });
  };
  getVehicleList = (isPageLoading = false, warehouse_id = null) => {
    let tripDate = moment(this.state.tripDate).format("YYYY-MM-DD");
    this.props.getAvailableVehiclesApi(this.props.selectedBranch, tripDate);
  };

  removeDeletedRoute = (route_id) => {
    let allroutes = [...this.state.routes];
    _.remove(allroutes, { route_id: route_id });
    this.setState({
      routes: allroutes,
    });
  };
  removeGeofenceOrders = () => {
    this.getRoutesandCapacity();
  };
  ordersInProductionClick = () => {
    // if (this.state.ordersInProduction.length > 0) {
    let mapfeatures = { ...this.state.mapfeatures };
    let store_address = { ...this.state.defaultCenter };
    mapfeatures.orderType = ORDERS_IN_PRODUCTION;
    this.setState({
      isActive: 3,
      showOrdersInProduction: true,
      showOrders: false,
      showDeliveryTrip: false,
      deliveryTrips: [],
      defaultMenuText: "All Orders",
      defaultMenuText2: "Unassigned Orders",
      selectedRoute: ALL_ORDERS,
      mapfeatures: mapfeatures,
      routeOrders: {
        deliveries: this.state.ordersInProduction,
        store_address: {
          latitude: store_address.lat,
          longitude: store_address.lng,
        },
      },
    });
    // }
  };
  onPageContetRefresh = () => {
    this.setState({
      pageloading: true,
      deliveryTrips: [],
    });
    this.getRoutesandCapacity();
  };

  onOrderClick = () => {
    this.setState({
      // tripcallPending: true,
      dataTableloading: !this.state.dataTableloading,
      pageloading: false,
      // showOrders: false,
      showDeliveryTrip: false,
      showOrdersInProduction: false,
      polygonPaths: null,
      deliveryTrips: [],
    });
    this.getRoutesandCapacity();
  };
  onCreateTripClick = () => {
    this.setState({
      createTrip: true,
    });
    // this.getRoutesandCapacity()
  };
  getSelectedDeliveryTripOrder = (routeOrders) => {
    let store_address = { ...this.props.defaultCenter };
    this.setState({
      routeOrders: {
        deliveries: routeOrders,
        store_address: {
          latitude: store_address.lat,
          longitude: store_address.lng,
        },
      },
    });
  };
  onModalsLoading = (flag) => {
    this.setState({
      pageloading: flag,
    });
  };
  mapLoadError = () => {};
  render() {
    let mapComponent = (
      <Map
        language={this.props.i18n.language}
        routelist={
          this.state.routeOrders && this.state.routeOrders.deliveries
            ? this.state.routeOrders
            : []
        }
        t={this.props.t}
        getMapError={this.mapLoadError}
        selectedBranchId={this.state.selectedBranchId}
        selectedRouteId={this.state.selectedRoute}
        getDeltedRouteId={this.removeDeletedRoute}
        mapfeatures={this.state.mapfeatures}
        defaultCenter={this.props.defaultCenter}
        orderType={this.state.mapfeatures.orderType}
        getDeletedOrders={this.removeGeofenceOrders}
        polygonPaths={
          this.state.polygonPaths &&
          this.state.polygonPaths.length > 0 &&
          this.state.polygonPaths
        }
        googleMapURL={this.state.mapUrl}
        loadingElement={<div style={{ height: "77.2vh" }} />}
        containerElement={<div style={{ height: "77.2vh" }} />}
        selectedOrderId={
          this.state.selectedOrderId.length > 0
            ? this.state.selectedOrderId
            : []
        }
        sendSelectedOrderId={this.getMapSelectedOrderId}
        mapElement={<div style={{ height: "77.2vh" }} />}
      />
    );
    let t = this.props.t;
    let lang = this.props.i18n.language;
    return (
      <React.Fragment>
        <ClipLoader
          css={`
            position: fixed;
            top: 40%;
            left: 42%;
            right: 40%;
            bottom: 20%;
            // opacity: 0.5;
            z-index: 500;
          `}
          size={"200px"}
          this
          also
          works
          color={"#196633"}
          height={200}
          // margin={2}
          loading={this.state.pageloading}
        />
        <div
          className={`${this.state.pageloading ? style.loadmain : null} row`}
        >
          <CreateTripModal
            show={this.state.showTripModal}
            // reasons={this.state.cancalReasons}
            onHide={() => this.setState({ showTripModal: false })}
            // orderid={this.state.selectedOrder.order_id}
          />
          <div className={col12}>
            <div className={`row ${style.routeplanDiv} routePlanDiv`}>
              <ToastContainer
                transition={Zoom}
                position="top-center"
                // autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
              />
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="row mt-1 align-items-center">
                  <div className={`${col12}`}>
                    <div
                      className={` row ${style.routePlanNav}  align-items-center`}
                    >
                      {
                        this.state.routesEnabled && (
                          // this.state.allorders.length > 0 ? (
                          <div className="col-md-2 col-sm-2 col-xs-2 col-lg-2 pt-3 pb-3">
                            <Form.Control
                              as="select"
                              className="rounded-0"
                              onChange={this.onRouteChange}
                              value={
                                this.state.selectedRoute
                                  ? this.state.selectedRoute
                                  : ""
                              }
                            >
                              <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                                --- {this.props.t("Select Route")} ---
                              </option>
                              <option value={ALL_ORDERS}>
                                {this.props.t(this.state.defaultMenuText)}
                              </option>
                              <option value={UNASSIGNED_ORDERS}>
                                {this.props.t(this.state.defaultMenuText2)}
                              </option>
                              {this.state.routes.map((route) => (
                                <option
                                  key={route.route_id}
                                  value={route.route_id}
                                >
                                  {route.route_name}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                        )
                        // ) : null
                      }

                      {this.state.selectedBranchId ? null : (
                        <div className="col-4 offset-5">
                          <span className="text-danger">
                            {" "}
                            <Trans
                              i18nKey={"Please Select Branch To Continue"}
                            ></Trans>
                          </span>
                        </div>
                      )}
                      {this.state.selectedBranchId && (
                        <div className={`${col1} pt-3 pb-3`}>
                          <OverlayTrigger
                            key={1}
                            placement={"right"}
                            overlay={
                              <Tooltip
                                id={`tooltip-12`}
                                style={{ fontSize: "10px" }}
                              >
                                <Trans i18nKey={"Refresh Page Content"} />
                              </Tooltip>
                            }
                          >
                            <i
                              // title="Refresh Page Content"
                              className={`fa fa-refresh fa-1x setMousePointer`}
                              onClick={() => this.onPageContetRefresh()}
                            ></i>
                          </OverlayTrigger>
                        </div>
                      )}
                      <div className={`${col7} offset-2`}>
                        {this.state.selectedOrderId.length > 0 ? (
                          <div className="row">
                            {this.state.selectedOrderId.length > 0 ? (
                              <div
                                className={` ${col_md_auto} ${col_lg_auto} ${col_sm_auto} ${col_sm_auto} pt-3 pb-3`}
                              >
                                <Button
                                  className={style.buttonStyle}
                                  onClick={() => this.onCreateTripClick()}
                                >
                                  <Trans i18nKey={"Create Trip"}></Trans>
                                </Button>
                              </div>
                            ) : null}

                            {this.state.createTrip ? (
                              <React.Fragment>
                                <div className={col4}>
                                  <div className="row no-gutters">
                                    <div
                                      className={`${col4} ${style.inputShadow} pt-4`}
                                      // style={{ fontSize: '10px' }}
                                    >
                                      <Trans i18nKey={"Select Date"} />:
                                    </div>
                                    <div
                                      className={`col-md-8 col-sm-8  ${style.inputShadow} col-xs-8 col-lg-8 pt-3 pb-3`}
                                    >
                                      <DatePicker
                                        selected={this.state.tripDate}
                                        dateFormat={this.state.dateFormat}
                                        // onChange={(date) => setStartDate(date)}
                                        // customInput={<ExampleCustomInput />}
                                        // showTimeSelect={false}
                                        // title="Select Date"
                                        // currentDate={this.state.tripDate}
                                        // dateFormat={this.state.dateFormat}
                                        // minDate={new Date()}
                                        onChange={this.onTripDateChange}
                                        customInput={<CustomDatePickerInput />}
                                        className={`rounded-0 ${style.datePickerinputShadow}  textingred `}
                                      ></DatePicker>
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            ) : null}
                            {this.state.createTrip ? (
                              <div className={col4}>
                                <div className="row no-gutters">
                                  <div
                                    className={`RoutesPlan_inputShadow__5Ht1u pt-4 ${col4}`}
                                    style={{
                                      fontSize: "10px",
                                    }}
                                  >
                                    {t("Select Vehicle")}:{" "}
                                  </div>
                                  <div
                                    className={`${
                                      this.state.vehicleLoading ? col7 : col7
                                    } pt-3 pb-3`}
                                  >
                                    <Form.Control
                                      as="select"
                                      className="rounded-0"
                                      onChange={this.onVehicleChange}
                                      value={
                                        this.state.selectedVehicle
                                          ? this.state.selectedVehicle
                                          : ""
                                      }
                                    >
                                      <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                                        --- {t("Select Vehicle")}
                                        ---
                                      </option>
                                      {this.state.vehicleList.length > 0 &&
                                        this.state.vehicleList.map(
                                          (vehicle) => (
                                            <option
                                              key={vehicle.vehicle_id}
                                              value={vehicle.vehicle_id}
                                            >
                                              {`${vehicle.number_plate} - ${
                                                typeof vehicle.driver_name !==
                                                "undefined"
                                                  ? vehicle.driver_name[lang]
                                                  : null
                                              }
                                               (${vehicle.vehicle_code})`}
                                            </option>
                                          )
                                        )}
                                    </Form.Control>
                                  </div>{" "}
                                </div>
                              </div>
                            ) : null}

                            {this.state.selectedVehicle ? (
                              <div className="col-md-2 col-sm-2 col-xs-2 col-lg-2 pt-3 pb-3">
                                <Button
                                  className={style.buttonStyle}
                                  onClick={this.assignPlanRoute2}
                                >
                                  {t("Assign Vehicle")}
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        ) : this.state.generatedTripCode &&
                          !this.state.createTrip ? (
                          <b>
                            Trip {this.state.generatedTripCode} Created
                            Successfully
                          </b>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-3 mb-1 no-gutters">
                  {this.state.isChanged ? (
                    <div className={`${col5}`}>
                      <div className="row" style={{ marginLeft: "-1.8rem" }}>
                        <div className={`${col12} w-auto h-auto test`}>
                          <ClipLoader
                            css={`
                              position: fixed;
                              top: 35%;
                              left: 12%;
                              right: 40%;
                              bottom: 20%;

                              // opacity: 0.5;
                              z-index: 999999;
                            `}
                            size={200}
                            this
                            also
                            works
                            color={"#196633"}
                            loading={this.state.dataTableloading}
                          />

                          {this.state.showOrders && (
                            <BoostrapDataTable
                              sendSelectedOrderId={this.setDataTableSelectedId}
                              t={this.props.t}
                              language={this.props.i18n.language}
                              actionStatus={false}
                              rowExpansion={true}
                              rowSelection={true}
                              columns={OrderTableColumns}
                              data={
                                this.state.routeOrders
                                  ? this.state.routeOrders.deliveries
                                    ? this.state.routeOrders.deliveries
                                    : []
                                  : []
                              }
                              mapSelectedOrderId={
                                this.state.selectedOrderId.length > 0
                                  ? this.state.selectedOrderId
                                  : []
                              }
                              fromPage={"routesPlan"}
                              mapSelectedDetailOrders={
                                this.state.selectedOrdersDetail.length > 0
                                  ? this.state.selectedOrdersDetail
                                  : []
                              }
                              wrapperClasses={"routePlanBoostrapTable"}
                              dataFor="orders"
                              keyField="order_id"
                            />
                          )}
                          {this.state.showOrdersInProduction && (
                            <BoostrapDataTable
                              sendSelectedOrderId={this.setDataTableSelectedId}
                              language={this.props.i18n.language}
                              t={this.props.t}
                              actionStatus={false}
                              rowExpansion={true}
                              rowSelection={false}
                              columns={OrderTableColumns}
                              data={
                                this.state.routeOrders
                                  ? this.state.routeOrders.deliveries
                                    ? this.state.routeOrders.deliveries
                                    : []
                                  : []
                              }
                              mapSelectedOrderId={
                                this.state.selectedOrderId.length > 0
                                  ? this.state.selectedOrderId
                                  : []
                              }
                              mapSelectedDetailOrders={
                                this.state.selectedOrdersDetail.length > 0
                                  ? this.state.selectedOrdersDetail
                                  : []
                              }
                              wrapperClasses={"routePlanBoostrapTable"}
                              fromPage={"routesPlan"}
                              dataFor="orders"
                              keyField="order_id"
                            />
                          )}
                          {this.state.showDeliveryTrip && (
                            <DeliveryTripDataTable
                              t={this.props.t}
                              language={this.props.i18n.language}
                              sendSelectedOrderId={this.setDataTableSelectedId}
                              warehouse_id={this.state.selectedBranchId}
                              getRouteOrders={this.getSelectedDeliveryTripOrder}
                              isPageLoading={this.onModalsLoading}
                              rowSelection={false}
                              rowExpansion={false}
                              columns={DeliveryTripColumns}
                              data={this.state.routeTrips}
                              mapSelectedOrderId={
                                this.state.selectedOrderId.length > 0
                                  ? this.state.selectedOrderId
                                  : []
                              }
                              getCancelDeliveries={this.removeCancelDeliveries}
                              ordersdata={this.state.allorders}
                              vehiclesdata={this.state.vehicleList}
                              wrapperClasses={"routePlanBoostrapTable"}
                              dataFor="deliverytrips"
                              keyField="delivery_trip_id"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!this.state.pageloading &&
                    // this.state.allorders &&
                    this.state.mapUrl && (
                      // this.state.allorders.length > 0 && (
                      <div className={`${col7}`}>
                        {navigator.onLine ? (
                          mapComponent
                        ) : (
                          <h1 style={{ margin: "0px auto" }}>
                            No Internet Connection
                          </h1>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
            {!this.state.pageloading && (
              <div className="row mt-1 align-items-center fixed-bottom">
                <div className={col12}>
                  <div className={`row`}>
                    <div className={col6}>
                      <ul className={`nav nav-tabs ${style.routePlanTabs}`}>
                        <li className={style.navItem}>
                          <a
                            style={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            id="1"
                            onClick={(e) => this.onOrderClick(e)}
                            className={`${style.navLink} ${
                              this.state.isActive == 1 ? style.active : ""
                            } nav-link`}
                            role="button"
                          >
                            <Trans i18nKey={"Orders"} />
                          </a>
                        </li>
                        <li className={style.navItem}>
                          <a
                            onClick={(e) => this.getDeliveryTrips(e)}
                            id="2"
                            className={`${style.navLink} ${
                              this.state.isActive == 2 ? style.active : ""
                            } nav-link`}
                            role="button"
                          >
                            <Trans i18nKey={"Delivery Trips"} />
                          </a>
                        </li>
                        <li className={style.navItem}>
                          <a
                            id="3"
                            onClick={() => this.ordersInProductionClick()}
                            className={`${style.navLink} ${
                              this.state.isActive == 3 ? style.active : ""
                            } nav-link`}
                            role="button"
                          >
                            <Trans i18nKey={"Orders In Production"} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedBranch: state.navbar.selectedBranch,
    routeOrders: state.routesplan.routeOrders,
    orders: state.routesplan.orders,
    vehicleList: state.routesplan.vehicleList,
    constraints: state.routesplan.constraints,
    summaryStats: state.routesplan.summaryStats,
    apiLoaded: state.routesplan.routesPlanLoaded,
    tripList: state.live.tripList,
    defaultCenter: state.navbar.defaultCenter,
    routesAndPlanData: state.routesplan.routesAndPlanData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getrouteandplanApi: (from_date, to_date, store_id) =>
      dispatch(get_routes_and_capacity(from_date, to_date, store_id)),
    getAvailableVehiclesApi: (branchId, date) =>
      dispatch(get_available_vehciles(branchId, date)),
    getTripsApi: (currentDate, id) => dispatch(get_trips_list(currentDate, id)),
    createTripApi: (branchId, data) => dispatch(create_trip(branchId, data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomRoutesPlan);
