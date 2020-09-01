import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import style from "./Datatable.module.css";
import OrderEditModal from "../Modal/OrderEditModal";
import OrderInfoModal from "../Modal/OrderInfoModal";
import OrderCancelModal from "../Modal/OrderCancelModal";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { TRIP_STATUS_WAITING } from "../Constants/Trips/Constants";
import {
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import _ from "lodash";
import moment from "moment";
import axios from "../API/Axios";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { get_trip_deliveries } from "../../store/actions/live/actionCreator";
import { FOR_ROUTES_PALN_PAGE_MESSAGES } from "../Constants/Other/Constants";
import { approve_delivery_trip } from "../../store/actions/routesplan/actionCreator";

class DeliveryTripDataTable extends Component {
  constructor(props) {
    super(props);
    this.expandRow = {};
    this.state = {
      data: [],
      selectedOrders: [],
      showOrderEditModal: false,
      showOrderInfoModal: false,
      showOrderCancelModal: false,
      tripEditData: null,
      deliveryVehicledata: [],
      tripcancelData: null,
      vehicleData: [],
      selectedRoutes: [],
      selectedRows: [],
      deliveryOrders: [],
      selectedDeliveryTrip: null,
      selectedTripDate: null,
      infoClick: false,
      selectedTripIsEditable: false,
      selectedTripInfo: null,
      isEditable: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.mapSelectedOrderId) {
      return {
        selectedOrders: props.mapSelectedOrderId,
        vehicleData: props.vehiclesdata,
      };
    }
    return state;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.deliveriesList !== prevProps.deliveriesList) {
      let data = this.props.deliveriesList;
      let is_editable = this.state.isEditable;
      if (data.deliveries.length > 0) {
        if (this.state.infoClick) {
          this.setState({
            showOrderInfoModal: true,
            deliveryOrders: data.deliveries,
            selectedTripIsEditable: is_editable,
          });
          this.props.getRouteOrders([]);
        } else {
          this.setState({
            showOrderInfoModal: false,
            deliveryOrders: data.deliveries,
          });
          this.props.getRouteOrders(data.deliveries);
        }

        this.props.isPageLoading(false);
      } else {
        this.setState({
          routeloading: false,
          deliveryOrders: data.deliveries,
        });
        this.props.isPageLoading(false);
        this.props.getRouteOrders(data.deliveries);
        this.showMessage(this.props.t("No Record Found"), "error");
      }
    }
  }
  onTripEditClick = (row) => {
    this.setState({
      tripEditData: row,
      showOrderEditModal: true,
      showOrderInfoModal: false,
      showOrderCancelModal: false,
    });
  };
  onTripCancelClick = (row) => {
    this.setState({
      showOrderCancelModal: true,
      tripcancelData: row,
    });
  };
  onDeliveryInfoClick = (tripDate, delivery_trip_id, is_editable = false) => {
    this.props.isPageLoading(true);

    this.setState({
      showOrderInfoModal: false,
      showOrderEditModal: false,
      showOrderCancelModal: false,
      isEditable: is_editable,
      // tripEditData: row,
    });
    this.props.getTripDeliveriesApi(
      delivery_trip_id,
      this.props.selectedBranch
    );
    // axios
    //   .get(`storesupervisor/v1/${tripDate}/${delivery_trip_id}/deliveries`, {
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
    //         if (this.state.infoClick) {
    //           this.setState({
    //             showOrderInfoModal: true,
    //             deliveryOrders: data.deliveries,
    //             selectedTripIsEditable: is_editable,
    //             // tripEditData: row,
    //           });
    //           this.props.getRouteOrders([]);
    //         } else {
    //           this.setState({
    //             showOrderInfoModal: false,
    //             deliveryOrders: data.deliveries,
    //             // tripEditData: row,
    //           });
    //           this.props.getRouteOrders(data.deliveries);
    //         }

    //         this.props.isPageLoading(false);

    //         // this.showMessage(
    //         //    'Vehicle Route Mapping Successfully ',
    //         //    'success'
    //         // )
    //       } else {
    //         this.setState({
    //           // vehicleRoutes: data,
    //           routeloading: false,
    //           deliveryOrders: data.deliveries,
    //         });
    //         this.props.isPageLoading(false);
    //         this.props.getRouteOrders(data.deliveries);
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
  showMessage = (message, type, autoClose = 2000) => {
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success" ? style.toastContainerSuccess : style.toastContainer,
    });
  };
  actionsFormatter = (cell, row, index) => {
    let t = this.props.t;
    let status = row.trip_status;
    // console.log("CHECK ROW NOW", row);
    let is_editable = row.is_cancellable === "True" ? true : false;
    let is_cancleable = row.is_editable === "True" ? true : false;
    let lang = this.props.language;
    return (
      <React.Fragment>
        <div key={index} className="inline-block setMousePointer">
          <OverlayTrigger
            // key={1}
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Show Trip"} />
              </Tooltip>
            }
          >
            <i
              onClick={(e) => this.onInfoClick(row, e)}
              className={`fa fa-info-circle fa-1x ${style.Button} text-success `}
            ></i>
          </OverlayTrigger>{" "}
          {is_editable && (
            <React.Fragment>
              <OverlayTrigger
                // key={1}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
                    <Trans i18nKey={"Edit Trip"} />
                  </Tooltip>
                }
              >
                <i
                  onClick={() => this.onTripEditClick(row)}
                  className={`fa fa-edit fa-1x ${style.Button} text-primary `}
                ></i>
              </OverlayTrigger>{" "}
            </React.Fragment>
          )}
          {is_cancleable && (
            <React.Fragment>
              <OverlayTrigger
                // key={1}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
                    <Trans i18nKey={"Delete Trip"} />
                  </Tooltip>
                }
              >
                <i
                  onClick={() => this.onTripCancelClick(row)}
                  className={`fa fa-trash fa-1x ${style.Button} text-danger `}
                ></i>
              </OverlayTrigger>{" "}
            </React.Fragment>
          )}
          <OverlayTrigger
            key={1}
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Trip Deliveries On Map"} />
              </Tooltip>
            }
          >
            <i
              className={`fa fa-map fa-1x ${style.mapButton} `}
              onClick={() => this.onMapClick(row)}
            ></i>
          </OverlayTrigger>
          {status[lang] === "Assigned" ? (
            <OverlayTrigger
              key={1}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
                  <Trans i18nKey={"Approved"} />
                </Tooltip>
              }
            >
              <i
                className={`fa fa-thumbs-up  fa-1x ${style.mapButton} `}
                onClick={() => this.onApprovedClick(row)}
              ></i>
            </OverlayTrigger>
          ) : null}
          {/* <OverlayTrigger
            key={1}
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-12`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Not Approved"} />
              </Tooltip>
            }
          >
            <i
              className={`fa fa-thumbs-down  fa-1x ${style.mapButton} `}
              // onClick={() => this.onMapClick(row)}
            ></i>
          </OverlayTrigger> */}
          {/* </React.Fragment> */}
        </div>
      </React.Fragment>
    );
  };
  onApprovedClick = (row) => {
    let branch_id = this.props.selectedBranch;
    let trip_id = row.delivery_trip_id;
    let data = {
      trip_id: trip_id.toString(),
    };
    this.props.approveDeliveryTripApi(data, branch_id);
  };
  onMapClick = (row) => {
    let selectedRows = [];
    selectedRows.push(row.delivery_trip_id);
    this.setState({
      infoClick: false,
      selectedRows: selectedRows,
    });
    this.onDeliveryInfoClick(row.trip_date, row.delivery_trip_id);
  };
  onInfoClick = (row) => {
    let selectedRows = [];
    selectedRows.push(row.delivery_trip_id);
    this.setState({
      infoClick: true,
      selectedRows: selectedRows,
      selectedTripInfo: row,
    });
    this.onDeliveryInfoClick(
      row.trip_date,
      row.delivery_trip_id,
      row.is_editable === "True" ? true : false
    );
  };
  renderDataTable = () => {
    let t = this.props.t;
    let lang = this.props.language;
    if (this.props.data) {
      // let products = [...this.props.data]
      let products = [];
      if (this.props.dataFor === "deliverytrips") {
        products = this.props.data;
      }
      const sizePerPageRenderer = ({
        options,
        currSizePerPage,
        onSizePerPageChange,
      }) => (
        <React.Fragment>
          <DropdownButton
            as={ButtonGroup}
            key={"up"}
            id={`tripdropdown-button-drop-up`}
            className={"btnBrown"}
            drop={`up`}
            variant=""
            title={currSizePerPage}
          >
            {options.map((option) => (
              <Dropdown.Item
                key={option.text}
                eventKey="1"
                onClick={() => onSizePerPageChange(option.page)}
                className={`btn ${
                  currSizePerPage === `${option.page}`
                    ? "btn-light-brown"
                    : "btn-light-brown2"
                }`}
              >
                {option.text}
              </Dropdown.Item>
            ))}
          </DropdownButton>{" "}
        </React.Fragment>
      );
      const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
          {"   "} <Trans i18nKey={"Total Records"} />: {size}
        </span>
      );
      const options = {
        sizePerPageRenderer,
        paginationTotalRenderer: customTotal,
        showTotal: true,
        pageStartIndex: 1,
      };
      let selectrowOptions;
      if (this.props.rowSelection) {
        selectrowOptions = {
          mode: "checkbox",
          clickToSelect: true,
        };
      } else {
        selectrowOptions = {
          mode: "checkbox",
          clickToSelect: true,
          hideSelectColumn: true,
        };
      }
      const defaultSorted = [
        {
          dataField: "trip_code",
          order: "desc",
        },
      ];

      let columns = this.props.columns;
      columns = columns.map((val) => {
        let updatedval = { ...val, classes: "text-break" };
        if (val.dataField === "trip_status") {
          updatedval.dataField = `trip_status[${lang}]`;
        }
        if (val.dataField === "driver.name") {
          updatedval.dataField = `driver.name[${lang}]`;
        }
        let text = "";
        if (this.props.t) {
          text = this.props.t(val.text);
        }
        updatedval.text = text;
        if (val.dataField === "action") {
          return { ...updatedval, formatter: this.actionsFormatter };
        } else {
          return updatedval;
        }
      });

      const selectRow = {
        mode: "checkbox",
        clickToSelect: false,
        hideSelectColumn: true,
        // selected: this.state.selectedRows,
        selected: this.state.selectedRows,
        bgColor: "#c8e6c9",
        onSelect: (row, isSelect, rowIndex, e) => {
          if (isSelect) {
            let route_id = row.route_id;
            let trip_code = row.trip_code;
            // let delivery_trip_id = row.delivery_trip_id
            let delivery_trip_id = row.delivery_trip_id;

            this.setState({
              selectedRows: [delivery_trip_id],
              selectedTripDate: row.trip_date,
              selectedDeliveryTrip: row.delivery_trip_id,
            });
          }
        },
      };

      return (
        <BootstrapTable
          bootstrap4
          selectRow={selectRow}
          keyField={this.props.keyField}
          // keyField={'order_id'}
          data={products}
          wrapperClasses={this.props.wrapperClasses}
          columns={columns}
          pagination={paginationFactory(options)}
          fontSize={15}
          bordered={false}
          tdStyle={{ fontSize: "10px" }}
          noDataIndication={this.props.t("No Record Found")}
          defaultSorted={defaultSorted}
          //    expandRow={this.expandRow}
        />
      );
    }
  };
  removeCancelledOrders = (order_id) => {
    let alldeliveryorders = [...this.state.deliveryOrders];
    if (alldeliveryorders.length > 0) {
      _.remove(alldeliveryorders, ({ order }) => order.order_id == order_id);
    }
    this.setState({
      deliveryOrders: alldeliveryorders,
    });
  };
  onModalClose = () => {
    this.setState({
      infoClick: false,
    });
  };
  showInfoModalAgain = () => {
    this.setState({
      showOrderInfoModal: true,
    });
  };
  renderOrderModals = () => {
    return (
      <div style={{ width: "95%", height: "auto" }}>
        {this.state.showOrderEditModal && (
          <OrderEditModal
            t={this.props.t}
            warehouse_id={this.props.warehouse_id}
            language={this.props.language}
            show={this.state.showOrderEditModal}
            editdata={this.state.tripEditData}
            vehiclesdata={this.state.vehicleData}
            // reasons={this.state.cancalReasons}
            onHide={() =>
              this.setState({
                showOrderEditModal: false,
                tripEditData: null,
              })
            }
            // orderid={this.state.selectedOrder.order_id}
          />
        )}{" "}
        {/* {this.state.showOrderInfoModal && ( */}
        <OrderInfoModal
          show={this.state.showOrderInfoModal}
          isEditable={this.state.selectedTripIsEditable}
          t={this.props.t}
          showModalAgain={this.showInfoModalAgain}
          language={this.props.language}
          // onModalClose={this.onModalClose}
          orderdata={this.state.deliveryOrders}
          tripdata={this.state.selectedTripInfo}
          getcancelledorder={this.removeCancelledOrders}
          // reasons={this.state.cancalReasons}
          onHide={() =>
            this.setState({
              showOrderInfoModal: false,
              infoClick: false,
              selectedTripIsEditable: false,
              selectedTripInfo: null,
            })
          }
        ></OrderInfoModal>
        {/* )} */}
        {this.state.showOrderCancelModal && (
          <OrderCancelModal
            t={this.props.t}
            language={this.props.language}
            cancelleddelivery={this.getCancelledDelivery}
            canceldata={this.state.tripcancelData}
            show={this.state.showOrderCancelModal}
            onHide={() => this.setState({ showOrderCancelModal: false })}
          />
        )}
      </div>
    );
  };

  getCancelledDelivery = (id) => {
    this.props.getCancelDeliveries(id);
  };
  render() {
    return (
      <React.Fragment>
        {this.renderOrderModals()} {this.renderDataTable()}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    deliveriesList: state.live.deliveries,
    selectedBranch: state.navbar.selectedBranch,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getTripDeliveriesApi: (trip_id, store_id) =>
      dispatch(
        get_trip_deliveries(trip_id, store_id, FOR_ROUTES_PALN_PAGE_MESSAGES)
      ),
    approveDeliveryTripApi: (data, store_id) =>
      dispatch(
        approve_delivery_trip(data, store_id, FOR_ROUTES_PALN_PAGE_MESSAGES)
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryTripDataTable);
