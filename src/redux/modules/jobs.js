const INIT = 'jenkins/jobs/INIT';

const LOAD = 'jenkins/jobs/LOAD';
const LOAD_SUCCESS = 'jenkins/jobs/LOAD_SUCCESS';
const LOAD_FAIL = 'jenkins/jobs/LOAD_FAIL';

const START = 'jenkins/jobs/START';
const START_SUCCESS = 'jenkins/jobs/START_SUCCESS';
const START_FAIL = 'jenkins/jobs/START_FAIL';

const initialState = {
  data: [],
  error: null,
  loading: false,
  selectedJob: null
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
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.result.jobs
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
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

export function load() {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: client => client.get(`${protocol}://${host}/api/json?tree=jobs[name,color]`)
    });
  };
}

export function start(job) {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [START, START_SUCCESS, START_FAIL],
      promise: client => client.post(`${protocol}://${host}/job/${job}/build`),
      job
    });
  };
}
