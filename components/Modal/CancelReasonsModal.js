import React, { Component } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
} from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import $ from "jquery";
import axios from "axios";
import { LOCAL_API_URL } from "../Constants/Enviroment/Enviroment";
import { connect } from "react-redux";
import { cancel_order } from "../../store/actions/live/actionCreator";
class CancleReasonsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      reasons: [],
      order_id: null,
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
        color={"#123abc"}
        loading={this.state.sideloading}
      />
    );
  };
  static getDerivedStateFromProps(props, state) {
    if (props.reasons && props.orderid) {
      return {
        reasons: props.reasons.cancel_reasons,
        order_id: props.orderid,
      };
    }
    return state;
  }
  handleSubmit = (e) => {
    const formdata = new FormData(e.target);
    console.log(...formdata);
    const data = {
      order_id: this.state.order_id,
      cancel_reason_id: this.refs.cancelreason.value,
    };

    const newdata = JSON.stringify(data);
    this.props.cancelReasonApi(newdata, this.props.selectedstore);
    // axios
    //   .post(`${LOCAL_API_URL}cancelOrders`, newdata)
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       alert(response.message);
    //     } else {
    //       alert(response.message);
    //     }
    //   })
    //   .catch((error) => console.log(error));
    e.preventDefault();
  };
  render() {
    return (
      <Modal {...this.props} aria-labelledby="contained-modal-title-vcenter">
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Cancel Order Reasons
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {this.state.reasons.length > 0
                ? this.state.reasons.map((reason, key) => (
                    <Row key={reason.cancel_reason_id} className="show-grid">
                      <Col xs={6} md={10}>
                        <FormGroup>
                          <Form.Check
                            type={`radio`}
                            ref="cancelreason"
                            value={reason.cancel_reason_id}
                            name="cancelReason"
                            id={`default`}
                            label={reason.reason.en}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ))
                : ""}
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
const mapStateToProps = (state) => {
  return {
    cancelOrderResponse: state.live.cancelOrderResponse,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    cancelReasonApi: (data, store_id) => dispatch(cancel_order(data, store_id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CancleReasonsModal);
