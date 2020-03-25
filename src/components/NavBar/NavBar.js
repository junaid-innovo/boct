import React, {Component} from 'react';
import {Navbar, Nav, Dropdown, NavDropdown} from 'react-bootstrap';
import {LoadFadeLoader, LoadClipLoader} from '../Loaders/Loaders';
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
  renderStoreList = data => {
    // const location = useLocation();
    // console.log(location);
    // return location.pathname == '/login' ? <YourNavBarComponents /> : null
    return this.state.storeList.length > 0 ? (
      <Dropdown key={data} disabled={this.state.disablebtn}>
        <Dropdown.Toggle id="dropdown-basic" variant="success">
          Select Store
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{
            overflowY: 'scroll',
            maxHeight:
              window.innerHeight -
              (this.myRef
                ? this.myRef.getBoundingClientRect().top +
                  this.myRef.getBoundingClientRect().height +
                  100
                : 200),
          }}
        >
          {data.map((store, key) => (
            <Dropdown.Item key={store.store_id}>
              <div>
                <b
                  key={store.store_id}
                  id={store.store_id}
                  onClick={() =>
                    this.setState({selectedStoreId: store.store_id})
                  }
                >
                  {store.store_name.en}
                </b>
                <span>
                  <i className="glyphicon glyphicon-triangle-bottom"></i>
                </span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <LoadClipLoader size="20" />
      // <LoadFadeLoader></LoadFadeLoader>
    );
  };
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
              <Navbar.Brand href="#home">Control Tower</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Link to="/" className="nav-link" style={null}>
                  Live
                </Link>
                <Link className="nav-link" to="/controltower">
                  Control Tower
                </Link>
                <Nav.Item className="pr-2">
                  <NavDropdown
                    title="Routes and Capacity"
                    id="basic-nav-dropdown"
                  >
                    <Link
                      to="/routessummary"
                      className="dropdown-item"
                      style={null}
                    >
                      Routes Summary
                    </Link>
                    <Link
                      to="/routesplan"
                      className="dropdown-item"
                      style={null}
                    >
                      Routes Plan
                    </Link>
                  </NavDropdown>
                </Nav.Item>
                <Nav className="m-auto">
                  {this.renderStoreList(this.state.storeList)}
                  {/*this.props.location.pathname.match('/')
                    ? this.renderStoreList(this.state.storeList)
                  : null*/}
                </Nav>
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
            <Route path="/routessummary">
              <RouteSummary />
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
