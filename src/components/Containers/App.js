import React, {Component} from 'react';
import NavBar from '../NavBar/NavBar';
import '../../css/mapstyling.css';
import {useLocation} from 'react-router-dom';
import NotFound from '../Exceptions/NotFound';
import Live from '../Live/Live';
import ControlTower from '../ControlTower/Controltower';
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
    };
  }
  renderNavBar = () => {
    return <NavBar></NavBar>;
  };
  render() {
    return this.renderNavBar();
  }
}

export default App;
