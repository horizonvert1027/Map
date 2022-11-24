import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setUser,
} from "../actions/user";

const initialState = {
  user: localStorage?.auth ? JSON.parse(localStorage.auth) : null
};

const reducer = persistReducer(
  {
    storage,
    key: "user",
    whitelist: []
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setUser]: (state, { payload }) => ({ ...state, user: payload }),
    },
    initialState
  )
);

export default reducer;