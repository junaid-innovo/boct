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
import axios from "../API/Axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import { ToastContainer, toast, Zoom } from "react-toastify";
import style from "./OrderCancelModal.module.css";
import { connect } from "react-redux";
import { cancel_order } from "../../store/actions/live/actionCreator";
class DeliveryTripOrderCancel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      tripId: null,
      selectedOrderId: null,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.orderid !== this.state.selectedOrderId) {
      this.setState({
        selectedOrderId: this.props.orderid,
      });
    }
    if (this.props.cancelOrderResponse !== prevProps.cancelOrderResponse) {
      this.showMessageTest(this.props.cancelOrderResponse, "success");
    }
  }
  handleSubmit = (e) => {
    const data = {
      deliveries: [this.state.selectedOrderId],
      trip_id: this.props.tripId,
    };
    const newdata = JSON.stringify(data);
    this.props.removeDeliveryApi(this.props.selectedBranch, data);
    // axios
    //    .post(`storesupervisor/v1/cancelOrders`, newdata, {
    //       headers: {
    //          Authorization: `bearer ${localStorage.getItem('authtoken')}`,
    //       },
    //    })
    //    .then((res) => {
    //       let response = res.data
    //       if (response.code === 200) {
    //          this.showMessageTest(response.message, 'success')
    //          this.props.onHide()
    //          this.props.getcancelledorder(this.state.selectedOrderId)
    //       } else {
    //          this.showMessageTest(response.message, 'error')
    //       }
    //    })
    //    .catch((error) => {
    //       this.showMessageTest(error.toString(), 'error', false)
    //    })
    e.preventDefault();
  };
  showMessageTest = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success" ? style.toastContainerSuccess : style.toastContainer,
    });
  render() {
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
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={(e) => this.handleSubmit(e)}
          >
            <Modal.Header closeButton>
              <Modal.Title
                id="contained-modal-title-vcenter"
                className="col-11 text-center"
              >
                {t("Cancel Delivery Order")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <h5>
                  {t("Are you sure you want to remove delivery order")}
                  ??
                </h5>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btn-danger">
                {t("Yes")}
              </Button>
              <Button onClick={this.props.onHide}>{t("No")}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cancelOrderResponse: state.live.cancelOrderResponse,
    selectedBranch: state.navbar.selectedBranch,
    cancelOrderResponse: state.live.cancelOrderResponse,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeDeliveryApi: (store_id, data) =>
      dispatch(remove_delivery(store_id, data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryTripOrderCancel);
