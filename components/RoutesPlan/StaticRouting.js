import React, { Component, PureComponent } from "react";
import {
  Form,
  Nav,
  FormGroup,
  Row,
  InputGroup,
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Link from "next/link";
// import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import Map from "../googlemap/Map";
import {
  get_routes_and_capacity,
  get_available_vehciles,
  create_trip,
  create_static_trip,
} from "../../store/actions/routesplan/actionCreator";
import { OrderTableColumns } from "../Constants/TableColumns/OrderColumns";
import { DeliveryTripColumns } from "../Constants/TableColumns/DeliveryTripColumns";
import BoostrapDataTable from "../datatable/Datatable";
import DeliveryTripDataTable from "../datatable/DeliveryTripDataTable";
import axios from "../API/Axios";
import SearchDropDown from "../UI/DropDown/RoutePlanDropDown";
import DatePicker from "react-datepicker";
import moment from "moment";
import CustomDatePickerInput from "../UI/Input/CustomDatePickerInput";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import SampleData from "../../components/SampleData/RoutesPlanData.json";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  col6,
  col5,
  col12,
  col7,
  col2,
  col3,
  col1,
  col_md_auto,
  col_lg_auto,
  col_sm_auto,
  col4,
} from "../Constants/Classes/BoostrapClassses";
import RouteSummary from "../RoutesPlan/RouteSummary";
//import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { LoadPropagateLoader } from "../Loaders/Loaders";
import style from "./RoutesPlan.module.css";
import { Trans } from "../../i18n";
import _ from "lodash";
import {
  ALL_ORDERS,
  UNASSIGNED_ORDERS,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_READY_FOR_PICKUP,
  DELIVERY_TRIPS,
} from "../Constants/Order/Constants";
import { connect } from "react-redux";
import { get_trips_list } from "../../store/actions/live/actionCreator";
import {
  CLEAR_ROUTES_PLAN,
  SUCCESS_MESSAGE,
} from "../../store/actions/actionTypes";
import cookie from "js-cookie";
import { FOR_ROUTES_PALN_PAGE_MESSAGES } from "../Constants/Other/Constants";
class StaticRoutesPlan extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      routes: [],
      vehicleRoutes: null,
      orders: [],
      allOrders: [],
      plandate: "PLAN-04/15/2020 5:51:06PM",
      listview: true,
      mapview: false,
      constraints: null,
      selectedConstraints: null,
      selectedConstraintName: { type: "", names: [] },
      selectedRoute: null,
      selectedVehicle: null,
      advancemenu: false,
      date: [new Date(), new Date()],
      plannow: false,
      planlater: false,
      startDate: new Date(),
      endDate: new Date(),
      summarystats: null,
      isActive: false,
      pageloading: true,
      routeOrders: null,
      tripcallPending: false,
      cityDefaultText: "--- Select City ---",
      routeDefaultText: "--- Select Route ---",
      areaDefaultText: "--- Select Area ---",
      selectedCity: null,
      selectedArea: null,
      mapfeatures: {
        showMarker: true,
        showRoutes: false,
        showOriginMarker: true,
        drawing: true,
        polygon: false,
        orderType: null,
        routesEnabled: false,
      },
      // routesEnabled: true,
      showOrders: true,
      showByOrder: true,
      showByRoute: false,
      showByArea: false,
      showDeliveryTrip: false,
      showOrdersInProduction: false,
      showTripModal: false,
      selectedOrderId: [],
      selectedBranchId: null,
      forDataTableSelectedId: [],
      mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${cookie.get(
        "Map_Key"
      )}&language=en}`,
      isChanged: false,
      showBackdrop: true,
      selectedOrdersDetail: [],
      generatedTripCode: null,
      AllFilter: "All Orders",
      dataTableloading: false,
      tripDate: new Date(),
      deliveryTrips: [],
      vehicleList: [],
      areaList: [],
      cityList: [],
      routeTrips: [],
    };
  }

  onChange = (date) => this.setState({ date });
  onPageContetRefresh = () => {
    this.getRoutesandCapacity();
  };
  componentDidMount() {
    let lang = this.props.i18n.language;
    this._isMounted = true;
    if (this.props.selectedBranch) {
      this.props.live.loading = true;
      this.props.getAvailableVehiclesApi(
        this.props.selectedBranch,
        moment(this.state.tripDate).format("YYYY-MM-DD")
      );
      this.getRoutesandCapacity();
    }

    // }
  }
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
        });
        // let trip_date = moment(new Date()).format("YYYY-MM-DD");
        let trip_date = "2020-09-01";
        this.props.live.loading = true;
        this.props.getTripsApi(trip_date, this.props.selectedBranch);
      }
    }
  };
  onTripDateChange = (date) => {
    this.setState({
      tripDate: date,
      // vehicleLoading: true,
      pageloading: true,
      selectedVehicle: null,
    });
  };

  onVehicleChange = (e) => {
    this.setState({
      selectedVehicle: e.target.value,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedBranch !== prevProps.selectedBranch) {
      if (this.props.selectedBranch) {
        this.props.live.loading = true;
        this.props.getAvailableVehiclesApi(
          this.props.selectedBranch,

          moment(this.state.tripDate).format("YYYY-MM-DD")
        );
      }
      this.getRoutesandCapacity();
    }
    if (this.props.routesAndPlanData !== prevProps.routesAndPlanData) {
      let lang = this.props.i18n.language;
      let data = this.props.routesAndPlanData;
      if (data) {
        let orders = data.orders;
        let routes = data.Routes;
        let cityList = data.Locations;
        let store_address = { ...this.state.defaultCenter };
        let modifiedOrders = [];
        let getAreaList = [];
        orders.map((order, key) => {
          if (parseInt(order.order_status_id) === ORDER_STATUS_CONFIRMED) {
            modifiedOrders.push({ order: order });
            getAreaList.push({
              id: order.address.area_id,
              name: order.address.area_name[lang],
            });
          }
        });
        this.setState({
          routeOrders: {
            deliveries: orders,
            store_address: {
              latitude: store_address.lat,
              longitude: store_address.lng,
            },
          },
          isActive: 1,
          orders: modifiedOrders,
          allOrders: orders,
          cityList: _.uniqBy(cityList, "location_id"),
          areaList: _.uniqBy(getAreaList, "id"),
          pageloading: false,
          routes: routes,
          showOrders: true,
          showDeliveryTrip: false,
          tripcallPending: false,
          defaultMenuText: "All Orders",
          defaultMenuText2: "Unassigned Orders",
          isChanged: true,
        });
      }
    }
    if (this.state.vehicleList !== this.props.vehicleList) {
      this.setState({
        vehicleList: this.props.vehicleList,
      });
    }
    if (this.props.tripCode) {
      if (this.props.tripCode !== prevProps.tripCode) {
        if (this.state.routeOrders && this.state.routeOrders.deliveries) {
          let selectedOrderIds = [...this.state.routeOrders.deliveries];
          4;
          console.log("CHECK ORDER IDS", selectedOrderIds);
          _.remove(selectedOrderIds, (order) =>
            this.state.selectedOrderId.includes(order.order_id)
          );
          let store_address = { ...this.state.defaultCenter };

          this.setState({
            routeOrders: {
              deliveries: selectedOrderIds,
              store_address: {
                latitude: store_address.lat,
                longitude: store_address.lng,
              },
            },
            createTrip: false,
            tripDate: new Date(),
            selectedVehicle: null,
            selectedOrderId: [],
            selectedOrdersDetail: [],
            pageloading: false,
            generatedTripCode: this.props.tripCode,
          });
        }
      }
    }
    if (this.props.toastMessages) {
      const { forPage, messageId, type, message } = this.props.toastMessages;
      if (
        forPage === FOR_ROUTES_PALN_PAGE_MESSAGES &&
        messageId !== prevProps.toastMessages.messageId
      ) {
        if (message) {
          this.showMessage(message, type);
        }
      }
    }
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
        selectedRoute: null,
        defaultMenuText: "All Trips",
        defaultMenuText2: "Unassigned Trips",
        tripcallPending: false,
        dataTableloading: false,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  onCreateTripClick = () => {
    this.setState({
      createTrip: true,
    });
  };
  getRoutesandCapacity = () => {
    let getDateRange = [...this.state.date];
    let selectedRoute = this.state.selectedRoute;
    let startDate = moment(getDateRange[0]).format("YYYY-MM-DD");
    let endDate = moment(getDateRange[1]).format("YYYY-MM-DD");
    this.setState({
      pageloading: true,
    });
    this.props.live.loading = true;
    this.props.getrouteandplanApi(
      startDate,
      endDate,
      this.props.selectedBranch
    );
  };

  renderConstraints = () => {
    return (
      this.state.constraints &&
      this.state.constraints.map((constraint) => (
        <React.Fragment key={constraint.constraint_id}>
          <Nav.Link
            className={`${style.navLink}`}
            variant="button"
            onClick={(e) => this.onConstraintClick(e, constraint)}
          >
            {constraint.constraint_type}
          </Nav.Link>
        </React.Fragment>
      ))
    );
  };

  onConstraintClick = (e, constraint) => {
    let parentElement = e.target.parentElement;
    for (let i = 0; i < parentElement.children.length; i++) {
      parentElement.children[i].classList.remove(style.active);
    }
    e.target.classList.add(style.active);
    if (constraint.constraint_type === "Advance") {
      this.setState({
        advancemenu: true,
        plannow: false,
        planlater: false,
      });
    } else {
      let type = "";
      if (constraint.multival) {
        type = "checkbox";
      } else {
        type = "radio";
      }
      let altconstraint = {
        type: type,
        // names: JSON.parse(constraint.constraint_name),
        names: constraint.constraint_name,
      };
      this.setState({
        selectedConstraintName: altconstraint,
        advancemenu: false,
        plannow: false,
      });
    }
  };
  // };
  setStartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };
  setEndDate = (date) => {
    this.setState({
      endDate: date,
    });
  };
  renderDateRangePicker = (minDate) => {
    return (
      <React.Fragment>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.setStartDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />
        <DatePicker
          selected={this.state.endDate}
          onChange={this.setEndDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minDate={this.state.endDate}
        />
      </React.Fragment>
    );
  };
  onDateTimeRangeChange = (date) => this.setState({ DateTimeRange: date });

  advanceRadioClick = (e) => {
    this.setState({
      plannow: true,
      planlater: false,
    });
  };
  planlaterRadioClick = (e) => {
    this.setState({
      plannow: false,
      planlater: true,
    });
  };
  onDateRangeChange = (date) => {
    var datearr = [date];
    this.setState({
      date: datearr,
    });
  };
  getMapSelectedOrderId = (order_id, orders_in_detail) => {
    let order_detail = orders_in_detail;
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
  assignPlanRoute2 = () => {
    let getDateRange = [...this.state.date];
    let startDate = moment(getDateRange[0]).format("YYYY-MM-DD");
    let endDate = moment(getDateRange[1]).format("YYYY-MM-DD");
    let data = {
      route_ids: this.state.selectedRoute ? [this.state.selectedRoute] : [],
      order_ids: this.state.selectedOrderId,
      area_ids: this.state.selectedArea ? [this.state.selectedArea] : [],
      date_from: this.state.selectedOrderId.length > 0 ? "" : startDate,
      date_to: this.state.selectedOrderId.length > 0 ? "" : endDate,
    };
    this.setState({
      pageloading: true,
    });
    this.props.createTripApi(this.props.selectedBranch, JSON.stringify(data));
  };
  //new
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
  showMessage = (message, type, autoClose = 2000) => {
    return toast(message, {
      type: type === SUCCESS_MESSAGE ? "success" : "error",
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === SUCCESS_MESSAGE
          ? style.toastContainerSuccess
          : style.toastContainer,
    });
  };
  handleRecurringOptions = () => {};
  //new
  onSearchClick = () => {
    console.log(this.state.date);
    let getDateRange = [...this.state.date];
    let selectedRoute = this.state.selectedRoute
      ? parseInt(this.state.selectedRoute)
      : null;
    let startDate = getDateRange[0].getTime();
    let endDate = new Date().getTime();
    if (this.state.showByOrder) {
      let orders = this.state.allOrders ? [...this.state.allOrders] : [];
      let deliveryTrips = this.state.deliveryTrips
        ? [...this.state.deliveryTrips]
        : [];
      let getfilteredOrders = _.filter(orders, (order) => {
        let order_date = new Date(order.created_at).getTime();
        if (selectedRoute) {
          return (
            order_date >= startDate &&
            order_date <= endDate &&
            order.routes.map((val) => val.includes(selectedRoute))
          );
        } else {
          return order_date >= startDate && order_date <= endDate;
        }
      });
      let getfilteredTrips = _.filter(deliveryTrips, (trip) => {
        let trip_date = new Date(trip.trip_date).getTime();
        if (selectedRoute) {
          return (
            trip_date >= startDate &&
            trip_date <= endDate &&
            trip.route_id === selectedRoute
          );
        } else {
          return trip_date >= startDate && trip_date <= endDate;
        }
      });
      if (getfilteredOrders.length > 0) {
        this.setState({
          routeOrders: { deliveries: getfilteredOrders },
        });
      } else {
        this.setState({
          routeOrders: null,
        });
      }
      if (getfilteredTrips.length > 0) {
        this.setState({
          routeTrips: getfilteredTrips,
        });
      } else {
        this.setState({
          routeTrips: null,
        });
      }
    } else if (this.state.showByRoute) {
      let selectedArea = this.state.selectedArea;
      let orders = this.state.allOrders ? [...this.state.allOrders] : [];
      let getFiltredOrders = _.filter(orders, (order) => {
        let order_date = new Date(order.created_at).getTime();

        return (
          (order_date >= startDate && order_date <= endDate) ||
          parseInt(order.address.area_id) === parseInt(selectedArea)
        );
      });
      if (getFiltredOrders.length > 0) {
        this.setState({
          routeOrders: { deliveries: getFiltredOrders },
        });
      } else {
        this.setState({
          routeOrders: null,
        });
      }
    } else {
      let selectedCity = this.state.selectedCity;
      let orders = this.state.allOrders ? [...this.state.allOrders] : [];
      let getFiltredOrders = _.filter(orders, (order) => {
        let order_date = new Date(order.created_at).getTime();

        return (
          (order_date >= startDate && order_date <= endDate) ||
          parseInt(order.address.area_id) === parseInt(selectedCity)
        );
      });
      if (getFiltredOrders.length > 0) {
        this.setState({
          routeOrders: { deliveries: getFiltredOrders },
        });
      } else {
        this.setState({
          routeOrders: null,
        });
      }
    }
  };
  removeDeletedRoute = (route_id) => {
    let allroutes = [...this.state.routes];
    _.remove(allroutes, { route_id: route_id });
    this.setState({
      routes: allroutes,
    });
  };
  onOrderClick = () => {
    this.setState({
      // tripcallPending: true,
      // dataTableloading: !this.state.dataTableloading,
      pageloading: false,
      // showOrders: false,

      showOrdersInProduction: false,
      polygonPaths: null,
      deliveryTrips: [],
    });
    this.props.live.loading = true;
    this.props.resetRoutesandPlanApi();
    this.getRoutesandCapacity();
  };
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
  mapLoadError = () => {};
  removeGeofenceOrders = () => {
    this.getRoutesandCapacity();
  };
  onRouteChange = (text, evt) => {
    let selectedRoute = evt.target.value;
    this.setState({
      routeDefaultText: text,
      selectedRoute: selectedRoute,
    });

    // let status = null;
    // if (this.state.isActive === 1) {
    //   status = ORDER_STATUS_READY_FOR_PICKUP;
    // } else if (this.state.isActive === 2) {
    //   status = DELIVERY_TRIPS;
    // } else {
    //   status = ORDER_STATUS_CONFIRMED;
    // }
    // let route_id = e;
    // let selectedRoute = parseInt(route_id);
    // // if (selectedRoute === UNASSIGNED_ORDERS) {
    // let getRouteOrders = [];
    // let getRouteDeliveryTrip = [];
    // if (status === ORDER_STATUS_READY_FOR_PICKUP) {
    //   if (this.state.orders.length > 0) {
    //     if (selectedRoute === UNASSIGNED_ORDERS) {
    //       getRouteOrders = _.filter(this.state.orders, (col, i) => {
    //         let order = col.order;
    //         return order.routes.length === 0;
    //       });
    //     } else if (selectedRoute === ALL_ORDERS) {
    //       getRouteOrders = [...this.state.orders];
    //     } else {
    //       getRouteOrders = _.filter(this.state.orders, (col, i) => {
    //         let order = col.order;
    //         return order.routes.includes(selectedRoute);
    //       });
    //     }
    //   }
    // } else if (status === ORDER_STATUS_CONFIRMED) {
    //   if (selectedRoute === UNASSIGNED_ORDERS) {
    //     getRouteOrders = _.filter(this.state.ordersInProduction, (col, i) => {
    //       let order = col.order;
    //       return order.routes.length === 0;
    //     });
    //   } else if (selectedRoute === ALL_ORDERS) {
    //     getRouteOrders = [...this.state.ordersInProduction];
    //   } else {
    //     getRouteOrders = _.filter(this.state.ordersInProduction, (col, i) => {
    //       let order = col.order;
    //       return order.routes.includes(selectedRoute);
    //     });
    //   }
    // } else {
    //   if (this.state.deliveryTrips.length > 0) {
    //     if (selectedRoute === UNASSIGNED_ORDERS) {
    //       getRouteDeliveryTrip = _.filter(
    //         this.state.deliveryTrips,
    //         (trip, i) => {
    //           let id = trip.route_id;
    //           return id.length === 0;
    //         }
    //       );
    //     } else if (selectedRoute === ALL_ORDERS) {
    //       getRouteDeliveryTrip = [...this.state.deliveryTrips];
    //     } else {
    //       getRouteDeliveryTrip = _.filter(this.state.orders, (trip, i) => {
    //         let id = trip.route_id;
    //         return id === selectedRoute;
    //       });
    //     }
    //   }
    // }
    // let getRouteOrdersInProduction;
    // if (this.state.ordersInProduction.length > 0) {
    //   getRouteOrdersInProduction = _.filter(
    //     this.state.ordersInProduction,
    //     (col, i) => {
    //       let order = col.order;
    //       return order.routes.includes(selectedRoute);
    //     }
    //   );
    // }
    // let finalpath = [];
    // let getGeoLocation = [];
    // if (this.state.routes.length > 0) {
    //   getGeoLocation = _.filter(
    //     this.state.routes,
    //     (route, i) => route.route_id === selectedRoute
    //   );
    //   getGeoLocation = _.map(getGeoLocation, "geofence_locations");
    //   if (getGeoLocation[0]) {
    //     getGeoLocation[0].map((point) => {
    //       finalpath.push({
    //         lat: parseFloat(point.lat),
    //         lng: parseFloat(point.lng),
    //       });
    //     });
    //   }
    // }
    // let store_address = { ...this.state.defaultCenter };
    // let order = {
    //   deliveries: [],
    //   store_address: { latitude: null, longitude: null },
    // };
    // if (typeof getRouteOrders !== "undefined" && getRouteOrders.length > 0) {
    //   let order = {
    //     deliveries: [],
    //     store_address: { latitude: null, longitude: null },
    //   };
    //   order.store_address.latitude = store_address.lat;
    //   order.store_address.longitude = store_address.lng;
    //   order.deliveries = [...getRouteOrders];
    // }
    // this.setState({
    //   routeOrders: {
    //     deliveries: getRouteOrders,
    //     store_address: {
    //       latitude: store_address.lat,
    //       longitude: store_address.lng,
    //     },
    //   },
    //   // routeOrders: order,
    //   routeTrips: getRouteDeliveryTrip,
    //   selectedRoute: selectedRoute,
    //   routesOrdersInProduction: getRouteOrders,
    //   selectedOrderId: [],
    //   createTrip: false,
    //   selectedVehicle: null,
    //   // selectedRoute: selectedRoute,
    //   // polygonPaths: finalpath,
    //   routeIsActive: route_id,
    // });
  };
  onCityChange = (text, evt) => {
    let selectedCity = evt.target.value;
    let getAreaList = [...this.state.areaList];
    let filteredArea = _.filter(getAreaList, ({ id }) => {
      return id === parseInt(selectedCity);
    });
    this.setState({
      areaList: filteredArea,
      cityDefaultText: text,
      selectedCity: selectedCity,
    });
  };
  onAreaChange = (text, evt) => {
    let selectedArea = evt.target.value;
    let getRouteList = [...this.state.routes];
    let filteredRoute = _.filter(getRouteList, ({ area_id }) => {
      return area_id === parseInt(selectedArea);
    });

    this.setState({
      routes: filteredRoute,
      areaDefaultText: text,
      selectedArea: selectedArea,
    });
  };
  onModalsLoading = (flag) => {
    this.setState({
      pageloading: flag,
    });
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
  render() {
    let t = this.props.t;
    let lang = this.props.i18n.language;
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
        selectedBranchId={this.props.selectedBranch}
        selectedRouteId={this.state.selectedRoute}
        getDeltedRouteId={this.removeDeletedRoute}
        mapfeatures={this.state.mapfeatures}
        defaultCenter={this.props.defaultCenter}
        orderType={this.state.mapfeatures.orderType}
        getDeletedOrders={this.removeGeofenceOrders}
        polygonPaths={null}
        googleMapURL={this.state.mapUrl}
        loadingElement={
          <div
            style={{
              height: `${
                this.state.selectedOrderId.length > 0 ? "70vh" : "71.5vh"
              }`,
            }}
          />
        }
        containerElement={
          <div
            style={{
              height: `${
                this.state.selectedOrderId.length > 0 ? "70vh" : "71.5vh"
              }`,
            }}
          />
        }
        selectedOrderId={
          this.state.selectedOrderId.length > 0
            ? this.state.selectedOrderId
            : []
        }
        sendSelectedOrderId={this.getMapSelectedOrderId}
        mapElement={
          <div
            style={{
              height: `${
                this.state.selectedOrderId.length > 0 ? "70vh" : "71.5vh"
              }`,
            }}
          />
        }
      />
    );

    return (
      <div className={`${style.routeplanDiv}`}>
        {/* <ToastContainer
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
        /> */}
        {this.state.allOrders.length == 0 ? (
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
            loading={this.state.allOrders.length == 0 ? true : false}
          />
        ) : null}
        <div
          className={`${this.state.pageloading ? style.loadmain : null} row`}
        >
          {this.state.isChanged && (
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="row mt-3 no-gutters">
                <div
                  className={`${col12} ${style.staticTopMenu} align-content-center`}
                >
                  <div className="row">
                    <div className={col3}>
                      <ButtonGroup aria-label="Basic example">
                        <Button
                          className={`${style.buttonShadow} ${
                            this.state.showByOrder
                              ? "bg-purple"
                              : "bg-light-purple"
                          } `}
                          variant=""
                          onClick={() =>
                            this.setState({
                              showByRoute: false,
                              showByArea: false,
                              showByOrder: true,
                            })
                          }
                        >
                          Order Wise
                        </Button>{" "}
                        <Button
                          className={`${style.buttonShadow} ${
                            this.state.showByArea
                              ? "bg-purple"
                              : "bg-light-purple"
                          } `}
                          variant=""
                          onClick={() =>
                            this.setState({
                              showByRoute: false,
                              showByArea: true,
                              showByOrder: false,
                            })
                          }
                        >
                          Area Wise
                        </Button>
                        <Button
                          variant=""
                          className={`${style.buttonShadow} ${
                            this.state.showByRoute
                              ? "bg-purple"
                              : "bg-light-purple"
                          } `}
                          onClick={() =>
                            this.setState({
                              showByRoute: true,
                              showByArea: false,
                              showByOrder: false,
                            })
                          }
                        >
                          Route Wise
                        </Button>
                      </ButtonGroup>
                    </div>

                    {this.state.showByRoute ||
                    this.state.showByOrder ||
                    this.state.showByArea ? (
                      <React.Fragment>
                        <div className={col2}>
                          <SearchDropDown
                            language={lang}
                            dropInfo={{
                              text: t(this.state.cityDefaultText),

                              id: "searchcity",
                              event: this.onCityChange,
                              data: this.state.cityList,
                            }}
                          />
                        </div>
                        {!this.state.showByArea && (
                          <div className={`${col2}`}>
                            <SearchDropDown
                              language={lang}
                              dropInfo={{
                                text: t(this.state.areaDefaultText),

                                id: "searcharea",
                                event: this.onAreaChange,
                                data: this.state.areaList,
                              }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ) : null}
                    {this.state.showByOrder && (
                      <div className={col2}>
                        <SearchDropDown
                          language={lang}
                          dropInfo={{
                            text: t(this.state.routeDefaultText),
                            // text1: t(this.state.defaultMenuText),
                            // text2: t(this.state.defaultMenuText2),
                            id: "searchroute",
                            event: this.onRouteChange,
                            data: this.state.routes,
                          }}
                        />
                      </div>
                    )}
                    <div className={col2}>
                      <InputGroup>
                        <DatePicker
                          className={style.inputShadow}
                          onChange={this.onDateRangeChange}
                          value={this.state.date}
                          selected={this.state.date[0]}
                          currentDate={this.state.date[0]}
                          dateFormat="MM/dd/yyyy"
                        />
                      </InputGroup>
                    </div>
                    <div className={col1}>
                      <Button
                        onClick={this.onSearchClick}
                        className={`btn btn-primary btn-xs ${style.buttonShadow}`}
                      >
                        <i
                          className="fa fa-search"
                          style={{ fontSize: "10px" }}
                        ></i>{" "}
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="col-md-7 offset-1"></div>
              </div>
              <div
                className={` row mt-1 ${style.routePlanNav}  align-items-center`}
              >
                {this.state.selectedBranchId ||
                this.props.selectedBranch ? null : (
                  <div className="col-4 offset-5">
                    <span className="text-danger">
                      <Trans
                        i18nKey={"Please Select Branch To Continue"}
                      ></Trans>
                    </span>
                  </div>
                )}
                {this.state.selectedBranchId && (
                  <div className={`${col1} pt-1 pb-1`}>
                    <OverlayTrigger
                      key={1}
                      placement={"right"}
                      overlay={
                        <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
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
                          className={`${col_md_auto} ${col_lg_auto} ${col_sm_auto} ${col_sm_auto} pt-1 pb-1`}
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
                                className={`${col4} ${style.inputShadow} pt-2`}
                              >
                                <Trans i18nKey={"Select Date"} />:
                              </div>
                              <div
                                className={`col-md-8 col-sm-8  ${style.inputShadow} col-xs-8 col-lg-8 pt-1 pb-1`}
                              >
                                <DatePicker
                                  selected={this.state.tripDate}
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
                              className={`RoutesPlan_inputShadow__5Ht1u pt-2 ${col4}`}
                              style={{
                                fontSize: "10px",
                              }}
                            >
                              {t("Select Vehicle")}:{" "}
                            </div>
                            <div
                              className={`${
                                this.state.vehicleLoading ? col7 : col7
                              } pt-1 pb-1`}
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
                                  this.state.vehicleList.map((vehicle) => (
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
                                  ))}
                              </Form.Control>
                            </div>{" "}
                          </div>
                        </div>
                      ) : null}
                      {this.state.selectedVehicle ? (
                        <div className="col-md-2 col-sm-2 col-xs-2 col-lg-2 pt-2 pb-1">
                          <Button
                            className={style.buttonStyle}
                            onClick={this.assignPlanRoute2}
                          >
                            {t("Assign Vehicle")}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="row mt-3 mb-1 no-gutters">
                {this.state.listview ? (
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
                            z-index: 999999;
                          `}
                          size={200}
                          this
                          also
                          works
                          color={"#196633"}
                          loading={
                            this.state.allOrders.length == 0 ? true : false
                          }
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
                            showInfoIcon={
                              this.state.showByArea || this.state.showByRoute
                                ? true
                                : false
                            }
                            wrapperClasses={"routePlanBoostrapTable"}
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
                        )}{" "}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className={`${this.state.listview ? col7 : col5}`}>
                  {mapComponent}
                </div>
                {this.state.listview && (
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
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    selectedBranch: state.navbar.selectedBranch,
    // apiLoaded: state.routesplan.routesPlanLoaded,
    vehicleList: state.routesplan.vehicleList,
    defaultCenter: state.navbar.defaultCenter,
    tripList: state.live.tripList,
    message: state.routesplan.message,
    tripCode: state.routesplan.tripCode,
    tripData: state.routesplan.staticTripData,
    routesAndPlanData: state.routesplan.routesAndPlanData,
    toastMessages: state.toastmessages,
    live: state.live,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getrouteandplanApi: (from_date, to_date, store_id) =>
      dispatch(get_routes_and_capacity(from_date, to_date, store_id, "static")),
    getAvailableVehiclesApi: (branchId, date) =>
      dispatch(get_available_vehciles(branchId, date)),
    getTripsApi: (currentDate, id) =>
      dispatch(get_trips_list(currentDate, id, FOR_ROUTES_PALN_PAGE_MESSAGES)),
    resetRoutesandPlanApi: () => dispatch({ type: CLEAR_ROUTES_PLAN }),
    createTripApi: (branchId, data) =>
      dispatch(
        create_static_trip(branchId, data, FOR_ROUTES_PALN_PAGE_MESSAGES)
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StaticRoutesPlan);
