import React, {
  // useState,4
  Component,
  PureComponent,
} from "react";
import ReactDOM from "react-dom";
import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from "recompose";
import { MAP } from "react-google-maps/lib/constants";
import { ToastContainer, toast, Zoom } from "react-toastify";

import _ from "lodash";
import style from "./Map.module.css";
import {
  Polyline,
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  TrafficLayer,
  Polygon,
  // MarkerClusterer,
  // DrawingManager,
  // DirectionsService
} from "react-google-maps";
// import withScriptjs from "react-google-maps/lib/async/withScriptjs";
// import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import markerimg from "./marker.svg";
import HomeIcon from "./Warehouse.png";
import CarIcon from "./Tracking.png";
import PropTypes from "prop-types";
import {
  ORDER_DELIVERED,
  ORDERS_IN_PRODUCTION,
  DELIVERY_TRIPS,
  ORDERS_READYFORPICKUP,
  ORDER_STATUS_READY_FOR_PICKUP,
} from "../Constants/Order/Constants";
import axios from "axios";
import {
  LOCAL_API_URL,
  LANGUAGE_STRING,
} from "../Constants/Enviroment/Enviroment";
import Button from "../UI/Button/Button";
import { json } from "d3";
import moment from "moment";
import { Form } from "react-bootstrap";
import { LANG_AR } from "../Constants/Language/Language";
// const {
//    SearchBox,
// } = require('react-google-maps/lib/components/places/SearchBox')
// const {
//    DrawingManager,
// } = require('react-google-maps/lib/components/drawing/DrawingManager')

class Map extends PureComponent {
  constructor(props) {
    super(props);
    this._map = null;
    this.drawingManger = React.createRef();
    // this._map = this.context[MAP]
    this._mapRef = React.createRef();
    this.origin = null;
    this.firstOrigin = null;
    this.markerPositions = [];
    this.orignmarker = null;
    this.destmarker = null;
    this.destination = null;
    this.Mode = null;
    this.google = window.google;
    this.polylinescoords = [];
    this.state = {
      mapModes: ["polygon", "rectangle"],
      selectedOrder: null,
      directions: [],
      routes: null,
      markers: { url: markerimg },
      loading: true,
      wayPoints: null,
      linescoords: [],
      ordercaltime: [],
      mapfeatures: {
        showMarker: false,
        showRoutes: false,
        showOriginMarker: false,
        drawing: false,
        polygon: false,
        orderType: null,
        routesEnabled: false,
      },
      routelist: { deliveries: [] },
      selectedmarkersdata: [],
      isActive: [],
      showInfowWindow: false,
      update: false,
      userRouteName: "",
      selectedWareHouseId: null,
      selectedRouteId: null,
      polygonPaths: null,
      defaultCenter: null,
      createTrip: false,
      allshapes: [],
      drawingModes: [],
      selectedOrdersDetail: [],
      polygoncenter: null,
      vehicleTracking: [],
      selectedVehilce: null,
      language: null,
      languageUpdate: true,
      error: false,
      errorInfo: null,
      loadMapComponents: true,
      map: {},
    };
  }
  onLoad = (drawingManager) => {};
  onPolygonComplete = (polygon) => {
    if (this.markerPositions) {
      let activemarkers = [];
      let orders_in_detail = [];
      this.markerPositions.map((val) => {
        val.map((order) => {
          let orderlat = order.address.latitude;
          let orderlong = order.address.longitude;
          let checkexit = this.google.maps.geometry.poly.containsLocation(
            new this.google.maps.LatLng(orderlat, orderlong),
            polygon
          );
          if (checkexit) {
            activemarkers.push(order.order_id);
            orders_in_detail.push({
              id: order.order_id,
              location: {
                latitude: orderlat,
                longitude: orderlong,
              },
            });
          }
        });
      });
      if (activemarkers.length > 0) {
        if (this.props.sendSelectedOrderId) {
          this.props.sendSelectedOrderId(activemarkers, orders_in_detail);
        }
      }
    }

    let finalpoints = this.mapGeofenceObject(polygon.getPath().getArray());
    finalpoints = { geofence_locations: finalpoints };
    this.sendGeofence(finalpoints);
  };

