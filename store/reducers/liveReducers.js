import {
  GET_LIVE,
  GET_TRIPS,
  SELECT_BRANCH,
  GET_TRIP_DELIVERIES,
  GET_CANCEL_REASONS,
  GET_DELIVERY_SLOTS,
  CANCEL_ORDER,
  UPDATE_DELIVERY_TIME,
} from "../actions/actionTypes";

const initialState = {
  counter: 0,
  results: [],
  deliveries: [],
  tripList: [],
  selectedBranch: null,
  cancelReasons: null,
  deliverySlots: null,
  selectedOrder: null,
  cancelOrderResponse: null,
  cancelOrderData: null,
  updateOrderDeliveryResponse: null,
  updateOrderDeliveryData: null,
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_LIVE) {
    return { counter: state.counter + 1 };
  }
  if (action.type === GET_TRIPS) {
    let livestate = { ...state };
    livestate.tripList = action.payload.tripList;
    livestate.selectedBranch = action.payload.selectedBranchId;
    return { ...livestate };
  }
  if (action.type === GET_TRIP_DELIVERIES) {
    let livestate = { ...state };
    livestate.deliveries = action.payload.deliveriesList;
    return { ...livestate };
  }
  if (action.type === GET_CANCEL_REASONS) {
    let livestate = { ...state };
    livestate.cancelReasons = action.payload.cancelReasonList;
    livestate.selectedOrder = action.payload.selectedOrder;
    return { ...livestate };
  }
  if (action.type === GET_DELIVERY_SLOTS) {
    let livestate = { ...state };
    livestate.deliverySlots = action.payload.deliverySlotList;
    livestate.selectedOrder = action.payload.selectedOrder;
    return { ...livestate };
  }
  if (action === CANCEL_ORDER) {
    let livestate = { ...state };
    livestate.cancelOrderResponse = action.payload.message;
    livestate.cancelOrderData = action.payload.cancelOrderData;
  }
  if (action === UPDATE_DELIVERY_TIME) {
    let livestate = { ...state };
    livestate.updateOrderDeliveryResponse = action.payload.message;
    livestate.updateOrderDeliveryData = action.payload.updateOrderDeliveryData;
  }
  return state;
};
export default reducers;
