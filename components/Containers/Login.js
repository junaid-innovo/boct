import React, { Component } from "react";
import {
  Button,
  FormGroup,
  Form,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import { Redirect } from "react-router-dom";
// import Logo from '../../images/controltower.png'
import AseelLogo from "../../public/images/controltower.png";
// import App from "./App";
import styles from "./Login.module.css";
import axios from "../API/Axios";
import {
  LOCAL_API_URL,
  LANGUAGE_STRING,
} from "../Constants/Enviroment/Enviroment";
// import { askForPermissioToReceiveNotifications } from "../notifications/Push";
import { ToastContainer, toast, Zoom } from "react-toastify";
import jwt from "jsonwebtoken";
import ChangePasswordModal from "../Modal/ChangePassword/ChangePassword";
import { ClipLoader } from "react-spinners";
import { ONLY_FOR_SUPERVISOR } from "../Constants/Messages/Messages";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggedin: false,
      fcm_token: null,
      validated: false,
      emailIsValid: false,
      emailInvalid: false,
      passIsValid: false,
      passInvalid: false,
      showPassword: false,
      showEmail: true,
      pageloading: false,
      showChangePasswordModal: false,
      fcmToken: null,
    };
  }
  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };
  async componentDidMount() {
    if (localStorage.getItem("authtoken")) {
      localStorage.removeItem("authtoken");
    }
    if (localStorage.getItem("username")) {
      localStorage.removeItem("username");
    }

    // await askForPermissioToReceiveNotifications().then((val) => {
    //   console.log(val);
    //   let fcm_token = null;
    //   fcm_token = val;
    //   this.setState({
    //     fcmToken: fcm_token,
    //   });
    // });
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    // let str = e.target.value
    if (
      this.state.email.length === 0 ||
      this.state.password.length === 0 ||
      !this.state.email.match(regex)
    ) {
      if (this.state.email.length === 0) {
        this.setState({
          emailInvalid: true,
          emailIsValid: false,
        });
      }
      if (this.state.password.length === 0) {
        this.setState({
          passInvalid: true,
          passIsValid: false,
        });
      }
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.setState({
        pageloading: true,
      });

      let formData = new FormData();
      formData.append("email", this.state.email);
      formData.append("password", this.state.password);
      formData.append("firebase_id", this.state.fcmToken);
      axios
        .post(`v1/user/login`, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
        .then((res) => {
          let response = res.data;
          if (res.status === 200) {
            if (response.token) {
              let jwtString = jwt.decode(response.token);
              let prefLang = jwtString.preferred_lang;
              if (prefLang) {
                localStorage.setItem(LANGUAGE_STRING, prefLang);
              }
              let role = jwtString.role;
              let userName = jwtString.name;
              if (role.length === 0) {
                this.showMessage(ONLY_FOR_SUPERVISOR, "error");
                this.setState({
                  loggedin: false,
                  email: "",
                  password: "",
                  emailIsValid: false,
                  passIsValid: false,
                  pageloading: false,
                });
              } else {
                localStorage.setItem("authtoken", response.token);
                localStorage.setItem("username", userName);
                this.setState({ loggedin: true, pageloading: false });
                this.props.loggedin(true);
              }
            }
          }
          if (parseInt(response.code) === 401) {
            this.setState({
              pageloading: false,
            });
            this.showMessage(response.message, "error");
          }
        })
        .catch((error) => console.log(error));
    }
    this.setState({ validated: false });
  };
  onNextClick = () => {
    let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    // let str = e.target.value
    if (this.state.email.length === 0 || !this.state.email.match(regex)) {
      if (this.state.email.length === 0) {
        this.setState({
          emailInvalid: true,
          emailIsValid: false,
        });
      }
    } else {
      this.setState({
        showEmail: false,
        showPassword: true,
      });
    }
  };
  rednerLoginDesign = () => {
    return (
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="m-auto">
            <div className="col-12">
              <img
                alt="logo"
                style={{ maxHeight: "100px", maxWidth: "100px" }}
                // src={Logo}
                src={AseelLogo}
                // src="https://alaseeldates.com/wp-content/uploads/2019/08/aseel_logo.png"
              />
            </div>
          </div>
        </div>
        <div className="row mb-3 mt-1">
          <div className="m-auto">
            <div className="col-12">
              <h6>Control Tower</h6>
            </div>
          </div>
        </div>
        <div className="row m-auto">
          <div className="col-12">
            <div className={styles.Login}>
              <Form
                noValidate
                validated={this.state.validated}
                onSubmit={this.handleSubmit}
              >
                {this.state.showEmail && (
                  <React.Fragment>
                    <FormGroup controlid="email" bssize="large">
                      <FormLabel>Email</FormLabel>
                      <FormLabel className={"pull-right"}>
                        البريد الإلكتروني
                      </FormLabel>
                      <FormControl
                        required
                        autoFocus
                        ref="email"
                        // type="email"
                        value={this.state.email}
                        onChange={(e) => {
                          let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                          let str = e.target.value;
                          let m;

                          if ((m = regex.exec(str)) !== null) {
                            // The result can be accessed through the `m`-variable.
                            m.forEach((match, groupIndex) => {
                              this.setState({
                                email: e.target.value,
                                emailIsValid: true,
                                emailInvalid: false,
                              });
                            });
                          } else {
                            this.setState({
                              email: e.target.value,
                              emailInvalid: true,
                              emailIsValid: false,
                            });
                          }
                        }}
                        isValid={this.state.emailIsValid}
                        isInvalid={this.state.emailInvalid}
                      />
                      <Form.Control.Feedback type="invalid">
                        Valid Email Is Required
                      </Form.Control.Feedback>
                    </FormGroup>
                    <Button
                      block
                      bssize="large"
                      onClick={this.onNextClick}
                      // disabled={!this.validateForm()}
                      type="button"
                    >
                      Next / التالى
                    </Button>
                  </React.Fragment>
                )}
                {this.state.showPassword && (
                  <React.Fragment>
                    <FormGroup controlId="password" bssize="large">
                      <FormLabel>Password</FormLabel>
                      <FormLabel className={"pull-right"}>كلمه السر</FormLabel>
                      <FormControl
                        required
                        value={this.state.password}
                        onChange={(e) => {
                          if (e.target.value.length > 0) {
                            this.setState({
                              password: e.target.value,
                              passInvalid: false,
                              passIsValid: true,
                            });
                          } else {
                            this.setState({
                              password: e.target.value,
                              passInvalid: true,
                              passIsValid: false,
                            });
                          }
                        }}
                        type="password"
                        isValid={this.state.passIsValid}
                        isInvalid={this.state.passInvalid}
                      />
                      <Form.Control.Feedback type="invalid">
                        Password Is Required
                      </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup>
                      <Form.Control
                        as="select"
                        className="rounded-0"
                        // onChange={this.onRouteChange}
                        // value={
                        //   this.state.selectedRoute
                        //     ? this.state.selectedRoute
                        //     : ""
                        // }
                      >
                        <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                          ---Select Company---
                        </option>
                      </Form.Control>
                    </FormGroup>
                    <Button
                      block
                      bssize="large"
                      // disabled={!this.validateForm()}
                      type="submit"
                    >
                      Login / تسجيل الدخول
                    </Button>
                  </React.Fragment>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success"
          ? styles.toastContainerSuccess
          : styles.toastContainer,
      // progressClassName: style.toastProgressBar,
    });
  render() {
    return (
      <div className={this.state.pageloading ? styles.loadmain : null}>
        <ToastContainer
          position="top-center"
          transition={Zoom}
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
            z-index: 999999;
            background-color: grey;
          `}
          size={"200px"}
          this
          also
          works
          color={"#196633"}
          height={100}
          loading={this.state.pageloading}
        />

        {this.rednerLoginDesign()}
      </div>
    );
  }
}
export default Login;
