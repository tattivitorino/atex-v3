import { put, call, takeLatest, fork, select, spawn } from 'redux-saga/effects';
import NavigationService from '../../services/NavigationService';
import { sha256 } from 'js-sha256';
const JWTDecode = require('jwt-decode');

import {
  getStorageItemAsync,
  setStorageItemAsync,
  deleteStorageItemAsync
} from '../../services/PersistService';

import { simpleDevice as device } from '../../services/DeviceService';

import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  PUSH_TOKEN_KEY,
  USER_KEY,
  APP_ENVIRONMENT,
  ORGANIZATION
} from '../../config';

//Action Types and Action Creators
import {
  USER_STATE_REQUEST,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  RECOVER_PASSWORD_REQUEST,
  TOKEN_REFRESH_REQUEST,
  LOAD_USER_CREDENTIALS,
  userStateSuccess,
  loadUserCredentialsSuccess,
  loadUserCredentialsError,
  loginSuccess,
  fetchAuthUserSuccess,
  logoutSuccess,
  recoverPasswordSuccess,
  tokenRefreshSuccess,
  fetchingAuth,
  requestAuthError,
  clearAuthError
} from '../actions';

// API CALLS
import { setAuthHeader } from '../../api/base.api';
import AuthApi from '../../api/auth.api';
import UsersApi from '../../api/users.api';

/** 
 * @function handleCredentials trata as credenciais recebidas do backend, armazena no Secure Store, decodifica o JWT para armazenar no state
 * @param credentials object {access, refresh}
 * @return object {access, refresh, uid, exp}
 */
const handleCredentials = async credentials => {
  try {
    const { access, refresh } = credentials;
    await setStorageItemAsync(AUTH_TOKEN_KEY, access)
    await setStorageItemAsync(REFRESH_TOKEN_KEY, refresh)
    const { user_id, exp } = JWTDecode(access);
    return {
      access, refresh,
      uid: user_id,
      exp
    }
  } catch (e) {
    throw ('Erro ao tratar credenciais: ' + e);
  }
}

// NON BLOCKING SAGA
function* fetchUserData(uid) {
  try {
    const response = yield call(UsersApi.fetchUser, uid);
    yield put(fetchAuthUserSuccess(response));
  } catch (e) {
    yield put(requestAuthError(null))
  }
}

// NON BLOCKING SAGA
function* sendDeviceData(uid, params) {
  try {
    const pushToken = yield call(getStorageItemAsync, PUSH_TOKEN_KEY);
    const data = { uid, push_token: pushToken, ...device, ...params };
    //console.log('DEVICE DATA', JSON.stringify(data));
    yield call(AuthApi.sendDeviceDataAsync, data);
    //console.log('DEVICE DATA RESPONSE: ', response);
  } catch (e) {
    console.log(e);
  }
}

// SAGA HANDLER DA ACTION TYPE USER_STATE_REQUEST 
export function* userStateSaga(dispatch) {
  try {

    let access = yield call(getStorageItemAsync, AUTH_TOKEN_KEY);
    const refresh = yield call(getStorageItemAsync, REFRESH_TOKEN_KEY);

    if (!access && !refresh) {
      throw new Error('Usuário não logado!');
    }

    let user = yield call(getStorageItemAsync, USER_KEY);
    if (user) console.log('USERKEY', JSON.parse(user));


    const { user_id, exp } = JWTDecode(access);
    const now = Date.now() / 1000;
    //console.log('EXP: ', exp, now);

    if (now > exp) {
      console.log('******REFRESH TOKEN********');

      const refreshResponse = yield call(AuthApi.refreshTokenAsync, refresh);
      access = refreshResponse.access;

      yield call(setStorageItemAsync, AUTH_TOKEN_KEY, access);
    }

    setAuthHeader(access);

    const pushToken = yield call(getStorageItemAsync, PUSH_TOKEN_KEY);

    const credentials = {
      access, refresh,
      uid: user_id,
      exp,
      pushToken
    }
    //console.log('RESPONSE USER STATE SAGA', credentials);     

    const { uid } = credentials;
    // chamada para pegar o usuário logado (non blocking)
    yield spawn(fetchUserData, uid);
    // envio dos dados do aparelho
    yield spawn(sendDeviceData, uid, { status_user: 1, status_token: 1 });

    yield put(userStateSuccess(credentials))
    NavigationService.navigate('App');
  }
  catch (e) {
    console.log(e);
    yield put(requestAuthError(null))
    NavigationService.navigate('Auth');
  }
}

