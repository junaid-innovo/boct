import React, {Component} from 'react';
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
} from 'react-bootstrap';
import {FadeLoader} from 'react-spinners';
import axios from 'axios';
import DatePicker from '../DatePicker/Simple';
import moment from 'moment';
class ChangeDeliveryTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      timeSlots: [],
      order_id: null,
      currentDate: new Date(),
      dateFormat: 'yyyy-MM-dd  hh:mm:ss aa',
      currentTimeSlot: null,
      selectedTimeSlot: null,
      showModal: false,
    };
  }
  renderFadeLoader = () => {
    return (
      <FadeLoader
        css={`
          cssdisplay: block;
          margin: 0 auto;
          border-color: red;
        `}
        size={150}
        color={'#123abc'}
        loading={this.state.sideloading}
      />
    );
  };
  static getDerivedStateFromProps(props, state) {
    if (props.timeslots && props.orderid && props.currenttimeslot) {
      if (state.selectedTimeSlot) {
        return {
          showModal: true,
          currentTimeSlot: state.selectedTimeSlot,
          timeSlots: props.timeslots,
          order_id: props.orderid,
        };
      } else {
        console.log('yes selected slot false');
        return {
          showModal: true,
          currentTimeSlot: props.currenttimeslot,
          timeSlots: props.timeslots,
          order_id: props.orderid,
        };
      }
    }
    return state;
  }
  handleSubmit = e => {
    const formData = new FormData(e.target);
    let deliverytime = formData.get('changedelivery');
    let data = {
      order_id: `${this.state.order_id}`,
      delivery_slot_id: `${deliverytime}`,
      date: `${moment(this.state.currentDate).format('YYYY-MM-DD hh:mm:ss')}`,
    };
    axios
      .post(
        `http://192.168.18.12/backoffice/public/api/tower/updateOrderDelivery`,
        JSON.stringify(data)
      )
      .then(res => {
        let response = res.data;
        if (response.code === 200) {
          alert(response.message);
          this.setState({selectedTimeSlot: null});
          this.props.onHide(false);
          this.props.changedeliveryslotid(this.state.order_id,deliverytime)
        } else {
          alert(response.message);
        }
      })
      .catch(error => console.log(error));
    e.preventDefault();
  };

  handleDateChange = date => {
    console.log(date);
    this.setState({
      currentDate: date,
    });
  };
  handleRadioChange = e => {
    this.setState({
      selectedTimeSlot: parseInt(e.target.value),
    });
  };
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={e => this.handleSubmit(e)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Change Delivery Time
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row className="show-grid">
                <Col xs={6} md={10}>
                  <DatePicker
                    showTimeSelect={true}
                    title="Select Date"
                    currentDate={this.state.currentDate}
                    dateFormat={this.state.dateFormat}
                    onChange={this.handleDateChange}
                  ></DatePicker>
                </Col>
              </Row>
              {this.state.timeSlots.length > 0
                ? this.state.timeSlots
                    .sort((a, b) => a.slot_id < b.slot_id)
                    .map((slot, key) => (
                      <Row key={key} className="show-grid">
                        <Col xs={6} md={10}>
                          <FormGroup key>
                            <Form.Check
                              type={`radio`}
                              ref={`changedelivery${key}`}
                              checked={
                                slot.slot_id === this.state.currentTimeSlot
                              }
                              onChange={this.handleRadioChange}
                              value={slot.slot_id}
                              name="changedelivery"
                              id={`default${key}`}
                              label={slot.tile.en}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    ))
                : null}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Submit form</Button>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default ChangeDeliveryTime;
