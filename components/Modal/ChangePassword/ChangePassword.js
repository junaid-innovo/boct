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
import axios from "../../API/Axios";
import { LOCAL_API_URL } from "../../Constants/Enviroment/Enviroment";
import { ToastContainer, toast, Zoom } from "react-toastify";
import moment from "moment";
import style from "./ChangePassword.module.css";
import { Trans } from "react-i18next";
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      newPasswordInvalid: false,
      newPasswordValid: false,
      newPasswordError: null,
      confirmPasswordInvalid: false,
      confirmPasswordValid: false,
      oldPasswordInValid: false,
      oldPasswordInValid: false,
      confirmPasswordError: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return state;
  }
  onVehicleChange = (e) => {
    let veh_id = parseInt(e.target.value);
    this.setState({
      selectedVehicleId: veh_id,
    });
  };
  componentDidUpdate(prevProps, prevState) {}
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

  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      this.state.oldPassword.length === 0 ||
      this.state.newPassword.length === 0 ||
      this.state.confirmPassword.length === 0 ||
      this.state.oldPassword === this.state.newPassword ||
      this.state.confirmPassword !== this.state.newPassword
    ) {
      if (this.state.oldPassword.length === 0) {
        this.setState({
          oldPasswordInValid: true,
          oldPasswordValid: false,
          validated: false,
        });
      } else if (this.state.newPassword.length === 0) {
        this.setState({
          newPasswordInvalid: true,
          newPasswordValid: false,
          validated: false,
        });
      } else if (this.state.confirmPassword.length === 0) {
        this.setState({
          confirmPasswordInvalid: true,
          confirmPasswordValid: false,
          validated: false,
        });
      } else if (this.state.oldPassword === this.state.newPassword) {
        this.setState({
          newPasswordInvalid: true,
          newPasswordValid: false,
          validated: false,
        });
      } else if (this.state.confirmPassword !== this.state.newPassword) {
        this.setState({
          confirmPasswordInvalid: true,
          confirmPasswordValid: false,
          validated: false,
        });
      } else {
        this.setState({});
      }

      e.preventDefault();
      e.stopPropagation();
    } else {
      let data = {
        password: this.state.newPassword,
        confirm_password: this.state.confirmPassword,
        old_password: this.state.oldPassword,
      };

      axios
        .post(`storesupervisor/v1/user/update`, JSON.stringify(data), {
          headers: {
            Authorization: `bearer ${localStorage.getItem("authtoken")}`,
          },
        })
        .then((res) => {
          let response = res.data;
          if (response.code === 406) {
            this.showMessage(response.message, "error");
          } else if (response.code === 200) {
            this.showMessage(response.message, "success");
            this.props.onHide();
            this.props.history.push("/login");
          } else {
            this.showMessage(response.message, "error");
          }
        })
        .catch((error) => {
          this.showMessage(error.toString(), "error", false);
        });
    }

    this.setState({
      validated: false,
    });
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
    // let t = this.props.t
    // let lang = this.props.language
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
                {/* {('Update Password')}  */}
                {"Update Password"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row key className="show-grid">
                  <Col xs={6} md={10}>
                    <FormGroup>
                      <Form.Label> {"Old Password"}</Form.Label>
                      <Form.Control
                        // required
                        type="text"
                        defaultValue={this.state.oldPassword}
                        placeholder={"Old Password"}
                        onChange={(e) => {
                          if (e.target.value.length > 0) {
                            if (this.state.newPassword === e.target.value) {
                              this.setState({
                                newPasswordInvalid: true,
                                newPasswordValid: false,
                                newPasswordError:
                                  "Please Enter A Different Password",
                              });
                            } else {
                              this.setState({
                                newPasswordInvalid: false,
                                newPasswordValid: true,
                              });
                            }
                            this.setState({
                              oldPassword: e.target.value,
                              oldPasswordValid: true,
                              validated: false,
                              oldPasswordInValid: false,
                            });
                          } else {
                            this.setState({
                              oldPassword: e.target.value,
                              oldPasswordValid: false,
                              oldPasswordInValid: true,
                            });
                          }
                        }}
                        isValid={this.state.oldPasswordValid}
                        isInvalid={this.state.oldPasswordInValid}
                      />
                      <Form.Control.Feedback type="invalid">
                        {"Old Password Is Required"}
                      </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup>
                      <Form.Label> {"New Password"}</Form.Label>
                      <Form.Control
                        // required
                        type="text"
                        defaultValue={this.state.newPassword}
                        placeholder={"New Password"}
                        onChange={(e) => {
                          if (
                            e.target.value.length > 0 &&
                            this.state.oldPassword === e.target.value
                          ) {
                            this.setState({
                              newPassword: e.target.value,
                              newPasswordInvalid: true,
                              newPasswordValid: false,
                              validated: false,
                              newPasswordError:
                                "Please Enter A Different Password",
                            });
                          } else {
                            this.setState({
                              newPassword: e.target.value,
                              newPasswordInvalid: false,
                              newPasswordValid: true,
                              newPasswordError: null,
                            });
                          }
                        }}
                        isInvalid={this.state.newPasswordInvalid}
                        isValid={this.state.newPasswordValid}
                      />
                      <Form.Control.Feedback type="invalid">
                        {this.state.newPasswordError
                          ? this.state.newPasswordError
                          : "New Password Is Required"}
                      </Form.Control.Feedback>
                    </FormGroup>{" "}
                    <FormGroup>
                      <Form.Label>{"Confirm New Password"}</Form.Label>
                      <Form.Control
                        // required
                        type="text"
                        defaultValue={this.state.confirmPassword}
                        placeholder={"Confirm New Password"}
                        onChange={(e) => {
                          if (
                            this.state.newPassword !== e.target.value &&
                            e.target.value.length > 0
                          ) {
                            this.setState({
                              confirmPassword: e.target.value,
                              confirmPasswordInvalid: true,
                              confirmPasswordValid: false,
                              validated: false,
                              confirmPasswordError:
                                "Password Does Not Match New Password",
                            });
                          } else {
                            this.setState({
                              confirmPassword: e.target.value,
                              confirmPasswordInvalid: false,
                              confirmPasswordValid: true,
                              confirmPasswordError: null,
                            });
                          }
                        }}
                        isInvalid={this.state.confirmPasswordInvalid}
                        isValid={this.state.confirmPasswordValid}
                      />
                      <Form.Control.Feedback type="invalid">
                        {this.state.confirmPasswordError
                          ? this.state.confirmPasswordError
                          : "New Password Is Required"}
                      </Form.Control.Feedback>
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btnGreen">
                <i className="fa fa-check"></i> {"Update"}
              </Button>
              <Button className="btn btnBrown" onClick={this.props.onHide}>
                <i className="fa fa-close"></i> {"Cancel"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ChangePassword;
