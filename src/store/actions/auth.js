export const USER_STATE_REQUEST = 'USER_STATE_REQUEST';
export const USER_STATE_SUCCESS = 'USER_STATE_SUCCESS';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const FETCH_AUTH_USER_SUCCESS = 'FETCH_AUTH_USER_SUCCESS';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const RECOVER_PASSWORD_REQUEST = 'RECOVER_PASSWORD_REQUEST';
export const RECOVER_PASSWORD_SUCCESS = 'RECOVER_PASSWORD_SUCCESS';

export const TOKEN_REFRESH_REQUEST = 'TOKEN_REFRESH_REQUEST';
export const TOKEN_REFRESH_SUCCESS = 'TOKEN_REFRESH_SUCCESS';

export const LOAD_USER_CREDENTIALS = 'LOAD_USER_CREDENTIALS';
export const LOAD_USER_CREDENTIALS_SUCCESS = 'LOAD_USER_CREDENTIALS_SUCCESS';
export const LOAD_USER_CREDENTIALS_ERROR = 'LOAD_USER_CREDENTIALS_ERROR';

export const FETCHING_AUTH = 'FETCHING_AUTH';
export const REQUEST_AUTH_ERROR = 'REQUEST_AUTH_ERROR';
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';


export const userStateRequest = () => ({
    type: USER_STATE_REQUEST
})
export const userStateSuccess = credentials => ({
    type: USER_STATE_SUCCESS,
    credentials
})

export const loadUserCredentials = () => ({
    type: LOAD_USER_CREDENTIALS
})

export const loadUserCredentialsSuccess = credentials => ({
    type: LOAD_USER_CREDENTIALS_SUCCESS,
    credentials
})
export const loadUserCredentialsError = () => ({
    type: LOAD_USER_CREDENTIALS_ERROR
})

export const loginRequest = data => ({
    type: LOGIN_REQUEST,
    data
})
export const loginSuccess = credentials => ({
    type: LOGIN_SUCCESS,
    credentials
})
export const fetchAuthUserSuccess = user => ({
    type: FETCH_AUTH_USER_SUCCESS,
    user
})

export const logoutRequest = () => ({
    type: LOGOUT_REQUEST
})
export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS
})

export const recoverPasswordRequest = data => ({
    type: RECOVER_PASSWORD_REQUEST,
    data
})
export const recoverPasswordSuccess = () => ({
    type: RECOVER_PASSWORD_SUCCESS
})

export const tokenRefreshRequest = () => ({
    type: TOKEN_REFRESH_REQUEST
})
export const tokenRefreshSuccess = credentials => ({
    type: TOKEN_REFRESH_SUCCESS,
    credentials
})

export const fetchingAuth = fetching => ({
    type: FETCHING_AUTH,
    fetching
})
export const requestAuthError = error => ({
    type: REQUEST_AUTH_ERROR,
    error
})
export const clearAuthError = () => ({
    type: CLEAR_AUTH_ERROR
})