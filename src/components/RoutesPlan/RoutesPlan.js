import React, {Component} from 'react';
import {
  Form,
  Navbar,
  Nav,
  FormGroup,
  Row,
  Col,
  InputGroup,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import Map from '../Map';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import {LOCAL_API_URL} from '../Constants/Enviroment/Enviroment';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {col12, col6} from '../Constants/Classes/BoostrapClassses';
import RouteSummary from '../RoutesPlan/RouteSummary';
import _ from 'lodash';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DatePicker from 'react-datepicker';
class RoutesPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: null,
      vehicleRoutes: null,
      orders: [],
      plandate: 'PLAN-04/15/2020 5:51:06PM',
      listview: true,
      mapview: false,
      constraints: null,
      selectedConstraints: null,
      selectedConstraintName: {type: '', names: []},
      advancemenu: false,
      plannow: false,
      startDate: new Date(),
      endDate: new Date(),
      rangedate: [new Date(), new Date()],
    };
  }

  componentWillMount() {
    this.getRoutesandCapacity();
  }
  getRoutesandCapacity = () => {
    axios
      .get(`${LOCAL_API_URL}2020-02-01/2020-03-01/routingAndCapacity`)
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          console.log(response);
          this.setState({
            orders: response.data.orders,
            constraints: _.sortBy(response.data.constraints, 'constraint_id'),
          });
        }
      })
      .catch(error => console.log(error));
  };
  renderDataTable = () => {
    if (this.state.orders.length > 0) {
      let products = [...this.state.orders];
      const options = {
        // pageStartIndex: 0,
        sizePerPage: 11,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
      };
      const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
      };
      const defaultSorted = [
        {
          dataField: 'name',
          order: 'desc',
        },
      ];
      const columns = [
        {
          dataField: 'order_id',
          text: 'Order Id',
          sort: true,
          headerStyle: {
            fontSize: '10px',
          },
          style: {
            fontSize: '10px',
          },
        },
        {
          dataField: 'order_number',
          text: 'Order No.',
          sort: true,
          style: {
            fontSize: '10px',
          },
          headerStyle: {
            fontSize: '10px',
          },
        },
        {
          dataField: 'address_title',
          text: 'Address',
          sort: true,
          style: {
            fontSize: '10px',
          },
          headerStyle: {
            fontSize: '10px',
          },
        },
      ];

      return (
        <BootstrapTable
          bootstrap4
          keyField="order_number"
          data={products}
          columns={columns}
          defaultSorted={defaultSorted}
          pagination={paginationFactory(options)}
          selectRow={selectRow}
          fontSize={15}
          bordered={false}
          tdStyle={{fontSize: '10px'}}
        />
      );
    }
  };

  renderConstraints = () => {
    return (
      this.state.constraints &&
      this.state.constraints.map(constraint => (
        <React.Fragment key={constraint.constraint_id}>
          <Nav.Link
            variant="button"
            onClick={() => this.onConstraintClick(constraint)}
          >
            {constraint.constraint_type}
          </Nav.Link>
        </React.Fragment>
      ))
    );
  };

  onConstraintClick = constraint => {
    if (constraint.constraint_type === 'Advance') {
      this.setState({
        advancemenu: true,
        plannow: false,
      });
    } else {
      let type = '';
      if (constraint.multival) {
        type = 'checkbox';
      } else {
        type = 'radio';
      }
      let altconstraint = {
        type: type,
        names: JSON.parse(constraint.constraint_name),
      };
      this.setState({
        selectedConstraintName: altconstraint,
        advancemenu: false,
        plannow: false,
      });
    }
  };
  setStartDate = date => {
    this.setState({
      startDate: date,
    });
  };
  setEndDate = date => {
    this.setState({
      endDate: date,
    });
  };
  renderDateRangePicker = () => {
    return (
      <React.Fragment>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.setStartDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />
        <DatePicker
          selected={this.state.endDate}
          onChange={this.setEndDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minDate={this.state.endDate}
        />
      </React.Fragment>
    );
  };
  advanceRadioClick = e => {
    this.setState({
      plannow: true,
    });
  };
  planlaterRadioClick = e => {
    this.setState({
      plannow: false,
    });
  };
  onDateRangeChange = date => {
    this.setState({
      rangedate: date,
    });
  };
  render() {
    return (
      <div className="row routeplan-div">
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="row mt-3 no-gutters">
            <div className="col-md-4">
              <div className="row no-gutters ml-n2 align-items-center">
                <div className="col-md-7 mr-n5">
                  <b>Routes > Trip Planning ></b>
                </div>
                <div className="col-md-5 ml-n3">
                  <Form.Control
                    className="rounded-0"
                    type="text"
                    name="firstName"
                    value={this.state.plandate}
                    readOnly
                    isValid={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-7 offset-1">
              <div className="row">
                <div className="col-md-3">
                  <Form.Control as="select" className="rounded-0 up-select">
                    <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                      Select Branches
                    </option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </div>
                <div className="col-md-3">
                  <InputGroup>
                    <Form.Control
                      className="rounded-0"
                      type="text"
                      name="firstName"
                      value="04/15/2020-04/22/2020"
                      isValid={false}
                      readOnly
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text
                        id="inputGroup-sizing-default"
                        className="bg-primary text-white"
                      >
                        <i className="fa fa-calendar  fa-3x"></i>
                      </InputGroup.Text>
                      {/*<InputGroup.Text>
                        <DateRangePicker
                          onChange={this.onDateRangeChange}
                          value={this.state.rangedate}
                          calendarIcon="fa fa-calendar"
                        ></DateRangePicker>
                      </InputGroup.Text>*/}
                    </InputGroup.Prepend>
                  </InputGroup>
                </div>
                <div className="col-md-3">
                  <Button className="btn btn-primary btn-xs">
                    <i className="fa fa-search" style={{fontSize: '10px'}}></i>{' '}
                    Search Orders
                  </Button>
                </div>
                <div className="col-md-3">
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      variant="secondary"
                      onClick={() => this.setState({listview: true})}
                    >
                      <i className="fa fa-list" style={{fontSize: '12px'}} />{' '}
                      List
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => this.setState({listview: false})}
                    >
                      <i
                        className="fa fa-map-marker"
                        style={{fontSize: '12px'}}
                      />{' '}
                      Map
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4 align-items-center">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12 routeplannav ml-2 align-items-center">
                  <div className="row">
                    <div
                      className="col-md-5 col-sm-5 col-xs-5"
                      id="basic-navbar-nav"
                    >
                      <Nav className="mr-auto">{this.renderConstraints()}</Nav>
                    </div>
                    <div
                      className="col-md-5 col-sm-5 col-xs-5 offset-2"
                      id="basic-navbar-nav"
                    >
                      <div className="row align-items-center">
                        <div className="offset-1 col-md-5 text-right">
                          <Form.Control as="select" className="rounded-0">
                            <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                              Default
                            </option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </Form.Control>
                        </div>
                        <Link
                          role="button"
                          to="/"
                          className="nav-link col-md-6 text-center"
                          style={null}
                        >
                          <i className="fa fa-eye"> Show Profile</i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 set-shadow1 ml-2">
                  <FormGroup className="mt-2 ml-3 p-2" as={Row}>
                    {this.state.selectedConstraintName.names &&
                      !this.state.advancemenu &&
                      this.state.selectedConstraintName.names.map(
                        (name, key) => (
                          <Form.Check
                            key={key}
                            className="pr-3"
                            column="true"
                            md={4}
                            type={this.state.selectedConstraintName.type}
                            ref={`routendcap${this.state.selectedConstraintName.type}`}
                            value={1}
                            name="routendcapradio"
                            id={`default`}
                            label={name}
                          />
                        )
                      )}
                    {this.state.advancemenu && (
                      <React.Fragment>
                        <Form.Check
                          className="pr-3"
                          column="true"
                          md={4}
                          type="radio"
                          onClick={this.advanceRadioClick}
                          ref="plannow"
                          value="plannow"
                          name="advance"
                          id={`default1`}
                          label={'Plan Now'}
                        />
                        <Form.Check
                          className="pr-3"
                          column="true"
                          md={4}
                          onClick={this.planlaterRadioClick}
                          type="radio"
                          ref="planlater"
                          value="planlater"
                          name="advance"
                          id={`default2`}
                          label={'Plan Later'}
                        />
                      </React.Fragment>
                    )}
                    {this.state.plannow && (
                      <div className="col-md-6">
                        {this.renderDateRangePicker()}
                      </div>
                    )}
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3 mb-1">
            {this.state.listview ? (
              <div className={col6}>{this.renderDataTable()}</div>
            ) : (
              <div className={`${col6} align-content-end`}>
                <Map
                  routelist={this.state.vehicleRoutes}
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                  loadingElement={<div style={{height: '100vh'}} />}
                  containerElement={<div style={{height: '100vh'}} />}
                  mapElement={<div style={{height: '100vh'}} />}
                />
              </div>
            )}
            <div className={col6}>
              <RouteSummary />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default RoutesPlan;
