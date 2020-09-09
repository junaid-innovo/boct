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
  }
  static getDerivedStateFromProps = (props, state) => {
    if (props.summary) {
      return {
        summarystats: props.summary,
      };
    }
    return state;
  };
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
                          <small>
                            04/15/2020 05:35 PM -04/28/2020 05:35 PM
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
                          <small>50</small>
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
                          <small>Percentage Of Order GeoCoded</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          {this.state.summarystats && (
                            <small>{`${this.state.summarystats.geoEncodedOrdersPercentage}%`}</small>
                          )}
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
                          <small>No Of OutSourced Fleet:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          {this.state.summarystats && (
                            <small>
                              {this.state.summarystats.numberOfOutSourcedFleet}
                            </small>
                          )}
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
                          {this.state.summarystats && (
                            <small>{this.state.summarystats.branches}</small>
                          )}
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
                          <small>Number Of Territories</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          {this.state.summarystats && (
                            <small>{this.state.summarystats.territories}</small>
                          )}
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
                          {this.state.summarystats && (
                            <small>{this.state.summarystats.customers}</small>
                          )}
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
                          <i className="fa fa-clock-o  fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Average Loaging Time:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>0 Seconds</small>
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
                          <i className="fa fa-cogs fa-1x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Default Service Time:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className={style.cardBody}>
                      <div className="row">
                        <div className={`${col12} text-center`}>
                          <small>5 minutes</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default RoutesSummary;
