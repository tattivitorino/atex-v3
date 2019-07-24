import {
  FETCHING_AUTH,
  REQUEST_AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  USER_STATE_SUCCESS,
  LOGIN_SUCCESS,
  FETCH_AUTH_USER_SUCCESS,
  LOGOUT_SUCCESS,
  RECOVER_PASSWORD_SUCCESS,
  TOKEN_REFRESH_SUCCESS,
  LOAD_USER_CREDENTIALS_SUCCESS,
  LOAD_USER_CREDENTIALS_ERROR
} from '../actions';

const INITIAL_STATE = {
  sending: false,
  error: null,
  uid: null,
  user: null,
  userCredentials: null,
  loggedIn: null,
  accessToken: null,
  refreshToken: null,
  pushToken: null,
  exp: null
}

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_AUTH:
      return { ...state, sending: action.fetching, error: null }

    case USER_STATE_SUCCESS:
    case LOGIN_SUCCESS:
    case TOKEN_REFRESH_SUCCESS:
      const { access, refresh, uid, exp, pushToken } = action.credentials;
      return {
        ...state,
        sending: false,
        accessToken: access,
        refreshToken: refresh,
        uid,
        exp,
        pushToken,
        loggedIn: true
      }

    case LOAD_USER_CREDENTIALS_SUCCESS:
      const { email } = action.credentials;
      return {
        ...state,
        userCredentials: {
          ...state.userCredentials,
          email
        }
      }

    case FETCH_AUTH_USER_SUCCESS:
      return {
        ...state,
        sending: false,
        user: action.user
      }

    case LOGOUT_SUCCESS:
    case RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        sending: false,
        accessToken: null,
        refreshToken: null,
        userCredentials: null,
        uid: null,
        exp: null,
        loggedIn: null,
        user: null
      }

    case REQUEST_AUTH_ERROR:
      return { ...state, sending: false, error: action.error }

    case CLEAR_AUTH_ERROR:
      return { ...state, error: null }

    default:
      return state;
  }
}

export default auth;