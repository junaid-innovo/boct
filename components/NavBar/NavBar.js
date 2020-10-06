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
import {
  SELECT_BRANCH,
  SUCCESS_MESSAGE,
} from "../../store/actions/actionTypes";
import { get_trips_list } from "../../store/actions/live/actionCreator";
import { get_logout } from "../../store/actionsCreators/loginCreator";
import { FOR_NAV_BAR_PAGE_MESSAGES } from "../Constants/Other/Constants";
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
    if (this.props.selectedBranchId) {
      this.setState({
        selectedStoreId: this.props.selectedBranchId,
      });
    }
    if (this._isMounted) {
      this.props.getDefaultsApi();
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedStoreId !== this.state.selectedStoreId) {
      // const { cookies } = this.props;
      // cookies.set("AseelWareHouse", this.state.selectedStoreId, {
      //   path: "/",
      // });
      // cookies.set("AseelWareHouseLocation", this.state.defaultCenter, {
      //   path: "/",
      // });
      // if (this.state.defaultCenter) {
      //   this.props.warehouse_id(
      //     this.state.selectedStoreId,
      //     this.state.defaultCenter
      //   );
      // }
    }
    // if (this.props.selectedBranchId !== this.state.selectedStoreId) {
    //   this.setState({
    //     selectedStoreId: this.props.selectedBranchId,
    //   });
    // }
    if (prevState.routesEnabled !== this.state.routesEnabled) {
      this.props.setRoutesStatus(this.state.routesEnabled);
    }
    if (this.props.toastMessages) {
      const { forPage, messageId, type, message } = this.props.toastMessages;
      if (
        forPage === FOR_NAV_BAR_PAGE_MESSAGES &&
        messageId !== prevProps.toastMessages.messageId
      ) {
        if (message) {
          this.showMessage(message, type);
        }
      }
    }
    // if (this.state.storeList !== prevState.storeList) {
    //   if (this.state.storeList.length > 0) {
    //     if (this.props.cookies.get("AseelWareHouse")) {
    //       this.setState({
    //         selectedStoreId: this.props.cookies.get("AseelWareHouse"),
    //       });
    //     }
    //     if (this.props.cookies.get("AseelWareHouseLocation")) {
    //       this.setState({
    //         defaultCenter: this.props.cookies.get("AseelWareHouseLocation"),
    //       });
    //     }
    //   }
    // }
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
    this.props.live.loading = true;
    let warehouse_id = e.target.value;
    // console.log("CHeck WAREHOUSE ID", warehouse_id);
    // let formattedDate = moment(this.state.currentDate).format("YYYY-MM-DD");
    this.setState({
      selectedStoreId: warehouse_id,
    });

    if (warehouse_id.length > 0) {
      let storeList = [...this.props.warehouses];
      let filterWareHouses = _.filter(storeList, (ware_house) => {
        if (ware_house.store_id === parseInt(warehouse_id)) {
          return ware_house.loacation;
        }
      });
      const { lat, lng } = filterWareHouses[0].loacation;
      let defaultCenter = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      if (warehouse_id === "") {
        // this.props.vehiclesList(null);
      } else {
        this.props.setBranchId(warehouse_id, defaultCenter);
        // this.setState({
        //   selectedStoreId: parseInt(warehouse_id),
        //   defaultCenter: defaultCenter,
        // });
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
          <Col sm={12} lg={12} xs={12} sm={12}></Col>
          <Form.Label
            column
            sm={!this.state.selectedStoreId ? 2 : 3}
            lg={!this.state.selectedStoreId ? 2 : 3}
            className={`${style.upSelectLabel} mt-3`}
          >
            <Trans i18nKey={"Branches"} />
          </Form.Label>
          <Col>
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
                <option key={store.store_id} value={store.store_id}>
                  {store.store_name.en}
                </option>
              ))}
            </Form.Control>
          </Col>
          {!this.state.selectedStoreId && (
            <Col className="mt-3">
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
    ) : this.props.loadding == true ? (
      // </SelectedStoreContext.Provider>
      <LoadFadeLoader height={2} size="5" css={""}></LoadFadeLoader>
    ) : null;
  };
  showMessage = (message, type, autoClose = 2000) => {
    console.log("NAVBAR MESSSAGE");
    return toast(message, {
      type: type === SUCCESS_MESSAGE ? "success" : "error",
      // autoClose: false,
      autoClose: autoClose,
      className: style.toastContainer,
    });
  };
  logoutUser = () => {
    this.setState({
      pageloading: true,
    });
    // this.props.getLogoutApi();
  };
  onLanguageChange = () => {
    this.props.i18n.changeLanguage("en");
    // this.localStorage.setItem(LANGUAGE_STRING,"")
  };
  handleClickEvnt = (e) => {
    this.props.live.loading = true;
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
                <Link href="/">
                  <a
                    className={`${style.navLink} ${
                      this.props.router.asPath === "/" ? style.active : null
                    }  nav-link `}
                  >
                    {" "}
                    <Trans i18nKey={"Live"} />
                  </a>
                </Link>{" "}
                <NavDropdown
                  title="Trip Planning"
                  id="basic-nav-dropdown1"
                  className={`dropdown-menu-right logout-menu  ${style.dropDown}`}
                >
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
                  <Link href="/staticroute">
                    <a
                      onClick={this.handleClickEvnt}
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
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    warehouses: state.navbar.warehouses,
    selectedBranchId: state.navbar.selectedBranch,
    toastMessages: state.toastmessages,
    navbar: state.navbar,
    live: state.live,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getDefaultsApi: () => dispatch(get_defaults()),
    setBranchId: (selectedStoreId, defaultCenter) =>
      dispatch({
        type: SELECT_BRANCH,
        payload: {
          selectedBranchId: selectedStoreId,
          defaultCenter: defaultCenter,
        },
      }),
    getTripsApi: (date, store_id) => dispatch(get_trips_list(date, store_id)),
    getLogoutApi: () => dispatch(get_logout()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
// export default NavBar;
