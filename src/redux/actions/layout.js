import { createActions } from "redux-actions";

export const {
  setDrawingSidebar,
  setLoading,
} = createActions(
  "SET_DRAWING_SIDEBAR",
  "SET_LOADING",
  { prefix: "LAYOUT" }
);
