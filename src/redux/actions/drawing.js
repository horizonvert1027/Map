import { createActions } from "redux-actions";

export const {
  setShapes,
  setKind,
  setProjectInfo,
  setEditMode,

  setShapeProps,
  setShapeActive,
  setDeactivateAll,

  addNewCamera,
  addNewPolygon,
  addNewPolyline,
  addNewCircle,
  addNewRectangle,
  addNewWall,
  addNewBlueprint,
  addNewIcon,
  addNewLabel,

  setBlueprintLoaded,

  deleteShape,
  removeDeletedData,

  setFitShapeId,

  addSnapshot,
  setSnapshot,

} = createActions(
  "SET_SHAPES",
  "SET_KIND",
  "SET_PROJECT_INFO",
  "SET_EDIT_MODE",

  "SET_SHAPE_PROPS",
  "SET_SHAPE_ACTIVE",
  "SET_DEACTIVATE_ALL",

  "ADD_NEW_CAMERA",
  "ADD_NEW_POLYGON",
  "ADD_NEW_POLYLINE",
  "ADD_NEW_CIRCLE",
  "ADD_NEW_RECTANGLE",
  "ADD_NEW_WALL",
  "ADD_NEW_BLUEPRINT",
  "ADD_NEW_ICON",
  "ADD_NEW_LABEL",

  "SET_BLUEPRINT_LOADED",

  "DELETE_SHAPE",
  "REMOVE_DELETED_DATA",

  "SET_FIT_SHAPE_ID",

  "SET_CONTENT_ENTITY",

  "ADD_SNAPSHOT",
  "SET_SNAPSHOT",
  
  { prefix: "DRAWING" }
);
