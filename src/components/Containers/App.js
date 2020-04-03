import React, {Component} from 'react';
import NavBar from '../NavBar/NavBar';
import '../../css/mapstyling.css';
import {useLocation} from 'react-router-dom';
import NotFound from '../Exceptions/NotFound';
import Live from '../Live/Live';
import ControlTower from '../ControlTower/Controltower';
import RoutePlan from '../RoutesPlan/RoutesPlan';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
} from 'react-router-dom';
import Login from './Login';
// import 'bootstrap/dist/css/bootstrap.min.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSlots: null,
      cancalReasons: null,
      vehicles: null,
      vehiclesdata: null,
      vehicleRoutes: null,
      vehiclesdescription: null,
      sideloading: true,
      routeloading: false,
      currentDate: new Date(),
      disableall: {},
      storeList: [],
      routesarr: null,
      currentdiv: false,
      disablebtn: false,
      allorders: null,
      open: false,
      reasonmodal: false,
      timeSlotModel: false,
      selectedOrder: null,
      dateFormat: 'yyyy-MM-dd',
      isLoggedIn: false,
    };
  }
  renderNavBar = () => {
    return <NavBar></NavBar>;
  };
  callbackFunction = childData => {
    this.setState({storeList: childData});
  };
  checkLogin = isLoggedIn => {
    this.setState({isLoggedIn: isLoggedIn});
  };
  render() {
    return (
      <div className="container-fluid">
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login/>
            </Route>
            <Route exact path="/">
              <NavBar></NavBar>
              <Live parentCallback={this.callbackFunction} />
            </Route>

            <Route path="/controltower">
              <NavBar></NavBar>
              <ControlTower setSelectedDate={this.getSelectedDate} />
            </Route>
            <Route path="/routesplan">
              <NavBar></NavBar>
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

export default App;
