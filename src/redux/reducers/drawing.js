import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { updateJsonById } from 'utils/common';
import {
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
  setFirstNoMap

} from "../actions/drawing";


const initialState = {
  shapes: [],
  kind: null, // 1-map, 2-grid
  projectInfo: {},
  editMode: 'normal',
  fitShapeId: 0,
  blueprintLoaded: false,
  snapshots: [],
  snapshot: 0
};

const reducer = persistReducer(
  {
    storage,
    key: "drawing",
    whitelist: []
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),

      [setShapes]: (state, { payload }) => ({ ...state, shapes: payload }),

      [setKind]: (state, { payload }) => ({ ...state, kind: payload }),

      [setProjectInfo]: (state, { payload }) => ({ ...state, projectInfo: payload }),

      [setEditMode]: (state, { payload }) => ({ ...state, editMode: payload }),

      [setShapeProps]: (state, { payload }) => ({ ...state, shapes: updateJsonById(state.shapes, payload) }),

      [setShapeActive]: (state, { payload }) => {
        let shapes = [];
        for (let shape of state.shapes) {
          shapes[shapes.length] = { ...shape, active: shape.id === payload };
        }
        return { ...state, shapes }
      },
      [setDeactivateAll]: (state) => ({ ...state, shapes: state.shapes.map(d => ({ ...d, active: false })) }),

      [addNewCamera]: (state, { payload }) => {
        let count = 1;
        for (let shape of state.shapes) {
          if (shape.type === 'camera') count++;
        }
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'camera',
            name: 'K' + count,
            lat: payload.lat,
            lng: payload.lng,
            distance: 30,
            color: "#FF5700",
            zones: {
              dead: { distance: 10, opacity: 0 },
              detection: { distance: 20, opacity: 0.9 },
              observation: { distance: 30, opacity: 0.7 },
              recognition: { distance: 50, opacity: 0.5 },
              identification: { distance: 70, opacity: 0.3 },
            },
            angle: 70,
            rotation: 90,
            irLength: 20,
            dzHeight: 0,
            active: true,
            locked: false,
            irVisible: false,
            ppmVisible: true,
            blindVisible: true,
            deepChange: true
          }]
        };
      },

      [addNewPolygon]: (state, { payload }) => {
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'polygon',
            name: 'New Polygon',
            color: '#FF5700',
            path: payload,
            active: true,
            locked: false
          }]
        };
      },

      [addNewPolyline]: (state, { payload }) => {
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'polyline',
            name: 'New Polyline',
            color: '#FF5700',
            path: payload,
            lineType: 'normal',
            arrowType: 'none',
            active: true,
            locked: false,
          }]
        };
      },

      [addNewCircle]: (state, { payload }) => {
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'circle',
            name: 'New Circle',
            color: '#FF5700',
            lat: payload.lat,
            lng: payload.lng,
            radius: payload.radius,
            active: true,
            locked: false,
          }]
        };
      },

      [addNewRectangle]: (state, { payload }) => {
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'rectangle',
            name: 'New Rectangle',
            color: '#FF5700',
            path: payload,
            active: true,
            locked: false,
          }]
        };
      },

      [addNewWall]: (state, { payload }) => {
        return {
          ...state, shapes: [...state.shapes, {
            id: Date.now(),
            type: 'wall',
            name: 'New Wall',
            color: '#FF5700',
            path: payload,
            active: true,
            locked: false,
          }]
        };
      },

      [setBlueprintLoaded]: (state, { payload }) => {
        return { ...state, blueprintLoaded: payload };
      },

      [addNewBlueprint]: (state, { payload }) => {
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'blueprint',
            name: 'New Blueprint',
            src: payload.src,
            ne: { lat: payload.north, lng: payload.east },
            nw: { lat: payload.north, lng: payload.west },
            se: { lat: payload.south, lng: payload.east },
            sw: { lat: payload.south, lng: payload.west },
            scale: 1,
            onlyRotate: true,
            opacity: 0.5,
            active: true,
            locked: true,
          }]
        };
      },

      [addNewIcon]: (state, { payload }) => {
        let count = 1;
        for (let shape of state.shapes) {
          if (shape.type === 'icon') count++;
        }        
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'icon',
            name: 'New Icon' + count,
            color: '#FFFFFF',
            backgroundColor: '#47aaee',
            size: 1,
            src: payload.src,
            lat: payload.lat,
            lng: payload.lng,
            opacity: 0,
            active: true,
            locked: false,
          }]
        };
      },

      [addNewLabel]: (state, { payload }) => {
        return {
          ...state,
          shapes: [...state.shapes, {
            id: Date.now(),
            type: 'label',
            name: 'New Label',
            text: 'Type your text here.',
            fontSize: 1,
            visible: true,
            backgroundColor: 'none',
            color: '#000000',
            borderColor: '#FFFFFF',
            lat: payload.lat,
            lng: payload.lng,
            active: true,
            locked: false,
          }]
        };
      },

      [deleteShape]: (state, { payload }) => {
        // const shape = state.shapes.find(v => v.id === payload);
        // if (shape.type === 'camera') {
        //   deleteCamera(payload);
        // } else if (shape.type === 'blueprint') {
        //   deleteBlueprint(payload);
        // }
        return { ...state, shapes: state.shapes.filter(v => v.id !== payload) };
      },

      [removeDeletedData]: (state, { payload }) => {
        return { ...state, shapes: state.shapes.filter(v => v.id !== payload) };
      },

      [setFitShapeId]: (state, { payload }) => {
        return { ...state, fitShapeId: payload };
      },

      [addSnapshot]: state => {
        return { ...state, snapshots: [...state.snapshots.splice(0, state.snapshot + 1), state.shapes] };
      },
      [setSnapshot]: (state, { payload }) => {
        return { ...state, snapshot: payload };
      },
    },
    initialState
  )
);
export default reducer;
