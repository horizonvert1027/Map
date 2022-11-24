import { createStore, /*compose*/ } from "redux";
// import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
// import { createLogger } from 'redux-logger'
import rootReducer from "./reducers";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const logger = createLogger(
//   Object.assign(
//     {},
//     { collapsed: true }
//   )
// )


// const sagaMiddleware = createSagaMiddleware();
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  
  // composeEnhancers(applyMiddleware(sagaMiddleware/*, logger*/)),
  // applyMiddleware(sagaMiddleware/* , logger */)
);


export const persistor = persistStore(store);

// sagaMiddleware.run(rootSaga);

export default store;
