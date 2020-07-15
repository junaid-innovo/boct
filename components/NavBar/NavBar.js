import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Navbar,
  Nav,
  Form,
  NavDropdown,
  FormGroup,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { askForPermissioToReceiveNotifications } from "../notifications/Push";
import { connect } from "react-redux";
import Logo from "../../public/images/controltower.png";
import AseelLogo from "../../public/images/controltower.png";
import { NavLink } from "react-router-dom";
import Link from "next/link";
import { LoadFadeLoader } from "../Loaders/Loaders";
import style from "./NavBar.module.css";
import axios from "../API/Axios";
import moment from "moment";
import ChangePasswordModal from "../Modal/ChangePassword/ChangePassword";
import {
  LOCAL_API_URL,
  LANGUAGE_STRING,
} from "../Constants/Enviroment/Enviroment";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { ONLY_FOR_SUPERVISOR } from "../Constants/Messages/Messages";
import _ from "lodash";
import $ from "jquery";
import { Trans, i18n } from "../../i18n";
import { get_defaults } from "../../store/actions/actionsCreator";
import { LANG_AR, LANG_EN } from "../Constants/Language/Language";
import { ClipLoader } from "react-spinners";
import { withRouter } from "next/router";
class NavBar extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      // selectedDate: new Date(),
      storeList: [],
      storeSelected: false,
      selectedStoreId: null,
      message: "",
      selectedDate: null,
      vehicles: null,
      routesEnabled: false,
      defaultCenter: null,
      showChangePasswordModal: false,
      pageloading: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (_.isEmpty(props)) {
      return {
        // selectedStoreId: null,
        vehicles: null,
        storeList: [],
      };
    }
    if (props.storeList) {
      return {
        // storeList: props.storeList,
        selectedDate: props.currentDate,
      };
    }
    if (props.selectedwarehouse_id) {
      if (!state.selectedStoreId) {
        return {
          selectedStoreId: props.selectedwarehouse_id,
        };
      }
    }
    return state;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      // alert("MOunted");
      console.log("MOUNTED NAVBAR");
      this.props.getDefaultsApi();
      // this.getStoreByDefault();
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedStoreId !== this.state.selectedStoreId) {
      const { cookies } = this.props;
      cookies.set("AseelWareHouse", this.state.selectedStoreId, {
        path: "/",
      });
      cookies.set("AseelWareHouseLocation", this.state.defaultCenter, {
        path: "/",
      });
      if (this.state.defaultCenter) {
        this.props.warehouse_id(
          this.state.selectedStoreId,
          this.state.defaultCenter
        );
      }
    }
    if (prevState.routesEnabled !== this.state.routesEnabled) {
      this.props.setRoutesStatus(this.state.routesEnabled);
    }
    if (this.state.storeList !== prevState.storeList) {
      if (this.state.storeList.length > 0) {
        if (this.props.cookies.get("AseelWareHouse")) {
          this.setState({
            selectedStoreId: this.props.cookies.get("AseelWareHouse"),
          });
        }
        if (this.props.cookies.get("AseelWareHouseLocation")) {
          this.setState({
            defaultCenter: this.props.cookies.get("AseelWareHouseLocation"),
          });
        }
      }
    }
  }
  getStoreByDefault = () => {
    axios
      .get(`storesupervisor/v1/defaults`, {
        headers: {
          // Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        if (this._isMounted) {
          let response = res.data;
          if (response.code === 200) {
            let data = response.data;
            if (data.ware_houses.length > 0) {
              if (data) {
                let storeList = data.ware_houses;
                // console.log()
                if (storeList.length === 1) {
                  const { latitude, longitude } = storeList[0].loacation;
                  let defaultCenter = {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  };
                  this.setState({
                    selectedStoreId: storeList[0].warehouse_id,
                    storeList: storeList,
                    defaultCenter: defaultCenter,
                    routesEnabled:
                      parseInt(data.routes_enabled) === 1 ? true : false,
                  });
                } else {
                  this.setState({
                    storeList: data.ware_houses,
                    routesEnabled:
                      parseInt(data.routes_enabled) === 1 ? true : false,
                  });
                }
              }
            } else {
              this.showMessage("No Data Found");
            }
          } else {
            if (response.code === 401) {
              // if (response.message === ONLY_FOR_SUPERVISOR) {
              this.logoutUser();
              // }
            }
            if (response.code === 404) {
              if (response.message) {
                this.showMessage(response.message, "error");
              }
            }
          }
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), "error", false);
      });
  };

  getSelectedDate = (date) => {
    this.setState({ selectedDate: date });
  };
  onBranchChange = (e) => {
    let warehouse_id = e.target.value;
    if (warehouse_id.length > 0) {
      let storeList = [...this.state.storeList];
      let filterWareHouses = _.filter(storeList, (ware_house) => {
        if (ware_house.warehouse_id === parseInt(warehouse_id)) {
          return ware_house.loacation;
        }
      });
      const { latitude, longitude } = filterWareHouses[0].loacation;
      let defaultCenter = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      };
      if (warehouse_id === "") {
        // this.props.vehiclesList(null);
      } else {
        this.setState({
          selectedStoreId: parseInt(warehouse_id),
          defaultCenter: defaultCenter,
        });
      }
    }
  };
  getDefaultTex = () => {
    // return <Trans i18nKey={"Select Branch"} />;
    return "Select Branch";
  };
  rednerBranches = () => {
    return this.props.warehouses.length > 0 ? (
      <Form inline>
        <Form.Group
          as={Row}
          controlId="formHorizontalEmail"
          className={`m-auto`}
        >
          <Form.Label
            column
            sm={!this.state.selectedStoreId ? 2 : 3}
            lg={!this.state.selectedStoreId ? 2 : 3}
            className={`${style.upSelectLabel} mt-3`}
          >
            <Trans i18nKey={"Branches"} />
          </Form.Label>
          <Col
            sm={!this.state.selectedStoreId ? 6 : 9}
            lg={!this.state.selectedStoreId ? 6 : 9}
          >
            <Form.Control
              as="select"
              onChange={this.onBranchChange}
              className={`${style.upSelect} mt-3 `}
              value={
                this.state.selectedStoreId ? this.state.selectedStoreId : ""
              }
              required
            >
              <option value="">{this.props.t("Select Branch")}</option>
              {/* <option value="">{"Select Branch"}</option> */}

              {this.props.warehouses.map((store, key) => (
                <option key={store.store_id} value={store.warehouse_id}>
                  {store.store_name.en}
                </option>
              ))}
            </Form.Control>
          </Col>
          {!this.state.selectedStoreId && (
            <Col sm={4} lg={4} className="mt-3">
              <span
                style={{
                  fontSize: "12px",
                  // fontWeight: 'bold',
                  color: "red",
                }}
              >
                <Trans i18nKey={"Please Select Branch"}>
                  {"Please Select Branch"}
                </Trans>
                {/* {"Please Select Branch"} */}
              </span>
            </Col>
          )}
        </Form.Group>
      </Form>
    ) : (
      // </SelectedStoreContext.Provider>
      <LoadFadeLoader height={2} size="5" css={""}></LoadFadeLoader>
    );
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className: style.toastContainer,
    });
  logoutUser = () => {
    this.setState({
      pageloading: true,
    });
    axios
      .post(
        `v1/user/logout`,
        {},
        {
          headers: {
            // Authorization: `bearer ${localStorage.getItem("authtoken")}`,
          },
        }
      )
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          this.props.cookies.remove("LANGUAGE", { path: "/" });
          this.props.cookies.remove("AseelWareHouse", { path: "/" });
          this.props.cookies.remove("AseelWareHouseLocation", {
            path: "/",
          });
          this.setState({
            pageloading: false,
          });
          // this.props.history.push("/login");
        }
        if (response.code === 401) {
          this.setState({
            pageloading: false,
          });
          // this.props.history.push("/login");
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), "error", false);
        this.setState({
          pageloading: false,
        });
      });
  };
  onLanguageChange = () => {
    this.props.i18n.changeLanguage("en");
    // this.localStorage.setItem(LANGUAGE_STRING,"")
  };
  render() {
    let lang = this.props.i18n.language;
    return (
      <React.Fragment>
        <ClipLoader
          css={`
            position: fixed;
            top: 40%;
            left: 42%;
            right: 40%;
            bottom: 20%;
            // opacity: 0.5;
            z-index: 500;
          `}
          size={"200px"}
          this
          also
          works
          color={"#196633"}
          height={200}
          // margin={2}
          loading={this.state.pageloading}
        />

        {/* <div className="row" dir={lang === LANG_AR ? "rtl" : null}> */}
        <div className="row">
          <ChangePasswordModal
            show={this.state.showChangePasswordModal}
            history={this.props.history}
            // t={this.props.t}
            // language={this.props.i18n.language}
            onHide={() => this.setState({ showChangePasswordModal: false })}
          ></ChangePasswordModal>
          {this.props.storeList && !this.state.selectedStoreId && (
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
          )}
          <Navbar
            expand="xl"
            className={`col-md-12 col-sm-12 col-xs-12 ${style.colorNavbar}  justify-content-between routplaninNav`}
          >
            <Navbar.Brand className={`${style.navbarBrand}`}>
              <img
                style={{ maxWidth: "50px", maxHeight: "50px" }}
                src={AseelLogo}
                // src={Logo}
                alt="controltowerlogo"
              />
              <span className="ml-1 mr-2">
                <Trans i18nKey={"Control Tower"} />
                {/* {"Control Tower"} */}
              </span>
            </Navbar.Brand>

            <Navbar.Collapse
              id="basic-navbar-nav"
              className={style.basicNavBar}
            >
              {/* <Nav className={this.props.language === LANG_EN ? "mr-auto" : ""}> */}
              <Nav className="mr-auto">
                <Link
                  // activeClassName={style.active}
                  // exact

                  href="/"
                >
                  <a
                    className={`${style.navLink} ${
                      this.props.router.asPath === "/" ? style.active : null
                    }  nav-link `}
                  >
                    {" "}
                    <Trans i18nKey={"Live"} />
                  </a>
                </Link>{" "}
                {/* <Link href="/tripplanning">
                  <a
                    className={`${style.navLink}  ${
                      this.props.router.asPath === "/tripplanning"
                        ? style.active
                        : null
                    }  nav-link `}
                  >
                    <Trans i18nKey={"Trip Planning"} />
                  </a>
                </Link>*/}
                <NavDropdown
                  title="Trip Planning"
                  id="basic-nav-dropdown1"
                  className={`dropdown-menu-right logout-menu  ${style.dropDown}`}
                >
                  <Link href="/staticroute">
                    <a
                      className={`${
                        this.props.router.asPath === "/staticroute"
                          ? style.active
                          : ""
                      } dropdown-item ${style.dropdownItem} `}
                    >
                      {" "}
                      <Trans i18nKey={"Static Route"} />
                    </a>
                  </Link>
                  <Link href="/dynamicroute">
                    <a
                      className={`${
                        this.props.router.asPath === "/dynamicroute"
                          ? style.active
                          : ""
                      } dropdown-item ${style.dropdownItem} `}
                    >
                      {" "}
                      <Trans i18nKey={"Dynamic Route"} />
                    </a>
                  </Link>
                  <Link href="/customroute">
                    <a
                      className={`${
                        this.props.router.asPath === "/customroute"
                          ? style.active
                          : ""
                      } dropdown-item ${style.dropdownItem} `}
                    >
                      <Trans i18nKey={"Custom Route"} />
                    </a>
                  </Link>
                </NavDropdown>{" "}
                <Link href="/controltower">
                  <a
                    className={`${style.navLink} ${
                      this.props.router.asPath === "/controltower"
                        ? style.active
                        : ""
                    } nav-link`}
                  >
                    <Trans i18nKey={"Control Tower"} />
                  </a>
                </Link>{" "}
              </Nav>
            </Navbar.Collapse>
            <Nav>{this.rednerBranches()}</Nav>
            <NavDropdown
              title={"username"}
              className={`dropdown-menu-right logout-menu  ${style.dropDown}`}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item
                role="button"
                onClick={this.logoutUser}
                className={`dropdown-item ${style.navLink}`}
              >
                <i className="fas fa-sign-out-alt">
                  <Trans i18nKey={"logout"} />
                </i>
              </NavDropdown.Item>
              <NavDropdown.Item
                role="button"
                onClick={() => this.setState({ showChangePasswordModal: true })}
                className={`dropdown-item ${style.navLink}`}
                to="/login"
              >
                <i className="fas fa-key">
                  <Trans i18nKey={"Change Password"} />
                </i>
              </NavDropdown.Item>
            </NavDropdown>
            <Nav>
              {this.props.i18n.language === "en" ? (
                <a
                  className={`${style.navLink} nav-link setMousePointer`}
                  role="button"
                  onClick={() => this.props.i18n.changeLanguage("ar")}
                >
                  <i className="fas fa-globe">عربى</i>
                </a>
              ) : (
                <a
                  className={`${style.navLink} nav-link setMousePointer`}
                  role="button"
                  onClick={() => this.onLanguageChange()}
                >
                  <i className="fas fa-globe">English</i>
                </a>
              )}
            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Navbar>
          {/* <b
            onClick={async () => {
              await askForPermissioToReceiveNotifications().then((val) => {
                console.log("FCM_TOKEN", val);
                // let fcm_token = null
                // fcm_token = val
                // this.setState({
                //    fcmToken: fcm_token,
                // })
              });
            }}
          >
            CLick NOw
          </b> */}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    warehouses: state.navbar.warehouses,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getDefaultsApi: () => dispatch(get_defaults()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
// export default NavBar;
