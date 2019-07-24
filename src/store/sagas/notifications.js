import { put, call, takeLatest, select, delay } from 'redux-saga/effects';
import { showAlert } from '../../utils';
import { ALERT_DELAY } from '../../config';
import NavigationService from '../../services/NavigationService';

//Action Types and Action Creators
import {
  fetchingNotifications,
  loadingNotifications,
  updatingNotifications,
  requestNotificationError,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATION_REQUEST,
  UPDATE_NOTIFICATION_REQUEST,
  fetchNotificationsSuccess,
  fetchNotificationSuccess,
  updateNotificationSuccess,
  updateBadgeCount
} from '../actions';

// API Calls
import NotificationsApi from '../../api/notifications.api';

export function* fetchNotificationsSaga({ params }) {
  const action = params.page === 1 ? fetchingNotifications(true) : loadingNotifications(true);
  yield put(action);
  try {
    const response = yield call(NotificationsApi.fetchNotifications, params);
    yield put(fetchNotificationsSuccess({ ...response, page: params.page }));
    yield put(updateBadgeCount())
  } catch (e) {
    yield put(requestNotificationError(e.message));
  }
}

export function* fetchNotificationSaga({ id }) {
  yield put(fetchingNotifications(true));
  try {
    const response = yield call(NotificationsApi.fetchNotification, id);
    yield put(fetchNotificationSuccess(response));
  } catch (e) {
    yield put(requestNotificationError(e.message));
  }
}

export function* updateNotificationSaga({ data }) {
  console.log('NOTIF DATA SAGA: ', data);
  yield put(updatingNotifications(true));
  try {
    const response = yield call(NotificationsApi.updateNotification, data);
    yield put(updateNotificationSuccess(response));
    yield put(updateBadgeCount())
  } catch (e) {
    yield put(requestNotificationError(null));
    yield delay(ALERT_DELAY);
    showAlert('Notificação', e.message, null);
  }
}

export default function* notifications() {
  yield takeLatest(FETCH_NOTIFICATIONS_REQUEST, fetchNotificationsSaga);
  yield takeLatest(FETCH_NOTIFICATION_REQUEST, fetchNotificationSaga);
  yield takeLatest(UPDATE_NOTIFICATION_REQUEST, updateNotificationSaga);
}