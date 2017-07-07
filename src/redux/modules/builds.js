const INIT = 'jenkins/builds/INIT';

const LOAD = 'jenkins/builds/LOAD';
const LOAD_SUCCESS = 'jenkins/builds/LOAD_SUCCESS';
const LOAD_FAIL = 'jenkins/builds/LOAD_FAIL';

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
    case LOAD_SUCCESS:
      {
        const data = action.result.builds.map((obj) => {
          const rawDate = new Date(obj.timestamp);
          const dateFormatted = rawDate.toLocaleString();
          return {
            number: obj.number,
            result: obj.result,
            timestamp: dateFormatted
          };
        });
        return {
          ...state,
          loading: false,
          loaded: true,
          data
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

export function load(job) {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: client => client.get(`${protocol}://${host}/job/${encodeURIComponent(job)}/api/json?tree=builds[number,status,timestamp,id,result]`),
      job
    });
  };
}
