const INIT = 'jenkins/views/INIT';

const LOAD_VIEWS = 'jenkins/views/LOAD_VIEWS';
const LOAD_VIEWS_SUCCESS = 'jenkins/views/LOAD_VIEWS_SUCCESS';
const LOAD_VIEWS_FAIL = 'jenkins/views/LOAD_VIEWS_FAIL';

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
    case LOAD_VIEWS:
      return {
        ...state,
        loading: true,
        loaded: false,
        selectedJob: action.job
      };
    case LOAD_VIEWS_SUCCESS: {
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
    case LOAD_VIEWS_FAIL:
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

export function getLoad() {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';
    return dispatch({
      types: [LOAD_VIEWS, LOAD_VIEWS_SUCCESS, LOAD_VIEWS_FAIL],
      promise: client => client.get(`${protocol}://${host}/api/json?tree=views[name,url]`)
    });
  };
}
