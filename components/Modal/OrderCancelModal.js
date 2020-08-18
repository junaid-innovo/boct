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
import { remove_delivery } from "../../store/actions/routesplan/actionCreator";
class OrderCancelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      tripId: null,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.canceldata) {
        this.setState({
          tripId: this.props.canceldata.delivery_trip_id,
        });
      } else {
        this.setState({
          tripId: null,
        });
      }
    }
    if (this.props.message != prevProps.message) {
      this.showMessage(this.props.message, "success");
    }
  }
  handleSubmit = (e) => {
    const data = {
      trip_id: `${this.state.tripId}`,
      deliveries: [],
    };
    const newdata = JSON.stringify(data);
    this.props.removeDeliveryApi(this.props.selectedBranchId, newdata);
    //  axios
    //    .post(`storesupervisor/v1/removeTrip`, newdata, {
    //      headers: {
    //        Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //      },
    //    })
    //    .then((res) => {
    //      let response = res.data;
    //      if (response.code === 200) {
    //        this.props.cancelleddelivery(this.state.tripId);
    //        this.props.onHide();
    //        this.showMessage(response.message, "success");
    //      } else {
    //        this.showMessage(response.message, "error");
    //      }
    //    })
    //    .catch((error) => console.log(error));
    e.preventDefault();
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success" ? style.toastContainerSuccess : style.toastContainer,
    });
  render() {
    let t = this.props.t;
    let language = this.props.language;
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
                {t("Cancel Delivery Trip")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <h5 className="text-center">
                  {" "}
                  {t("Are you sure you want to delete trip??")}
                </h5>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btnGreen">
                {t("Yes")}
              </Button>
              <Button className="btn btnBrown" onClick={this.props.onHide}>
                {t("No")}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    message: state.routesplan.message,
    selectedBranchId: state.navbar.selectedBranch,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeDeliveryApi: (branchId, data) =>
      dispatch(remove_delivery(branchId, data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderCancelModal);
