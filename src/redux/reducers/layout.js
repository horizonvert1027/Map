import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setDrawingSidebar,
  setLoading,
} from "./../actions/layout";

const initialState = {
  drawingSidebar: null,
  loading: false,
};

const reducer = persistReducer(
  {
    storage,
    key: "layout",
    whitelist: []
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setDrawingSidebar]: (state, { payload }) => ({
        ...state,
        drawingSidebar: payload,
      }),
      [setLoading]: (state, { payload }) => ({
        ...state,
        loading: payload,
      }),
    },
    initialState
  )
);
export default reducer;
