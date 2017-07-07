// import 'rxjs';

// import { REHYDRATE } from 'redux-persist/constants';


const INIT = 'jenkins/health/INIT';

const GET_LOAD = 'jenkins/health/GET_LOAD';
const GET_LOAD_SUCCESS = 'jenkins/health/GET_LOAD_SUCCESS';
const GET_LOAD_FAIL = 'jenkins/health/GET_LOAD_FAIL';

const LOAD_QUE = 'jenkins/health/LOAD_QUE';
const LOAD_QUE_SUCCESS = 'jenkins/health/LOAD_QUE_SUCCESS';
const LOAD_QUE_FAIL = 'jenkins/health/LOAD_QUE_FAIL';

const initialState = {
  data: [],
  error: null,
  loading: false,
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INIT:
      return {
        ...initialState
      };
    case GET_LOAD:
      return {
        ...state,
        loading: true,
        loaded: false,
        selectedJob: action.job
      };
    case GET_LOAD_SUCCESS: {
      const dataArray = action.result.actions[0].parameters;
      const payload = {};
      for (const item of dataArray) {
        const name = item.name;
        payload[`${name}`] = item.value;
      }

      return {
        ...state,
        loading: false,
        loaded: true,
        data: payload
      };
    }
    case GET_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: action.error.message,
          url: action.error.url,
          status: action.error.status
        }
      };
    case LOAD_QUE:
      return {
        ...state,
        loading: true,
        loaded: false,
        selectedJob: action.job
      };
    case LOAD_QUE_SUCCESS: {
      const dataArray = action.result.actions[0].parameters;
      const payload = {};
      for (const item of dataArray) {
        const name = item.name;
        payload[`${name}`] = item.value;
      }

      return {
        ...state,
        loading: false,
        loaded: true,
        data: payload
      };
    }
    case LOAD_QUE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: action.error.message,
          url: action.error.url,
          status: action.error.status
        }
      };
    // redux-persist action to restore previously persisted state
    // case REHYDRATE: {
    //   const persistedState = action.payload.location;
    //   if (persistedState) {
    //     return {
    //       ...initialState,
    //       recent: persistedState.recent
    //     };
    //   }
    //   return state;
    // }
    default:
      return state;
  }
}

export function init() {
  return {
    type: INIT
  };
}

export function getLoad() {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [GET_LOAD, GET_LOAD_SUCCESS, GET_LOAD_FAIL],
      promise: client => client.get(`${protocol}://${host}/overallLoad/api/json?pretty=true`)
    });
  };
}

export function getQue() {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [LOAD_QUE, LOAD_QUE_SUCCESS, LOAD_QUE_FAIL],
      promise: client => client.get(`${protocol}://${host}/queue/api/json?pretty=true`)
    });
  };
}

// export const getAutocompleteEpic = (action$, store, { ajax, Observable }) =>
//   action$.ofType(GET_AUTOCOMPLETE).switchMap((request) => {
//     const { auth } = store.getState();
//     const url = `${auth.instanceUrl}${auth.appPath}${request.url}`;
//     const bearerAuth = `bearer ${auth.accessToken}`;
//     const options = request.options;
//     // send the autonation bearer token with the body
//     options.body = { ...options.body, bearer: auth.accessTokenAN };
//
//     options.headers = {
//       Authorization: bearerAuth,
//       'Content-Type': 'application/json'
//     };
//
//     return ajax({
//       url,
//       ...options,
//       crossDomain: true,
//       responseType: 'json'
//     })
//       .map(result => ({
//         type: GET_AUTOCOMPLETE_SUCCESS,
//         result: result.response
//       }))
//       .catch(error => Observable.of({ type: GET_AUTOCOMPLETE_FAILURE, error }));
//   });
