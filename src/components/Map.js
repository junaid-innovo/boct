import React, {
  // useState,4
  Component,
} from 'react';
import {compose} from 'recompose';
import _ from 'lodash';
import {
  Polyline,
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  TrafficLayer,
  // DirectionsService
} from 'react-google-maps';

import {data as devliveriesdata} from '../data/deliveries';
import markerimg from '../components/marker.svg';
import HomeIcon from '../components/Homeicon.svg';
import {ORDER_DELIVERED} from './Constants/Order/Constants';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

class Map extends Component {
  constructor(props) {
    super(props);
    this.origin = null;
    this.firstOrigin = null;
    this.markerPositions = [];
    this.markerCounts = 0;
    this.orignmarker = null;
    this.destmarker = null;
    this.destination = null;
    this.Mode = null;
    this.google = window.google;
    this.polylinescoords = [];
    this.state = {
      selectedOrder: null,
      directions: [],
      routes: null,
      markers: {url: markerimg},
      vehiclesdata: null,
      vehiclesdesc: null,
      loading: true,
      wayPoints: null,
      linescoords: [],
      ordercaltime: [],
    };
  }

  createOrderObject = (originorder, destinationorder) => {
    let originaddress = {
      lat: parseFloat(originorder.address.latitude),
      lng: parseFloat(originorder.address.longitude),
    };
    let destinationaddress = {
      lat: parseFloat(destinationorder.address.latitude),
      lng: parseFloat(destinationorder.address.longitude),
    };

    let orderpoints = {
      origin: new this.google.maps.LatLng(originaddress.lat, originaddress.lng),
      destination: new this.google.maps.LatLng(
        destinationaddress.lat,
        destinationaddress.lng
      ),
      order_id: destinationorder.order_id,
    };
    return orderpoints;
  };

