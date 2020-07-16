import React, { Component } from "react";
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

import { OrderTableColumns } from "../Constants/TableColumns/OrderColumns";
import { DeliveryTripColumns } from "../Constants/TableColumns/DeliveryTripColumns";
import BoostrapDataTable from "../datatable/Datatable";
import DeliveryTripDataTable from "../datatable/DeliveryTripDataTable";
import axios from "axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
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
} from "../Constants/Classes/BoostrapClassses";
import RouteSummary from "../RoutesPlan/RouteSummary";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { LoadPropagateLoader } from "../Loaders/Loaders";
import style from "./RoutesPlan.module.css";
import { Trans } from "../../i18n";
import _ from "lodash";
import { ALL_ORDERS, UNASSIGNED_ORDERS } from "../Constants/Order/Constants";
class RoutesPlan extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      routes: null,
      vehicleRoutes: null,
      orders: [],
      plandate: "PLAN-04/15/2020 5:51:06PM",
      listview: true,
      mapview: false,
      constraints: null,
      selectedConstraints: null,
      selectedConstraintName: { type: "", names: [] },
      advancemenu: false,
      date: [new Date(), new Date()],
      DateTimeRange: [new Date(), new Date()],
      plannow: false,
      planlater: false,
      startDate: new Date(),
      endDate: new Date(),
      rangedate: [new Date(), new Date()],
      summarystats: null,
      isActive: false,
      pageloading: true,
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
      showOrders: true,
      showByOrder: false,
      showByRoute: false,
      showByArea: false,
      showDeliveryTrip: false,
      showOrdersInProduction: false,
      showTripModal: false,
      selectedOrderId: [],
      selectedBranchId: 1,
      forDataTableSelectedId: [],
      mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=en}`,
      isChanged: true,
      showBackdrop: true,
      selectedOrdersDetail: [],
      generatedTripCode: null,
      AllFilter: "All Orders",
      dataTableloading: false,
      routes: [],
    };
  }

  onChange = (date) => this.setState({ date });
  componentDidMount() {
    this._isMounted = true;
    this.getRoutesandCapacity();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  getRoutesandCapacity = () => {
    axios
      .get(`${LOCAL_API_URL}2020-02-01/2020-03-01/routingAndCapacity`)
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          if (this._isMounted) {
            this.showMessage(
              "Route Data Retrieved Successfully",
              "success",
              1500
            );
            let data = response.data;
            let orders = data.orders;
            let constraints = data.constraints;
            let summarystats = data.counters;
            let modifiedOrders = [];
            orders.map((val, key) => {
              modifiedOrders.push({ order: val });
            });
            console.log("Check Modified Orders", modifiedOrders);
            this.setState({
              routeOrders: { deliveries: modifiedOrders },
              orders: modifiedOrders,
              constraints: _.sortBy(constraints, "constraint_id"),
              summarystats: summarystats,
            });
          }
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), "error", false);
      });
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
        loadingElement={
          <div
            style={{
              height: `${
                this.state.selectedOrderId.length > 0 ? "71.5vh" : "72vh"
              }`,
            }}
          />
        }
        containerElement={
          <div
            style={{
              height: `${
                this.state.selectedOrderId.length > 0 ? "71.5vh" : "72vh"
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
                this.state.selectedOrderId.length > 0 ? "71.5vh" : "72vh"
              }`,
            }}
          />
        }
      />
    );
    return (
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
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="row mt-3 no-gutters">
            <div
              className={`${col12} ${style.staticTopMenu} align-content-center`}
            >
              <div className="row">
                <div className={col3}>
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant=""
                      className={`${style.buttonShadow} ${
                        this.state.showByRoute ? "bg-brown" : "bg-light-brown"
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
                    <Button
                      className={`${style.buttonShadow} ${
                        this.state.showByOrder ? "bg-brown" : "bg-light-brown"
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
                        this.state.showByArea ? "bg-brown" : "bg-light-brown"
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
                  </ButtonGroup>
                </div>
                {this.state.showByOrder && (
                  <div className={col2}>
                    <Form.Control
                      as="select"
                      className="rounded-0"
                      onChange={this.onRouteChange}
                      defaultValue={
                        this.state.selectedRoute ? this.state.selectedRoute : ""
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
                        <option key={route.route_id} value={route.route_id}>
                          {route.route_name}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                )}{" "}
                {this.state.showByRoute ||
                this.state.showByOrder ||
                this.state.showByArea ? (
                  <React.Fragment>
                    <div className={col2}>
                      <Form.Control
                        as="select"
                        className="rounded-0"
                        onChange={this.onRouteChange}
                        defaultValue={
                          this.state.selectedRoute
                            ? this.state.selectedRoute
                            : ""
                        }
                      >
                        <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                          --- {this.props.t("Select City")} ---
                        </option>
                        <option value={ALL_ORDERS}>
                          {this.props.t(this.state.defaultMenuText)}
                        </option>
                        <option value={UNASSIGNED_ORDERS}>
                          {this.props.t(this.state.defaultMenuText2)}
                        </option>
                        {this.state.routes.map((route) => (
                          <option key={route.route_id} value={route.route_id}>
                            {route.route_name}
                          </option>
                        ))}
                      </Form.Control>
                    </div>
                    {!this.state.showByArea && (
                      <div className={`${col2}`}>
                        <Form.Control
                          as="select"
                          className="rounded-0"
                          onChange={this.onRouteChange}
                          defaultValue={
                            this.state.selectedRoute
                              ? this.state.selectedRoute
                              : ""
                          }
                        >
                          <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                            --- {this.props.t("Select  Area")} ---
                          </option>
                          <option value={ALL_ORDERS}>
                            {this.props.t(this.state.defaultMenuText)}
                          </option>
                          <option value={UNASSIGNED_ORDERS}>
                            {this.props.t(this.state.defaultMenuText2)}
                          </option>
                          {this.state.routes.map((route) => (
                            <option key={route.route_id} value={route.route_id}>
                              {route.route_name}
                            </option>
                          ))}
                        </Form.Control>
                      </div>
                    )}
                  </React.Fragment>
                ) : null}
                <div className={col2}>
                  <InputGroup>
                    <DateRangePicker
                      className={style.inputShadow}
                      onChange={this.onChange}
                      value={this.state.date}
                      format="MM/dd/y"
                    />
                  </InputGroup>
                </div>
                <div className={col1}>
                  <Button
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
            {this.state.selectedBranchId ? null : (
              <div className="col-4 offset-5">
                <span className="text-danger">
                  {" "}
                  <Trans i18nKey={"Please Select Branch To Continue"}></Trans>
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
                          <div className={`${col4} ${style.inputShadow} pt-1 pb-1`}>
                            <Trans i18nKey={"Select Date"} />:
                          </div>
                          <div
                            className={`col-md-8 col-sm-8  ${style.inputShadow} col-xs-8 col-lg-8 pt-1 pb-1`}
                          >
                            <DatePicker
                              showTimeSelect={false}
                              title="Select Date"
                              currentDate={this.state.tripDate}
                              dateFormat={this.state.dateFormat}
                              minDate={new Date()}
                              onChange={this.onTripDateChange}
                              className={`rounded-0 ${style.datePickerinputShadow}  textingred form-control`}
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
                              this.state.vehicleList.map((vehicle) => (
                                <option
                                  key={vehicle.vehicle_id}
                                  value={vehicle.vehicle_id}
                                >
                                  {`${vehicle.number_plate} - ${
                                    typeof vehicle.driver_name !== "undefined"
                                      ? vehicle.driver_name
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
                    <div className="col-md-2 col-sm-2 col-xs-2 col-lg-2 pt-1 pb-1">
                      <Button
                        className={style.buttonStyle}
                        onClick={this.assignPlanRoute2}
                      >
                        {t("Assign Vehicle")}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : this.state.generatedTripCode && !this.state.createTrip ? (
                <b>Trip {this.state.generatedTripCode} Created Successfully</b>
              ) : null}
            </div>
          </div>
          <div className="row mt-3 mb-1 no-gutters">
            {this.state.isChanged && this.state.listview ? (
              <div className={`${col6}`}>
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
                    {/*
                    {this.state.showOrdersInProduction && (
                      <BoostrapDataTable
                        sendSelectedOrderId={this.setDataTableSelectedId}
                        language={this.props.language}
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
                    */}
                  </div>
                </div>
              </div>
            ) : null}
            <div className={`${this.state.listview ? col6 : col5}`}>
              {mapComponent}
            </div>
            {!this.state.listview && (
              <div className={col7}>
                {this.state.summarystats ? (
                  <RouteSummary
                    summary={this.state.summarystats}
                  ></RouteSummary>
                ) : (
                  <LoadPropagateLoader size={15}></LoadPropagateLoader>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default RoutesPlan;
