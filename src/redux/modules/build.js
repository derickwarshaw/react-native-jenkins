const INIT = 'jenkins/build/INIT';

const LOAD = 'jenkins/build/LOAD';
const LOAD_SUCCESS = 'jenkins/build/LOAD_SUCCESS';
const LOAD_FAIL = 'jenkins/build/LOAD_FAIL';

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
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false,
        selectedJob: action.job
      };
    case LOAD_SUCCESS: {
      const dataArray = action.result.actions[0].parameters;
      let payload = {};
      if (dataArray) {
        for (const item of dataArray) {
          const name = item.name;
          payload[`${name}`] = item.value;
        }
      } else {
        payload = action.result;
      }

      return {
        ...state,
        loading: false,
        loaded: true,
        data: payload
      };
    }
    case LOAD_FAIL:
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
    default:
      return state;
  }
}

export function init() {
  return {
    type: INIT
  };
}

export function load(job, buildNumber) {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: client => client.get(`${protocol}://${host}/job/${encodeURIComponent(job)}/${buildNumber}/api/json?tree=actions[parameters[name,value]]`)
    });
  };
}
