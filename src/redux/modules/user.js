import base64 from 'base-64';
import { serializeJSON } from '../../utils';

const GET_CRUMB = 'jenkins/user/GET_CRUMB';
const GET_CRUMB_SUCCESS = 'jenkins/user/GET_CRUMB_SUCCESS';
const GET_CRUMB_FAIL = 'jenkins/user/GET_CRUMB_FAIL';

const LOGIN = 'jenkins/user/LOGIN';
const LOGIN_SUCCESS = 'jenkins/user/LOGIN_SUCCESS';
const LOGIN_FAIL = 'jenkins/user/LOGIN_FAIL';

const LOGOUT = 'jenkins/user/LOGOUT';
const LOGOUT_SUCCESS = 'jenkins/user/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'jenkins/user/LOGOUT_FAIL';

const initialState = {
  username: null,
  loginSuccess: false,
  loginFail: false,
  loggingOut: false,
  password: null,
  error: null,
  instanceName: null,
  host: null,
  port: null,
  https: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loginFail: false,
        loginSuccess: false,
        loggingIn: true,
        username: action.username,
        password: action.password,
        instanceName: action.instanceName,
        host: action.host,
        port: action.port,
        https: action.https
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loginSuccess: true,
        password: null,
        error: null,
        username: action.username,
        instanceName: action.instanceName,
        host: action.host,
        port: action.port
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loginFail: true,
        loggingIn: false,
        loginSuccess: false,
        error: {
          message: action.error.message,
          url: action.error.url,
          status: action.error.status

        },
        instanceName: null
      };
    case GET_CRUMB:
      return {
        ...state,
        loadingCrumb: true
      };
    case GET_CRUMB_SUCCESS:
      return {
        ...state,
        loadingCrumb: false,
        crumb: action.result.crumb,
        crumbRequestField: action.result.crumbRequestField,
        error: null
      };
    case GET_CRUMB_FAIL:
      return {
        ...state,
        loadingCrumb: false,
        loggingIn: false,
        error: {
          message: action.error.message,
          url: action.error.url,
          status: action.error.status

        },
        instanceName: null
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...initialState
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        loginSuccess: false,
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

export function getCrumb(host, username, password) {
  const credentials = `${username}:${password}`;
  const token = base64.encode(credentials);
  return {
    types: [GET_CRUMB, GET_CRUMB_SUCCESS, GET_CRUMB_FAIL],
    promise: client => client.get(`https://${host}/crumbIssuer/api/json`, {
      headers: {
        'Authorization': `Basic ${token}`
      }
    })
  };
}

export function secureLogin(username, instanceName, host, port, https, data, headers) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post(`https://${host}/j_acegi_security_check`, {
      data: serializeJSON(data),
      headers
    }),
    username,
    instanceName,
    host,
    port,
    https
  };
}

export function insecureLogin(username, instanceName, host, port, https, data, headers) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post(`http://${host}/j_acegi_security_check`, {
      data: serializeJSON(data),
      headers
    }),
    username,
    instanceName,
    host,
    port,
    https
  };
}

export function initiateLogin(username, password, instanceName, host, port, https) {
  return (dispatch) => {
    const data = {
      j_username: username,
      j_password: password,
      from: '/'
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (https) {
      return dispatch(getCrumb(host, username, password))
        .then((response) => {
          if (response.ok) {
            const { crumb, crumbRequestField: fieldName } = response.result;

            if (crumb && fieldName) {
              data[fieldName] = crumb;
            }

            return dispatch(secureLogin(username, instanceName, host, port, https, data, headers));
          }
        });
    } else {
      return dispatch(insecureLogin(username, instanceName, host, port, https, data, headers));
    }
  };
}
export function logout() {
  return (dispatch, getState) => {
    const { user: { host, https } } = getState();
    const protocol = https ? 'https' : 'http';

    dispatch({
      types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
      promise: client => client.get(`${protocol}://${host}/logout`)
    });
  };
}