  sendGeofence = (finalpoints) => {
    axios
      .post(
        `${LOCAL_API_URL}storesupervisor/v1/getGeofence/47.36025273799896/47.36025273799896`,
        JSON.stringify(finalpoints),
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("authtoken")}`,
          },
        }
      )
      .then((res) => {
        let response = res.data;
        if (res.status === 200) {
          if (response.token) {
            this.setState({ loggedin: true });
            localStorage.setItem("authtoken", response.token);
            localStorage.setItem("username", "Supervisor");
            this.props.loggedin(true);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  onCircleHover = (e) => {};
  onCircleComplete = (circle) => {};
  onRectangleComplete = (rectangle) => {
    if (this.markerPositions) {
      let activemarkers = [];
      let orders_in_detail = [];
      this.markerPositions.map((val) => {
        val.map((order) => {
          let orderlat = order.address.latitude;
          let orderlong = order.address.longitude;
          let checkexit = rectangle
            .getBounds()
            .contains(new this.google.maps.LatLng(orderlat, orderlong));
          if (checkexit) {
            activemarkers.push(order.order_id);
            orders_in_detail.push({
              id: order.order_id,
              location: {
                latitude: orderlat,
                longitude: orderlong,
              },
            });
          }
        });
      });
      if (activemarkers.length > 0) {
        if (this.props.sendSelectedOrderId) {
          this.props.sendSelectedOrderId(activemarkers, orders_in_detail);
        }
      }
    }
  };

  mapGeofenceObject = (shape) => {
    let polygonpoints = [];
    shape.map((point) => {
      polygonpoints.push({
        lat: `${point.lat()}`,
        lng: `${point.lng()}`,
      });
    });
    // console.log('polygon points', polygonpoints)

    return polygonpoints;
  };
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
    let update_store_address = null;
    let allorders = routelist.map((order) => order);
    if (store_address) {
      update_store_address = { address: store_address };
      allorders = [update_store_address, ...allorders];
    } else {
      allorders = [...allorders];
    }
    let count = 0;
    for (let i = 0; i < allorders.length; i++) {
      let originorder = allorders[i];
      if (typeof allorders[i + 1] !== "undefined") {
        let destinationorder = allorders[i + 1];
        count++;
        let orderpoints = this.createOrderObject(originorder, destinationorder);
        this.getDistanceBetweenPoints(orderpoints);
      }
    }
  };
  getDistanceBetweenPoints = (orderpoints) => {
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
        this.setState({ ordercaltime: [...ordertime] });
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
        waypoints: wayPoints,
        // optimizeWaypoints: true,
        // avoidHighways: false,
        travelMode: this.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(), // for the time N milliseconds from now.
          // trafficModel: 'optimistic',
        },
      },
      (result, status) => {
        if (status === this.google.maps.DirectionsStatus.OK) {
          const overViewCoords = result.routes[0].overview_path;
          this.setState({
            directions: [...this.state.directions, result],
            linescoords:
              typeof overViewCoords !== "undefined"
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
    if (type === "multiple") {
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
      // console.log('check marker point', point)
      this.markerPositions.push(point);
      pointlength = point.length - 2;
      this.origin = new this.google.maps.LatLng(origin.lat, origin.lng);
      this.orignmarker = this.origin;
    }
    let dest = { lat: null, lng: null };
    if (point[point.length - 1]) {
      dest.lat = point[point.length - 1].address.latitude;
      dest.lng = point[point.length - 1].address.longitude;
    }

    this.destination = new this.google.maps.LatLng(dest.lat, dest.lng);
    this.destmarker = this.dest;
    let wayPoints = [];
    const filteredpoints = point.filter((order, key) => {
      return order.address.latitude !== null;
    });

    filteredpoints.map((order, key) =>
      wayPoints.push({
        // location: new this.google.maps.LatLng(data.lat, data.lng),
        location: {
          lat: parseFloat(order.address.latitude),
          lng: parseFloat(order.address.longitude),
        },
        stopover: false,
      })
    );
    if (wayPoints.length > 5) {
      // this.setState({
      //    defaultCenter: {
      //       lat: wayPoints[5].location.lat,
      //       lng: wayPoints[5].location.lng,
      //    },
      // })
    } else {
      if (wayPoints[0]) {
        // this.setState({
        //    defaultCenter: {
        //       lat: wayPoints[0].location.lat,
        //       lng: wayPoints[0].location.lng,
        //    },
        // })
      }
    }
    return wayPoints;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.selectedOrderId) {
      return {
        isActive: props.selectedOrderId,
      };
    }

    return state;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.createTrip !== prevState.createTrip) {
      // console.log('yes create trip changes')
    }
    if (this.props.selectedRouteId) {
      if (this.props.selectedRouteId !== this.state.selectedRouteId) {
        // let accessKey1 = 'createandclear'
        let accessKey1 = "saveandclear";
        let accessKey2 = "createanddelete";
        this.removeCustomControl(accessKey1);
        this.removeCustomControl(accessKey2);
        this.setState({
          selectedRouteId: this.props.selectedRouteId,
        });
        let allshapes = [...this.state.allshapes];
        if (allshapes.length > 0) {
          allshapes.map((shape) => {
            shape.setMap(null);
          });
        }
        //   allshapes[0].setMap(null)
      }
    }
    if (this.props.selectedBranchId) {
      if (this.props.selectedBranchId !== this.state.selectedWareHouseId) {
        this.setState({
          selectedWareHouseId: this.props.selectedBranchId,
        });
      }
    }
    if (this.props.polygonPaths !== prevProps.polygonPaths) {
      if (this.props.polygonPaths) {
        // if (this.props.mapfeatures.orderType !== DELIVERY_TRIPS) {
        this.getPolyGonCenter(this.props.polygonPaths);
        this.setState({
          polygonPaths: this.props.polygonPaths,
          // defaultCenter: {
          //    lat: this.props.polygonPaths[0].lat,
          //    lng: this.props.polygonPaths[0].lng,
          // },
        });
        // }
        if (this.props.routelist == null) {
          this.markerPositions = [];
        }
      } else {
        this.setState({
          polygonPaths: this.props.polygonPaths,
          polygoncenter: null,
        });
      }
    }
    if (this.props.routelist) {
      //   await this.getCalcultedTimeOfWaypoints(this.props.routelist.deliveries, this.props.routelist.store_address);
      //   // prevProps

      if (
        this.props.routelist.deliveries ||
        this.props.routelist.store_address
      ) {
        let origin = {
          lat: null,
          lng: null,
        };
        if (
          this.props.routelist.store_address !== {} &&
          this.props.routelist.deliveries.length === 0
        ) {
          let store_address = this.props.routelist.store_address;
          origin.lat = parseFloat(store_address.latitude);
          origin.lng = parseFloat(store_address.longitude);
          this.origin = origin;
          this.orignmarker = this.origin;
        }

        if (
          this.props.routelist.deliveries !== this.state.routelist.deliveries ||
          this.props.routelist.deliveries !== prevProps.routelist.deliveries
        ) {
          this.setState({
            routelist: this.props.routelist,
            defaultCenter: this.props.defaultCenter,
            directions: [],
          });
          this.markerPositions = [];
          this.renderMapSettings();
        }
      }
    }
    if (typeof this.props.mapfeatures !== "undefined") {
      if (this.props.mapfeatures !== this.state.mapfeatures) {
        if (typeof this.props.mapfeatures.orderType !== "undefined") {
          if (this.props.mapfeatures.orderType !== ORDERS_READYFORPICKUP) {
            this.removeAllShapes();
            this.removeCustomControl("clearallbtn", "top_right");
          } else {
            this.addRemoveIconInDrawingManager();
          }
          this.setState({
            mapfeatures: this.props.mapfeatures,
          });
        }
      }
    }
    if (typeof this.props.vehicleTrackingData !== "undefined") {
      if (this.props.vehicleTrackingData !== this.state.vehicleTracking) {
        if (this.props.vehicleTrackingData.length > 0) {
          this.setState({
            vehicleTracking: this.props.vehicleTrackingData,
            defaultCenter: this.props.vehicleTrackingData[0].vehiclePath,
          });
        } else {
          if (
            this.props.routelist &&
            typeof this.props.routelist.deliveries !== "undefined"
          ) {
            if (this.props.routelist.length === 0) {
              this.setState({
                defaultCenter: null,
              });
            }
          }
          this.setState({
            vehicleTracking: this.props.vehicleTrackingData,
          });
        }
      }
    }
  }
  addRemoveIconInDrawingManager = () => {
    let map = this._map.context[MAP];
    var gmnoprint = document.createElement("div");
    gmnoprint.class = `gmnoprint ${style.gmnoprint}`;
    ReactDOM.render(
      <React.Fragment>
        <div
          className="gmnoprint"
          title="Clear drawing"
          style={{
            margin: "5px",
            zIndex: "10",
            position: "absolute",
            right: "-10px",
            top: 0,
          }}
          onClick={this.removeAllShapes}
        >
          <div style={{ float: "left", lineHeight: 0 }}>
            <div
              role="button"
              tabIndex="0"
              aria-label="Stop drawing"
              aria-pressed="true"
              draggable="false"
              style={{
                direction: " ltr",
                overflow: " hidden",
                textAlign: " left",
                position: " relative",
                color: " rgb(0, 0, 0)",
                fontFamily: " Roboto, Arial, sans-serif",
                userSelect: " none",
                fontSize: " 11px",
                backgroundColor: " rgb(255, 255, 255)",
                padding: " 4px",
                borderBottomLeftRadius: " 2px",
                borderTopLeftRadius: " 2px",
                backgroundClip: " padding-box",
                boxShadow: " rgba(0, 0, 0, 0.3) 0px 1px 4px -1px",
                fontWeight: " 500",
              }}
            >
              <span style={{ display: "inline-block" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <i
                    style={{
                      position: "absolute",
                      fontSize: "19px",
                    }}
                    className="fa fa-remove"
                  ></i>
                </div>
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>,
      gmnoprint
    );
    gmnoprint.accessKey = "clearallbtn";
    let index = map.controls[this.google.maps.ControlPosition.TOP_RIGHT].push(
      gmnoprint
    );
  };

  removeAllShapes = () => {
    let checkIsActive = [...this.state.isActive];
    let allshapes = [...this.state.allshapes];
    if (allshapes.length > 0) {
      allshapes.map((shape) => {
        shape.setMap(null);
      });
    }
    if (checkIsActive.length > 0) {
      this.props.sendSelectedOrderId([], []);
    }
    let accessKey1 = "saveandclear";
    let accessKey2 = "createanddelete";
    this.removeCustomControl(accessKey1);
    this.removeCustomControl(accessKey2);
  };

  componentDidMount() {
    if (this.props.mapfeatures) {
      if (this.props.mapfeatures.drawing) {
        if (this.props.mapfeatures.orderType === ORDERS_READYFORPICKUP) {
          this.addRemoveIconInDrawingManager();
        }
      }
      this.setState({
        mapfeatures: this.props.mapfeatures,
      });
    }
    if (this.props.polygonPaths) {
      this.setState({
        polygonPaths: this.props.polygonPaths,
      });
    }
    window.gm_authFailure = () => {
      if (this.props.getMapError) {
        this.setState({
          loadMapComponents: false,
        });
        this.props.getMapError(false);
      }
    };
    window.mapsCallback = (obj) => {
      // isMapsApiLoaded = true;
      console.log("Chekc Callback object", obj);
      // initialize map, etc.
    };
    if (this.context[MAP].data.getMap() !== "undefined") {
      this.setState({
        map: this.context[MAP].data.getMap(),
      });
    }
  }
  sendOrderRouteDistanceAndTime = (orderlist) => {
    // console.log('send')
    // console.log([...orderlist])
    // console.log(JSON.stringify([...orderlist]))
  };

  renderMapSettings = () => {
    if (
      this.props.routelist &&
      this.props.routelist.deliveries &&
      this.props.routelist.deliveries.length > 0
    ) {
      this.setState({
        routes: _.uniqBy(this.props.routelist.deliveries, "order_id"),
        ordercaltime: [],
      });
      let wayPoints = [];
      let routelist;
      // let wayPointsmax = 25;
      routelist = _.uniqBy(this.props.routelist.deliveries, "order_id");
      let store_address = null;
      if (this.state.mapfeatures.showOriginMarker) {
        if (this.props.routelist.store_address) {
          store_address = this.props.routelist.store_address;
        }
      }
      // this.getCalcultedTimeOfWaypoints(
      //   this.props.routelist.deliveries,
      //   this.props.routelist.store_address
      // );
      let chunkarray = _.chunk(routelist, 24);
      console.log("CHUNK ARRAY", chunkarray);
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
            (order) => !parseFloat(order.address.latitude) <= 0
          );
          if (filteredchunk.length > 0) {
            let type = "multiple";
            wayPoints = this.makewayPoints(filteredchunk, type, store_address);
            if (this.state.mapfeatures.showRoutes) {
              this.setDirections(wayPoints);
            }
          }
        }
      } else {
        let filteredchunk = chunkarray[0].filter((order) => {
          return (
            !parseFloat(order.address.latitude) <= 0
            // order.address.langitude !== null
          );
          // !parseFloat(order.latitude) <= 0
        });
        wayPoints = this.makewayPoints(filteredchunk, routelist, store_address);
        if (this.state.mapfeatures.showRoutes) {
          this.setDirections(wayPoints);
        }
      }
      // this.sendOrderRouteDistanceAndTime(this.state.ordercaltime);
    }
  };

  showDirectionRendrer = () => {
    const alternatingColor = ["#FFFF00", "#0000fd"];
    const strokeColor = ["#ff9900", "#6a0dad"];
    return this.state.directions.map((direcrray, key) => (
      <DirectionsRenderer
        key={key}
        places={this.state.markers}
        directions={direcrray}
        options={{
          polylineOptions: {
            icons: [
              {
                color: "#00ff00",
                icon: {
                  // strokeColor:strokeColor[key],
                  path: this.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                },
                offset: "100%",
                scaledSize: new this.google.maps.Size(2, 2),
                repeat: "100px",
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
  onMarkerClick = (e, order, i) => {
    if (parseInt(order.order_status_id) === ORDER_STATUS_READY_FOR_PICKUP) {
      let isActive = [...this.state.isActive];
      let orders_in_detail = [...this.state.selectedOrdersDetail];
      let selectedMarkers = this.state.selectedmarkersdata;
      if (order) {
        if (
          this.state.mapfeatures.orderType !== ORDERS_IN_PRODUCTION &&
          this.state.mapfeatures.orderType !== DELIVERY_TRIPS
        ) {
          if (!isActive.includes(order.order_id)) {
            isActive.push(order.order_id);
            orders_in_detail.push({
              id: order.order_id,
              location: {
                latitude: order.address.latitude,
                longitude: order.address.longitude,
              },
            });
          } else {
            _.remove(isActive, (item) => item == order.order_id);
            _.remove(orders_in_detail, ({ id }) => id == order.order_id);
          }
          if (_.find(selectedMarkers, order)) {
            _.remove(selectedMarkers, (item) => item == order);
          } else {
            selectedMarkers.push(order);
          }
        }
        this.setState({
          isActive: isActive,
          selectedOrder: order,
          selectedOrdersDetail: orders_in_detail,
          selectedmarkersdata: selectedMarkers,
          showInfowWindow: false,
          update: !this.state.update,
        });
        if (
          this.state.mapfeatures.orderType !== ORDERS_IN_PRODUCTION &&
          this.state.mapfeatures.orderType !== DELIVERY_TRIPS
        ) {
          if (this.props.sendSelectedOrderId) {
            this.props.sendSelectedOrderId(isActive, orders_in_detail);
          }
        }
      }
    } else {
      console.log("Order Status Is Not READYFORPICKUP");
    }
  };
  onMarkerClustererClick = (markercluster) => {
    let allmarkers = markercluster.getMarkers();
  };

  getMarkerPostion = (lat, lng) => {
    return new this.google.maps.LatLng(lat, lng);
  };
  renderMarkers = () => {
    const markerColors = { green: "#008000", red: "#FF0000" };
    let MarkerComp = this.state.loadMapComponents ? (
      <MarkerClusterer
        onClick={this.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={1}
        maxZoom={18}
        zoomOnClick={true}
      >
        {this.markerPositions &&
          this.state.directions &&
          [].concat.apply([], this.markerPositions).map(
            (order, i) => (
              <Marker
                // animation={this.google.maps.Animation.BOUNCE}
                pinColor="yellow"
                key={i}
                label={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  text: `${i + 1}`,
                }}
                position={this.getMarkerPostion(
                  order.address.latitude,
                  order.address.longitude
                )}
                onClick={(e) => this.onMarkerClick(e, order, i)}
                onRightClick={(e) => {
                  this.setState({
                    showInfowWindow: true,
                    selectedOrder: order,
                  });
                }}
                icon={
                  this.state.isActive.includes(order.order_id)
                    ? {
                        url: `http://maps.google.com/mapfiles/ms/icons/green.png`,
                        color:
                          order.order_status === ORDER_DELIVERED
                            ? markerColors.green
                            : markerColors.red,
                      }
                    : null
                }
              ></Marker>
            )
            // )
          )}
      </MarkerClusterer>
    ) : null;

    return MarkerComp;
  };
  calulateTotalQuantity = (items) => {
    let sum = 0;
    items.map(({ quantity }) => (sum += parseInt(quantity)));
    return sum;
  };
  renderInfoWindow = () => {
    let lang = this.props.language;
    let t = this.props.t;
    let order = null;
    if (this.state.selectedOrder) {
      order = this.state.selectedOrder;
    }
    return order ? (
      <InfoWindow
        key={order.order_id + order.order_number + this.state.isActive}
        position={
          new this.google.maps.LatLng(
            order.address.latitude,
            order.address.longitude
          )
        }
        onCloseClick={() => {
          this.setState({ selectedOrder: null, showInfowWindow: false });
        }}
      >
        <div
          style={{
            fontSize: "11px",
            background: `white`,
            borderRadius: null,
            padding: 15,
          }}
          dir={lang === LANG_AR ? "rtl" : "ltr"}
          className={lang === LANG_AR ? "text-right" : ""}
          id={order.order_id + order.order_number}
          key={order.order_id + order.order_number}
        >
          <h5>
            {t("Order Id")}: {order.order_id}
          </h5>
          <div>
            <strong className="font-weight-bold pr-1">
              {t("Order code")}:
            </strong>{" "}
            {order.order_number}
          </div>
          <div>
            <span className="font-weight-bold pr-1">{t("Delivery Time")}:</span>
            <span>
              {typeof order.delivery_slot !== "undefined"
                ? order.delivery_slot.en
                : order.order_slot}
            </span>
          </div>
          <div>
            <span className="font-weight-bold pr-1">
              {t("Total Quantity")}:
            </span>
            <span>{this.calulateTotalQuantity(order.items)}</span>
          </div>
          <div>
            <span className="font-weight-bold pr-1">{t("Total Amount")}:</span>
            <span>{order.grand_total}</span>
          </div>
          <div>
            <span className="font-weight-bold pr-1">{t("Order Status")}:</span>
            <span>{order.order_status[lang]}</span>
          </div>
          <div>
            <span className="font-weight-bold pr-1">{t("Area Name")}:</span>
            <span>{order.address.area_name[lang]}</span>
          </div>
          <div>
            <strong className="font-weight-bold pr-1">
              {t("Delivery Resource Name")}:
            </strong>{" "}
            {typeof order.customer != "undefined"
              ? order.customer.name
              : order.customer_name
              ? order.customer_name
              : " "}
            <br />
            <strong className="font-weight-bold pr-1">
              {t("Phone Number")}:
            </strong>{" "}
            {typeof order.customer != "undefined"
              ? order.customer.phone
              : order.customer_mobile
              ? order.customer_mobile
              : " "}
            <br />
            <strong className="font-weight-bold pr-1">
              {t("Coordinates")}:
            </strong>{" "}
            {`${order.address.latitude} , ${order.address.longitude}`}
            <br />
            <strong className="font-weight-bold pr-1">
              {t("Location")}:
            </strong>{" "}
            {order.address.address_detail}
            <br />
          </div>
          <div>
            <span className="font-weight-bold pr-1">
              {t("Payment Method")}:
            </span>
            {/* <span>{order.payment_method[lang]}</span> */}
          </div>
          <div>
            <span className="font-weight-bold pr-1">
              {t("Order Products")}:
            </span>
          </div>
          {order.items &&
            order.items.map((item, key) => (
              <div key={key}>
                {`${item.product_name[lang]} x ${item.quantity} ${
                  item.foc !== "0" && item.foc !== "NULL"
                    ? ` + ${item.foc}`
                    : ""
                }`}
              </div>
            ))}
        </div>
      </InfoWindow>
    ) : null;
  };
  renderOriginMarker = () => {
    return (
      <Marker
        position={this.props.defaultCenter}
        icon={{
          url: HomeIcon,
          // color: '#ff0000',
          scaledSize: new this.google.maps.Size(25, 25),
          offset: "100%",
        }}
      ></Marker>
    );
  };

  renderVehicleInfoWindow = () => {
    let t = this.props.t;
    return this.state.selectedVehilce ? (
      <InfoWindow
        key={this.state.selectedVehilce.id}
        position={this.state.selectedVehilce.position}
        onCloseClick={() => {
          this.setState({ selectedVehilce: null, showInfowWindow: false });
        }}
      >
        <div
          style={{
            fontSize: "11px",
            background: `white`,
            borderRadius: null,
            padding: 15,
          }}
          key={this.state.selectedVehilce.id}
        >
          {/* <h5>Vehicle Id: {this.state.selectedVehilce.id}</h5> */}
          <div>
            <strong className="font-weight-bold pr-1">
              {t("Vehicle Code")}:
            </strong>{" "}
            <span>{this.state.selectedVehilce.vehicleCode} </span>
          </div>
          <div>
            <span className="font-weight-bold pr-1">
              {t("Vehicle Category")}:
            </span>
            <span> {this.state.selectedVehilce.vehicleCategory.en}</span>
          </div>
          <div>
            <span className="font-weight-bold pr-1">{t("Plate No")}:</span>
            <span> {this.state.selectedVehilce.plateNo}</span>
          </div>{" "}
          <div>
            <span className="font-weight-bold pr-1">{t("Driver Name")}:</span>
            <span> {this.state.selectedVehilce.driverName}</span>
          </div>{" "}
          <div>
            <span className="font-weight-bold pr-1">{t("Driver Erp Id")}:</span>
            <span>{this.state.selectedVehilce.driverErpId}</span>
          </div>{" "}
          <div>
            <span className="font-weight-bold pr-1">{t("All Trips")}:</span>
            <span>
              {typeof this.state.selectedVehilce.tripCounter !== "undefined" &&
                this.state.selectedVehilce.tripCounter.all_counter}
            </span>
          </div>{" "}
          <div>
            <span className="font-weight-bold pr-1">
              {t("Completed Trips")}:
            </span>
            <span>
              {typeof this.state.selectedVehilce.tripCounter !== "undefined" &&
                this.state.selectedVehilce.tripCounter.completed_counter}
            </span>
          </div>{" "}
          <div>
            <span className="font-weight-bold pr-1">{t("Started Trips")}:</span>
            <span>
              {typeof this.state.selectedVehilce.tripCounter !== "undefined" &&
                this.state.selectedVehilce.tripCounter.start_counter}
            </span>
          </div>{" "}
          <div>
            <span className="font-weight-bold pr-1">
              {t("Not Started Trip")}:
            </span>
            <span>
              {typeof this.state.selectedVehilce.tripCounter !== "undefined" &&
                this.state.selectedVehilce.tripCounter.notStart_counter}
            </span>
          </div>{" "}
        </div>
      </InfoWindow>
    ) : null;
  };
  renderVehicleTrack = () => {
    return this.state.vehicleTracking.map((vehicleData, i) => {
      return (
        <Marker
          // animation={this.google.maps.Animation.BOUNCE}
          pinColor="yellow"
          key={i}
          // label={{
          //    fontWeight: 'bold',
          //    fontSize: '10px',
          //    text: `${i + 1}`,
          // }}
          position={vehicleData.vehiclePath}
          onClick={(e) => {
            this.setState({
              selectedVehilce: {
                position: vehicleData.vehiclePath,
                id: parseInt(vehicleData.vehicle_id),
                vehicleCode: vehicleData.vehicleCode,
                plateNo: vehicleData.plateNo,
                vehicleCategory: vehicleData.vehicleCategory,
                driverName: vehicleData.driverName,
                driverErpId: vehicleData.driverErpId,
                tripCounter: vehicleData.tripCounter,
              },
            });
          }}
          // onClick={(e) => this.onMarkerClick(e, order, i)}
          // onRightClick={(e) => {
          //    this.setState({
          //       showInfowWindow: true,
          //       selectedOrder: order,
          //    })
          // }}
          icon={{
            url: CarIcon,
            // color: '#ff0000',
            scaledSize: new this.google.maps.Size(48, 48),
            offset: "100%",
          }}
        ></Marker>
      );
      // <Polyline
      //    path={vehicleData.polyLinePath}
      //    // geodesic={true}
      //    options={{
      //       icons: [
      //          {
      //             color: '#00ff00',
      //             icon: {
      //                path: this.google.maps.SymbolPath
      //                   .FORWARD_CLOSED_ARROW,
      //             },
      //             offset: '100%',
      //             scaledSize: new this.google.maps.Size(2, 2),
      //             repeat: '100px',
      //          },
      //       ],
      //       clickable: true,
      //       strokeColor: '#FF5733',
      //       strokeOpacity: 1,
      //       strokeWeight: 1,
      //    }}
      // />
    });
  };
  renderPolyLines = () => {
    return (
      <Polyline
        path={this.state.linescoords ? this.state.linescoords[0] : []}
        geodesic={true}
        options={{
          icons: [
            {
              color: "#00ff00",
              icon: {
                path: this.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              },
              offset: "100%",
              scaledSize: new this.google.maps.Size(2, 2),
              repeat: "100px",
            },
          ],
          clickable: true,
          strokeColor: "#FF5733",
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
      />
    );
  };
  onCircleClick = (e) => {
    // console.log('circle clicked', e)
  };
  onPolygonLoad = (e) => {
    // console.log('Polygon loaded'.e)
  };
  // onDrawingChange = (e) => {
  //    console.log('test qieseere', e)
  // }
  getPolyGonCenter = (polygonPaths) => {
    // console.log('check paths', polygonPaths)
    var bounds = new this.google.maps.LatLngBounds();
    var i;

    // The Bermuda Triangle
    var polygonCoords = polygonPaths;

    for (i = 0; i < polygonCoords.length; i++) {
      bounds.extend(polygonCoords[i]);
    }

    let center = bounds.getCenter();
    let defaultCenter = {
      lat: center.lat(),
      lng: center.lng(),
    };
    this.setState({
      polygoncenter: defaultCenter,
    });
  };
  renderPolygon = () => {
    const options = {
      // fillColor: 'lightblue',
      fillOpacity: 0.6,
      strokeColor: "red",
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: true,
      draggable: false,
      editable: false,
      geodesic: true,
      zIndex: 1,
    };
    return (
      <Polygon
        geodesic={true}
        visible={true}
        // ref={this.polygonRef}
        onLoad={(e) => this.onPolygonLoad(e)}
        paths={this.state.polygonPaths}
        options={options}
        {...this.props}
        onRightClick={this.onPolygonClick}
      />
    );
  };

  saveGeofenceRoute = (geofencePoints, overlay, accessKey) => {
    // let map = this._map.context[MAP]
    let data = {
      ware_house_id: this.state.selectedWareHouseId,
      route_name: this.state.userRouteName
        ? this.state.userRouteName
        : "Test Custome Route2",
      geofence_locations: [...geofencePoints],
    };
    axios
      .post(`${LOCAL_API_URL}storesupervisor/v1/saveGeofence`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          this.props.getDeletedOrders(this.state.isActive);
          overlay.setMap(null);
          this.removeCustomControl(accessKey);
          this.removeAllShapes();
          this.setState({
            isActive: [],
          });
          this.showMessage("Route Saved Successfully", "success");
        } else {
          this.showMessage(response.mesaege, "error");
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), "error", false);
      });
  };

  removeGeofenceRoute = (geofencePoints, accessKey = "") => {
    let data = {
      route_id: this.state.selectedRouteId,
    };
    axios
      .post(`${LOCAL_API_URL}storesupervisor/v1/removeRoute`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        if (response.code === 200) {
          if (accessKey !== "") {
            this.removeCustomControl(accessKey);
          }
          this.setState({
            polygonPaths: null,
          });
          this.props.getDeltedRouteId(this.state.selectedRouteId);

          this.showMessage("Route Deleted Successfully", "success");
        } else {
          this.showMessage(response.mesaege, "error");
        }
      })
      .catch((error) => {
        this.showMessage(error.toString(), "error", false);
      });
  };
  removeCustomControl = (accessKey, position = "") => {
    let map = this._map.context[MAP];
    if (position.length > 0) {
      if (position === "top_center") {
        map.controls[this.google.maps.ControlPosition.TOP_CENTER]["i"].map(
          (val, i) => {
            // console.log('check', val)
            if (val.accessKey === accessKey) {
              map.controls[
                this.google.maps.ControlPosition.TOP_CENTER
              ].removeAt(i);
            }
          }
        );
      }
      if (position === "top_right") {
        map.controls[this.google.maps.ControlPosition.TOP_RIGHT]["i"].map(
          (val, i) => {
            // console.log('check', val)
            if (val.accessKey === accessKey) {
              map.controls[this.google.maps.ControlPosition.TOP_RIGHT].removeAt(
                i
              );
            }
          }
        );
      }
    }

    map.controls[this.google.maps.ControlPosition.TOP_CENTER]["i"].map(
      (val, i) => {
        // console.log('check', val)
        if (val.accessKey === accessKey) {
          map.controls[this.google.maps.ControlPosition.TOP_CENTER].removeAt(i);
        }
      }
    );
  };
  clearGeoFenceRoute = (e, overlay, accessKey) => {
    overlay.setMap(null);
    this.removeCustomControl(accessKey);
    this.removeAllShapes();
  };
  onPlanCodeChange = (e) => {};
  polygonClick = (e, overlay) => {
    let geofene_points = [];
    let map = this._map.context[MAP];
    if (overlay.type === "polygon") {
      geofene_points = this.mapGeofenceObject(overlay.getPath().getArray());
    }
    let accessKey = "saveandclear";
    this.removeCustomControl(accessKey);
    const controlButtonDiv = document.createElement("div");
    controlButtonDiv.setAttribute("class", "mt-4");
    ReactDOM.render(
      <React.Fragment>
        <Form.Control
          className={`rounded-0 ${style.routeNameInput} textingred`}
          type="text"
          name="firstName"
          defaultValue={this.state.userRouteName}
          onChange={this.onRouteNameChange}
          placeholder={"Enter Route Name"}
          // isValid={false}
        />
        <div className="btn-group" role="group" aria-label="First group">
          <button
            type="button"
            className="btn-xs btn-primary"
            onClick={() =>
              this.saveGeofenceRoute(geofene_points, overlay, accessKey)
            }
          >
            Save Route
          </button>
          <button
            type="button"
            className="btn-xs btn-danger"
            onClick={(e) => this.clearGeoFenceRoute(e, overlay, accessKey)}
          >
            Clear Route
          </button>
        </div>
        {/* <Button
               className="btn-xs btn-secondary mr-2"
               onClick={() => this.saveGeofenceRoute(geofene_points)}
            >
               Save Trip
            </Button>
            <Button
               className="btn-xs  btn-danger"
               onClick={(e) => overlay.setMap(null)}
            >
               Clear Route
            </Button> */}
      </React.Fragment>,
      controlButtonDiv
    );
    controlButtonDiv.accessKey = accessKey;

    let index = map.controls[this.google.maps.ControlPosition.TOP_CENTER].push(
      controlButtonDiv
    );
    // console.log('check control index', index)
    // map.controls.removeAt(index)
  };
  onShapeComplete = (event) => {
    this.removeAllShapes();
    const shape = event.overlay;
    shape.type = event.type;
    if (this.state.mapfeatures.routesEnabled) {
      this.google.maps.event.addListener(shape, "rightclick", (e) =>
        this.polygonClick(e, event.overlay)
      );
    }
    let allshapes = [...this.state.allshapes];
    allshapes.push(shape);
    this.setState({
      allshapes: allshapes,
    });
  };
  handleApiLoaded = (e) => {
    console.log("Yes api is lodedddddddd");
  };
  showMessage = (message, type, autoClose = 2000) =>
    toast(message, {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "success" ? style.toastContainerSuccess : style.toastContainer,
    });
  onCreateTrip = () => {
    this.setState({
      createTrip: true,
    });
  };
  onRouteNameChange = (e) => {
    let value = e.target.value;
    this.setState({
      userRouteName: value,
    });
  };
  onPolygonClick = (e) => {
    // this.setState({ polygonPaths: null })
    let map = this._map.context[MAP];
    let accessKey = "createanddelete";
    this.removeCustomControl(accessKey);
    const controlButtonDiv = document.createElement("div");
    ReactDOM.render(
      <React.Fragment>
        <Button
          className="btn-xs btn-secondary mr-2"
          onClick={() => this.onCreateTrip}
        >
          Create Trip
        </Button>
        <Button
          className="btn-xs  btn-danger"
          onClick={(e) =>
            this.removeGeofenceRoute(this.state.polygonPaths, accessKey)
          }
          // onClick={(e) => this.removeGeofenceRoute(geofene_points)}
        >
          Delete Route
        </Button>
      </React.Fragment>,
      controlButtonDiv
    );
    controlButtonDiv.accessKey = accessKey;
  };
  renderDrawingManager = () => {
    let options;
    if (this.state.mapfeatures.orderType === ORDERS_READYFORPICKUP) {
      options = {
        // drawingMode: this.google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: this.google.maps.ControlPosition.TOP_RIGHT,
          drawingModes: ["polygon", "rectangle"],
          // drawingModes: this.state.mapfeatures.orderType
          //    ? ['polygon', 'circle', 'marker', 'rectangle']
          //    : [],
          // this.state.mapfeatures.orderType ===
          // ORDERS_READYFORPICKUP
          //    ? ['polygon', 'rectangle']
          //    : [],
          // 'polygon',
          // 'circle',
          // 'marker',
          // 'rectangle',
        },
        circleOptions: {
          onClick: this.onCircleClick,
          fillColor: "#ffff00",
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          dragable: true,
          zIndex: 1,
        },
        polygonOptions: {
          // editable: true,
          // draggable: true,
          fillColor: "lightblue",
        },
      };
    } else {
      options = {
        drawingControl: false,
        drawingControlOptions: {
          position: this.google.maps.ControlPosition.TOP_RIGHT,
          drawingModes: ["polygon", "rectangle"],
        },
        circleOptions: {
          onClick: this.onCircleClick,
          fillColor: "#ffff00",
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          dragable: true,
          zIndex: 1,
        },
        polygonOptions: {
          // editable: true,
          // draggable: true,
          fillColor: "lightblue",
        },
      };
    }
    return (
      <DrawingManager
        // {...this.props}
        // ref={this.drawingManger}
        key={this.state.mapfeatures}
        onLoad={this.onLoad}
        defaultOptions={options}
        // onChage={this.onDrawingChange()}
        onPolygonComplete={this.onPolygonComplete}
        onCircleComplete={this.onCircleComplete}
        onRectangleComplete={this.onRectangleComplete}
        onOverlayComplete={(e) => this.onShapeComplete(e)}
        // onOverlayComplete={(...args) =>
        //    console.log('=== onOverlayComplete ===', ...args)
        // }
      />
    );
  };
  OnMapLoad = (map) => {};
  render() {
    const gmapError = (
      <React.Fragment>
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: "0px",
            left: "0px",
            backgroundColor: "rgb(229, 227, 223)",
          }}
        >
          <div className="gm-err-container">
            <div className="gm-err-content">
              <div className="gm-err-icon">
                <img
                  src="https://maps.gstatic.com/mapfiles/api-3/images/icon_error.png"
                  draggable="false"
                  style={{ userSelect: "none" }}
                />
              </div>
              <div className="gm-err-title">Oops! Something went wrong.</div>
              <div className="gm-err-message">
                This page didn't load Google Maps correctly. See the JavaScript
                console for technical details.
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <ToastContainer
          transition={Zoom}
          position="top-center"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        {typeof this.state.map === "undefined" && gmapError}
        <GoogleMap
          key={this.props.language}
          ref={(map) => {
            this._map = map;
            return this._map;
          }}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
          }}
          zoom={this.props.zoom ? this.props.zoom : 11}
          defaultZoom={11}
          language={this.props.language}
          defaultCenter={{ lat: 23.8859, lng: 45.0792 }}
          center={
            this.state.polygoncenter
              ? this.state.polygoncenter
              : this.state.defaultCenter
              ? this.state.defaultCenter
              : { lat: 23.8859, lng: 45.0792 }
          }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        >
          {this.state.mapfeatures.drawing &&
            this.state.mapfeatures.orderType === ORDERS_READYFORPICKUP &&
            this.renderDrawingManager()}

          {this.state.showInfowWindow ? this.renderInfoWindow() : null}
          {[].concat.apply([], this.markerPositions).length > 0 &&
            this.renderMarkers()}
          {this.state.polygonPaths && this.renderPolygon()}

          {this.state.mapfeatures.showRoutes && this.showDirectionRendrer()}
          {this.state.vehicleTracking.length > 0 && this.renderVehicleTrack()}
          {this.renderVehicleInfoWindow()}
          {this.state.mapfeatures.showOriginMarker && this.renderOriginMarker()}
          <TrafficLayer autoUpdate />
        </GoogleMap>

        {/* )} */}
      </React.Fragment>
    );
  }
}
Map.contextTypes = {
  [MAP]: PropTypes.object,
  value: PropTypes.object,
};

export default compose(
  withProps((props) => {
    return {
      googleMapURL: props.googleMapURL,
    };
  }),
  withHandlers(() => {
    const refs = {
      map: undefined,
    };

    return {
      onMapMounted: () => (ref) => {
        refs.map = ref;
      },
      onZoomChanged: ({ onZoomChange }) => () => {
        onZoomChange(refs.map.getZoom());
      },
    };
  }),
  withScriptjs,
  withGoogleMap
)(Map);
