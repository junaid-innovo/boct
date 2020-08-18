import React, { Component } from "react";
import DatePicker from "react-datepicker";

class Simple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTimeSelect: false,
    };
  }
  render() {
    return (
      <DatePicker
        showTimeSelect={this.props.showTimeSelect}
        title={this.props.title}
        customInput={this.props.customInput}
        selected={this.props.currentDate}
        dateFormat={this.props.dateFormat}
        onChange={this.props.onChange}
      ></DatePicker>
    );
  }
}
export default Simple;
