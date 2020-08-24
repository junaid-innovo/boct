import React, { Component } from "react";
import BootstrapTable, {
  SizePerPageDropDown,
} from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import style from "./Datatable.module.css";
import DeliveryOrderCancelModal from "../Modal/DeliveryTripOrderCancel";
import { ToastContainer, toast, Zoom } from "react-toastify";
import OrderCancelModal from "../Modal/OrderCancelModal";
// import axios from 'axios'
import axios from "../API/Axios";
import {
  LOCAL_API_URL,
  LANGUAGE_STRING,
} from "../Constants/Enviroment/Enviroment";
import _ from "lodash";
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
import posIconMed from "../../public/images/Icons_custom/POSx30.png";

import { thresholdFreedmanDiaconis } from "d3";
import {
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import {
  PAYMENT_TYPE_CASH_ON_DELIVERY,
  PAYMENT_TYPE_POS,
  PAYMENT_TYPE_MADA_CREDIT_CARD,
  PAYMENT_TYPE_MOYASAR_CREDIT_CARD,
} from "../Constants/Payment/Payment";
import {
  ORDERS_READYFORPICKUP,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_ON_HOLD,
  ORDER_STATUS_ON_HOLD_BY_SALES,
  ORDER_STATUS_SHIPPED,
} from "../Constants/Order/Constants";
import {
  DELIVERY_TYPE_ANYTIME,
  DELIVERY_TYPE_MORNING,
  DELIVERY_TYPE_EVENING,
} from "../Constants/Delivery/Delivery";
import { Trans, useTranslation } from "react-i18next";
// import { toast } from 'react-toastify';

class BootstrapDataTable extends Component {
  constructor(props) {
    super(props);
    this.expandRow = {};
    this.state = {
      data: [],
      selectedOrders: [],
      showOrderEditModal: false,
      showOrderInfoModal: false,
      showDeliveryOrderCancelModal: false,
      deliveryVehicledata: [],
      selectedOrdersDetail: [],
      selectedOrderId: null,
      cancelSelectedOrder: null,
      update: false,
      hideCancelOrder: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.mapSelectedOrderId) {
      return {
        selectedOrders: props.mapSelectedOrderId,
      };
    }
    if (props.mapSelectedDetailOrders) {
      return {
        selectedOrdersDetail: props.mapSelectedDetailOrders,
      };
    }

    return state;
  }
  componentDidUpdate(prevProps, prevState) {}
  componentDidMount() {
    if (this.props.data) {
      if (this.props.data.length > 1) {
        this.setState({
          hideCancelOrder: true,
          data: this.props.data,
          update: true,
        });
      } else {
        this.setState({
          hideCancelOrder: false,
          data: this.props.data,
          update: false,
        });
      }
    }
  }
  calulateTotalQuantity = (items) => {
    let sum = 0;
    items.map(({ quantity }) => (sum += parseInt(quantity)));
    return sum;
  };
  expandRowSelection = () => {
    let langauge = this.props.language;
    let t = this.props.t;
    let expandRow;
    if (this.props.dataFor === "orders") {
      expandRow = {
        renderer: (row, key) => {
          console.log("CHECK ROW", row);
          return (
            <div key={key} className="row" style={{ fontSize: "10px" }}>
              <div className="col-6">
                {langauge === "en" ? (
                  <div>
                    <b>{t("Erp Id")}</b>:{" "}
                    {typeof row.erp_id !== "undefined" ? row.erp_id : null}
                  </div>
                ) : (
                  <div>
                    {typeof row.erp_id !== "undefined" ? row.erp_id : null} :
                    <b>{t("Erp Id")}</b>
                  </div>
                )}
                {langauge === "en" ? (
                  <div>
                    <b>{t("Customer Name")}</b>:{" "}
                    {typeof row.customer_name !== "undefined"
                      ? row.customer_name
                      : typeof row.customer.name !== "undefined"
                      ? row.customer.name
                      : null}
                  </div>
                ) : (
                  <div>
                    {typeof row.customer_name !== "undefined"
                      ? row.customer_name
                      : typeof row.customer.name !== "undefined"
                      ? row.customer.name
                      : null}{" "}
                    :<b>{t("Customer Name")}</b>
                  </div>
                )}
                <div>
                  <b>{t("Customer Mobile")}</b>:{" "}
                  {typeof row.customer_mobile !== "undefined"
                    ? row.customer_mobile
                    : typeof row.customer.phone !== "undefined"
                    ? row.customer.phone
                    : null}
                </div>
                <div>
                  <b>{t("Address")}</b>: {row.address.address_detail}
                </div>
              </div>

              <div className="col-6">
                <div>
                  <b>{t("Quantity")}</b>:{" "}
                  {typeof row.items !== "undefined" &&
                    this.calulateTotalQuantity(row.items)}
                </div>
                <div>
                  {langauge === "en" ? (
                    <b>{t("Products")}:</b>
                  ) : (
                    <b>:{t("Products")}</b>
                  )}
                  {row.items.length > 0 ? (
                    row.items.map((product, key) => {
                      return (
                        <div key={key}>
                          {product.product_name[langauge]} <br />
                          {`${product.material ? product.material : ""} x ${
                            product.quantity
                          } ${
                            product.foc && parseInt(product.foc) !== 0
                              ? ` + ${product.foc}`
                              : ""
                          }`}
                        </div>
                      );
                    })
                  ) : (
                    <div> No Product Avaialable</div>
                  )}
                </div>
              </div>
            </div>
          );
        },
        showExpandColumn: this.props.rowExpansion,
        expandColumnPosition: "left",
        selectColumnStyle: { float: "right" },
        expandHeaderColumnRenderer: ({ isAnyExpands }) => {
          if (isAnyExpands) {
            return (
              <b>
                <i
                  style={{
                    fontSize: "12px",
                  }}
                  className="fa fa-minus fa-1x"
                ></i>
              </b>
            );
          }
          return (
            <b>
              {" "}
              <i
                style={{
                  fontSize: "12px",
                }}
                className="fa fa-plus fa-1x"
              ></i>
            </b>
          );
        },
        expandColumnRenderer: ({ expanded }) => {
          if (expanded) {
            return (
              <b>
                <i
                  style={{
                    fontSize: "12px",
                  }}
                  className="fa fa-minus fa-1x"
                ></i>
              </b>
            );
          }
          return (
            <b>
              <i
                style={{
                  fontSize: "12px",
                }}
                className="fa fa-plus fa-1x"
              ></i>
            </b>
          );
        },
      };
    } else {
      expandRow = {
        renderer: null,
      };
    }

    return expandRow;
  };
  addInfoFormatter = (cell, row, rowIndex, formatExtraData) => {
    let t = this.props.t;
    return (
      <span key={this.props.data.length} className="setMousePointer">
        <OverlayTrigger
          // key={1}
          placement={"top"}
          overlay={
            <Tooltip id={`cod`} style={{ fontSize: "10px" }}>
              <Trans i18nKey={"Order Info"} />
            </Tooltip>
          }
        >
          <i className="fa fa-info-circle text-success"></i>
          {/* <img src={smCashonDelivery}></img> */}
        </OverlayTrigger>
      </span>
    );
  };
  addPaymentFormatter = (cell, row, rowIndex, formatExtraData) => {
    let t = this.props.t;
    return (
      <span key={this.props.data.length} className="setMousePointer">
        {row.payment_method_key === PAYMENT_TYPE_CASH_ON_DELIVERY && (
          <OverlayTrigger
            // key={1}
            placement={"top"}
            overlay={
              <Tooltip id={`cod`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Cash on Delivery"} />
              </Tooltip>
            }
          >
            <img src={smCashonDelivery}></img>
          </OverlayTrigger>
        )}{" "}
        {row.payment_method_key === PAYMENT_TYPE_POS && (
          <OverlayTrigger
            // key={1}
            placement={"top"}
            overlay={
              <Tooltip id={`onpay`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"POS"} />
              </Tooltip>
            }
          >
            <img src={posIcon}></img>
          </OverlayTrigger>
        )}{" "}
        {row.payment_method_key === PAYMENT_TYPE_MADA_CREDIT_CARD ||
          (row.payment_method_key === PAYMENT_TYPE_MOYASAR_CREDIT_CARD && (
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip id={`onpay`} style={{ fontSize: "10px" }}>
                  <Trans i18nKey={"Credit Card"} />
                </Tooltip>
              }
            >
              <img src={smOnlinePayment}></img>
            </OverlayTrigger>
          ))}{" "}
        {parseInt(row.order_status_id) === ORDER_STATUS_READY_FOR_PICKUP && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`rfp`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Ready For Pickup"} />
              </Tooltip>
            }
          >
            <img src={smReadyForPickup}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.order_status_id) === ORDER_STATUS_CANCELLED && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`cancelled`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Cancelled"} />
              </Tooltip>
            }
          >
            <img src={smOrderCancelled}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.order_status_id) === ORDER_STATUS_CONFIRMED && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`confirmed`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Confirmed"} />
              </Tooltip>
            }
          >
            <img src={smOrderConfirmed}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.order_status_id) === ORDER_STATUS_DELIVERED && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`delivered`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Delivered"} />
              </Tooltip>
            }
          >
            <img src={smOrderDelivered}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.order_status_id) === ORDER_STATUS_ON_HOLD && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`onhold`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"On Hold"} />
              </Tooltip>
            }
          >
            <img src={smOrderOnHold}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.order_status_id) === ORDER_STATUS_SHIPPED && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`shipped`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Shipped"} />
              </Tooltip>
            }
          >
            <img src={smOrderShipped}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.delivery_slot_id) === DELIVERY_TYPE_MORNING && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`morning`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Morning"} />
              </Tooltip>
            }
          >
            <img src={smDeliveryTimeMorning}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.delivery_slot_id) === DELIVERY_TYPE_EVENING && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`evening`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Evening"} />
              </Tooltip>
            }
          >
            <img src={smDeliveryTimeEvening}></img>
          </OverlayTrigger>
        )}{" "}
        {parseInt(row.delivery_slot_id) === DELIVERY_TYPE_ANYTIME && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`anytime`} style={{ fontSize: "10px" }}>
                <Trans i18nKey={"Anytime"} />
              </Tooltip>
            }
          >
            <img src={smDeliveryTimeAnyTime}></img>
          </OverlayTrigger>
        )}{" "}
        {this.props.actionStatus &&
          this.props.isEditable &&
          this.state.hideCancelOrder &&
          parseInt(row.order_status_id) === ORDER_STATUS_READY_FOR_PICKUP && (
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip id={`cadelivery`} style={{ fontSize: "10px" }}>
                  <Trans i18nKey={"Cancel Delivery"} />
                </Tooltip>
              }
            >
              <i
                style={{ fontSize: "18px", fontWeight: "bold" }}
                onClick={(e) => this.onOrderCancelClick(row)}
                className={`fa fa-trash fa-1x text-danger`}
              ></i>
            </OverlayTrigger>
          )}
      </span>
    );
  };
  onOrderCancelClick = (row) => {
    this.setState({
      showDeliveryOrderCancelModal: true,
      cancelSelectedOrder: row.order_id,
    });
  };
  actionsFormatter = (cell, row, index) => {
    return (
      <React.Fragment>
        <div className="inline-block">
          <i
            title="Cancel Order"
            className={`fa fa-trash fa-1x ${style.Button} text-danger`}
          ></i>
        </div>
      </React.Fragment>
    );
  };
  renderDataTable = () => {
    let language = this.props.language;
    if (this.props.data) {
      let products = [];

      if (this.props.dataFor === "orders") {
        products = this.props.data;
      }
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
            className="react-bs-table-sizePerPage-dropdown dropdown"
            id={`tripplandropdown-button-drop-up`}
            drop={`up`}
            className="btnBrown"
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
          </DropdownButton>
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
      };

      let selectrowOptions;
      if (this.props.rowSelection) {
        selectrowOptions = {
          mode: "checkbox",
          clickToSelect: this.props.rowSelection,
        };
      } else {
        selectrowOptions = {
          mode: "checkbox",
          clickToSelect: false,
          hideSelectColumn: true,
        };
      }

      this.expandRow = this.expandRowSelection();
      const selectRow = {
        ...selectrowOptions,
        selectColumnPosition: "left",
        align: "left",
        clickToExpand: false,
        style: { backgroundColor: "#c8e6c9" },
        onSelect: (row, isSelect, rowIndex, e) => {
          if (isSelect) {
            let order_id = row.order_id;
            let order_lat = row.address.latitude;
            let order_lng = row.address.longitude;

            let selectedOrderIds = [...this.state.selectedOrders];
            if (!selectedOrderIds.includes(order_id)) {
              selectedOrderIds.push(order_id);
            }
            let selectedordersDetail = [...this.state.selectedOrdersDetail];
            let order_detail = {
              id: order_id,
              location: {
                latitude: order_lat,
                longitude: order_lng,
              },
            };
            selectedordersDetail.push(order_detail);
            this.setState({
              selectedOrderId: selectedOrderIds,
              selectedOrdersDetail: selectedordersDetail,
            });
            if (this.props.sendSelectedOrderId) {
              this.props.sendSelectedOrderId(
                selectedOrderIds,
                _.uniqBy(selectedordersDetail, "id")
              );
            }
          } else {
            let order_id = row.order_id;

            let selectedOrderIds = [...this.state.selectedOrders];
            if (selectedOrderIds.includes(order_id)) {
              _.remove(selectedOrderIds, (item) => item == order_id);
            }
            let selectedordersDetail = [...this.state.selectedOrdersDetail];
            _.remove(selectedordersDetail, ({ id }) => id === order_id);
            this.setState({
              selectedOrderId: selectedOrderIds,
              selectedOrdersDetail: selectedordersDetail,
            });
            this.props.sendSelectedOrderId(
              selectedOrderIds,
              selectedordersDetail
            );
          }
        },
        onSelectAll: (isSelect, rows, e) => {
          if (isSelect) {
            let selectedOrders = this.state.selectedOrders;
            let selectedorderids = _.map(products, "order_id");
            let finalOrders = [
              ...this.state.selectedOrders,
              ...selectedorderids,
            ];
            let finalDetailOrdes = [];
            products.map(({ order_id, address }) => {
              let order_lat = address.latitude;
              let order_lng = address.longitude;
              finalDetailOrdes.push({
                id: order_id,
                location: {
                  latitude: order_lat,
                  longitude: order_lng,
                },
              });
            });

            this.setState({
              selectedOrders: _.uniq(finalOrders),
              selectedOrdersDetail: finalDetailOrdes,
            });
            this.props.sendSelectedOrderId(finalOrders, finalDetailOrdes);
          } else {
            let selectedOrders = [...this.state.selectedOrders];
            let selectedOrderDetails = [...this.state.selectedOrdersDetail];
            let roworder_ids = _.map(products, "order_id");
            let finalOrders = _.pullAll(selectedOrders, roworder_ids);
            _.remove(selectedOrderDetails, ({ id }) =>
              roworder_ids.includes(id)
            );
            this.setState({
              selectedOrders: _.uniq(finalOrders),
              selectedOrdersDetail: selectedOrderDetails,
            });
            this.props.sendSelectedOrderId(finalOrders, selectedOrderDetails);
          }
        },

        selected: this.state.selectedOrders,
      };
      const defaultSorted = [
        {
          dataField: "created_at",
          order: "asc",
        },
      ];

      let columns = this.props.columns;
      columns = columns.map((val) => {
        if (val.dataField === "payment_type") {
          return {
            ...val,
            formatter: (cell, row, rowIndex) =>
              this.addPaymentFormatter(cell, row, rowIndex),
          };
        }
        if (val.dataField === "action") {
          if (this.props.showInfoIcon) {
            let editedVal = { ...val };
            editedVal.hidden = false;
            return {
              ...editedVal,
              formatter: (cell, row, rowIndex) =>
                this.addInfoFormatter(cell, row, rowIndex),
            };
          }
        }
        if (
          val.dataField === "order_number" ||
          val.dataField === "created_at" ||
          val.dataField === "address.area_name"
        ) {
          let updatedval = { ...val };
          if (val.dataField === "address.area_name") {
            updatedval.dataField = `address.area_name[${language}]`;
          }
          let text = "";
          if (this.props.t) {
            text = this.props.t(val.text);
          }
          updatedval.text = text;
          return {
            ...updatedval,
          };
        } else {
          return val;
        }
      });

      return (
        <BootstrapTable
          key={this.state.data}
          bootstrap4
          selectRow={selectRow}
          keyField={this.props.keyField}
          // keyField={'order_id'}
          data={products}
          columns={columns}
          defaultSorted={defaultSorted}
          pagination={paginationFactory(options)}
          fontSize={15}
          bordered={false}
          tdStyle={{ fontSize: "10px" }}
          noDataIndication={this.props.t("No Record Found")}
          // rowStyle={{ overflowY: 'scroll' }}
          wrapperClasses={this.props.wrapperClasses}
          expandRow={this.expandRow}
        />
      );
    }
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
  setCancelledProps = (order) => {
    this.props.getcancelledOrder(order);
  };
  renderOrderModals = () => {
    return (
      <div style={{ width: "auto", height: "auto" }}>
        <DeliveryOrderCancelModal
          show={this.state.showDeliveryOrderCancelModal}
          orderid={this.state.cancelSelectedOrder}
          t={this.props.t}
          tripId={this.props.tripId}
          language={this.props.language}
          onHide={() =>
            this.setState({
              showDeliveryOrderCancelModal: false,
              update: true,
            })
          }
          getcancelledorder={this.setCancelledProps}
        ></DeliveryOrderCancelModal>
      </div>
    );
  };
  render() {
    return (
      <React.Fragment>
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
        {this.renderOrderModals()}
        {this.renderDataTable()}
      </React.Fragment>
    );
  }
}
export default BootstrapDataTable;
