import React, {Component} from 'react';
import {Navbar, Nav, Dropdown, NavDropdown} from 'react-bootstrap';
import {LoadFadeLoader, LoadClipLoader} from '../Loaders/Loaders';
import Logo from '../../images/controltower.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
// import App from '../container/old_App';
import NotFound from '../Exceptions/NotFound';
import Live from '../Live/Live';
import ControlTower from '../ControlTower/Controltower';
import RoutePlan from '../RoutesPlan/RoutesPlan';
import RouteSummary from '../RoutesPlan/RouteSummary';

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
      <div className="container-fluid">
        <Router>
          <div className="row">
            <Navbar
              expand="xl"
              className="col-md-12 col-sm-12 col-xs-12 color-navbar"
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
                <Link to="/" className="nav-link" style={null}>
                  Live
                </Link>
                <Link className="nav-link" to="/controltower">
                  Control Tower
                </Link>
                <Nav.Item className="pr-2">
                  <Link className="nav-link" to="/routesplan">
                    Routes Plan and Capacity
                  </Link>
                  {/*<NavDropdown
                    title="Routes and Capacity"
                    id="basic-nav-dropdown"
                  >
                    <Link
                      to="/routesplan"
                      className="dropdown-item"
                      style={null}
                    >
                      Routes Plan
                    </Link>
                    <Link
                      to="/routessummary"
                      className="dropdown-item"
                      style={null}
                    >
                      Routes Summary
                    </Link>
                  </NavDropdown>*/}
                </Nav.Item>
              </Navbar.Collapse>
            </Navbar>
          </div>
          <Switch>
            <Route exact path="/">
              <Live
                parentCallback={this.callbackFunction}
                storeid={this.state.selectedStoreId}
              />
            </Route>
            <Route path="/controltower">
              <ControlTower setSelectedDate={this.getSelectedDate} />
            </Route>
            <Route path="/routesplan">
              <RoutePlan />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default NavBar;
