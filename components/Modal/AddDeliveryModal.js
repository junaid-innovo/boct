import React, { Component } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FadeLoader, ClipLoader } from "react-spinners";
import $ from "jquery";
import axios from "axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import OrderDataTable from "../datatable/Datatable";
import { OrderTableColumns } from "../Constants/TableColumns/OrderColumns";
import style from "./OrderCancelModal.module.css";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { Trans } from "../../i18n";
import {
  ORDER_STATUS_PENDING,
  ORDER_DELIVERED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_ON_HOLD,
} from "../Constants/Order/Constants";
import { col12 } from "../Constants/Classes/BoostrapClassses";
import { LANG_AR } from "../Constants/Language/Language";
import {
  add_delivery,
  get_routes_and_capacity,
} from "../../store/actions/routesplan/actionCreator";
import { connect } from "react-redux";
import { FOR_ROUTES_PALN_PAGE_MESSAGES } from "../Constants/Other/Constants";
import { SUCCESS_MESSAGE } from "../../store/actions/actionTypes";
class AddDeliveryModal extends Component {
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
      pageloading: true,
      selectedOrderId: [],
      selectedOrdersDetail: [],
      data: [],
      tripData: null,
      alldeliveries: [],
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
  componentDidMount() {
    this.props.getrouteandplanApi(
      "2020-08-13",
      "2020-08-13",
      this.props.selectedBranch,
      "available_deliveries"
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.toastMessages) {
      const { forPage, messageId, type, message } = this.props.toastMessages;
      if (
        forPage === FOR_ROUTES_PALN_PAGE_MESSAGES &&
        messageId !== prevProps.toastMessages.messageId
      ) {
        let getorder = _.filter(this.state.alldeliveries, ({ order_id }) => {
          return !this.state.selectedOrderId.includes(order_id);
        });
        this.setState({
          alldeliveries: getorder,
        });
      }
    }
    if (
      this.props.allavailableDeliveries !== prevProps.allavailableDeliveries
    ) {
      this.setState({
        pageloading: false,
        alldeliveries: this.props.allavailableDeliveries,
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
      type: type === SUCCESS_MESSAGE ? "success" : "error",
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
  onModalHide = () => {
    this.setState({
      tripData: null,
      alldeliveries: [],
    });
    this.props.onHide();
  };
  onAddDelvieryClick = () => {
    let data = {
      trip_id: this.props.tripId.toString(),
      order_ids: this.state.selectedOrdersDetail,
    };
    this.props.addDeliveryApi(this.props.selectedBranch, JSON.stringify(data));
  };
  render() {
    let lang = this.props.language;
    let t = this.props.t;
    return (
      <React.Fragment>
        <Modal
          show={this.props.show}
          onHide={this.onModalHide}
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
                <Trans i18nKey={"Add Deliveries"} />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ClipLoader
                css={`
                  position: fixed;
                  top: 30%;
                  left: 47%;
                  right: 40%;
                  bottom: 20%;
                  // opacity: 0.5;
                  z-index: 500;
                `}
                size={"50px"}
                this
                also
                works
                color={"#196633"}
                height={200}
                // margin={2}
                loading={this.state.pageloading}
              />
              <Container
                style={{
                  fontSize: "9px",
                }}
                className={col12}
              >
                <Row>
                  <div className={col12}>
                    <OrderDataTable
                      tripdata={this.props.tripdata}
                      sendSelectedOrderId={this.setDataTableSelectedId}
                      mapSelectedOrderId={this.state.selectedOrderId}
                      t={this.props.t}
                      language={this.props.language}
                      isEditable={this.props.isEditable}
                      getcancelledOrder={this.getOrderCancelledOrder}
                      actionStatus={false}
                      rowSelection={true}
                      rowExpansion={true}
                      columns={OrderTableColumns}
                      data={this.state.alldeliveries}
                      wrapperClasses={"infoModalBoostrapTable"}
                      dataFor="orders"
                      keyField="order_id"
                    />
                  </div>
                </Row>
                <Row className="align-items-end">
                  {this.state.selectedOrderId.length > 0 && (
                    <div className={`text-right ${col12}}`}>
                      <OverlayTrigger
                        placement={"top"}
                        overlay={
                          <Tooltip
                            id={`adddelivery`}
                            style={{ fontSize: "10px" }}
                          >
                            <Trans i18nKey={"Add Delivery"} />
                          </Tooltip>
                        }
                      >
                        <Button
                          onClick={this.onAddDelvieryClick}
                          className="btn btn-sm button-small"
                          style={{ fontSize: "95%" }}
                        >
                          Add Delivery
                        </Button>
                      </OverlayTrigger>
                    </div>
                  )}
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

const mapStateToProps = (state) => {
  return {
    selectedBranch: state.navbar.selectedBranch,
    allavailableDeliveries: state.routesplan.foravailableDeliveries,
    // toastMessages: state.toastmessages,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addDeliveryApi: (branchId, data) => dispatch(add_delivery(branchId, data)),
    getrouteandplanApi: (from_date, to_date, store_id, pageFor) =>
      dispatch(get_routes_and_capacity(from_date, to_date, store_id, pageFor)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddDeliveryModal);
