import React, { Component } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import PieClass from "../D3Charts/PieClass";
import Map from "../Map";
// import Test from "../D3Charts/Test"
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import { ProgressBar, Button, FormControl, InputGroup } from "react-bootstrap";
// import '../../css/ControlTower.css';
import style from "./ControlTower.module.css";
import cookie from "js-cookie";
class Controltower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "",
      chartData: null,
      vehicleRoutes: null,
      mapKey: cookie.get("Map_Key"),
    };
    this.tdRef = React.createRef();
    this.oncRef = React.createRef();
    this.doRef = React.createRef();
    this.osRef = React.createRef();
    this.data = [10, 20, 30, 40, 50];
    this.now = [27, 0, 0, 0];
  }
  getData = () => {
    const data = {
      date: "2020-03-19",
    };
    axios
      .post(`${LOCAL_API_URL}controlTower`, JSON.stringify(data))
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          // alert(response.message);
        } else {
          // alert(response.message);
        }
      })
      .catch((error) => console.log(error));
  };

  componentDidMount() {
    // this.getData();
  }
  render() {
    return (
      <React.Fragment>
        <div className="row mt-1">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <b> Delivery Leg Details</b>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <div className="row">
              <div className="col-3">
                <Card>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2">
                          <small className="font-weight-normal">
                            Total Deliveries
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <small className="font-weight-normal">545</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className={`col-12 ${style.customTextFont}`}>
                      <div className="row mt-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2 pr-0">
                          <small className="font-weight-normal">
                            27% Orders-Not Dispa..
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <ProgressBar
                            className={`ml-3n ${style.progress}`}
                            now={this.now[0]}
                            label={`${this.now[0]}%`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <Card.Body>
                    <div className="row">
                      <PieClass data={this.data} legendRef={this.tdRef} />
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-3">
                <Card>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1 mr-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2">
                          <small className="font-weight-normal">
                            Orders Not Completed
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <small className="font-weight-normal">545</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2 pr-0">
                          <small className="font-weight-normal">
                            0% Orders-Other Reas..
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <ProgressBar
                            className={`ml-3n ${style.progress}`}
                            now={this.now[1]}
                            label={`${this.now[1]}%`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <Card.Body>
                    <div className="row">
                      <PieClass data={this.data} legendRef={this.tdRef} />
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-3">
                <Card>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1 mr-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2">
                          <small className="font-weight-normal">
                            Delayed Orders
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <span className="font-weight-normal">545</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2 pr-0">
                          <small className="font-weight-normal">
                            25% Orders-Late Dispa..
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <ProgressBar
                            className={`ml-3n ${style.progress}`}
                            now={this.now[2]}
                            label={`${this.now[2]}%`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <Card.Body>
                    <div className="row">
                      <PieClass data={this.data} legendRef={this.tdRef} />
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-3">
                <Card>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1 mr-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2">
                          <small className="font-weight-normal">
                            Order Status
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <span className="font-weight-normal">545</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 custom-text-font">
                      <div className="row mt-1">
                        <div className="col-md-8 col-sm-8 col-xs-8 ml-2 pr-0">
                          <small className="font-weight-normal">
                            0% Orders-RTM
                          </small>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-3">
                          <ProgressBar
                            className={`ml-3n ${style.progress}`}
                            now={this.now[3]}
                            label={`${this.now[3]}%`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <Card.Body>
                    <div className="row">
                      <PieClass data={this.data} legendRef={this.tdRef} />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <b>Fleet Availability</b>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
            <Card>
              <div className="row mt-1">
                <div className="col-md-8 col-sm-8 col-xs-8 ml-2">
                  <small className="font-weight-normal">
                    Delivery Resources
                  </small>
                </div>
              </div>
              <hr></hr>
              <Card.Body>
                <div className="row">
                  <PieClass data={this.data} legendRef={this.tdRef} />
                </div>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <div className="row mt-1">
                <div className="col-md-8 col-sm-8 col-xs-8 ml-2">
                  <small className="font-weight-normal">Vehicles</small>
                </div>
              </div>
              <hr></hr>
              <Card.Body>
                <div className="row">
                  <PieClass data={this.data} legendRef={this.tdRef} />
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
            <div className="row">
              <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 pl-0">
                <InputGroup>
                  <InputGroup.Prepend>
                    <Button
                      className="btn-primary text-light"
                      style={{ borderRadius: "0" }}
                      variant="outline-secondary"
                    >
                      Delivery Resources
                    </Button>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-describedby="basic-addon1"
                    className="rounded-0 fa fa-search"
                  />
                  <FormControl.Feedback>
                    <i className="fa fa-search"></i>
                  </FormControl.Feedback>
                </InputGroup>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12 pl-0">
                <Map
                  routelist={this.state.vehicleRoutes}
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${this.state.mapKey}&language=en}`}
                  loadingElement={<div style={{ height: "100vh" }} />}
                  containerElement={<div style={{ height: "100vh" }} />}
                  mapElement={<div style={{ height: "100vh" }} />}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <br></br>
        </div>
      </React.Fragment>
    );
  }
}

export default Controltower;
