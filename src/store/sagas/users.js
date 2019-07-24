import { put, call, takeLatest, select } from 'redux-saga/effects';
import NavigationService from '../../services/NavigationService';

import {
  fetchingUsers,
  requestUserError,
  FETCH_USERS_REQUEST,
  FETCH_USER_REQUEST,
  UPDATE_USER_REQUEST,
  fetchUsersSuccess,
  fetchUserSuccess,
  updateUserSuccess
} from '../actions';

// API Calls
import UsersApi from '../../api/users.api';

export function* fetchUsersSaga({ params }) {
  yield put(fetchingUsers(true));
  try {
    const response = yield call(UsersApi.fetchUsers, params);
    //console.log(response);
    yield put(fetchUsersSuccess(response));
  } catch (e) {
    yield put(requestUserError(e.message))
  }
}

export function* fetchUserSaga({ id }) {
  yield put(fetchingUsers(true));
  try {
    const response = yield call(UsersApi.fetchUser, id);
    //console.log(response);
    yield put(fetchUserSuccess(response));
  } catch (e) {
    yield put(requestUserError(e.message))
  }
}

export function* updateUserSaga({ data }) {
  yield put(fetchingUsers(true));
  try {
    const response = yield call(UsersApi.saveUser, data);
    //console.log(response);
    yield put(updateUserSuccess(response))
  } catch (e) {
    yield put(requestUserError(e.message))
  }
}

export default function* users() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(FETCH_USER_REQUEST, fetchUserSaga);
  yield takeLatest(UPDATE_USER_REQUEST, updateUserSaga);
}