  getCalcultedTimeOfWaypoints = (routelist, store_address) => {
    // routelist=routelist.map(({order})=> )
    let update_store_address = {address: store_address};
    let allorders = routelist.map(({order}) => order);
    allorders = [update_store_address, ...allorders];
    let count = 0;
    for (let i = 0; i < allorders.length; i++) {
      let originorder = allorders[i];
      if (typeof allorders[i + 1] !== 'undefined') {
        let destinationorder = allorders[i + 1];
        count++;
        let orderpoints = this.createOrderObject(originorder, destinationorder);
        this.getDistanceBetweenPoints(orderpoints);
      }
    }
  };
  getDistanceBetweenPoints = orderpoints => {
    const service = new this.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [orderpoints.origin],
        destinations: [orderpoints.destination],
        // waypoints: wayPoints,
        // optimizeWaypoints: true,
        avoidHighways: false,
        travelMode: this.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        let general = result.rows[0].elements[0];
        let distance_in_km = general.distance.text;
        let time_required = general.duration.text;
        let finalobject = {
          order_id: orderpoints.order_id,
          distance: distance_in_km,
          time: time_required,
        };
        let ordertime = [...this.state.ordercaltime];
        ordertime.push(finalobject);
        this.setState({ordercaltime: [...ordertime]});
      }
    );
  };
  setDirections(wayPoints) {
    const DirectionsService = new this.google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: this.origin,
        destination: this.destination,
        provideRouteAlternatives: false,
        // waypoints: wayPoints,
        // optimizeWaypoints: true,
        avoidHighways: false,
        travelMode: this.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        // console.log("Check Direction Services", result);
        if (status === this.google.maps.DirectionsStatus.OK) {
          const overViewCoords = result.routes[0].overview_path;
          this.setState({
            directions: [...this.state.directions, result],
            linescoords:
              typeof overViewCoords !== 'undefined'
                ? [...this.state.linescoords, overViewCoords]
                : null,
          });
        } else {
          // console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  makewayPoints(point, type, store_address) {
    let origin = {
      lat: null,
      lng: null,
    };
    if (store_address) {
      origin.lat = parseFloat(store_address.latitude);
      origin.lng = parseFloat(store_address.longitude);
    }
    let pointlength = 0;
    if (type === 'multiple') {
      let firstpoint = point[0];
      if (this.markerPositions.length > 0) {
        this.markerPositions.push(point);
      } else {
        this.markerPositions.push(point);
      }

      if (this.destination) {
        pointlength = point.length - 2;
        pointlength = point.length;
      } else {
        pointlength = point.length - 1;
      }
      if (this.origin) {
        this.origin = this.destination;
      } else {
        this.origin = new this.google.maps.LatLng(origin.lat, origin.lng);
        this.orignmarker = this.origin;
      }
    } else {
      this.markerPositions.push(point);
      pointlength = point.length - 2;
      this.origin = new this.google.maps.LatLng(origin.lat, origin.lng);
      this.orignmarker = this.origin;
    }
    let dest = {lat: null, lng: null};

    dest.lat = point[point.length - 1].order.address.latitude;
    dest.lng = point[point.length - 1].order.address.longitude;

    this.destination = new this.google.maps.LatLng(dest.lat, dest.lng);
    this.destmarker = this.dest;
    let wayPoints = [];
    const filteredpoints = point.filter(({order}, key) => {
      return order.address.latitude !== null;
    });

    filteredpoints.map(({order}, key) =>
      wayPoints.push({
        // location: new this.google.maps.LatLng(data.lat, data.lng),
        location: {
          lat: parseFloat(order.address.latitude),
          lng: parseFloat(order.address.longitude),
        },
        stopover: false,
      })
    );
    return wayPoints;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.routelist) {
      if (props.routelist.deliveries.length > 0) {
        if (state.ordercaltime.length > 0) {
          if (state.ordercaltime.length === props.routelist.deliveries.length) {
            console.log(state.ordercaltime.length);
          }
        }
      }
    }
    return state;
  }
  sendOrderRouteDistanceAndTime = orderlist => {
    console.log('send');
    console.log([...orderlist]);
    console.log(JSON.stringify([...orderlist]));
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.routelist !== prevProps.routelist) {
      //   await this.getCalcultedTimeOfWaypoints(this.props.routelist.deliveries, this.props.routelist.store_address);
      //   // prevProps
      if (this.props.routelist && this.props.routelist.deliveries.length > 0) {
        this.setState({
          routes: this.props.routelist.deliveries,
          ordercaltime: [],
        });
        let wayPoints = [];
        let routelist;
        // let wayPointsmax = 25;
        routelist = this.props.routelist.deliveries;
        let store_address = this.props.routelist.store_address;
        this.getCalcultedTimeOfWaypoints(
          this.props.routelist.deliveries,
          this.props.routelist.store_address
        );
        let chunkarray = _.chunk(routelist, 24);
        for (let i = 0; i < chunkarray.length; i++) {
          if (i !== 0) {
            let firstchunkitem = chunkarray[i][0];
            chunkarray[i - 1].push(firstchunkitem);
          }
        }
        this.polylinescoords = [];
        this.origin = null;
        this.destination = null;
        this.markerPositions = [];
        if (this.state.directions.length > 0) {
          this.setState({
            directions: [],
            linescoords: [],
          });
        }
        if (chunkarray.length > 1) {
          for (let i = 0; i < chunkarray.length; i++) {
            let lat = chunkarray[0][0].latitude;
            let lng = chunkarray[0][0].longitude;
            this.firstOrigin = {
              lat: lat,
              lng: lng,
            };
            let filteredchunk = chunkarray[i].filter(
              ({order}) => order.latitude !== 0 || order.langitude !== null
            );
            if (filteredchunk.length > 0) {
              let type = 'multiple';
              wayPoints = this.makewayPoints(
                filteredchunk,
                type,
                store_address
              );
              this.setDirections(wayPoints);
            }
          }
        } else {
          let filteredchunk = chunkarray[0].filter(order => order.lat !== 0);
          wayPoints = this.makewayPoints(
            filteredchunk,
            routelist,
            store_address
          );
          this.setDirections(wayPoints);
        }
        console.log('check new state');
        console.log(this.state);
        // this.sendOrderRouteDistanceAndTime(this.state.ordercaltime);
      }
    }
  }

  showDirectionRendrer = () => {
    const alternatingColor = ['#FFFF00', '#0000fd'];
    const strokeColor = ['#ff9900', '#6a0dad'];
    return this.state.directions.map((direcrray, key) => (
      <DirectionsRenderer
        key={key}
        places={this.state.markers}
        directions={direcrray}
        options={{
          polylineOptions: {
            icons: [
              {
                color: '#00ff00',
                icon: {
                  // strokeColor:strokeColor[key],
                  path: this.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                },
                offset: '100%',
                scaledSize: new this.google.maps.Size(2, 2),
                repeat: '100px',
              },
            ],
            //  strokeColor:strokeColor[key],
            // strokeColor: '#0000fd',
            // strokeOpacity: 0.9,
            // strokeWeight: `${key + 2}`,
            strokeWeight: 3.5,
          },
          suppressMarkers: true,
          markerOptions: {},
        }}
      ></DirectionsRenderer>
    ));
  };
  renderMarkers = () => {
    const markerColors = {green: '#008000', red: '#FF0000'};
    return (
      this.markerPositions &&
      [].concat.apply([], this.markerPositions).map(({order}, i) => (
        <Marker
          animation={`BOUNCE`}
          key={i}
          label={{
            // color: this.BLACK,
            fontWeight: 'bold',
            text: `${i + 1}`,
          }}
          position={
            new this.google.maps.LatLng(
              order.address.latitude,
              order.address.longitude
            )
          }
          onClick={e => {
            this.setState({
              selectedOrder: order,
            });
          }}
          // icon={{
          //   url: `http://maps.google.com/mapfiles/ms/icons/green.png`,
          //   color:
          //     order.order_status === ORDER_DELIVERED
          //       ? markerColors.green
          //       : markerColors.red,
          // }}
        ></Marker>
      ))
    );
  };
  renderInfoWindow = () => {
    let order = null;
    if (this.state.selectedOrder) {
      order = this.state.selectedOrder;
    }
    return order ? (
      <InfoWindow
        key={order.order_id + order.order_number}
        position={
          new this.google.maps.LatLng(
            order.address.latitude,
            order.address.longitude
          )
        }
        onCloseClick={() => {
          this.setState({selectedOrder: null});
        }}
      >
        <div
          style={{
            fontSize: '11px',
            background: `white`,
            borderRadius: null,
            padding: 15,
          }}
          id={order.order_id + order.order_number}
          key={order.order_id + order.order_number}
        >
          <h5>Order Id: {order.order_id}</h5>
          {order.items.map((item, key) => (
            <div key={key}>
              <strong>Products Name:</strong>
              {item.product_name.en}
              <br />
              <strong>Product Quantitity:</strong> {item.quantity}
            </div>
          ))}
          <div>
            <strong>Delivery Resource Name:</strong> {order.customer.name}
            <br />
            <strong>Phone Number:</strong> {order.customer.phone}
            <br />
            <strong>Coordinates:</strong>{' '}
            {`${order.address.latitude} , ${order.address.longitude}`}
            <br />
            <strong>Location:</strong> {order.address.address_detail}
          </div>
        </div>
      </InfoWindow>
    ) : null;
  };
  renderOriginMarker = () => {
    return (
      <Marker
        position={this.orignmarker}
        icon={{
          url: HomeIcon,
          // color: '#ff0000',
          scaledSize: new this.google.maps.Size(25, 25),
          offset: '100%',
        }}
      ></Marker>
    );
  };
  renderPolyLines = () => {
    return (
      <Polyline
        path={this.state.linescoords ? this.state.linescoords[0] : []}
        geodesic={true}
        options={{
          icons: [
            {
              color: '#00ff00',
              icon: {
                path: this.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              },
              offset: '100%',
              scaledSize: new this.google.maps.Size(2, 2),
              repeat: '100px',
            },
          ],
          clickable: true,
          strokeColor: '#FF5733',
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
      />
    );
  };
  render() {
    return (
      <React.Fragment>
        {' '}
        <GoogleMap
          key={this.state.routes ? this.state.routes : null}
          defaultZoom={11}
          style={{
            height: '100vh',
          }}
          defaultCenter={
            this.state.routes
              ? new this.google.maps.LatLng(
                  this.state.routes[0].order.address.latitude,
                  this.state.routes[0].order.address.longitude
                )
              : new this.google.maps.LatLng(23.8859, 45.0792)
          }
        >
          {/*this.renderGoogleMap()*/}
          {this.renderInfoWindow()}
          {this.renderMarkers()}
          {/*this.renderPolyLines*/}
          {this.showDirectionRendrer()}
          {this.renderOriginMarker()}
          <TrafficLayer autoUpdate />
        </GoogleMap>
      </React.Fragment>
    );
  }
}
export default compose(withScriptjs, withGoogleMap)(Map);
