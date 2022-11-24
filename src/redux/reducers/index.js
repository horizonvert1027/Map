import { combineReducers } from "redux";
import mapReducer from "./map";
import layoutReducer from "./layout";
import drawingReducer from "./drawing";
import settingReducer from "./setting";
import userReducer from "./user";

const rootReducer = combineReducers({
  map: mapReducer,
  layout: layoutReducer,
  drawing: drawingReducer,
  setting: settingReducer,
  user: userReducer,
});

export default rootReducer;