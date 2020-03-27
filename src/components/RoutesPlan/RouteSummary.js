import React, {Component} from 'react';
import {Card} from 'react-bootstrap';
import '../../css/RouteSummary.css';
import {col12} from "../Constants/Classes/BoostrapClassses";
import DatePicker from "react-datepicker";
class RoutesSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: null,
    };
  }
  // static getDerivedStateFromProps=(props,state)=>{
  //   if(props.)
  // }
  render() {
    return (
      <React.Fragment>
        <div className="summary-div">
          <div className="row mt-n1">
            <div className={col12}>
              <b>Summary</b>
            </div>
          </div>
          <div className="row mt-2">
            <div className={col12}>
              <div className="row">
                <div className="col-3">
                  <Card>
                    <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-calendar-check-o fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Date Range Selected:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12">
                          <small>
                            04/15/2020 05:35 PM -04/28/2020 05:35 PM
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card>
                    <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fas fa-clipboard-list fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>No Of Orders:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>50</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card>
                    <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-archive  fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Percentage Of Order GeoCoded</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>100%</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card>
                   <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-truck fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>No Of OutSourced Fleet:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>5</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className={col12}>
              <div className="row">
                <div className="col-3">
                  <Card>
                   <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fas fa-warehouse fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>No Of Branches:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>1</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card>
                   <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-map-marker fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Number Of Territories</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>3</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card>
                   <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-calendar-check-o fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Number Of Customer(s):</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>4</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-3">
                  <Card>
                   <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-clock-o  fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Average Loaging Time:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
                          <small>0 Seconds</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className={col12}>
              <div className="row">
                <div className="col-3">
                  <Card>
                   <Card.Header className="h-50">
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <i className="fa fa-cogs fa-3x"></i>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                          <small>Default Service Time:</small>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="row">
                        <div className="col-12 text-center">
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
