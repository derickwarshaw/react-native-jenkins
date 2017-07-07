import { combineReducers } from 'redux';
// import { combineEpics } from 'redux-observable';

// import { getSomeEpic } from './modules/WHEREVERMYEPICISLOCATED';
//
// this is for redux-observable
// export const rootEpic = combineEpics(getSomeEpic);

import * as reducers from './modules';

export default function reducer(state, action) {
  return combineReducers(reducers)(state, action);
}
