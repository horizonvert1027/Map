import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setMap,
  setZoom,
  setCenter,
  setOptions,
  setType,
  showContextMenu,
  hideContextMenu,
  showScalerModal,
  hideScalerModal,
  setNewScalerDistance,
  setMeasurement,
  setCenterMarker,
} from "./../actions/map";

const initialState = {
  zoom: null,
  center: null, // { lat: 51.0877813, lng: 17.0118349 },
  options: {
    mapTypeId: "hybrid",
    tilt: 0,
    rotateControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    clickableIcons: false,
    zoomControl: true,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    centerMarker: null,
    popupPosition: null,
    styles: [{
      featureType: "administrative",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "water",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }]
  },
  type: 'map',
  contextMenu: { x: -1000, y: -1000, list: [] },
  contextPos: null,
  scaler: { x: -1000, y: -1000, distance: 0, newDistance: 0 },
  measurement: 0,
};

const reducer = persistReducer(
  {
    storage,
    key: "map",
    whitelist: []
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setMap]: (state, { payload }) => ({ ...state, map: payload }),
      [setZoom]: (state, { payload }) => ({ ...state, zoom: payload }),
      [setCenter]: (state, { payload }) => ({ ...state, center: payload }),
      [setOptions]: (state, { payload }) => ({ ...state, options: payload }),
      [setType]: (state, { payload }) => ({ ...state, type: payload }),
      [showContextMenu]: (state, { payload }) => ({ ...state, contextMenu: payload }),
      [hideContextMenu]: (state, { payload }) => ({ ...state, contextMenu: { x: -1000, y: -1000, list: [] } }),
      [showScalerModal]: (state, { payload }) => ({ ...state, scaler: { ...state.scaler, ...payload } }),
      [hideScalerModal]: (state, { payload }) => ({ ...state, scaler: { ...state.scaler, x: -1000, y: -1000 } }),
      [setNewScalerDistance]: (state, { payload }) => ({ ...state, scaler: { ...state.scaler, newDistance: +payload } }),
      [setMeasurement]: (state, { payload }) => ({ ...state, measurement: payload }),
      [setCenterMarker]: (state, { payload }) => ({ ...state, centerMarker: payload }),
    },
    initialState
  )
);

export default reducer;