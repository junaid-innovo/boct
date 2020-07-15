import React, { Component } from 'react'
import {
   Modal,
   Container,
   Row,
   Col,
   Button,
   Form,
   FormGroup,
} from 'react-bootstrap'
import { FadeLoader } from 'react-spinners'
import $ from 'jquery'
import axios from '../API/Axios'
import DatePicker from '../DatePicker/Simple'
import style from './CreateTripModal.module.css'
import moment from 'moment'
class CreateTrip extends Component {
   constructor(props) {
      super(props)
      this.state = {
         validated: false,
         currentDate: new Date(),
         dateFormat: 'yyyy-MM-dd',
      }
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
      )
   }

   handleSubmit = (e) => {
      // this.assignPlanRoute()
   }
   assignPlanRoute = () => {
      let data = {
         trip_code: this.state.planCode,
         warehouse_id: parseInt(this.state.selectedBranchId),
         order_ids: this.state.selectedOrderId,
         route_id: this.state.selectedRoute,
         vehicle_id: this.state.selectedVehicle,
         trip_date: moment(this.state.tripDate).format('YYYY-MM-DD'),
      }
      axios
         .post(`storesupervisor/v1/planRoute`, data, {
            headers: {
               Authorization: `bearer ${localStorage.getItem('authtoken')}`,
            },
         })
         .then((res) => {
            let response = res.data
            if (response.code === 200) {
               // }
            } else {
               // this.showMessage(response.mesaege, 'error')
            }
         })
         .catch((error) => {
            this.showMessage(error.toString(), 'error', false)
         })
   }
   onTripDateChange = (date) => {
      this.setState({
         currentDate: date,
      })
   }
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
                     Create Trip
                  </Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Container>
                     {/* {this.state.reasons.length > 0
                        ? this.state.reasons.map((reason, key) => ( */}
                     <Row key className="show-grid">
                        <Col xs={6} md={10}>
                           <FormGroup>
                              <Form.Label>Trip Code</Form.Label>
                              <Form.Control type="text" placeholder="PLAN-" />
                           </FormGroup>
                           <FormGroup>
                              <Form.Label>Trip Date</Form.Label>
                              <div className={style.myContainer}>
                                 <DatePicker
                                    showTimeSelect={false}
                                    title="Select Date"
                                    currentDate={this.state.currentDate}
                                    dateFormat={this.state.dateFormat}
                                    minDate={new Date()}
                                    onChange={this.onTripDateChange}
                                    calendarClassName="row"
                                    className={`form-control ${style.myDatePicker}`}
                                 ></DatePicker>
                              </div>
                           </FormGroup>
                           <FormGroup></FormGroup>
                           <FormGroup>
                              <Form.Label>Select Vehicle</Form.Label>

                              <Form.Control
                                 as="select"
                                 className="rounded-0"
                                 onChange={this.onVehicleChange}
                              >
                                 <option data-content="<i class='fa fa-cutlery'></i> Cutlery">
                                    --- Select Vehicle ---
                                 </option>
                                 {/* {this.state.vehicleList.map((vehicle) => ( */}
                                 <option
                                 // key={vehicle.vehicle_id}
                                 // value={vehicle.vehicle_id}
                                 >
                                    1{/* {vehicle.number_plate} */}
                                 </option>
                                 {/* ))} */}
                              </Form.Control>
                           </FormGroup>
                        </Col>
                     </Row>
                     {/* ))
                        : ''} */}
                  </Container>
               </Modal.Body>
               <Modal.Footer>
                  <Button type="submit" className="btn btn-success">
                     Create Trip
                  </Button>
                  <Button onClick={this.props.onHide}>Cancel</Button>
               </Modal.Footer>
            </Form>
         </Modal>
      )
   }
}

export default CreateTrip
