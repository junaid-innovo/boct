import React, {Component} from 'react';
import WrappedMap from '../Map';
import $ from 'jquery';
import DropDown from '../DropDown';
import axios from 'axios';
import {BounceLoader} from 'react-spinners';
import moment from 'moment';
import CancelReasonsModal from '../Modal/CancelReasonsModal';
import ChangeDeliveryTimeModal from '../Modal/ChangeDeliveryTime';
import {LOCAL_API_URL} from '../Constants/Enviroment/Enviroment';
import {ORDER_DELIVERED} from '../Constants/Order/Constants';
import {LoadFadeLoader} from '../Loaders/Loaders';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from '../App.module.css';
import {
  Dropdown,
  Collapse,
  Card,
  OverlayTrigger,
  Tooltip,
  Popover,
} from 'react-bootstrap';
// import from 'react-bootstrap/'
import '../../css/sideBar.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from '../DatePicker/Simple';
import NavBar from '../NavBar/NavBar';
// import {Button} from 'semantic-ui-react';
class Live extends Component {
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
      selectedStoreId: null,
      dateFormat: 'yyyy-MM-dd',
    };
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.currentDate !== prevState.currentDate) {
      this.setState({
        storeList: [],
        vehicleRoutes: null,
        allorders: null,
        vehicles: null,
        routeloading: false,
      });
      this.getStoreByCurDate();
    }
    if (this.state.selectedStoreId !== prevState.selectedStoreId) {
      this.getVehiclesByStoreId(this.state.selectedStoreId);
    }
  };
  renderStoreList = data => {
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
      <LoadFadeLoader height={2} size="5"></LoadFadeLoader>
    );
  };

  //get cancel reasons
  getCancelReasons = order => {
    axios
      .get(`${LOCAL_API_URL}cancelReasons`)
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          this.setState({
            cancalReasons: response.data,
            reasonmodal: true,
            selectedOrder: order,
          });
        }
      })
      .catch(error => {
        this.showMessage(error.toString(), 'error', false);
      });
  };

  // get delivery time slots
  getDeliveryTimeSlots = order => {
    console.log('order is', order);
    axios
      .get(`${LOCAL_API_URL}deliverySlots`)
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          this.setState({
            timeSlots: response.data.slots,
            timeSlotModel: true,
            selectedOrder: order,
          });
        }
      })
      .catch(error => {
        this.showMessage(error.toString(), 'error', false);
      });
  };
  //get store by date
  getStoreByCurDate = () => {
    let formattedDate = moment(this.state.currentDate).format('YYYY-MM-DD');
    axios
      .get(`${LOCAL_API_URL}${formattedDate}/warehouses`)
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          this.props.parentCallback(response.data);
          if (data.length < 1) {
            this.showMessage(
              'No Store Available For Selected Data',
              'error',
              2000
            );
          } else {
            this.showMessage('Store Listed Successfully', 'success', 1500);
          }
          this.setState({
            storeList: response.data,
          });
        }
      })
      .catch(error => {
        this.showMessage(error.toString(), 'error', false);
      });
  };

  getVehRoutesById = (e, veh_id) => {
    this.setState({
      routeloading: true,
      disableall: {
        pointerEvents: 'none',
        opacity: '0.4',
      },
    });
    let maindiv = e.currentTarget.parentElement;
    let element = maindiv.querySelector('.active');
    if (element) {
      element.classList.remove('active', 'text-light');
      element.classList.add('text-dark');
    }
    e.currentTarget.classList.add('active', 'text-light');
    e.currentTarget.firstChild.classList.remove('text-dark');
    let formattedDate = moment(this.state.currentDate).format('YYYY-MM-DD');
    axios
      .get(`${LOCAL_API_URL}${formattedDate}/${veh_id}/deliveries`)
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          if (response.message) {
            this.showMessage(response.message, 'error');
          } else {
            this.showMessage('Vehicle Route Mapping Successfully ', 'success');
          }
          this.setState({
            vehicleRoutes: data,
            routeloading: false,
            disableall: {},
            allorders: data,
          });
        }
      })
      .catch(error => {
        this.showMessage(error.toString(), 'error', false);
      });
  };

  getVehiclesByStoreId = id => {
    this.setState({
      vehicles: null,
      allorders: null,
      disablebtn: true,
    });
    let formattedDate = moment(this.state.currentDate).format('YYYY-MM-DD');
    axios
      .get(`${LOCAL_API_URL}${formattedDate}/${id}/vehicles`)
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          let data = response.data;
          if (response.message) {
            this.showMessage(response.message, 'error');
          }
          if (data.length > 0) {
            this.showMessage('Vehicle Listed Successfully', 'success');
          }
          this.setState({
            vehicles: data,
            disablebtn: false,
          });
        }
      })
      .catch(error => {
        this.showMessage(error.toString(), 'error', false);
      });
  };

  renderProductPopUp = (items, key) => {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h5">Total Products: {items.length}</Popover.Title>
        {items.map((item, key) => (
          <Popover.Content key={key}>
            <span>{item.product_name.en}</span>
            <strong>X</strong>
            <span>{item.quantity}</span>
          </Popover.Content>
        ))}
      </Popover>
    );
  };
  setActiveClass = e => {};
  handleDateChange = date => {
    this.setState({
      currentDate: date,
    });
  };
  renderNavBar = () => {
    return (
      <div className="row">
        <NavBar storeList={this.state.storeList}></NavBar>
      </div>
    );
  };

  renderLeftSideBar = () => {
    return (
      <div className="col-sm-2 col-md-2" id="sidebar">
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
        <div className={`row ${style.stringcheck}`}>
          <div className="mb-1 col-sm-12 col-md-12">
            <DatePicker
              showTimeSelect={false}
              title="Select Date"
              currentDate={this.state.currentDate}
              dateFormat={this.state.dateFormat}
              onChange={this.handleDateChange}
            ></DatePicker>
          </div>
        </div>
        <div className="row">
          <div className="text-center text-light bg-dark shadow p-3 mb-1  col-sm-12 col-md-12">
            All Vehicles
          </div>
        </div>
        <div className="row">{this.renderVehicles()}</div>
      </div>
    );
  };

  renderVehicles = () => {
    return (
      <div
        className="main-content col-sm-12 col-md-12 col-lg-12 col-xs-12"
        style={{
          height: '597px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          marginRight: '-14px',
        }}
      >
        {this.state.vehicles ? (
          this.state.vehicles.map((data, key) => (
            <div
              style={this.state.disableall}
              key={data.vehicle_id + data.driver.user_id}
              id={data.vehicle_id + data.driver.user_id}
              onClick={
                Array.isArray(data.delivery_trip_id) &&
                data.delivery_trip_id.length > 1
                  ? null
                  : e => this.getVehRoutesById(e, data.delivery_trip_id)
              }
              className="ml-1 pb-2 card-div row"
            >
              <Card className="text-center text-dark small col-sm-12 col-md-12 col-lg-12 col-xs-12">
                <div className="bg-dark text-light font-weight-bold">
                  Vehicle No {key + 1}
                </div>
                <div>
                  <span className="font-weight-bold pr-1">Driver Name:</span>
                  <span>
                    {data.driver.name ? data.driver.name.en : 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="font-weight-bold pr-1"> Plate No:</span>
                  <span>{data.vehicle_plate_number}</span>
                </div>
                {Array.isArray(data.delivery_trip_id) &&
                data.delivery_trip_id.length > 1
                  ? data.delivery_trip_id
                      .filter(
                        (item, index) =>
                          data.delivery_trip_id.indexOf(item) === index
                      )
                      .map((value, key) => (
                        <div>
                          <button
                            onClick={e =>
                              this.getVehRoutesById(e, data.delivery_trip_id)
                            }
                          >
                            Route {key + 1}
                          </button>{' '}
                        </div>
                      ))
                  : null}
              </Card>
            </div>
          ))
        ) : (
          <LoadFadeLoader />
        )}
      </div>
    );
  };

  hideChangeDeliveryModal = data => {
    this.setState({timeSlotModel: false});
  };

  changeSelectedDeliverySlotId = (order_id, slotid) => {
    let allorders = JSON.parse(JSON.stringify(this.state.allorders.deliveries));
    let selectedorderIndex = allorders.findIndex(
      ({order}) => order.order_id === order_id
    );
    console.log('check index', allorders[selectedorderIndex].order);
  };

  renderMainContent = () => {
    return (
      <div className="col-sm-8 col-md-8">
        <BounceLoader
          css={`
            position: fixed;
            top: 40%;
            left: 42%;
            right: 40%;
            bottom: 20%;

            opacity: 0.5;
            z-index: 999999;
          `}
          size={'300px'}
          this
          also
          works
          color={'#f30707'}
          height={100}
          loading={this.state.routeloading}
        />
        <div style={{width: 'auto', height: '100vh', paddingBottom: '10px'}}>
          {this.state.cancalReasons && this.state.selectedOrder && (
            <CancelReasonsModal
              show={this.state.reasonmodal}
              reasons={this.state.cancalReasons}
              onHide={() => this.setState({reasonmodal: false})}
              orderid={this.state.selectedOrder.order_id}
            ></CancelReasonsModal>
          )}
          {this.state.timeSlots && this.state.selectedOrder && (
            <ChangeDeliveryTimeModal
              show={this.state.timeSlotModel}
              timeslots={this.state.timeSlots}
              onHide={this.hideChangeDeliveryModal}
              changedeliveryslotid={this.changeSelectedDeliverySlotId}
              currenttimeslot={this.state.selectedOrder.delivery_slot_id}
              orderid={this.state.selectedOrder.order_id}
            ></ChangeDeliveryTimeModal>
          )}
          <WrappedMap
            routelist={this.state.vehicleRoutes}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
            loadingElement={<div style={{height: '100vh'}} />}
            containerElement={<div style={{height: '100vh'}} />}
            mapElement={<div style={{height: '100vh'}} />}
          />
        </div>
      </div>
    );
  };
  calulateTotalQuantity = items => {
    // const order_quantites=[];
    // items.map(({quantity})=>
    //     order_quantites.push(quantity)
    // )
    // let sum = order_quantites.reduce((acc, val) => {
    //   return acc + val;
    // });
    let sum = 0;
    items.map(({quantity}) => (sum += quantity));
    return sum;
  };
  renderCancelButton = order => {
    return (
      <button
        className="btn-danger btn-xs"
        data-toggle="tooltip"
        data-placement="top"
        title="Cancel Order"
        onClick={() => this.getCancelReasons(order)}
      >
        Cancel
      </button>
    );
  };
  renderRightSideBar = () => {
    return (
      <div className="col-sm-2 col-md-2" id="sidebar">
        <div className="row">
          <div className="mb-1 col-sm-12 col-md-12">
            {this.renderStoreList(this.state.storeList)}
          </div>
        </div>
        <div className="row">
          <div className="text-center text-light bg-dark shadow p-3 mb-1 col-md-12 col-md-12">
            All Orders
          </div>
        </div>
        <div className="row">
          <div
            className="main-content col-md-12 col-md-12"
            style={{
              height: '597px',
              overflowY: 'scroll',
              overflowX: 'hidden',
            }}
          >
            {this.state.allorders ? (
              this.state.allorders.deliveries.map(({order}, key) => (
                <div
                  key={order.order_id + order.order_number + key}
                  className="mr-2 pb-2 card-div"
                >
                  <Card className="text-center text-dark small">
                    <div className="bg-dark text-light font-weight-bold">
                      Order No {key + 1}
                    </div>
                    <div>
                      <span className="font-weight-bold pr-1">Id:</span>
                      <span>{order.order_id}</span>
                    </div>
                    <div>
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        rootClose={true}
                        overlay={this.renderProductPopUp(order.items)}
                      >
                        <span className="font-weight-bold pr-1">
                          Total Quantity:
                        </span>
                      </OverlayTrigger>
                      <span>{this.calulateTotalQuantity(order.items)}</span>
                    </div>
                    <div>
                      <span className="font-weight-bold pr-1">Order No:</span>
                      <span>{order.order_number}</span>
                    </div>
                    <div>
                      {order.order_status === ORDER_DELIVERED
                        ? null
                        : this.renderCancelButton(order)}{' '}
                      <button
                        className="btn-success btn-xs"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Change Delivery Time"
                        onClick={() => this.getDeliveryTimeSlots(order)}
                      >
                        Change Time
                      </button>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <LoadFadeLoader />
            )}
          </div>
        </div>
      </div>
    );
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className: 'toastContainer',
    });
  render() {
    const open = this.state.open;
    const test = (
      <div>
        <button
          aria-controls="example-collapse-text"
          aria-expanded={open}
        ></button>
        <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
            labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </Collapse>
      </div>
    );
    return (
      <React.Fragment>
        <div className="row">
          {this.renderLeftSideBar()}
          {this.renderMainContent()}
          {this.renderRightSideBar()}
        </div>
      </React.Fragment>
    );
  }
}
export default Live;
