import React, { Component, PureComponent } from "react";
import {
  Form,
  Nav,
  FormGroup,
  Row,
  InputGroup,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import Link from "next/link";
// import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import Map from "../googlemap/Map";
import {
  get_routes_and_capacity,
  get_available_vehciles,
  create_trip,
} from "../../store/actions/routesplan/actionCreator";
import { OrderTableColumns } from "../Constants/TableColumns/OrderColumns";
import { DeliveryTripColumns } from "../Constants/TableColumns/DeliveryTripColumns";
import BoostrapDataTable from "../datatable/Datatable";
import DeliveryTripDataTable from "../datatable/DeliveryTripDataTable";
import axios from "axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import paginationFactory from "react-bootstrap-table2-paginator";
import { col6, col5, col12, col7 } from "../Constants/Classes/BoostrapClassses";
import RouteSummary from "../RoutesPlan/RouteSummary";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { LoadPropagateLoader } from "../Loaders/Loaders";
import style from "./RoutesPlan.module.css";
import SampleData from "../SampleData/RoutesPlanData.json";
import moment from "moment";
import { Trans } from "../../i18n";
import _ from "lodash";
import { connect } from "react-redux";
import { get_trips_list } from "../../store/actions/live/actionCreator";
import { DELIVERY_TRIPS, ALL_ORDERS } from "../Constants/Order/Constants";
class DynamicRoutesPlan extends PureComponent {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      routes: null,
      vehicleRoutes: null,
      orders: [],
      plandate: "PLAN-04/15/2020 5:51:06PM",
      listview: false,
      mapview: false,
      constraints: null,
      selectedConstraints: null,
      selectedConstraintName: { type: "", names: [] },
      advancemenu: false,
      date: [new Date(), new Date()],
      DateTimeRange: [new Date(), new Date()],
      plannow: false,
      isChanged: false,
      planlater: false,
      startDate: new Date(),
      endDate: new Date(),
      rangedate: [new Date(), new Date()],
      summarystats: null,
      isActive: false,
      pageloading: true,
      allOrders: [],
      routeOrders: null,
      mapfeatures: {
        showMarker: true,
        showRoutes: false,
        showOriginMarker: true,
        drawing: true,
        polygon: false,
        orderType: null,
        routesEnabled: false,
      },
      routeTrips: [],
      deliveryTrips: [],
      showOrders: true,
      showDeliveryTrip: false,
      showOrdersInProduction: false,
      showTripModal: false,
      selectedOrderId: [],
      selectedBranchId: null,
      forDataTableSelectedId: [],
      mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=en}`,
      isChanged: true,
      showBackdrop: true,
      selectedOrdersDetail: [],
      generatedTripCode: null,
      AllFilter: "All Orders",
      dataTableloading: false,
      vehicleList: [],
    };
  }

  onChange = (date) => this.setState({ date });
  componentDidMount() {
    this._isMounted = true;
    // if (this.props.selectedBranch) {

    this._isMounted = true;
    if (this.props.selectedBranch) {
      this.props.getAvailableVehiclesApi(
        this.props.selectedBranch,
        moment(this.state.tripDate).format("YYYY-MM-DD")
      );
      this.getRoutesandCapacity();
    }

    //
    // }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedBranch !== prevProps.selectedBranch) {
      this.getRoutesandCapacity();
    }
    if (this.props.routesAndPlanData !== prevProps.routesAndPlanData) {
      let lang = this.props.i18n.language;
      let data = this.props.routesAndPlanData;
      let orders = data.orders;
      let constraints = data.constraints;
      let summarystats = data.counters;
      let modifiedOrders = [];
      let getAreaList = [];
      orders.map((val, key) => {
        modifiedOrders.push({ order: val });
        const { order } = val;
        getAreaList.push(val.address.area_name[lang]);
      });
      this.setState({
        routeOrders: { deliveries: orders },
        orders: modifiedOrders,
        allOrders: orders,
        isChanged: true,
        constraints: _.sortBy(constraints, "constraint_id"),
        summarystats: summarystats,
        pageloading: false,
        areaList: _.uniq(getAreaList),
        routes: data.Routes,
        defaultMenuText: "All Orders",
        defaultMenuText2: "Unassigned Orders",
      });
    }
    if (this.state.vehicleList !== this.props.vehicleList) {
      this.setState({
        vehicleList: this.props.vehicleList,
      });
    }
    if (this.props.message !== prevProps.message) {
      if (this.props.message) {
        this.showMessage(this.props.message, "success");
      }
      this.setState({
        createTrip: false,
        selectedOrderId: [],
        selectedVehicle: null,
      });
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
        selectedRoute: ALL_ORDERS,
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
  getRoutesandCapacity = () => {
    this.props.getrouteandplanApi(
      "2020-04-03",
      "2020-04-03",
      this.props.selectedBranch
    );
  };
  renderDataTable = () => {
    if (this.state.orders.length > 0) {
      let products = [...this.state.orders];
      const options = {
        // pageStartIndex: 0,
        sizePerPage: 11,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
      };
      const selectRow = {
        mode: "checkbox",
        clickToSelect: true,
      };
      const defaultSorted = [
        {
          dataField: "name",
          order: "desc",
        },
      ];
      const columns = [
        {
          dataField: "order_id",
          text: "Order Id",
          sort: true,
          headerStyle: {
            fontSize: "10px",
          },
          style: {
            fontSize: "10px",
          },
        },
        {
          dataField: "order_number",
          text: "Order No.",
          sort: true,
          style: {
            fontSize: "10px",
          },
          headerStyle: {
            fontSize: "10px",
          },
        },
        {
          dataField: "address_title",
          text: "Address",
          sort: true,
          style: {
            fontSize: "10px",
          },
          headerStyle: {
            fontSize: "10px",
          },
        },
      ];

      return (
        <BootstrapTable
          bootstrap4
          keyField="order_number"
          data={products}
          columns={columns}
          defaultSorted={defaultSorted}
          pagination={paginationFactory(options)}
          selectRow={selectRow}
          fontSize={15}
          bordered={false}
          tdStyle={{ fontSize: "10px" }}
        />
      );
    }
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
        this.props.getTripsApi("2020-04-24", this.props.selectedBranch);
      }
    }
  };
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
    this.setState({
      rangedate: date,
    });
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
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className: style.toastContainer,
    });
  handleRecurringOptions = () => {};
  render() {
    let mapComponent = (
      <Map
        language={this.props.language}
        routelist={
          // this.state.routeOrders && this.state.routeOrders.deliveries
          //   ? this.state.routeOrders:
          []
        }
        t={this.props.t}
        getMapError={this.mapLoadError}
        selectedBranchId={this.state.selectedBranchId}
        selectedRouteId={this.state.selectedRoute}
        getDeltedRouteId={this.removeDeletedRoute}
        mapfeatures={this.state.mapfeatures}
        defaultCenter={this.state.defaultCenter}
        orderType={this.state.mapfeatures.orderType}
        getDeletedOrders={this.removeGeofenceOrders}
        polygonPaths={
          this.state.polygonPaths &&
          this.state.polygonPaths.length > 0 &&
          this.state.polygonPaths
        }
        googleMapURL={this.state.mapUrl}
        loadingElement={<div style={{ height: "71vh" }} />}
        containerElement={<div style={{ height: "71vh" }} />}
        selectedOrderId={
          this.state.selectedOrderId.length > 0
            ? this.state.selectedOrderId
            : []
        }
        sendSelectedOrderId={this.getMapSelectedOrderId}
        mapElement={<div style={{ height: "71vh" }} />}
      />
    );
    return (
      <div className={`${this.state.pageloading ? style.loadmain : null}`}>
        <div className={`row ${style.routeplanDiv}`}>
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
          {this.state.isChanged && (
            <div className={col12}>
              <div className="row mt-1 no-gutters">
                <div className="col-md-4 align-content-center">
                  <div className="row no-gutters ml-n2">
                    <div className="col-md-7 mr-n5">
                      <div className="row">
                        <ol
                          className={`col-8 offset-1 breadcrumb ${style.breadCrumb} ${style.inputShadow}`}
                        >
                          <li
                            className={`${style.breadcrumbItem} breadcrumb-item`}
                          >
                            <b>Routes </b>
                          </li>
                          <li
                            className={`${style.breadcrumbItem} active  breadcrumb-item`}
                          >
                            <b>Trip Planning</b>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="col-md-5 ml-n2">
                      <Form.Control
                        className={`rounded-0 ${style.inputShadow} textingred`}
                        type="text"
                        name="firstName"
                        value={this.state.plandate}
                        readOnly
                        isValid={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-7 offset-1">
                  <div className="row">
                    <div className="col-md-3 offset-3">
                      <InputGroup>
                        <DateRangePicker
                          className={style.inputShadow}
                          onChange={this.onChange}
                          value={this.state.date}
                          format="MM/dd/y"
                        />
                        {/*<InputGroup.Prepend>
                      <InputGroup.Text
                        id="inputGroup-sizing-default"
                        className="bg-primary text-white"
                      >
                        <i className="fa fa-calendar  fa-3x"></i>
                      </InputGroup.Text>
                      <InputGroup.Text>
                        <DateRangePicker
                          onChange={this.onDateRangeChange}
                          value={this.state.rangedate}
                          calendarIcon="fa fa-calendar"
                        ></DateRangePicker>
                      </InputGroup.Text>
                    </InputGroup.Prepend>*/}
                      </InputGroup>
                    </div>
                    <div className="col-md-3">
                      <Button
                        className={`btn btn-primary btn-xs ${style.buttonShadow}`}
                      >
                        <i
                          className="fa fa-search"
                          style={{ fontSize: "10px" }}
                        ></i>{" "}
                        Search Orders
                      </Button>
                    </div>
                    <div className="col-md-3">
                      <ButtonGroup aria-label="Basic example">
                        <Button
                          variant="secondary"
                          className={style.buttonShadow}
                          onClick={() => this.setState({ listview: true })}
                        >
                          <i
                            className="fa fa-list"
                            style={{ fontSize: "12px" }}
                          />{" "}
                          List
                        </Button>
                        <Button
                          className={style.buttonShadow}
                          variant="primary"
                          onClick={() => this.setState({ listview: false })}
                        >
                          <i
                            className="fa fa-map-marker"
                            style={{ fontSize: "12px" }}
                          />{" "}
                          Map
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-1 align-items-center">
                <div className="col-md-12">
                  <div className="row">
                    <div
                      className={`col-md-12 col-sm-12 col-xs-12 ${style.routePlanNav}  align-items-center`}
                    >
                      <div className="row">
                        <div
                          className="col-md-5 col-sm-5 col-xs-5"
                          id="basic-navbar-nav"
                        >
                          <Nav className="mr-auto mb-1">
                            {this.renderConstraints()}
                          </Nav>
                        </div>
                        <div
                          className="col-md-5 col-sm-5 col-xs-5 offset-2"
                          id="basic-navbar-nav"
                        >
                          <div className="row align-items-center">
                            <div className="offset-1 col-md-5 text-right"></div>
                            <Link href="/">
                              <a
                                className={`${style.navLink} nav-link  col-md-6 text-center`}
                              >
                                <i className="fa fa-eye"> Show Profile</i>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`col-md-12 ${style.setShadow1}`}>
                      <FormGroup className="ml-3 p-2" as={Row}>
                        {this.state.selectedConstraintName.names &&
                          !this.state.advancemenu &&
                          this.state.selectedConstraintName.names.map(
                            (name, key) => (
                              <Form.Check
                                key={key}
                                className={`pr-3 ${style.formCheck}`}
                                column="true"
                                md={4}
                                type={this.state.selectedConstraintName.type}
                                ref={`routendcap${this.state.selectedConstraintName.type}`}
                                value={1}
                                name="routendcapradio"
                                id={`default`}
                                label={name}
                              />
                            )
                          )}
                        {this.state.advancemenu && (
                          <React.Fragment>
                            <Form.Check
                              className={`pr-3 ${style.formCheck}`}
                              column="true"
                              md={4}
                              type="radio"
                              onClick={this.advanceRadioClick}
                              ref="plannow"
                              value="plannow"
                              name="advance"
                              id={`default1`}
                              label={"Plan Now"}
                            />
                            <Form.Check
                              className={`pr-3 ${style.formCheck}`}
                              column="true"
                              md={4}
                              onClick={this.planlaterRadioClick}
                              type="radio"
                              ref="planlater"
                              value="planlater"
                              name="advance"
                              id={`default2`}
                              label={"Plan Later"}
                            />
                          </React.Fragment>
                        )}
                        {this.state.plannow && (
                          <div className="col-md-4">
                            {this.renderDateRangePicker()}
                          </div>
                        )}
                      </FormGroup>

                      {!this.state.plannow && this.state.planlater && (
                        <div className="col-md-4">
                          <FormGroup className="mt-2 ml-3 p-2" as={Row}>
                            <Form.Check
                              className={`pr-3 ${style.formCheck}`}
                              column="true"
                              md={4}
                              onClick={this.handleRecurringOptions}
                              type="radio"
                              ref="recurringoption"
                              value="recurringoption"
                              name="recurringoption"
                              id={`default2`}
                              label={"Daily"}
                            />
                            <Form.Check
                              className={`pr-3 ${style.formCheck}`}
                              column="true"
                              md={4}
                              onClick={this.handleRecurringOptions}
                              type="radio"
                              ref="recurringoption"
                              value="recurringoption"
                              name="recurringoption"
                              id={`default2`}
                              label={"Weekly"}
                            />
                            <Form.Check
                              className={`pr-3 ${style.formCheck}`}
                              column="true"
                              md={4}
                              onClick={this.handleRecurringOptions}
                              type="radio"
                              ref="recurringoption"
                              value="recurringoption"
                              name="recurringoption"
                              id={`default2`}
                              label={"Monthly"}
                            />
                          </FormGroup>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-1 no-gutters">
                {this.state.isChanged && this.state.listview ? (
                  <div className={`${this.state.listview ? col5 : col5}`}>
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
                        {this.state.showDeliveryTrip && (
                          <DeliveryTripDataTable
                            t={this.props.t}
                            language={this.props.language}
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

                {!this.state.listview && (
                  <div className={col7}>
                    <RouteSummary
                      summary={this.state.summarystats}
                    ></RouteSummary>
                  </div>
                )}
              </div>
              {!this.state.pageloading && this.state.listview && (
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
    // selectedBranch: state.navbar.selectedBranch,
    // vehicleList: state.routesplan.vehicleList,
    // constraints: state.routesplan.constraints,
    // summaryStats: state.routesplan.summaryStats,
    // tripList: state.live.tripList,
    // defaultCenter: state.navbar.defaultCenter,
    // routesAndPlanData: state.routesplan.routesAndPlanData,
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

export default connect(mapStateToProps, mapDispatchToProps)(DynamicRoutesPlan);
