import { createActions } from "redux-actions";

export const {
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
} = createActions(
  "SET_MAP",
  "SET_ZOOM",
  "SET_CENTER",
  "SET_OPTIONS",
  "SET_TYPE",
  "SHOW_CONTEXT_MENU",
  "HIDE_CONTEXT_MENU",
  "SET_CONTEXT_POS",
  "SHOW_SCALER_MODAL",
  "HIDE_SCALER_MODAL",
  "SET_NEW_SCALER_DISTANCE",
  "SET_MEASUREMENT",
  "SET_CENTER_MARKER",
  "SET_POPUP_POSITION",
  { prefix: "MAP" }
);
