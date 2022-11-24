import { createActions } from "redux-actions";

export const {
  setSetting,
} = createActions(
  "SET_SETTING",
  { prefix: "SETTING" }
);
