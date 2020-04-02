import React, {Component} from 'react';
import {Navbar, Nav, Dropdown, NavDropdown, Form} from 'react-bootstrap';
import {LoadFadeLoader, LoadClipLoader} from '../Loaders/Loaders';
import Logo from '../../images/controltower.png';
import {BrowserRouter as Router, Link, NavLink} from 'react-router-dom';

import '../../css/NavBar.css';
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      storeList: [],
      selectedStoreId: null,
      message: '',
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.storeList) {
      return {
        storeList: props.storeList,
      };
    }
    return state;
  }
  callbackFunction = childData => {
    this.setState({storeList: childData});
  };
  getSelectedDate = date => {
    this.setState({selectedDate: date});
  };
  render() {
    return (
      <div className="row">
        <Navbar
          expand="xl"
          className="col-md-12 col-sm-12 col-xs-12 color-navbar align-items-center"
        >
          <Navbar.Brand>
            <img
              style={{maxWidth: '40px', maxHeight: '40px'}}
              src={Logo}
              alt="controltowerlogo"
            />
            Control Tower
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <NavLink exact className="nav-link" to="/">
                Live
              </NavLink>
              <NavLink exact className="nav-link" to="/controltower">
                Control Tower
              </NavLink>
              <NavLink exact className="nav-link" to="/routesplan">
                Routes Plan and Capacity
              </NavLink>
            </Nav>
            <Form.Control
              as="select"
              className="up-select col-md-2 col-sm-2 col-xs-2 col-lg-2 m-auto"
            >
              <option>Select Branches</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </Form.Control>
            <Nav.Item className="text-right ml-auto">
              <Link className="nav-link" to="/logout">
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
