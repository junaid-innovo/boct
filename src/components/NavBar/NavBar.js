import React, {Component} from 'react';
import {Navbar, Nav, Dropdown} from 'react-bootstrap';
import {LoadFadeLoader, LoadClipLoader} from '../Loaders/Loaders';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import App from '../container/old_App';
import NotFound from '../Exceptions/NotFound';
import Live from '../Live/Live';
import ControlTower from '../ControlTower/Controltower';
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
    this.setState({selectedDate:date});
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
                <Nav className="m-auto">
                  <Link className="pr-3" to="/">
                    Live
                  </Link>
                  <Link className="pr-3" to="/controltower">
                    Control Tower
                  </Link>
                </Nav>
                <Nav className="mr-auto">
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
              <ControlTower setSelectedDate={this.getSelectedDate} />
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