export function* loadUserCredentialsSaga() {
  try {
    let response = yield call(getStorageItemAsync, USER_KEY);
    response = JSON.parse(response);
    const { email } = response;
    //yield put(loadUserCredentialsSuccess({ email }))
    yield put(loadUserCredentialsSuccess(response))
  } catch (e) {
    yield put(loadUserCredentialsError(null))
  }
}

// SAGA HANDLER DA ACTION TYPE LOGIN_REQUEST
export function* loginSaga({ data }) {
  yield put(fetchingAuth({
    screen: 'login',
    sending: true
  }));
  try {
    const { email, password } = data;
    let encPassword = sha256(password).toUpperCase();

    //api call
    const response = yield call(AuthApi.loginAsync, {
      email, password: encPassword, organization: ORGANIZATION, environment: APP_ENVIRONMENT
    });

    //local sagas
    const credentials = yield call(handleCredentials, response);
    const pushToken = yield call(getStorageItemAsync, PUSH_TOKEN_KEY);

    //local call to SecureStore
    yield call(setStorageItemAsync, USER_KEY, JSON.stringify({ email, password }))

    const { uid } = credentials;
    // chamada para pegar o usuário logado (non blocking)
    yield spawn(fetchUserData, uid);
    // envio dos dados do aparelho
    yield spawn(sendDeviceData, uid, { status_user: 1, status_token: 1 });

    yield put(loginSuccess({ ...credentials, pushToken }));
    NavigationService.navigate('App');
  }
  catch (e) {
    //NavigationService.navigate('App');
    yield put(requestAuthError({
      message: e.message,
      screen: 'login'
    }))
  }
}

// SAGA HANDLER DA ACTION TYPE LOGOUT_REQUEST
export function* logoutSaga() {
  yield put(fetchingAuth(true));
  try {
    const response = yield call(AuthApi.logoutAsync);
    yield call(deleteStorageItemAsync, AUTH_TOKEN_KEY);
    yield call(deleteStorageItemAsync, REFRESH_TOKEN_KEY);
    yield put(logoutSuccess())
    NavigationService.navigate('Auth');
  } catch (e) {
    yield put(requestAuthError({
      message: e.message,
      where: 'logout'
    }))
  }
}

// SAGA HANDLER DA ACTION TYPE RECOVER_PASSWORD_REQUEST
export function* recoverPasswordSaga({ data }) {
  yield put(fetchingAuth({
    screen: 'password',
    sending: true
  }));
  try {
    const { email } = data;
    const response = yield call(AuthApi.recoverPasswordAsync, email);
    yield put(recoverPasswordSuccess());
    NavigationService.back(null);
  } catch (e) {
    yield put(requestAuthError({
      message: e.message,
      screen: 'password'
    }));
    //yield delay(3000);
    //yield put(clearAuthError())
  }
}

// SAGA HANDLER DA ACTION TYPE TOKEN_REFRESH_REQUEST
export function* tokenRefreshSaga() {
  try {
    const refresh = yield call(getStorageItemAsync, REFRESH_TOKEN_KEY);
    const response = yield call(AuthApi.refreshTokenAsync, refresh);
    const { access } = response;
    yield call(setStorageItemAsync, AUTH_TOKEN_KEY, access);
    const { user_id, exp } = JWTDecode(access);
    const credentials = {
      access, refresh,
      uid: user_id,
      exp
    }
    yield put(tokenRefreshSuccess(credentials));
  } catch (e) {
    // log them out
  }
}


/**
 * As sagas interceptam as ACTION TYPES de REQUEST disparadas pelos componentes,
 * executam as tarefas e lidam com os side effects.
 * Para cada ACTION TYPE temos uma saga
 * A Saga Handler sempre tem como parâmetro a action creator
 * ex. {type:LOGIN_REQUEST, data}
 */
export default function* auth() {
  yield takeLatest(USER_STATE_REQUEST, userStateSaga);
  yield takeLatest(LOAD_USER_CREDENTIALS, loadUserCredentialsSaga)
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(LOGOUT_REQUEST, logoutSaga);
  yield takeLatest(RECOVER_PASSWORD_REQUEST, recoverPasswordSaga)
  yield takeLatest(TOKEN_REFRESH_REQUEST, tokenRefreshSaga)
}

