import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
import { findDOMNode } from "react-dom";
import WrappedMap from "../googlemap/Map";
import $ from "jquery";
import DropDown from "../DropDown";
// import axios from 'axios'
import axios from "../API/Axios";
import { BounceLoader, ClipLoader } from "react-spinners";
import moment from "moment";
import CancelReasonsModal from "../Modal/CancelReasonsModal";
import ChangeDeliveryTimeModal from "../Modal/ChangeDeliveryTime";
import {
  LOCAL_API_URL,
  LANGUAGE_STRING,
} from "../Constants/Enviroment/Enviroment";
import {
  ORDER_DELIVERED,
  ORDER_STATUS_DELIVERED,
} from "../Constants/Order/Constants";
import { LoadFadeLoader } from "../Loaders/Loaders";
import { ToastContainer, toast, Zoom } from "react-toastify";
import _ from "lodash";
import CustomDropDown from "../UI/DropDown/DropDown";
import {
  TRIP_STATUS_NOTSTARTED,
  TRIP_STATUS_WAITING,
  TRIP_STATUS_STARTED,
  TRIP_STATUS_COMPLETED,
  TRIP_STATUS_PARTIALLY_CLOSED,
  TRIP_STATUS_CLOSED,
} from "../Constants/Trips/Constants";
import {
  ORDERS_IN_PRODUCTION,
  ORDERS_READYFORPICKUP,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_ON_HOLD,
  ORDER_STATUS_SHIPPED,
} from "../Constants/Order/Constants";
import {
  Paho,
  Client,
  Message,
  onConnect,
  onConnectionLost,
  onMessageArrived,
} from "paho-mqtt";
// import "react-toastify/dist/ReactToastify.css";
import { withRouter } from "react-router-dom";
import {
  Dropdown,
  Collapse,
  Card,
  OverlayTrigger,
  Tooltip,
  Popover,
  Form,
} from "react-bootstrap";
// import 'react-datepicker/dist/react-datepicker.css'
import {
  col2,
  col5,
  col6,
  col3,
  col7,
  col11,
  col12,
  col4,
} from "../Constants/Classes/BoostrapClassses";
import DatePicker from "../DatePicker/Simple";
import NavBar from "../NavBar/NavBar";
import style from "./Live.module.css";
import smCashonDelivery from "../../public/images/Icons_custom/codx15.png";
import mdCashonDelivery from "../../public/images/Icons_custom/codx30.png";
import smOnlinePayment from "../../public/images/Icons_custom/online_paymentx15.png";
import mdOnlinePayment from "../../public/images/Icons_custom/online_paymentx30.png";
import smReadyForPickup from "../../public/images/Icons_custom/ready_to_shipx15.png";
import smOrderCancelled from "../../public/images/Icons_custom/cancelledx15.png";
import smOrderConfirmed from "../../public/images/Icons_custom/confirmedx15.png";
import smOrderDelivered from "../../public/images/Icons_custom/deliveredx15.png";
import smOrderOnHold from "../../public/images/Icons_custom/holdx15.png";
import smOrderPlaced from "../../public/images/Icons_custom/placedx15.png";
import smOrderShipped from "../../public/images/Icons_custom/shippedx15.png";
import smDeliveryTimeMorning from "../../public/images/Icons_custom/dayx15.png";
import mdDeliveryTimeMorning from "../../public/images/Icons_custom/dayx30.png";
import smDeliveryTimeAnyTime from "../../public/images/Icons_custom/all_dayx15.png";
import mdDeliveryTimeAnyTime from "../../public/images/Icons_custom/all_dayx30.png";
import smDeliveryTimeEvening from "../../public/images/Icons_custom/nightx15.png";
import mdDeliveryTimeEvening from "../../public/images/Icons_custom/nightx30.png";
import posIcon from "../../public/images/Icons_custom/POS x15.png";
import { thresholdFreedmanDiaconis } from "d3";
import {
  PAYMENT_TYPE_CASH_ON_DELIVERY,
  PAYMENT_TYPE_POS,
  PAYMENT_TYPE_MOYASAR_CREDIT_CARD,
  PAYMENT_TYPE_MADA_CREDIT_CARD,
} from "../Constants/Payment/Payment";
import { ORDER_STATUS_READY_FOR_PICKUP } from "../Constants/Order/Constants";
import {
  DELIVERY_TYPE_ANYTIME,
  DELIVERY_TYPE_MORNING,
  DELIVERY_TYPE_EVENING,
} from "../Constants/Delivery/Delivery";
import { Trans } from "../../i18n";
import { LANG_AR, LANG_EN } from "../Constants/Language/Language";
import { connect } from "react-redux";
import {
  get_trip_deliveries,
  get_cancel_reasons,
  get_delivery_slots,
  get_trips_list,
} from "../../store/actions/live/actionCreator";
// import {Button} from 'semantic-ui-react';
class Live extends PureComponent {
  constructor(props) {
    super(props);
    this.dropDownRef = React.createRef();
    this.myRef = React.createRef();
    this.rightSideBarRef = React.createRef();
    this.state = {
      timeSlots: null,
      cancalReasons: null,
      vehicles: null,
      vehiclesdata: null,
      vehicleRoutes: null,
      vehiclesdescription: null,
      sideloading: true,
      routeloading: true,
      currentDate: new Date(),
      disableall: {},
      storeList: [],
      routesarr: null,
      currentdiv: false,
      disablebtn: false,
      allorders: null,
      open: false,
      reasonmodal: false,
      timeSlotModel: false,
      selectedOrder: null,
      selectedStoreId: null,
      dateFormat: "yyyy-MM-dd",
      mapfeatures: {
        showMarker: true,
        showRoutes: true,
        showOriginMarker: true,
      },
      orders: [],
      trips: [],
      selectedBranchId: null,
      activeTrip: null,
      selectedOrderIds: [],
      vehicleTracking: [],
      // selectedOrderCard: null,
      update: false,
      rightHeaderText: "All Orders",
      leftHeadertext: "All Trips",
      defaultCenter: null,
      pageBodyStyle: {},
      language: "",
      languageUpdate: true,
      mapUrl: null,
      renderMap: true,
    };
  }
  componentWillUnmount() {
    //  this.props.parentCallback(null, null);

    const { client } = this.state;
    if (typeof client !== "undefined") {
      if (client.isConnected()) {
        client.disconnect();
      }
    }
  }
  onMapLoadError = (status) => {
    this.setState({
      renderMap: status,
    });
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.selectedBranch !== this.state.selectedBranchId) {
      this.props.getTripsApi("2020-04-24", this.props.selectedBranch);
      this.setState({
        selectedBranchId: this.props.selectedBranch,
      });
    }
    if (this.props.deliveriesList !== prevProps.deliveriesList) {
      this.setState({
        orders: this.props.deliveriesList.deliveries,
        vehicleRoutes: this.props.deliveriesList,
        routeloading: false,

        disableall: {},
        allorders: this.props.deliveriesList,
      });
    }
    if (this.props.cancelReasonList !== prevProps.cancelReasonList) {
      this.setState({
        cancalReasons: this.props.cancelReasonList,
        selectedOrder: this.props.selectedOrder,
        routeloading: false,
        reasonmodal: true,
      });
    }
    if (this.props.deliverySlotList !== prevProps.deliverySlotList) {
      this.setState({
        timeSlots: this.props.deliverySlotList.slots,
        timeSlotModel: true,
        selectedOrder: this.props.selectedOrder,
        routeloading: false,
      });
    }
    if (this.props.language !== this.state.language) {
      this.setState({
        // mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=${this.props.language}`,

        languageUpdate: false,
        language: this.props.language,
        mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=${this.props.language}`,
      });
    }
    if (this.state.language !== prevState.language) {
      this.setState({
        mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=${this.props.language}`,
        languageUpdate: true,
      });
    }
    if (this.state.currentDate !== prevState.currentDate) {
      this.setState({
        storeList: [],
        vehicleRoutes: null,
        allorders: null,
        vehicles: null,
        activeTrip: null,
        // routeloading: ,
        disableall: {},
      });
      // this.getStoreByCurDate()
      if (this.props.selectedwarehouse_id) {
        this.getVehiclesByStoreId(
          this.props.selectedwarehouse_id,
          this.props.defaultCenter
        );
      }
      this.props.currentDateCallBack(this.state.currentDate);
    }
    if (this.props.tripList !== prevProps.tripList) {
      this.setState({
        vehicles: this.props.tripList,
        routeloading: false,
      });
    }
    // if (
    //   this.state.selectedBranchId &&
    //   parseInt(this.state.selectedBranchId) !==
    //     parseInt(prevState.selectedBranchId)
    // ) {
    //   console.log("Check this now");
    //   this.getVehiclesByStoreId(
    //     this.state.selectedBranchId,
    //     this.props.defaultCenter
    //   );
    // }
  };

  componentDidMount() {
    if (this.props.selectedBranch) {
      this.props.getTripsApi("2020-04-24", this.props.selectedBranch);
      this.setState({
        selectedBranchId: this.props.selectedBranch,
      });
    }
  }

  renderStoreList = (data) => {
    return this.state.storeList.length > 0 ? (
      <Dropdown key={data} disabled={this.state.disablebtn}>
        <Dropdown.Toggle
          id="dropdown-basic"
          className={style.upSelect}
          variant="success"
        >
          Select Store
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{
            overflowY: "scroll",
            maxHeight:
              window.innerHeight -
              (this.myRef
                ? this.myRef.getBoundingClientRect().top +
                  this.myRef.getBoundingClientRect().height +
                  100
                : 200),
          }}
        >
          {data.map((store, key) => (
            <Dropdown.Item key={store.store_id}>
              <div>
                <b
                  key={store.store_id}
                  id={store.store_id}
                  onClick={() =>
                    this.setState({ selectedStoreId: store.store_id })
                  }
                >
                  {store.store_name.en}
                </b>
                <span>
                  <i className="glyphicon glyphicon-triangle-bottom"></i>
                </span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <LoadFadeLoader height={2} size="5"></LoadFadeLoader>
    );
  };

  //get cancel reasons
  getCancelReasons = (order) => {
    this.setState({
      routeloading: true,
    });
    this.props.getCancelReasonApi(order, this.state.selectedBranchId);
    // axios
    //   .get(`storesupervisor/v1/cancelReasons`, {
    //     headers: {
    //       Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       this.setState({
    //         cancalReasons: response.data,
    //         routeloading: false,
    //         reasonmodal: true,
    //         selectedOrder: order,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     this.showMessage(error.toString(), "error", false);
    //   });
  };

  // get delivery time slots
  getDeliveryTimeSlots = (order) => {
    this.setState({
      routeloading: true,
    });
    this.props.getDeliverySlotApi(order, this.state.selectedBranchId);
    // axios
    //   .get(`storesupervisor/v1/deliverySlots`, {
    //     headers: {
    //       Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       this.setState({
    //         timeSlots: response.data.slots,
    //         timeSlotModel: true,
    //         selectedOrder: order,
    //         routeloading: false,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     this.showMessage(error.toString(), "error", false);
    //   });
  };

  getVehRoutesById = (e, dev_trip_id, veh_id) => {
    this.setState({
      activeTrip: dev_trip_id,
      routeloading: true,
    });
    this.props.getTripDeliveriesApi(dev_trip_id, this.state.selectedBranchId);
    // this.setState({
    //   vehicleTracking: [],
    //   routeloading: true,
    //   disableall: {
    //     pointerEvents: "none",
    //     opacity: "0.4",
    //   },
    //   activeTrip: dev_trip_id,
    // });
    // let veh_idss = ['111', '333']
    // const { client } = this.state;
    // if (typeof client !== "undefined") {
    //   client.disconnect();
    // }
    // this.PAHOFUNC(veh_id);
    // let formattedDate = moment(this.state.currentDate).format("YYYY-MM-DD");
    // axios
    //   .get(`storesupervisor/v1/${formattedDate}/${dev_trip_id}/deliveries`, {
    //     headers: {
    //       Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       let data = response.data;

    //       if (response.message) {
    //         this.showMessage(response.message, "error");
    //       }
    //       if (data.deliveries.length > 0) {
    //         this.setState({
    //           orders: data.deliveries,
    //           vehicleRoutes: data,
    //           routeloading: false,
    //           disableall: {},
    //           allorders: data,
    //         });

    //         this.showMessage(
    //           this.props.t("Vehicle Route Mapping Successfully"),
    //           "success"
    //         );
    //       } else {
    //         this.setState({
    //           orders: data.deliveries,
    //           vehicleRoutes: data,
    //           // vehicleRoutes: data,
    //           routeloading: false,
    //           disableall: {},
    //           allorders: data,
    //         });
    //         this.showMessage(this.props.t("No Record Found"), "error");
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     this.showMessage(error.toString(), "error", false);
    //     this.setState({
    //       routeloading: false,
    //       disableall: {},
    //     });
    //   });
  };

  getVehiclesByStoreId = (id, center = null) => {
    this.setState({
      vehicles: null,
      allorders: null,
      disablebtn: true,
      activeTrip: null,
    });

    // let formattedDate = moment(this.state.currentDate).format("YYYY-MM-DD");
    // getTripsApi(formattedDate,id)
    // axios
    //   .get(`storesupervisor/v1/${formattedDate}/${id}/vehicles`, {
    //     headers: {
    //       Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       let data = response.data;
    //       if (response.message) {
    //         this.showMessage(response.message, "error");
    //       }
    //       if (data.length > 0) {
    //         this.showMessage(
    //           this.props.t("Vehicle Listed Successfully"),
    //           "success"
    //         );
    //         this.setState({
    //           trips: data,
    //           vehicles: data,
    //           disablebtn: false,
    //           routeloading: false,
    //           defaultCenter: center,
    //           pageBodyStyle: {},
    //         });
    //       } else {
    //         this.showMessage(this.props.t("No Record Found"), "error");
    //         this.setState({
    //           disablebtn: false,
    //           routeloading: false,
    //         });
    //       }
    //     }
    // })
    // .catch((error) => {
    //   this.showMessage(error.toString(), "error", false);
    // });
  };

  renderProductPopUp = (items, order, key) => {
    let lang = this.props.i18n.language;
    let t = this.props.t;
    return (
      <Popover
        id="productpopover-basic"
        className={`${style.PopOverText}  row`}
      >
        <Popover.Title as="h5" className="bg-light-purple text-center">
          <Trans i18nKey={"Order Information"} />
        </Popover.Title>
        <Popover.Content
          key={key}
          className={col12}
          className={style.tripPopUp}
        >
          <div dir={lang === LANG_AR ? "rtl" : "ltr"}>
            <div>
              <span className="font-weight-bold">{t("Order code")}: </span>
              <span className="">{order.order_number} </span>
            </div>
            <div>
              <span className="font-weight-bold">{t("Order Date")}: </span>
              <span>{order.created_at}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Delivery Time")}:{" "}
              </span>
              <span>{order.delivery_slot[lang]}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Total Quantity")}:{" "}
              </span>
              <span>{this.calulateTotalQuantity(items)}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Total Amount")}:{" "}
              </span>
              <span>{order.grand_total}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Order Status")}:{" "}
              </span>
              <span>{order.order_status[lang]}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">{t("Area Name")}: </span>
              {/* <span>{order.address.area_name[lang]}</span> */}
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Address Detail")}:{" "}
              </span>
              <span>{order.address.address_detail}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Customer Name")}:{" "}
              </span>
              <span>{order.customer.name}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Customer Mobile")}:{" "}
              </span>
              <span>{order.customer.phone}</span>
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Payment Method")}:{" "}
              </span>
              {/* <span>{order.payment_method[lang]}</span> */}
            </div>
            <div>
              <span className="font-weight-bold pr-1">
                {t("Order Products")}:{" "}
              </span>
              {items.map((item, key) => (
                <div key={key}>
                  <span>
                    {item.product_name[lang]} {lang === LANG_EN && " x"}
                  </span>
                  {/* {lang === LANG_EN && <strong> x </strong>} */}
                  {lang === LANG_AR && <strong dir={"rtl"}> x </strong>}
                  <span>
                    {item.quantity}{" "}
                    {parseInt(item.foc) !== 0 && item.foc !== "NULL"
                      ? ` + ${item.foc}`
                      : ""}
                  </span>
                  {/* {lang === LANG_AR && <strong> x </strong>} */}
                </div>
              ))}
            </div>
            <div className="text-center">
              {order.payment_method_key === PAYMENT_TYPE_CASH_ON_DELIVERY && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`pcod`} style={{ fontSize: "10px" }}>
                      {t("Cash On Delivery")}
                    </Tooltip>
                  }
                >
                  <img src={smCashonDelivery}></img>
                </OverlayTrigger>
              )}{" "}
              {order.payment_method_key === PAYMENT_TYPE_POS && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`ponp`} style={{ fontSize: "10px" }}>
                      {t("POS")}
                    </Tooltip>
                  }
                >
                  <img src={posIcon}></img>
                </OverlayTrigger>
              )}{" "}
              {order.payment_method_key === PAYMENT_TYPE_MADA_CREDIT_CARD ||
                (order.payment_method_key ===
                  PAYMENT_TYPE_MOYASAR_CREDIT_CARD && (
                  <OverlayTrigger
                    // key={1}
                    placement={"top"}
                    overlay={
                      <Tooltip id={``} style={{ fontSize: "10px" }}>
                        {t("Online Payment")}
                      </Tooltip>
                    }
                  >
                    <img src={smOnlinePayment}></img>
                  </OverlayTrigger>
                ))}{" "}
              {parseInt(order.order_status_id) ===
                ORDER_STATUS_READY_FOR_PICKUP && (
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip
                      id={`pReadyForPickup`}
                      style={{ fontSize: "10px" }}
                    >
                      {t("Ready For Pickup")}
                    </Tooltip>
                  }
                >
                  <img src={smReadyForPickup}></img>
                </OverlayTrigger>
              )}{" "}
              {parseInt(order.order_status_id) === ORDER_STATUS_CANCELLED && (
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip id={`pCancelled`} style={{ fontSize: "10px" }}>
                      {t("Cancelled")}
                    </Tooltip>
                  }
                >
                  <img src={smOrderCancelled}></img>
                </OverlayTrigger>
              )}{" "}
              {parseInt(order.order_status_id) === ORDER_STATUS_CONFIRMED && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={"pconfirmed"} style={{ fontSize: "10px" }}>
                      {t("Confirmed")}
                    </Tooltip>
                  }
                >
                  <img src={smOrderConfirmed}></img>
                </OverlayTrigger>
              )}{" "}
              {parseInt(order.order_status_id) === ORDER_STATUS_DELIVERED && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`pdelivered`} style={{ fontSize: "10px" }}>
                      {t("Delivered")}
                    </Tooltip>
                  }
                >
                  <img src={smOrderDelivered}></img>
                </OverlayTrigger>
              )}{" "}
              {parseInt(order.order_status_id) === ORDER_STATUS_ON_HOLD && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`ponhold`} style={{ fontSize: "10px" }}>
                      {t("On Hold")}
                    </Tooltip>
                  }
                >
                  <img src={smOrderOnHold}></img>
                </OverlayTrigger>
              )}{" "}
              {parseInt(order.order_status_id) === ORDER_STATUS_SHIPPED && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`pshipped`} style={{ fontSize: "10px" }}>
                      {t("Shipped")}
                    </Tooltip>
                  }
                >
                  <img src={smOrderShipped}></img>
                </OverlayTrigger>
              )}{" "}
              {order.delivery_slot_id === DELIVERY_TYPE_MORNING && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`pmorning`} style={{ fontSize: "10px" }}>
                      {t("Morning")}
                    </Tooltip>
                  }
                >
                  <img src={smDeliveryTimeMorning}></img>
                </OverlayTrigger>
              )}{" "}
              {order.delivery_slot_id === DELIVERY_TYPE_EVENING && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`pevening`} style={{ fontSize: "10px" }}>
                      {t("Evening")}
                    </Tooltip>
                  }
                >
                  <img src={smDeliveryTimeEvening}></img>
                </OverlayTrigger>
              )}{" "}
              {order.delivery_slot_id === DELIVERY_TYPE_ANYTIME && (
                <OverlayTrigger
                  // key={1}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`panytime`} style={{ fontSize: "10px" }}>
                      {t("Anytime")}
                    </Tooltip>
                  }
                >
                  <img src={smDeliveryTimeAnyTime}></img>
                </OverlayTrigger>
              )}{" "}
            </div>
          </div>
        </Popover.Content>
      </Popover>
    );
  };
  renderTripPopUp = (tripdata, key) => {
    let lang = this.props.i18n.language;
    // console.log("CHECK LANG", lang);
    return (
      <Popover id="trippopup-basic" className={`${style.PopOverText}  row`}>
        <Popover.Title as="h5" className="text-center bg-light-purple">
          <Trans i18nKey={"Trip Information"} />
        </Popover.Title>
        <Popover.Content
          dir={this.props.language === LANG_AR ? "rtl" : "ltr"}
          key={key}
          className={col12}
          className={`${style.tripPopUp}`}
        >
          <div>
            <span className="text-left font-weight-bold">
              <Trans i18nKey={"Trip Status"} />:{" "}
            </span>
            {tripdata.trip_status ? tripdata.trip_status[lang] : null}
          </div>
          <div>
            <span className="text-left font-weight-bold">
              <Trans i18nKey={"Total Orders"} />:{" "}
            </span>{" "}
            {tripdata.no_of_orders}
          </div>
          <div>
            <span className="text-left font-weight-bold">
              <Trans i18nKey={"Driver Name"} />:{" "}
            </span>{" "}
            {tripdata.driver.name[lang]}
          </div>
          <div>
            <span className="text-left font-weight-bold">
              {" "}
              <Trans i18nKey={"Plate No"} />:{" "}
            </span>
            {tripdata.vehicle_plate_number}{" "}
          </div>

          <div>
            <span className="text-left font-weight-bold">
              <Trans i18nKey={"Vehicle Code"} />:{" "}
            </span>{" "}
            {tripdata.vehicle_code}
          </div>
          {tripdata.route_name && (
            <div>
              {" "}
              <span className="text-left font-weight-bold">
                <Trans i18nKey={"Route Name"} />:{" "}
              </span>{" "}
              {tripdata.route_name}
            </div>
          )}
          {/* <div>Delivery Status: test </div> */}
        </Popover.Content>
        {/* ))} */}
      </Popover>
    );
  };
  setActiveClass = (e) => {};
  handleDateChange = (date) => {
    this.setState({
      currentDate: date,
    });
  };
  renderNavBar = () => {
    return (
      <div className="row">
        <NavBar storeList={this.state.storeList}></NavBar>
      </div>
    );
  };

  renderLeftSideBar = () => {
    return (
      <div className={`${col2} ${style.sideBar}`}>
        {this.state.vehicles && (
          <ToastContainer
            position="top-center"
            transition={Zoom}
            // autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        )}
        <div className={`row mb-1`}>
          {/* <div className={`${col11} mb-1`}> */}
          <DatePicker
            showTimeSelect={false}
            title="Select Date"
            currentDate={this.state.currentDate}
            dateFormat={this.state.dateFormat}
            onChange={this.handleDateChange}
            className={col12}
          ></DatePicker>
          {/* </div> */}
        </div>
        <div className="row">
          <div
            className={`${col12} text-center text-light  bg-purple shadow p-3 mb-1  `}
          >
            <CustomDropDown
              {...this.props}
              dpFor="alltrips"
              text={
                <Trans
                  key={"alltripsmain"}
                  i18nKey={this.state.leftHeadertext}
                />
              }
              menudata={[
                {
                  text: <Trans key={"alltrips"} i18nKey={"All Trips"} />,
                  id: "alltrips",
                  event: this.onAllTripClick,
                },
                {
                  text: (
                    <Trans key={"startedtrips"} i18nKey={"Started Trips"} />
                  ),
                  id: "startedtrips",
                  event: this.OnStartedTripClick,
                },
                {
                  text: (
                    <Trans
                      key={"notstartedtrips"}
                      i18nKey={"Not Started Trips"}
                    />
                  ),
                  id: "notstartedtrips",
                  event: this.onNotStartedClick,
                },
                // {
                //    text: (
                //       <Trans
                //          key={'completedstartedtrips'}
                //          i18nKey={'Completed Trips'}
                //       />
                //    ),
                //    id: 'completedstartedtrips',
                //    event: this.OnCompletedTripClick,
                // },
                {
                  text: (
                    <Trans
                      key={"partiallclosedTrips"}
                      i18nKey={"Partially Closed Trips"}
                    />
                  ),
                  id: "paritallyclosedtrips",
                  event: this.OnPartiallyClosedTripClick,
                },
                {
                  text: <Trans key={"closed"} i18nKey={"Closed Trips"} />,
                  id: "closedtrip",
                  event: this.OnClosedTripClick,
                },
              ]}
            />
          </div>
        </div>
        <div className="row">{this.renderVehicles()}</div>
      </div>
    );
  };

  renderVehicles = () => {
    let lang = this.props.i18n.language;
    return (
      <div className={`card-main-content  ${col12} ${style.leftSideBar}`}>
        {this.state.vehicles && this.state.vehicles.length > 0 ? (
          this.state.vehicles.map((data, key) => {
            console.log("Check Data", data.driver.name[lang]);
            return (
              <div
                style={this.state.disableall}
                key={data.delivery_trip_id}
                id={data.vehicle_id + data.driver.user_id}
                className="pb-2 card-div row"
              >
                <Card
                  dir={this.props.language === LANG_AR ? "rtl" : "ltr"}
                  className={` ${
                    data.delivery_trip_id === this.state.activeTrip
                      ? `border-purple text-dark`
                      : "border-light-purple text-dark"
                  } text-center  small ${col12} ${style.card}`}
                >
                  <div
                    className={` ${
                      data.delivery_trip_id === this.state.activeTrip
                        ? `bg-purple`
                        : `bg-light-purple`
                    } custom-card-header text-light font-weight-bold`}
                  >
                    <Trans i18nKey={"Trip Code"} />: {data.trip_code}
                  </div>
                  <div
                    onClick={
                      Array.isArray(data.delivery_trip_id) &&
                      data.delivery_trip_id.length > 1
                        ? null
                        : (e) =>
                            this.getVehRoutesById(
                              e,
                              data.delivery_trip_id,
                              data.vehicle_id
                            )
                    }
                  >
                    <div>
                      <span className="font-weight-bold pr-1">
                        <Trans i18nKey={"Driver Name"} />:
                      </span>
                      <span>{data.driver.name[lang]}</span>
                    </div>
                    <div>
                      <span className="font-weight-bold pr-1">
                        <Trans i18nKey={"Plate No"} />:
                      </span>
                      <span>{data.vehicle_plate_number}</span>
                    </div>
                    <div>
                      <span className="font-weight-bold pr-1">
                        <Trans i18nKey={"Trip Status"} />:
                      </span>
                      <span>
                        {data.trip_status ? data.trip_status[lang] : null}
                      </span>
                    </div>
                    {Array.isArray(data.delivery_trip_id) &&
                    data.delivery_trip_id.length > 1
                      ? data.delivery_trip_id
                          .filter(
                            (item, index) =>
                              data.delivery_trip_id.indexOf(item) === index
                          )
                          .map((value, key) => (
                            <div>
                              <button
                                onClick={(e) =>
                                  this.getVehRoutesById(
                                    e,
                                    data.delivery_trip_id,
                                    data.vehicle_id
                                  )
                                }
                              >
                                Route {key + 1}
                              </button>{" "}
                            </div>
                          ))
                      : null}
                  </div>
                  <div>
                    <OverlayTrigger
                      key={"tripoverlay"}
                      trigger="click"
                      placement="right"
                      rootClose={true}
                      overlay={this.renderTripPopUp(data)}
                    >
                      <i className="fa fa-info-circle text-success"></i>
                    </OverlayTrigger>
                  </div>
                </Card>
              </div>
            );
          })
        ) : this.state.trips.length > 0 ? (
          <div className="text-center text-light bg-brown shadow p-3 mb-1 col-md-12 col-md-12">
            <Trans i18nKey={"No Record Found"} />
          </div>
        ) : (
          <LoadFadeLoader />
        )}
      </div>
    );
  };

  hideChangeDeliveryModal = (data) => {
    this.setState({ timeSlotModel: false });
  };

  changeSelectedDeliverySlotId = (order_id, slotid) => {
    let allorders = JSON.parse(JSON.stringify(this.state.allorders.deliveries));
    let selectedorderIndex = allorders.findIndex(
      (order) => order.order_id === order_id
    );
  };
  getMapSelectedOrderId = (order_ids) => {
    // this.rightSideBarRef.current.scrollIntoView({ behavior: 'smooth' })
    if (order_ids.length > 0) {
      order_ids.map((order_id) => {
        if (this[`${order_id}_ref`].current) {
          this[`${order_id}_ref`].current.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
      this.setState({
        // selectedOrderCard: order_ids,
        selectedOrderIds: order_ids,
        update: !this.state.update,
      });
    } else {
      var getSelectedCard = document.querySelector(style.orderCardActive);

      this.setState({
        // selectedOrderCard: [],
        selectedOrderIds: [],
        update: !this.state.update,
      });
    }
  };
  renderMainContent = () => {
    return (
      <div className={col7}>
        <div style={{ width: "auto", height: "auto" }} className="mt-3">
          {this.state.cancalReasons && this.state.selectedOrder && (
            <CancelReasonsModal
              t={this.props.t}
              language={this.props.language}
              show={this.state.reasonmodal}
              selectedstore={this.state.selectedBranchId}
              reasons={this.state.cancalReasons}
              onHide={() => this.setState({ reasonmodal: false })}
              orderid={this.state.selectedOrder.order_id}
            ></CancelReasonsModal>
          )}
          {this.state.timeSlots && this.state.selectedOrder && (
            <ChangeDeliveryTimeModal
              t={this.props.t}
              language={this.props.language}
              show={this.state.timeSlotModel}
              timeslots={this.state.timeSlots}
              selectedstore={this.state.selectedBranchId}
              onHide={this.hideChangeDeliveryModal}
              changedeliveryslotid={this.changeSelectedDeliverySlotId}
              currenttimeslot={this.state.selectedOrder.delivery_slot_id}
              orderid={this.state.selectedOrder.order_id}
            ></ChangeDeliveryTimeModal>
          )}
          {/* { 
         //  navigator.onLine &&
         //  this.state.languageUpdate &&
         //  this.state.mapUrl ? (*/}
          <WrappedMap
            routelist={
              this.state.vehicleRoutes ? this.state.vehicleRoutes : null
            }
            getMapError={this.onMapLoadError}
            t={this.props.t}
            vehicleTrackingData={this.state.vehicleTracking}
            defaultCenter={this.props.defaultCenter}
            sendSelectedOrderId={this.getMapSelectedOrderId}
            selectedOrderId={this.state.selectedOrderIds}
            mapfeatures={this.state.mapfeatures}
            language={this.state.language}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=en}`}
            loadingElement={<div style={{ height: "86vh" }} />}
            containerElement={<div style={{ height: "86vh" }} />}
            mapElement={<div style={{ height: "86vh" }} />}
          />
          {/* //  ) : (
         //    <h1 style={{ margin: "25%" }}>No Internet Connection</h1>
         //  )} */}
        </div>
      </div>
    );
  };
  calulateTotalQuantity = (items) => {
    let sum = 0;
    items.map(({ quantity }) => (sum += parseInt(quantity)));
    return sum;
  };
  renderCancelButton = (order) => {
    return (
      // <button
      //    className="btn-danger btn-xs"
      //    data-toggle="tooltip"
      //    data-placement="top"
      //    title="Cancel Order"
      //   }
      // >
      <i
        className="fa fa-remove text-danger fa-1x col-4"
        onClick={() => this.getCancelReasons(order)}
      ></i>
      // </button>
    );
  };
  onAllOrderClick = () => {
    let allorder = [...this.state.orders];
    this.setState({
      allorders: { deliveries: allorder },
      rightHeaderText: "All Orders",
    });
  };
  onPendingOrderClick = () => {
    let allorders = [...this.state.orders];
    let pendingorders = _.filter(allorders, (order) => {
      let status_id = order.order_status_id;
      return (
        status_id !== ORDER_STATUS_DELIVERED &&
        status_id !== ORDER_STATUS_CANCELLED &&
        status_id !== ORDER_STATUS_ON_HOLD
      );
    });
    this.setState({
      allorders: { deliveries: pendingorders },
      rightHeaderText: "Pending Orders",
    });
  };
  onDeliveredOrderClick = () => {
    let allorders = [...this.state.orders];
    let deliveredorders = _.filter(allorders, (order) => {
      return parseInt(order.order_status_id) === ORDER_STATUS_DELIVERED;
    });

    this.setState({
      allorders: { deliveries: deliveredorders },
      rightHeaderText: "Delivered Orders",
    });
  };
  onCancelOrderClick = () => {
    let allorders = [...this.state.orders];
    let cancelledorders = _.filter(allorders, (order) => {
      let status_id = order.order_status_id;
      return (
        status_id === ORDER_STATUS_CANCELLED ||
        status_id === ORDER_STATUS_ON_HOLD
      );
    });

    this.setState({
      allorders: { deliveries: cancelledorders },
      rightHeaderText: "Cancelled Orders",
    });
  };

  onAllTripClick = () => {
    let alltrips = [...this.state.trips];
    this.setState({
      vehicles: alltrips,
      leftHeadertext: "All Trips",
    });
  };
  OnStartedTripClick = () => {
    let alltrips = [...this.state.trips];
    let startedtrips = _.filter(alltrips, (trip, i) => {
      return trip.trip_status_key === TRIP_STATUS_STARTED;
    });
    this.setState({
      vehicles: startedtrips,
      leftHeadertext: "Started Trips",
    });
  };
  onNotStartedClick = () => {
    let alltrips = [...this.state.trips];
    let notstartedtrips = _.filter(alltrips, (trip, i) => {
      return trip.trip_status_key === TRIP_STATUS_NOTSTARTED;
    });
    this.setState({
      vehicles: notstartedtrips,
      leftHeadertext: "Not Started Trips",
    });
  };
  OnCompletedTripClick = () => {
    let alltrips = [...this.state.trips];
    let completedtrips = _.filter(alltrips, (trip, i) => {
      return trip.trip_status_key === TRIP_STATUS_COMPLETED;
    });
    this.setState({
      vehicles: completedtrips,
      leftHeadertext: "Completed Trips",
    });
  };

  OnPartiallyClosedTripClick = () => {
    let alltrips = [...this.state.trips];
    let completedtrips = _.filter(alltrips, (trip, i) => {
      return trip.trip_status_key === TRIP_STATUS_PARTIALLY_CLOSED;
    });
    this.setState({
      vehicles: completedtrips,
      leftHeadertext: "Partially Closed Trips",
    });
  };
  OnClosedTripClick = () => {
    let alltrips = [...this.state.trips];
    let completedtrips = _.filter(alltrips, (trip, i) => {
      return trip.trip_status_key === TRIP_STATUS_CLOSED;
    });
    this.setState({
      vehicles: completedtrips,
      leftHeadertext: "Closed Trips",
    });
  };
  onOrderCardClick = (order) => {
    let selectedOrderIds = [...this.state.selectedOrderIds];
    if (order) {
      if (order.order_id) {
        if (!selectedOrderIds.includes(order.order_id)) {
          selectedOrderIds.push(order.order_id);
        } else {
          _.remove(selectedOrderIds, (item) => item == order.order_id);
        }

        this.setState({
          selectedOrderIds: selectedOrderIds,
          // selectedOrderCard: selectedOrderId,
          update: !this.state.update,
        });
      }
    }
  };
  renderRightSideBar = () => {
    let lang = this.props.i18n.language;
    let t = this.props.t;
    this.state.allorders &&
      this.state.allorders.deliveries.length > 0 &&
      this.state.allorders.deliveries.map((order, key) => {
        this[`${order.order_id}_ref`] = React.createRef();
      });
    return (
      <div className={`${col3} ${style.sideBar}`}>
        <div className="row"></div>
        <div className="row">
          <div className="text-center text-light bg-purple shadow p-3 mb-1 col-md-12 col-md-12">
            <CustomDropDown
              {...this.props}
              dpFor={"allorders"}
              text={
                <Trans
                  key={"allordersmain"}
                  i18nKey={this.state.rightHeaderText}
                />
              }
              menudata={[
                {
                  text: (
                    <Trans key={"allorders"} i18nKey={"All Orders"}></Trans>
                  ),
                  id: "allorders",
                  event: this.onAllOrderClick,
                },
                {
                  text: (
                    <Trans
                      key={"pendingorders"}
                      i18nKey={"Pending Orders"}
                    ></Trans>
                  ),
                  id: "pendingorders",
                  event: this.onPendingOrderClick,
                },
                {
                  text: (
                    <Trans
                      key={"deliveredorders"}
                      i18nKey={"Delivered Orders"}
                    ></Trans>
                  ),
                  id: "deliveredorders",
                  event: this.onDeliveredOrderClick,
                },
                {
                  text: (
                    <Trans
                      key={"cancelledorders"}
                      i18nKey={"Cancelled Orders"}
                    ></Trans>
                  ),
                  id: "cancelledorders",
                  event: this.onCancelOrderClick,
                },
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div
            className={`main-content col-md-12 col-md-12 ${style.rightSideBarScroll}`}
          >
            {this.state.allorders &&
            this.state.allorders.deliveries.length > 0 ? (
              this.state.allorders.deliveries.map((order, key) => (
                <div
                  ref={this[`${order.order_id}_ref`]}
                  className={
                    key === this.state.allorders.deliveries.length - 1
                      ? "testrefekjekfj"
                      : null
                  }
                  key={order.order_id}
                >
                  <Card
                    className={`text-center text-dark small  mb-1 ${
                      style.card
                    }  ${
                      this.state.selectedOrderIds &&
                      this.state.selectedOrderIds.includes(order.order_id)
                        ? style.orderCardActive
                        : ""
                    }`}
                  >
                    <div
                      className={`${
                        this.state.selectedOrderIds &&
                        this.state.selectedOrderIds.includes(order.order_id)
                          ? "bg-purple"
                          : "bg-light-purple"
                      } text-light font-weight-bold`}
                    >
                      <div className="row p-1">
                        <div className="text-left col">
                          {order.order_number}
                        </div>
                        <div className="text-right col">
                          {moment(order.created_at).format(
                            "DD-MM-YYYY HH:mm:ss"
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => this.onOrderCardClick(order)}
                      dir={this.props.language === LANG_AR ? "rtl" : "ltr"}
                    >
                      <div>
                        <span className="font-weight-bold pr-1">
                          {t("Delivery Time")}:{" "}
                        </span>
                        <span>{order.delivery_slot[lang]}</span>
                      </div>
                      <div>
                        <span className="font-weight-bold pr-1">
                          {t("Total Quantity")}:{" "}
                        </span>
                        <span>{this.calulateTotalQuantity(order.items)}</span>
                      </div>
                      <div>
                        <span className="font-weight-bold pr-1">
                          {t("Total Amount")}:{" "}
                        </span>
                        <span>{order.grand_total}</span>
                      </div>
                      <div>
                        <span className="font-weight-bold pr-1">
                          {t("Order Status")}:{" "}
                        </span>
                        <span>{order.order_status[lang]}</span>
                      </div>
                      <div>
                        <span className="font-weight-bold pr-1">
                          {t("Area Name")}:{" "}
                        </span>
                        <span>
                          {order.address.area_name !== "undefined"
                            ? order.address.area_name[lang]
                            : null}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="offset-3 col-6"
                        style={{ fontSize: "14px" }}
                      >
                        <div className="row">
                          <OverlayTrigger
                            key={"productoverlay"}
                            trigger="click"
                            placement={"left"}
                            rootClose={true}
                            overlay={this.renderProductPopUp(
                              order.items,
                              order
                            )}
                          >
                            <i
                              className={`fa fa-info-circle text-success ${
                                parseInt(order.order_status_id) !==
                                ORDER_STATUS_DELIVERED
                                  ? col4
                                  : col12
                              }`}
                            ></i>
                          </OverlayTrigger>
                          {parseInt(order.order_status_id) !==
                          ORDER_STATUS_DELIVERED ? (
                            <React.Fragment>
                              {this.renderCancelButton(order)}
                              <i
                                className="fa fa-edit text-primary fa-1x col-4"
                                onClick={() => this.getDeliveryTimeSlots(order)}
                              ></i>
                            </React.Fragment>
                          ) : null}{" "}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : this.state.orders.length > 0 ? (
              <div className="text-center text-light bg-brown shadow p-3 mb-1 col-md-12 col-md-12">
                <Trans i18nKey={"No Record Found"} />
              </div>
            ) : (
              <LoadFadeLoader />
            )}
          </div>
        </div>
      </div>
    );
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success" ? style.toastContainerSuccess : style.toastContainer,
    });
  PAHOFUNC = (vehicle_id) => {
    let client = new Client(
      "gbhcdemosys.com",
      Number(15676),
      "/ws",
      "mqttjs_" + Math.random().toString(16).substr(2, 8)
    );
    // set callback handlers
    client.connect({
      onSuccess: () => {
        this.setState({
          client,
        });
        client.subscribe(vehicle_id.toString());
      },
      userName: "admin_aseel",
      password: "AlAseel!@#",
      mqttVersion: 4,
      useSSL: true,
      cleanSession: true,
      onFailure: (message) => {
        console.log("Error:", message);
      },
      keepAliveInterval: 60,
      reconnect: true, // Enable automatic reconnect
      timeout: 15000,
    });
    client.onConnectionLost = (responseObject) => {
      this.setState({
        pageloading: false,
        chartUpdate: !this.state.chartUpdate,
      });
      if (responseObject.errorCode !== 0) {
        console.log("Ws Connection Lost Error:" + responseObject.errorMessage);
      }
    };
    client.onMessageArrived = (message) => {
      let source = message.destinationName;
      let messageString = message.payloadString;
      this.setState({ pageloading: false });
      if (vehicle_id.toString() === source.toString()) {
        let trackingData = [...this.state.vehicleTracking];

        let filterMessage = messageString.split(",");
        let vehilceLatLng = {
          lat: parseFloat(filterMessage[0]),
          lng: parseFloat(filterMessage[1]),
        };

        // if (vehicle_id.includes(source)) {
        const isExist = _.find(trackingData, ({ vehicle_id }) => {
          return vehicle_id === source;
        });

        let liveVehicles = [...this.state.vehicles];
        let filteredVehicle = null;
        filteredVehicle = _.find(liveVehicles, (vehicle) => {
          let veh_id = vehicle.vehicle_id;
          return parseInt(veh_id) === parseInt(source);
        });

        let vehObj = {
          vehicle_id: null,
          polyLinePath: [],
          vehiclePath: null,
          vehicleCode: null,
          plateNo: null,
          vehicleCategory: null,
          driverName: null,
          driverErpId: null,
          tripCounter: null,
        };
        vehObj.vehicle_id = source;
        vehObj.vehiclePath = vehilceLatLng;
        vehObj.vehicleCode = filteredVehicle.vehicle_code;
        vehObj.plateNo = filteredVehicle.vehicle_plate_number;
        vehObj.vehicleCategory = filteredVehicle.vehicle_category;
        vehObj.driverName = filteredVehicle.driver.name;
        vehObj.driverErpId = filteredVehicle.driver.driver_erp_id;
        vehObj.tripCounter = filteredVehicle.trips;

        vehObj.polyLinePath.push(vehilceLatLng);
        if (typeof isExist === "undefined") {
          if (filterMessage.length > 0) {
            trackingData.push(vehObj);
            this.setState({
              vehicleTracking: trackingData,
              chartUpdate: !this.state.chartUpdate,
            });
          }
        } else {
          trackingData.map(({ vehicle_id }, key) => {
            if (vehicle_id === source) {
              if (filterMessage.length > 0) {
                trackingData[key].polyLinePath.push(vehilceLatLng);
                trackingData[key].vehiclePath = vehilceLatLng;
                trackingData[key].vehicleCode = filteredVehicle.vehicle_code;
                trackingData[key].plateNo =
                  filteredVehicle.vehicle_plate_number;
                trackingData[key].vehicleCategory =
                  filteredVehicle.vehicle_category;
                trackingData[key].driverName = filteredVehicle.driver.name;
                trackingData[key].driverErpId =
                  filteredVehicle.driver.driver_erp_id;
                trackingData[key].tripCounter = filteredVehicle.trips;
                this.setState({
                  vehicleTracking: trackingData,
                  chartUpdate: !this.state.chartUpdate,
                });
              }
            }
          });
        }
      } else {
        console.log("Form Unknown Source");
      }
    };
    client.onConnect = (message) => {};
    client.onConnected = (resObj) => {
      this.setState({
        pageloading: false,
        vehicleTracking: [],
      });

      // client.subscribe('World')
    };
  };
  render() {
    return (
      <React.Fragment>
        <ClipLoader
          css={`
            position: fixed;
            top: 40%;
            left: 40%;
            right: 40%;
            bottom: 20%;
            z-index: 999999;
          `}
          size={"200px"}
          this
          also
          works
          color={"#196633"}
          height={100}
          loading={this.state.routeloading}
        />
        <div
          className={`row ${this.state.routeloading ? style.loadmain : null}`}
        >
          {this.renderLeftSideBar()}
          {this.renderMainContent()}
          {this.renderRightSideBar()}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    tripList: state.live.tripList,
    deliveriesList: state.live.deliveries,
    cancelReasonList: state.live.cancelReasons,
    deliverySlotList: state.live.deliverySlots,
    selectedOrder: state.live.selectedOrder,
    selectedBranch: state.navbar.selectedBranch,
    defaultCenter: state.navbar.defaultCenter,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // getTripsApi: (date, store_id) => dispatch(get_trips_list(date, store_id)),
    getTripDeliveriesApi: (id, store_id) =>
      dispatch(get_trip_deliveries(id, store_id)),
    getCancelReasonApi: (order, store_id) =>
      dispatch(get_cancel_reasons(order, store_id)),
    getDeliverySlotApi: (order, store_id) =>
      dispatch(get_delivery_slots(order, store_id)),
    getTripsApi: (date, store_id) => dispatch(get_trips_list(date, store_id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Live);
// export default withRouter(Live);
