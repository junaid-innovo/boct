import React, {Component} from 'react';
import NavBar from '../NavBar/NavBar';
import '../../css/mapstyling.css';
import {useLocation} from 'react-router-dom';
import NotFound from '../Exceptions/NotFound';
import Live from '../Live/Live';
import ControlTower from '../ControlTower/Controltower';
import RoutePlan from '../RoutesPlan/RoutesPlan';
import {withRouter} from 'react-router-dom';
import PieceSign from '../D3Charts/pie-sign2';
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
import '../../App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.myRef=React.createRef();
    this.state = {
      timeSlots: null,
      cancalReasons: null,
      vehicles: null,
      vehiclesdata: null,
      vehicleRoutes: null,
      storeList: [],
      currentlocation: null,
    };
  }
  renderNavBar = () => {
    return <NavBar></NavBar>;
  };
  callbackFunction = (childData, date) => {
    this.setState({storeList: childData});
  };
  // checkLogin = (isLoggedIn) => {
  //   this.setState({isLoggedIn: isLoggedIn});
  // };
  getCurrentDate = (date) => {
    this.setState({
      currentDate: date,
      vehicles: null,
    });
  };
  getVehiclesList = (vehicles) => {
    console.log('[app.js] vehciles', vehicles);
    this.setState({
      vehicles: vehicles,
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.storeList !== this.state.storeList) {
      this.setState({
        vehiclesdata: null,
      });
    }
    if (prevState.vehicles !== this.state.vehicles) {
      this.setState({vehiclesdata: this.state.vehicles});
    }
  }
  static getDerivedStateFromProps(props, state) {
    console.log('getDerived app.js props', props);
    let location = props.location.pathname;
    return {
      currentlocation: location,
    };
  }
  // componentWillReceiveProps(props) {
  //   console.log("location",props.location.pathname)
  //   // var newLang = props.location.pathname.split('/').shift();
  //   // if(this.state.lang !== newLang) {
  //   //     // this.setState({lang: newLang});
  //   // }
  // 
  //<Route exact path="/test">
//   <div className="mt-4">
//     <PieceSign {...this.props} legref={this.myRef} />
//   </div>
 
// </Route>
// }
  render() {
    return (
      <div className="container-fluid">
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
         
          <Route exact path="/">
            <NavBar
              storeList={this.state.storeList}
              currentDate={this.state.currentDate}
              vehiclesList={this.getVehiclesList}
            ></NavBar>
            <Live
              vehicles={this.state.vehiclesdata}
              parentCallback={this.callbackFunction}
              currentDateCallBack={this.getCurrentDate}
            />
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
      </div>
    );
  }
}

export default withRouter(App);
