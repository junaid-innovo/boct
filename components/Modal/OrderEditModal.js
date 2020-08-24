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
import { FadeLoader, ClipLoader } from "react-spinners";
import $ from "jquery";
import axios from "../API/Axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import DatePicker from "../DatePicker/Simple";
import { ToastContainer, toast, Zoom } from "react-toastify";
import moment from "moment";
import style from "./OrderEditModal.module.css";
import { connect } from "react-redux";
import {
  update_delivery,
  get_available_vehciles,
} from "../../store/actions/routesplan/actionCreator";
import {
  FOR_NAV_BAR_PAGE_MESSAGES,
  FOR_ROUTES_PALN_PAGE_MESSAGES,
} from "../Constants/Other/Constants";
class OrderEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      reasons: [],
      order_id: null,
      selectedTrip: null,
      tripDate: new Date(),
      vehiclePlatNo: null,
      dateFormat: "yyyy-MM-dd",
      tripCode: null,
      vehilcesList: [],
      staticvehicleObj: null,
      selectedVehicleId: null,
    };
  }

  componentDidMount() {
    if (this.props.editdata) {
      this.setState({
        selectedTrip: this.props.editdata,
        tripCode: this.props.editdata.trip_code,
        tripDate: new Date(this.props.editdata.trip_date),
        vehilcesList: this.props.vehiclesdata,
        selectedVehicleId: this.props.editdata.vehicle_id,
        vehiclePlatNo: this.props.editdata.vehicle_plate_number,
      });
    }
  }
  onVehicleChange = (e) => {
    let veh_id = parseInt(e.target.value);
    this.setState({
      selectedVehicleId: veh_id,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.state.tripDate !== prevState.tripDate) {
      this.getVehicleList();
    }
    if (this.state.vehicleList !== this.props.vehicleList) {
      this.setState({
        vehicleList: this.props.vehicleList,
        vehicleLoading: false,
        pageloading: false,
      });
    }
    if (this.props.toastMessages) {
      const { forPage, messageId, type, message } = this.props.toastMessages;
      if (
        forPage === FOR_ROUTES_PALN_PAGE_MESSAGES &&
        messageId !== prevProps.toastMessages.messageId
      ) {
        this.props.onHide()
      }
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
  getVehicleList = () => {
    let tripDate = moment(this.state.tripDate).format("YYYY-MM-DD");
    this.props.getAvailableVehiclesApi(this.props.selectedBranch, tripDate);
    // axios
    //   .get(
    //     `storesupervisor/v1/${tripDate}/${this.props.warehouse_id}/availableVehicles`,
    //     {
    //       headers: {
    //         Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       let vehObj = {
    //         vehicle_id: this.state.selectedVehicleId,
    //         number_plate: this.state.vehiclePlatNo,
    //       };
    //       var data = response.data;
    //       let allvehicles = [...data.availabeVehicles];

    //       allvehicles.push(vehObj);
    //       this.setState({
    //         vehilcesList: allvehicles,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     this.showMessage(error.toString(), "error", false);
    // });
  };
  onTripDateChange = (date) => {
    this.setState({ tripDate: date, pageloading: true });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      trip_code: this.state.tripCode,
      vehicle_id: this.state.selectedVehicleId,
      trip_date: moment(this.state.tripDate).format("YYYY-MM-DD"),
    };
    this.props.updateDeliveryApi(
      this.props.selectedBranch,
      JSON.stringify(data)
    );
    // axios
    //   .post(`storesupervisor/v1/editTrip`, JSON.stringify(data), {
    //     headers: {
    //       Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //     },
    //   })
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       this.showMessage(response.mesaege, "success");
    //       this.props.onHide();
    //     } else {
    //       this.showMessage(response.mesaege, "error");
    //     }
    //   })
    //   .catch((error) => {
    //     this.showMessage(error.toString(), "error", false);
    //   });
  };

  renderVehicles = () => {
    let t = this.props.t;
    return (
      <FormGroup>
        <Form.Label>{t("Select Vehicle")}</Form.Label>

        <Form.Control
          as="select"
          className="rounded-0"
          onChange={this.onVehicleChange}
          value={
            this.state.selectedVehicleId ? this.state.selectedVehicleId : ""
          }
        >
          <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
            --- {t("Select Vehicle")} ---
          </option>
          {this.state.vehilcesList.map((vehicle) => (
            <option
              key={vehicle.vehicle_id}
              disabled={
                this.props.editdata.vehicle_id === vehicle.vehicle_id
                  ? true
                  : false
              }
              value={vehicle.vehicle_id}
            >
              {vehicle.number_plate}
            </option>
          ))}
        </Form.Control>
      </FormGroup>
    );
  };
  render() {
    let t = this.props.t;
    let lang = this.props.language;
    return (
      <React.Fragment>
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
                {t("Update Trip")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className={this.state.pageloading && "text-center"}>
              {this.state.pageloading ? (
                <ClipLoader
                  css={`
                    position: inherit;
                    margin: 0 auto;
                    // opacity: 0.5;
                    z-index: 500;
                  `}
                  size={"80px"}
                  this
                  also
                  works
                  color={"#196633"}
                  height={200}
                  // margin={2}
                  loading={this.state.pageloading}
                />
              ) : (
                <Container>
                  <Row key className="show-grid">
                    <Col xs={6} md={10}>
                      <FormGroup>
                        <Form.Label>{t("Trip Date")}</Form.Label>
                        <div className={`test`}>
                          <DatePicker
                            showTimeSelect={false}
                            title={t("Select Date")}
                            currentDate={this.state.tripDate}
                            dateFormat={this.state.dateFormat}
                            minDate={new Date()}
                            onChange={this.onTripDateChange}
                            calendarClassName="row"
                            className={`form-control`}
                          ></DatePicker>
                        </div>
                      </FormGroup>
                      <FormGroup></FormGroup>
                      {this.state.vehilcesList.length > 0 &&
                        this.renderVehicles()}
                    </Col>
                  </Row>
                </Container>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btnGreen">
                <i className="fa fa-check"></i> {t("Update Trip")}
              </Button>
              <Button className="btn btnBrown" onClick={this.props.onHide}>
                <i className="fa fa-close"></i> {t("Cancel")}
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
    selectedBranch: state.navbar.selectedBranch,
    vehicleList: state.routesplan.vehicleList,
    toastMessages: state.toastmessages,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAvailableVehiclesApi: (branchId, date) =>
      dispatch(get_available_vehciles(branchId, date)),
    updateDeliveryApi: (branchId, date) =>
      dispatch(update_delivery(branchId, date, FOR_ROUTES_PALN_PAGE_MESSAGES)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderEditModal);
