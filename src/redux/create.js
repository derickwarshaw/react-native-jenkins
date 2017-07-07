import { applyMiddleware, createStore, compose } from 'redux';
import clientMiddleware from './middleware/client';

// import { autoRehydrate } from 'redux-persist';
// import { createEpicMiddleware } from 'redux-observable';
// import { ajax } from 'rxjs/observable/dom/ajax';
// import { Observable } from 'rxjs/Rx';

// this is for redux-observable
// const epicMiddleware = createEpicMiddleware(rootEpic, {
//   dependencies: { ajax, Observable }
// });

const rootReducer = require('./reducer');

let composeEnhancers = compose;

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

// export default () =>
//   createStore(reducers, composeEnhancers(applyMiddleware(clientMiddleware, epicMiddleware), autoRehydrate()));

export default function makeStore(restClient) {
  return createStore(
    rootReducer.default,
    composeEnhancers(
      applyMiddleware(clientMiddleware(restClient))
    )
  );
}
