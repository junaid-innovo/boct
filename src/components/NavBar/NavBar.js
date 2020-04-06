import React, {Component} from 'react';
import {Navbar, Nav, Form} from 'react-bootstrap';
import Logo from '../../images/controltower.png';
import {Link, NavLink} from 'react-router-dom';
import {LoadFadeLoader} from '../Loaders/Loaders';
import style from './NavBar.module.css';
import axios from 'axios';
import moment from 'moment';
import {LOCAL_API_URL} from '../Constants/Enviroment/Enviroment';
import {ToastContainer, toast} from 'react-toastify';
import SelectedStoreContext from '../../context/selected-store';
import _ from 'lodash';
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedDate: new Date(),
      storeList: [],
      storeSelected: false,
      selectedStoreId: null,
      message: '',
      selectedDate: null,
      vehicles: null,
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (_.isEmpty(props)) {
      return {
        selectedStoreId: null,
        vehicles: null,
        storeList: [],
      };
    }
    if (props.storeList) {
      return {
        storeList: props.storeList,
        selectedDate: props.currentDate,
      };
    }
    return state;
  }
  getSelectedDate = (date) => {
    this.setState({selectedDate: date});
  };
  onBranchChange = (e) => {
    let store_id = e.target.value;
    if (store_id === '0') {
      // this.props.vehiclesList(null);
    } else {
      if (this.state.selectedDate && this.state.storeList.length > 0) {
        this.setState({
          selectedStoreId: parseInt(store_id),
        });
        this.getVehiclesByStoreId(store_id);
      }
    }
  };
  getVehiclesByStoreId = (id) => {
    // this.setState({
    //   vehicles: null,
    //   allorders: null,
    //   disablebtn: true,
    // });
    let formattedDate = moment(this.state.selectedDate).format('YYYY-MM-DD');
    axios
      .get(`${LOCAL_API_URL}${formattedDate}/${id}/vehicles`)
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          this.props.vehiclesList(data);
          if (response.message) {
            this.showMessage(response.message, 'error');
          }
          if (data.length > 0) {
            this.showMessage('Vehicle Listed Successfully', 'success');
          }
          this.setState({
            vehicles: data,
          });
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), 'error', false);
      });
  };
  rednerBranches = () => {
    return this.state.storeList.length > 0 ? (
      <SelectedStoreContext.Provider
        value={{selectedStoreId: this.state.selectedStoreId}}
      >
        <Form.Control
          as="select"
          onChange={this.onBranchChange}
          className={`${style.upSelect} col-md-2 col-sm-2 col-xs-2 col-lg-2 m-auto`}
        >
          <option value="0"> --- Select Branches ---</option>
          {this.state.storeList.map((store, key) => (
            <option
              key={store.store_id}
              id={store.store_id}
              value={store.store_id}
            >
              {store.store_name.en}
            </option>
          ))}
        </Form.Control>
      </SelectedStoreContext.Provider>
    ) : (
      <LoadFadeLoader height={2} size="5"></LoadFadeLoader>
    );
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className: style.toastContainer,
    });

  render() {
    return (
      <div className="row">
        <ToastContainer
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
        <Navbar
          expand="xl"
          className={`col-md-12 col-sm-12 col-xs-12 ${style.colorNavbar} align-items-center`}
        >
          <Navbar.Brand className={style.navbarBrand}>
            <img
              style={{maxWidth: '40px', maxHeight: '40px'}}
              src={Logo}
              alt="controltowerlogo"
            />
            Control Tower
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className={style.basicNavBar}>
            <Nav className={style.navbarNav}>
              <NavLink
                activeClassName={style.active}
                exact
                className={`${style.navLink} nav-link`}
                to="/"
              >
                Live
              </NavLink>
              <NavLink
                exact
                activeClassName={style.active}
                className={`${style.navLink} nav-link`}
                to="/controltower"
              >
                Control Tower
              </NavLink>
              <NavLink
                exact
                activeClassName={style.active}
                className={`${style.navLink} nav-link`}
                to="/routesplan"
              >
                Routes Plan and Capacity
              </NavLink>
            </Nav>
            {this.rednerBranches()}
            <Nav.Item className="text-right ml-auto">
              <Link className={`${style.navLink} nav-link`} to="/logout">
                <i className="fa fa-sign-out-alt"> Logout</i>
              </Link>
            </Nav.Item>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
export default NavBar;
