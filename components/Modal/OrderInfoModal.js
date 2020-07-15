import React, { Component } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
} from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import $ from "jquery";
import axios from "axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import OrderDataTable from "../datatable/Datatable";
import { OrderTableColumns } from "../Constants/TableColumns/OrderColumns";
import style from "./OrderCancelModal.module.css";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { Trans } from "react-i18next";
import {
  ORDER_STATUS_PENDING,
  ORDER_DELIVERED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_ON_HOLD,
} from "../Constants/Order/Constants";
import { col12 } from "../Constants/Classes/BoostrapClassses";
import { LANG_AR } from "../Constants/Language/Language";
class OrderInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      reasons: [],
      order_id: null,
      orderStatus: {
        totalOrders: null,
        pendingOrders: null,
        deliveredOrders: null,
        cancelledOrders: null,
      },
      data: [],
      tripData: null,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.orderdata) {
      return {
        data: props.orderdata,
      };
    }
    return state;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.orderdata !== prevProps.orderdata) {
      let totalOrders = this.props.orderdata.length;
      let pendingOrders = 0;
      let cancelledOrders = 0;
      let deliveredOrders = 0;
      this.props.orderdata.map(({ order }) => {
        let Orderstatus = parseInt(order.order_status_id);
        if (
          Orderstatus !== ORDER_DELIVERED &&
          Orderstatus !== ORDER_STATUS_CANCELLED &&
          Orderstatus !== ORDER_STATUS_ON_HOLD
        ) {
          pendingOrders = pendingOrders + 1;
        }
        if (Orderstatus === ORDER_DELIVERED) {
          deliveredOrders = deliveredOrders + 1;
        }
        if (
          Orderstatus === ORDER_STATUS_CANCELLED ||
          Orderstatus === ORDER_STATUS_ON_HOLD
        ) {
          cancelledOrders = cancelledOrders + 1;
        }
      });
      this.setState({
        data: [...this.props.orderdata],
        orderStatus: {
          totalOrders: totalOrders,
          pendingOrders: pendingOrders,
          deliveredOrders: deliveredOrders,
          cancelledOrders: cancelledOrders,
        },
        tripData: this.props.tripdata,
      });
    }
  }
  renderFadeLoader = () => {
    return (
      <FadeLoader
        css={`
          cssdisplay: block;
          margin: 0 auto;
          border-color: red;
        `}
        size={150}
        color={"#123abc"}
        loading={this.state.sideloading}
      />
    );
  };

  getOrderCancelledOrder = (order) => {
    this.props.getcancelledorder(order);
    this.setState({
      data: [],
    });
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
  render() {
    let lang = this.props.language;
    let t = this.props.t;
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

        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Form
            // className={style.tripIfoTable}
            noValidate
            validated={this.state.validated}
            // onSubmit={(e) => this.handleSubmit(e)}
          >
            <Modal.Header closeButton>
              <Modal.Title
                id="contained-modal-title-vcenter"
                className="col-11 text-center"
              >
                <Trans i18nKey={"Trip Information"} />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container
                style={{
                  fontSize: "9px",
                }}
                className={col12}
              >
                <Row>
                  <table className="table offset-1 col-9">
                    <tbody dir={lang === LANG_AR ? "rtl" : null}>
                      <tr>
                        <td className={style.tableZeroTopBorder} scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Trip Code")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {this.props.tripdata &&
                              this.props.tripdata.trip_code}
                          </span>
                        </td>
                        <td className={style.tableZeroTopBorder} scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Trip Date")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {" "}
                            {this.props.tripdata &&
                              this.props.tripdata.trip_date &&
                              this.props.tripdata.trip_date}
                          </span>
                        </td>
                        <td className={style.tableZeroTopBorder} scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Vehicle Code/Plate No")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >{`${
                            this.props.tripdata &&
                            this.props.tripdata.vehicle_code
                          }${" "}/${" "}${
                            this.props.tripdata &&
                            this.props.tripdata.vehicle_plate_number
                          }`}</span>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Driver Name")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {this.props.tripdata &&
                              this.props.tripdata.driver.name}
                          </span>
                        </td>
                        <td scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Trip Status")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {this.props.tripdata &&
                            this.props.tripdata.trip_status
                              ? this.props.tripdata.trip_status[lang]
                              : null}
                          </span>
                        </td>
                        <td scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Total Orders")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {this.state.orderStatus.totalOrders}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Pending Orders")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {" "}
                            {this.state.orderStatus.pendingOrders}
                          </span>
                        </td>
                        <td scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Delivered")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {" "}
                            {this.state.orderStatus.deliveredOrders}
                          </span>
                        </td>
                        <td scope="row">
                          <b
                            className={`${
                              lang === LANG_AR ? "pull-right" : "pull-left"
                            }`}
                          >
                            {t("Cancelled Orders")}:
                          </b>
                          <span
                            className={`${
                              lang === LANG_AR ? "pull-left" : "pull-right"
                            }`}
                          >
                            {" "}
                            {this.state.orderStatus.cancelledOrders}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Row>
                <Row>
                  <div className={col12}>
                    <OrderDataTable
                      tripdata={this.props.tripdata}
                      t={this.props.t}
                      language={this.props.language}
                      isEditable={this.props.isEditable}
                      getcancelledOrder={this.getOrderCancelledOrder}
                      actionStatus={true}
                      rowSelection={false}
                      rowExpansion={true}
                      columns={OrderTableColumns}
                      data={this.state.data}
                      wrapperClasses={"infoModalBoostrapTable"}
                      dataFor="orders"
                      keyField="order_id"
                    />
                  </div>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default OrderInfoModal;
