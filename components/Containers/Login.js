import React, { Component } from "react";
import {
  Button,
  FormGroup,
  Form,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import { withRouter } from "next/router";
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
import {
  get_companies,
  get_login,
} from "../../store/actionsCreators/loginCreator";
import Router from "next/router";
import ChangePasswordModal from "../Modal/ChangePassword/ChangePassword";
import { ClipLoader } from "react-spinners";
import { ONLY_FOR_SUPERVISOR } from "../Constants/Messages/Messages";
import { dispatch } from "d3";
import { connect } from "react-redux";
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
      companyIsValid: false,
      companyInvalid: false,
      showPassword: false,
      showEmail: true,
      pageloading: false,
      showChangePasswordModal: false,
      fcmToken: null,
      selectedCompany: null,
      userCompaniesList: [],
    };
  }
  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };
  onCompanyChange = (e) => {
    let selectedCompany = e.target.value;
    console.log("CHECK VALUE NOW", selectedCompany);
    if (selectedCompany && selectedCompany.length > 0) {
      this.setState({
        companyIsValid: true,
        companyInvalid: false,
      });
    } else {
      this.setState({
        companyIsValid: false,
        companyInvalid: true,
      });
    }
    this.setState({
      selectedCompany: selectedCompany,
    });
  };
  getUserCompanies = () => {
    var data = { email: this.state.email };
    this.props.getCompanyApi(data);
  };

  async componentDidMount() {
    if (localStorage.getItem("authtoken")) {
      localStorage.removeItem("authtoken");
    }
    if (localStorage.getItem("username")) {
      localStorage.removeItem("username");
    }
  }
  handleSubmit = (event) => {
    let lang = this.props.i18n.language;
    event.preventDefault();
    const form = event.currentTarget;
    if (
      this.state.password.length === 0 ||
      this.state.selectedCompany.length === 0
    ) {
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
      formData.append("company_id", this.state.selectedCompany);
      this.props.getLoginApi(formData, this.props.i18n.language);
      // formData.append("firebase_id", this.state.fcmToken);

      this.setState({ validated: false });
    }
  };
  onNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (this.state.email.length === 0 || !this.state.email.match(regex)) {
      if (this.state.email.length === 0) {
        this.setState({
          emailInvalid: true,
          emailIsValid: false,
        });
      }
    } else {
      this.setState({
        pageloading: true,
      });
      this.getUserCompanies();
    }
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.userCompaniesList !== prevProps.userCompaniesList) {
      this.setState({
        showEmail: false,
        showPassword: true,
        userCompaniesList: this.props.userCompaniesList,
        pageloading: false,
      });
    }
    if (this.props.loggedIn !== prevProps.loggedIn) {
      if (this.props.loggedIn) {
        Router.replace("/");
      }
    }
  }
  rednerLoginDesign = () => {
    let lang = this.props.i18n.language;
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
                      disabled={!this.state.showEmail}
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
                  {this.state.showEmail && (
                    <Button
                      block
                      bssize="large"
                      onClick={this.onNextClick}
                      // disabled={!this.validateForm()}
                      type="button"
                    >
                      Next / التالى
                    </Button>
                  )}
                </React.Fragment>

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
                        onChange={this.onCompanyChange}
                        value={
                          this.state.selectedCompany
                            ? this.state.selectedCompany
                            : ""
                        }
                        isValid={this.state.companyIsValid}
                        isInvalid={this.state.companyInvalid}
                      >
                        <option
                          value=""
                          data-content="<i class='fa fa-cutlery'></i> Cutlery"
                        >
                          ---Select Company---
                        </option>
                        {this.state.userCompaniesList.map((com) => {
                          return (
                            <option key={com.company_id} value={com.company_id}>
                              {`${com.company_name[lang]}-${com.company_code}`}
                            </option>
                          );
                        })}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Company Is Required
                      </Form.Control.Feedback>
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
const mapStateToProps = (state) => {
  return {
    loggedIn: state.authorization.logggedIn,
    userCompaniesList: state.authorization.companiesList,
    // selectedBranchId: state.navbar.selectedBranch,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyApi: (data) => dispatch(get_companies(data)),
    getLoginApi: (data) => dispatch(get_login(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
