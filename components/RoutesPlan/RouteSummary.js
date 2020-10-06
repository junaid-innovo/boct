import React, { Component } from "react";
import { Card } from "react-bootstrap";
// import '../../css/RouteSummary.css';
import { col12 } from "../Constants/Classes/BoostrapClassses";
import style from "./RoutesPlan.module.css";
import DatePicker from "react-datepicker";
class RoutesSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: null,
      summarystats: null,
    };
    this.summaryObj = {};
  }
  static getDerivedStateFromProps = (props, state) => {
    if (props.summary) {
      return {
        summarystats: props.summary,
      };
    }
    return state;
  };
  countSummary(selectedOrders) {
    let ttemp;
    let unique_cust = new Array();
    let dates = new Array();
    let countOfSelectedordersWithCoor = 0;
    let countOfSelectedordersWithOutCoor = 0;
    let areas = new Array();
    let RentedVehicles = 0;
    for (let i = 0; i < selectedOrders.length; i++) {
      for (let j = 0; j < this.props.stateObj.allOrders.length; j++) {
        if (selectedOrders[i] == this.props.stateObj.allOrders[j].order_id) {
          if (
            !unique_cust.includes(
              this.props.stateObj.allOrders[j].customer.phone
            )
          ) {
            unique_cust.push(this.props.stateObj.allOrders[j].customer.phone);
          }
          if (!dates.includes(this.props.stateObj.allOrders[j].created_at)) {
            dates.push(this.props.stateObj.allOrders[j].created_at);
          }
          console.log(this.props.stateObj.allOrders[j].address);
          if (
            this.props.stateObj.allOrders[j].address.latitude != null &&
            this.props.stateObj.allOrders[j].address.longitude != null
          ) {
            countOfSelectedordersWithCoor = countOfSelectedordersWithCoor + 1;
          } else {
            countOfSelectedordersWithOutCoor =
              countOfSelectedordersWithOutCoor + 1;
          }
          if (
            !areas.includes(
              this.props.stateObj.allOrders[j].address.area_name.en
            )
          ) {
            areas.push(this.props.stateObj.allOrders[j].address.area_name.en);
          }
        }
        //selectedOrders[i];
      }
    }
    let sorted_selectedOrders = dates.sort(function (a, b) {
      return a - b;
    });
    this.summaryObj.unique_cust = unique_cust.length;
    if (sorted_selectedOrders.length <= 0) {
      this.summaryObj.dateRange = "No order selected.";
    } else {
      this.summaryObj.dateRange =
        sorted_selectedOrders[0] +
        " TO " +
        sorted_selectedOrders[sorted_selectedOrders.length - 1];
    }
    if (selectedOrders.length > 0) {
      this.summaryObj.countOfSelectedordersWithOutCoor =
        (countOfSelectedordersWithOutCoor * 100) / selectedOrders.length;
    } else {
      this.summaryObj.countOfSelectedordersWithOutCoor = 0;
    }
    this.summaryObj.areas = areas.length;
    for (let i = 0; i < this.props.stateObj.vehicleList.length; i++) {
      if (
        this.props.stateObj.vehicleList[i].vehicle_category_name.en == "Rent"
      ) {
        RentedVehicles = RentedVehicles + 1;
      }
    }
    this.summaryObj.RentedVehicles = RentedVehicles;
    return this.summaryObj;
  }
  render() {
    return (
      <React.Fragment>
        <div className={style.summaryDiv}>
          <div className="row">
            <div className={col12}>
              <div className="row">
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-calendar-check-o fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Date Range Selected:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12}`}>
                          <small>{this.summaryObj.dateRange}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fas fa-clipboard-list fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>No Of Orders:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>
                            {this.props.stateObj.selectedOrderId.length}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-archive  fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>
                            <span
                              className="font-weight-bold"
                              style={{
                                color: "red",
                              }}
                            >
                              * &nbsp;
                            </span>
                            Missing coordinates:
                          </small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>
                            {this.countSummary(
                              this.props.stateObj.selectedOrderId
                            ).countOfSelectedordersWithOutCoor.toFixed(1)}{" "}
                            %
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-truck fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>No Of Rented Fleet:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>{this.summaryObj.RentedVehicles}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fas fa-warehouse fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>No Of Branches:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>{this.props.warehouses.length}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-map-marker fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Number Of Areas:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>{this.summaryObj.areas}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-calendar-check-o fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Number Of Customer(s):</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          {/* {this.state.summarystats && (
                            <small>{this.state.summarystats.customers}</small>
                          )} */}
                          <small>{this.summaryObj.unique_cust}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card className={style.card}>
                    <Card.Header className="h-60">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-cogs fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Average Service Time:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>15 minutes</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              {/* <div className="row">
                <div className="col-3">
                  
                </div>
              </div> */}
            </div>
          </div>
          <div class="row text-center">
            <span
              className="offset-4"
              style={{
                color: "red",
                fontSize: "10px",
              }}
            >
              *The higher number may reduce trip accuracy.{" "}
            </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default RoutesSummary;
