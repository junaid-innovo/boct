import React, {Component} from 'react';
import {Form} from 'react-bootstrap';
class RoutesPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: null,
    };
  }
  render() {
    return (
      <div className="row mt-3 no-gutters">
        <div className="col-md-6">
          <div className="row no-gutters">
            <div className="col-md-4 mr-3n">
              <b>Routes > Trip Planning ></b>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default RoutesPlan;
