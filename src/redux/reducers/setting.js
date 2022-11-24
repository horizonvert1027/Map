import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setSetting,
} from "../actions/setting";

const initialState = {
  setting: {
    irVisible: true,
    manVisible: true,
    nameVisible: true,
    rangeVisible: true,
    blindVisible: true,
    gridVisible: false,
    cameraFontSize: 1,
  }
};

const reducer = persistReducer(
  {
    storage,
    key: "setting",
    whitelist: []
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setSetting]: (state, { payload }) => ({ ...state, setting: { ...state.setting, ...payload } }),
    },
    initialState
  )
);

export default reducer;